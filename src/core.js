import util from "util";

export class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

export class PrintStatement {
  constructor(argument) {
    this.argument = argument;
  }
}

export class VariableDeclaration {
  constructor(variable, initializer) {
    this.variable = variable;
    this.initializer = initializer;
  }
}

export class Variable {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

export class Type {
  static BOOL = new Type("bool");
  static INT = new Type("int");
  static DOUBLE = new Type("double");
  static STRING = new Type("string");
  static VOID = new Type("void");
  constructor(description) {
    this.description = description;
  }
}

export class ArrayType extends Type {
  constructor(baseType) {
    super(`array[${baseType.description}]`);
    this.baseType = baseType;
  }
}

export class AssignmentStatement {
  constructor(target, eq, source) {
    this.target = target;
    this.eq = eq;
    this.source = source;
  }
}

export class IfStatement {
  constructor(test, consequent, elseIfParts, alternate) {
    this.test = test;
    this.consequent = consequent;
    this.elseIfParts = elseIfParts;
    this.alternate = alternate;
  }
}

export class WhileStatement {
  constructor(test, consequent) {
    this.test = test;
    this.consequent = consequent;
  }
}

export class ForStatement {
  constructor(iterable, collection, consequent) {
    this.iterable = iterable;
    this.collection = collection;
    this.consequent = consequent;
  }
}

export class ReturnStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

export class BinaryExpression {
  constructor(op, left, right, type) {
    this.op = op;
    this.left = left;
    this.right = right;
    this.type = type;
  }
}

export class UnaryExpression {
  constructor(op, operand, type) {
    this.op = op;
    this.operand = operand;
    this.type = type;
  }
}

export class TernaryExpression {
  constructor(test, consequent, alternate) {
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.type = consequent.type;
  }
}

export class Function {
  constructor(name, type, paramsLength, params) {
    this.name = name;
    this.type = type;
    this.paramsLength = paramsLength;
    this.params = params;
  }
}

export class FunctionDeclaration {
  constructor(id, params, body) {
    this.id = id;
    this.params = params;
    this.body = body;
  }
}

export class Call {
  constructor(callee, args) {
    this.callee = callee;
    this.args = args;
  }
}

export class StringLiteral {
  constructor(contents) {
    this.contents = contents;
  }
}

export class ArrayAccess {
  constructor(array, index) {
    this.array = array;
    this.index = index;
  }
}

// Return a compact and pretty string representation of the node graph,
// taking care of cycles. Written here from scratch because the built-in
// inspect function, while nice, isn't nice enough. Defined properly in
// the root class prototype so that it automatically runs on console.log.
Program.prototype[util.inspect.custom] = function () {
  const tags = new Map();

  // Attach a unique integer tag to every node
  function tag(node) {
    if (tags.has(node) || typeof node !== "object" || node === null) return;
    tags.set(node, tags.size + 1);
    for (const child of Object.values(node)) {
      Array.isArray(child) ? child.forEach(tag) : tag(child);
    }
  }

  function* lines() {
    function view(e) {
      if (tags.has(e)) return `#${tags.get(e)}`;
      if (Array.isArray(e)) return `[${e.map(view)}]`;
      return util.inspect(e);
    }
    for (let [node, id] of [...tags.entries()].sort((a, b) => a[1] - b[1])) {
      let type = node.constructor.name;
      let props = Object.entries(node).map(([k, v]) => `${k}=${view(v)}`);
      yield `${String(id).padStart(4, " ")} | ${type} ${props.join(" ")}`;
    }
  }

  tag(this);
  return [...lines()].join("\n");
};
