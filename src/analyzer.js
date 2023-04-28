import fs from "fs";
import ohm from "ohm-js";
import * as core from "./core.js";

const icedCoffeeGrammar = ohm.grammar(fs.readFileSync("src/icedCoffee.ohm"));

const INT = core.Type.INT.description;
const DOUBLE = core.Type.DOUBLE.description;
const STRING = core.Type.STRING.description;
const BOOL = core.Type.BOOL.description;
const VOID = core.Type.VOID.description;

function error(message, node) {
  if (node) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`);
  }
  throw new Error(message);
}

function checkIdDeclared(entity, name) {
  if (entity == null) {
    error(`Reference to: ${name} which is not declared`, entity);
  }
}

function checkSameType(e1, e2, at) {
  if (e1.type != e2.type) {
    error("Must be same type", at);
  }
}

function checkNumericType(e, at) {
  if (e.type != INT && e.type != DOUBLE && !Number.isInteger(e)) {
    error("Int or Double expected", at);
  }
}

function checkBoolType(e, at) {
  if (e.type != BOOL && e != true && e != false) {
    error("Expected a bool", at);
  }
}

function checkArrayOrIntType(e, at) {
  if (
    !(e.type instanceof core.ArrayType || e.type === INT || Number.isInteger(e))
  ) {
    error("Expected an Array or Int", at);
  }
}

function checkNoReturn(f, at) {
  if (f.type != VOID) {
    error("No value returned", at);
  }
}

function checkFuncReturns(f, at) {
  if (f.type == VOID) {
    error("Cannot return in a void function", at);
  }
}

function checkArgsMatch(argsPassed, argsNeeded, at) {
  if (argsPassed.length != argsNeeded) {
    error("Wrong number of arguments passed", at);
  }
}

function checkInFunction(context, at) {
  if (context.function == null) {
    error("Return can only appear in a function", at);
  }
}

class Context {
  constructor({
    parent = null,
    locals = new Map(),
    function: f = null,
    params = [],
  }) {
    Object.assign(this, { parent, locals, function: f, params });
  }
  set(name, entity) {
    this.locals.set(name, entity);
  }
  lookup(name) {
    const entity =
      this.locals.get(name) ||
      this.parent?.lookup(name) ||
      this.params.find((p) => p.name === name);
    checkIdDeclared(entity, name);
    return entity;
  }
  newChildContext(props) {
    return new Context({
      ...this,
      ...props,
      parent: this,
      locals: new Map(),
    });
  }
}

export default function analyze(sourceCode) {
  let context = new Context({});

  const analyzer = icedCoffeeGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.children.map((s) => s.rep()));
    },
    Statement_vardec(type, id, _eq, initializer) {
      const initializerRep = initializer.rep();
      const variable = new core.Variable(id.sourceString, type.rep());
      context.set(id.sourceString, variable);
      return new core.VariableDeclaration(variable, initializerRep);
    },
    Statement_fundec(_func, id, _open, params, _close, _arrow, type, body) {
      const paramReps = params.asIteration().children.map((p) => {
        const [paramType, paramId] = p.children;
        return new core.Variable(paramType.rep());
      });
      const func = new core.Function(
        id.sourceString,
        type.rep(),
        paramReps.length
      );
      context.set(id.sourceString, func);
      context = context.newChildContext({ inLoop: false, function: func });
      for (const p of paramReps) context.set(p.id, p);
      const b = body.rep();
      context = context.parent;
      return new core.FunctionDeclaration(id.sourceString, paramReps, b);
    },
    Statement_assign(id, eq, expression) {
      const target = id.rep();
      return new core.AssignmentStatement(target, eq.rep(), expression.rep());
    },
    Statement_print(_print, _left, argument, _right) {
      return new core.PrintStatement(argument.rep());
    },
    Statement_return(_return, exp) {
      checkInFunction(context, exp);
      if (exp.numChildren != 0) {
        checkFuncReturns(context.function);
      } else {
        checkNoReturn(context.function);
      }
      return new core.ReturnStatement(exp.rep());
    },
    Statement_while(_while, test, body) {
      checkBoolType(test.rep());
      return new core.WhileStatement(test.rep(), body.rep());
    },
    Statement_for(_for, left, _in, right, body) {
      checkArrayOrIntType(right.rep());
      if (right.rep().type instanceof core.ArrayType) {
        const iterator = new core.Variable(
          left.sourceString,
          right.rep().type.baseType
        );
        context = context.newChildContext({ inLoop: true });
        context.set(iterator.id, iterator);
        const block = body.rep();
        context = context.parent;
        return new core.ForStatement(iterator, right.rep(), block);
      } else {
        const iterator = new core.Variable(left.sourceString, "int");
        context = context.newChildContext({ inLoop: true });
        context.set(iterator.id, iterator);
        const block = body.rep();
        context = context.parent;
        return new core.ForStatement(iterator, right.sourceString, block);
      }
    },
    Statement_if(_if1, exp1, body1, _else1, _if2, exp2, body2, _else2, body3) {
      checkBoolType(exp1.rep());
      const elseIfParts =
        exp2.sourceString.length > 0
          ? [{ condition: exp2.rep(), body: body2.rep() }]
          : [];
      if (body3.sourceString != "") {
        return new core.IfStatement(
          exp1.rep(),
          body1.rep(),
          elseIfParts,
          body3.rep()
        );
      } else {
        return new core.IfStatement(exp1.rep(), body1.rep(), elseIfParts);
      }
    },
    Block(_open, body, _close) {
      return body.rep();
    },
    Exp_unary(op, operand) {
      let type;
      if (op.sourceString === "!") {
        checkBoolType(operand.rep());
        type = BOOL;
      }
      return new core.UnaryExpression(op.sourceString, operand.rep(), type);
    },
    Exp_ternary(test, _questionMark, consequent, _colon, alternate) {
      checkBoolType(test.rep());
      checkSameType(consequent.rep(), alternate.rep());
      return new core.TernaryExpression(
        test.rep(),
        consequent.rep(),
        alternate.rep()
      );
    },
    Exp1_binary(left, op, right) {
      checkBoolType(left.rep());
      checkBoolType(right.rep());
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), BOOL);
    },
    Exp2_binary(left, op, right) {
      checkBoolType(left.rep());
      checkBoolType(right.rep());
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), BOOL);
    },
    Exp3_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep(), BOOL);
    },
    Exp4_binary(left, op, right) {
      if (!context.function) {
        checkNumericType(left.rep());
        checkNumericType(right.rep());
      }
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        left.type
      );
    },
    Exp5_binary(left, op, right) {
      if (!context.function) {
        checkNumericType(left.rep());
        checkNumericType(right.rep());
      }
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        left.type
      );
    },
    Exp6_binary(left, op, right) {
      checkNumericType(left.rep());
      checkNumericType(right.rep());
      return new core.BinaryExpression(
        op.rep(),
        left.rep(),
        right.rep(),
        left.type
      );
    },
    Exp7_parens(_open, expression, _close) {
      return expression.rep();
    },
    Call(callee, _left, args, _right) {
      const fun = context.lookup(callee.sourceString);
      checkArgsMatch(args.asIteration().children, fun.paramsLength);
      return new core.Call(callee.sourceString, args.asIteration().rep());
    },
    Exp7_arrayAccess(target, _open, index, _close) {
      return new core.ArrayAccess(target.rep(), index.rep());
    },
    Array(_left, listOfArgs, _right) {
      return listOfArgs.sourceString;
    },
    Type_array(_left, _middle, baseType, _right) {
      return new core.ArrayType(baseType.rep());
    },
    stringlit(_left, text, _right) {
      return new core.StringLiteral(text.sourceString);
    },
    id(_one, _two) {
      const savedId = context.lookup(this.sourceString);
      return savedId;
    },
    true(_) {
      return true;
    },
    false(_) {
      return false;
    },
    num(_whole, _point, _fraction, _e, _sign, _exponent) {
      return Number(this.sourceString);
    },
    _terminal() {
      return this.sourceString;
    },
    _iter(...children) {
      return children.map((child) => child.rep());
    },
  });

  const match = icedCoffeeGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  return analyzer(match).rep();
}
