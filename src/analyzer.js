import fs from "fs";
import ohm from "ohm-js";
import * as core from "./core.js";

// Throw an error message that takes advantage of Ohm's messaging
function error(message, node) {
  if (node) {
    throw new Error(`${node.source.getLineAndColumnMessage()}${message}`);
  }
  throw new Error(message);
}

const icedCoffeeGrammar = ohm.grammar(fs.readFileSync("src/icedCoffee.ohm"));

export default function analyze(sourceCode) {
  const analyzer = icedCoffeeGrammar.createSemantics().addOperation("rep", {
    Program(body) {
      return new core.Program(body.children.map((s) => s.rep()));
    },
    Statement_vardec(_let, id, _eq, initializer) {
      // Analyze the initializer *before* adding the variable to the context,
      // because we don't want the variable to come into scope until after
      // the declaration. That is, "let x=x;" should be an error (unless x
      // was already defined in an outer scope.)
      const initializerRep = initializer.rep();
      const variable = new core.Variable(id.sourceString, false);
      context.add(id.sourceString, variable, id);
      return new core.VariableDeclaration(variable, initializerRep);
    },
    Statement_fundec(
      _fun,
      id,
      _open,
      params,
      _close,
      _equals,
      body,
      _semicolon
    ) {
      params = params.asIteration().children;
      const fun = new core.Function(id.sourceString, params.length, true);
      // Add the function to the context before analyzing the body, because
      // we want to allow functions to be recursive
      context.add(id.sourceString, fun, id);
      context = new Context(context);
      const paramsRep = params.map((p) => {
        let variable = new core.Variable(p.sourceString, true);
        context.add(p.sourceString, variable, p);
        return variable;
      });
      const bodyRep = body.rep();
      context = context.parent;
      return new core.FunctionDeclaration(fun, paramsRep, bodyRep);
    },
    Statement_assign(id, _eq, expression) {
      const target = id.rep();
      check(!target.readOnly, `${target.name} is read only`, id);
      return new core.Assignment(target, expression.rep());
    },
    Statement_print(_print, _left, argument, _right) {
      return new core.PrintStatement(argument.rep());
    },
    Statement_while(_while, test, body) {
      return new core.WhileStatement(test.rep(), body.rep());
    },
    Block(_open, body, _close) {
      return body.rep();
    },
    Exp_unary(op, operand) {
      return new core.UnaryExpression(op.rep(), operand.rep());
    },
    Exp_ternary(test, _questionMark, consequent, _colon, alternate) {
      return new core.Conditional(
        test.rep(),
        consequent.rep(),
        alternate.rep()
      );
    },
    Exp1_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp2_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp3_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp4_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp5_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp6_binary(left, op, right) {
      return new core.BinaryExpression(op.rep(), left.rep(), right.rep());
    },
    Exp7_parens(_open, expression, _close) {
      return expression.rep();
    },
    Call(callee, left, args, _right) {
      const fun = context.get(callee.sourceString, core.Function, callee);
      const argsRep = args.asIteration().rep();
      check(
        argsRep.length === fun.paramCount,
        `Expected ${fun.paramCount} arg(s), found ${argsRep.length}`,
        left
      );
      return new core.Call(fun, argsRep);
    },
    stringlit(_left, text, _right) {
      return new core.StringLiteral(text.sourceString);
    },
    id(_first, _rest) {
      // Designed to get here only for ids in expressions
      return context.get(this.sourceString, core.Variable, this);
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
    _iter(...children) {
      return children.map((child) => child.rep());
    },
  });

  const match = icedCoffeeGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
  return analyzer(match).rep();
}
