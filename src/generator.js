import { IfStatement, Type, ArrayType } from "./core.js";

export default function generate(program) {
  const output = [];

  function gen(node) {
    return generators[node.constructor.name](node);
  }

  const generators = {
    Program(p) {
      gen(p.statements);
    },
    PrintStatement(s) {
      output.push(`console.log(${gen(s.argument)});`);
    },
    VariableDeclaration(d) {
      if (d.variable.type instanceof ArrayType) {
        output.push(`let ${gen(d.variable)} = [${gen(d.initializer)}];`);
      } else {
        output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
      }
    },
    Variable(v) {
      return v.id;
    },
    AssignmentStatement(s) {
      output.push(`${gen(s.target)} ${gen(s.eq)} ${gen(s.source)};`);
    },
    IfStatement(s) {
      output.push(`if (${gen(s.test)}) {`);
      gen(s.consequent);
      for (const elseIfPart of s.elseIfParts) {
        output.push(`} else if (${gen(elseIfPart.condition)}) {`);
        gen(elseIfPart.body);
      }
      if (s.alternate) {
        output.push("} else {");
        gen(s.alternate);
        output.push("}");
      } else {
        output.push("}");
      }
    },
    WhileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);
      gen(s.consequent);
      output.push("}");
    },
    ForStatement(s) {
      if (s.collection.type instanceof ArrayType) {
        output.push(`for (const ${gen(s.iterable)} of ${gen(s.collection)}) {`);
        gen(s.consequent);
        output.push("}");
      } else {
        output.push(
          `for (let ${gen(s.iterable)} = 0; ${gen(s.iterable)} < ${
            s.collection
          }; ${gen(s.iterable)}++) {`
        );
        gen(s.consequent);
        output.push("}");
      }
    },
    ReturnStatement(s) {
      output.push(`return ${gen(s.expression)};`);
    },
    BinaryExpression(e) {
      if (e.op == "^") {
        return `(${gen(e.left)} ** ${gen(e.right)})`;
      } else {
        const op = e.op === "!=" ? "!==" : e.op;
        return `(${gen(e.left)} ${op} ${gen(e.right)})`;
      }
    },
    UnaryExpression(e) {
      return `(${e.op}${gen(e.operand)})`;
    },
    TernaryExpression(e) {
      return `(${gen(e.test)} ? ${gen(e.consequent)} : ${gen(e.alternate)})`;
    },
    FunctionDeclaration(d) {
      output.push(`function ${gen(d.id)}(${gen(d.params)}) {`);
      gen(d.body);
      output.push("}");
    },
    Call(c) {
      return `${gen(c.callee)}(${gen(c.args).join(", ")})`;
    },
    ArrayAccess(e) {
      return `${gen(e.array)}[${gen(e.index)}]`;
    },
    Number(e) {
      return e;
    },
    Boolean(e) {
      return e;
    },
    String(e) {
      return e;
    },
    StringLiteral(e) {
      return JSON.stringify(e.contents);
    },
    Array(a) {
      return a.map(gen);
    },
  };

  gen(program);
  return output.join("\n");
}
