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
      const initializerRep = initializer.rep();
      const variable = new core.Variable(id.sourceString, false);
      return new core.VariableDeclaration(variable, initializerRep);
    },
    Statement_fundec(_func, _id, _open, params, _close, _arrow, _type, body) {
      return new core.FunctionDeclaration(
        params.asIteration().rep(),
        body.rep()
      );
    },
    Statement_assign(id, _eq, expression) {
      const target = id.rep();
      return new core.AssignmentStatement(target, expression.rep());
    },
    Statement_print(_print, _left, argument, _right) {
      return new core.PrintStatement(argument.rep());
    },
    Statement_return(_return, exp) {
      return new core.ReturnStatement(exp.rep());
    },
    Statement_while(_while, test, body) {
      return new core.WhileStatement(test.rep(), body.rep());
    },
    Statement_if(_if1, exp1, body1, _else1, _if2, exp2, body2, _else2, body3) {
      return new core.IfStatement(
        exp1.rep(),
        body1.rep(),
        exp2.rep(),
        body2.rep(),
        body3.rep()
      );
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
    Call(callee, _left, args, _right) {
      return new core.Call(callee.sourceString, args.asIteration().rep());
    },
    stringlit(_left, text, _right) {
      return new core.StringLiteral(text.sourceString);
    },
    id(_one, _two) {
      return this.sourceString;
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
