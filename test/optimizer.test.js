import assert from "node:assert/strict";
import optimize from "../src/optimizer.js";
import * as core from "../src/core.js";

const arrayType = new core.ArrayType("int");
const x = new core.Variable("x", core.Type.INT);
const y = new core.Variable("y", core.Type.INT);
const z = new core.Variable("z", arrayType);
const q = new core.Variable("z", arrayType);
const emptyArray = new core.VariableDeclaration(z, []);
const nonEmptyArray = new core.VariableDeclaration(q, [1, 2, 3]);
const neg = (x) => new core.UnaryExpression("-", x);
const or = (...d) => d.reduce((x, y) => new core.BinaryExpression("||", x, y));
const and = (...c) => c.reduce((x, y) => new core.BinaryExpression("&&", x, y));
const less = (x, y) => new core.BinaryExpression("<", x, y);

const tests = [
  ["folds +", new core.BinaryExpression("+", 5, 8), 13],
  ["folds -", new core.BinaryExpression("-", 5n, 8n), -3n],
  ["folds *", new core.BinaryExpression("*", 5, 8), 40],
  ["folds /", new core.BinaryExpression("/", 5, 8), 0.625],
  ["folds ^", new core.BinaryExpression("^", 5, 8), 390625],
  ["folds <", new core.BinaryExpression("<", 5, 8), true],
  ["folds <=", new core.BinaryExpression("<=", 5, 8), true],
  ["folds ==", new core.BinaryExpression("==", 5, 8), false],
  ["folds !=", new core.BinaryExpression("!=", 5, 8), true],
  ["folds >=", new core.BinaryExpression(">=", 5, 8), false],
  ["folds >", new core.BinaryExpression(">", 5, 8), false],
  ["optimizes +0", new core.BinaryExpression("+", x, 0), x],
  ["optimizes -0", new core.BinaryExpression("-", x, 0), x],
  ["optimizes *1", new core.BinaryExpression("*", x, 1), x],
  ["optimizes /1", new core.BinaryExpression("/", x, 1), x],
  ["optimizes *0", new core.BinaryExpression("*", x, 0), 0],
  ["optimizes 0*", new core.BinaryExpression("*", 0, x), 0],
  ["optimizes 0/", new core.BinaryExpression("/", 0, x), 0],
  ["optimizes 0+", new core.BinaryExpression("+", 0, x), x],
  ["optimizes 0-", new core.BinaryExpression("-", 0, x), neg(x)],
  ["optimizes 1*", new core.BinaryExpression("*", 1, x), x],
  ["folds negation", new core.UnaryExpression("-", 8), -8],
  ["optimizes 1^", new core.BinaryExpression("^", 1, x), 1],
  ["optimizes ^0", new core.BinaryExpression("^", x, 0), 1],
  ["removes left false from ||", or(false, less(x, 1)), less(x, 1)],
  ["removes right false from ||", or(less(x, 1), false), less(x, 1)],
  ["removes left true from &&", and(true, less(x, 1)), less(x, 1)],
  ["removes right true from &&", and(less(x, 1), true), less(x, 1)],
  [
    "removes assignment with same target and source",
    new core.AssignmentStatement(x, "=", x),
    [],
  ],
  [
    "optimizes if-statement with constant boolean test (true)",
    new core.IfStatement(
      true,
      [new core.PrintStatement("true branch")],
      [],
      []
    ),
    [new core.PrintStatement("true branch")],
  ],
  [
    "optimizes if-statement with constant boolean test (false)",
    new core.IfStatement(
      false,
      [],
      [],
      [new core.PrintStatement("false branch")]
    ),
    [new core.PrintStatement("false branch")],
  ],
  [
    "optimizes while-statement with constant false test",
    new core.WhileStatement(false, [new core.PrintStatement("while loop")]),
    [],
  ],
  [
    "optimizes for-statement with empty array",
    new core.ForStatement(x, emptyArray, [new core.PrintStatement("for loop")]),
    [],
  ],
  [
    "optimizes ternary expression with constant boolean test (true)",
    new core.TernaryExpression(true, x, y),
    x,
  ],
  [
    "optimizes ternary expression with constant boolean test (false)",
    new core.TernaryExpression(false, x, y),
    y,
  ],
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new core.Program([new core.ForStatement()]),
      new core.VariableDeclaration(x, "z"),
      new core.AssignmentStatement(x, "=", "h"),
      new core.ForStatement(x, nonEmptyArray, []),
    ]),
  ],
];

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(scenario, () => {
      assert.deepStrictEqual(optimize(before), after);
    });
  }
});
