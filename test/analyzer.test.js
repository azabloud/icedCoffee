import assert from "assert/strict";
import analyze from "../src/analyzer.js";

// Programs that are semantically correct
const semanticChecks = [
  ["variables can be printed", "int x = 1\n print(x)"],
  ["variables can be reassigned", "int x = 1\n x = 5"],
  [
    "variables can be compared",
    "int x = 3\n int y = 5\n if x == y {\n print(x+y)\n}",
  ],
  [
    "different number types can be compared",
    "int x = 3\n double y = 5.4\n if x > y {\n print(x+y)\n}",
  ],
  [
    "different number types can be added",
    "int x = 3\n double y = 5.3\n x = y + x",
  ],
  [
    "different number types can be multiplied",
    "int x = 3\n double y = 5.7\n x = y * x",
  ],
  [
    "different number types can be powers",
    "int x = 3\n double y = 5.4\n x = y^x",
  ],
  [
    "AND comparisons use bools",
    "int x = 3\n double y = 5.3\n if true && (x > y) {\n print(x+y)\n}",
  ],
  [
    "using unary NOT",
    "int x = 3\n double y = 5.3\n if !true {\n print(x+y)\n}",
  ],
  ["using ternary conditional", "int x = 3\n int y = 5\n print(true ? x : y)"],
  [
    "OR comparisons use bools",
    "int x = 3\n double y = 5.3\n if true || (x > y) {\n print(x+y)\n}",
  ],
  [
    "while loops use bools",
    "int x = 3\n double y = 5.8\n while true && (x < y) {\n print(x+y)\n x=x+y\n}",
  ],
  ["for loops use ints", "int x = 5\n for val in x {\n print(x)\n}"],
  [
    "for loops can use int arrays",
    "array[int] x = [3,6,4]\n for val in x {\n print(x)\n}",
  ],
  [
    "for loops can use bool arrays",
    "array[int] x = [true,true,false]\n for val in x {\n print(x)\n}",
  ],
  [
    "returning no value in void function",
    "func adder(x, y) -> void {\nreturn \n}",
  ],
  [
    "returning int in non-void function",
    "int z = 5\n func adder(x, y) -> int {\nreturn z\n}",
  ],
  [
    "returning array in non-void function",
    "array[int] z = [5, 3, 8]\n func adder(x, y) -> array[int] {\nreturn z\n}",
  ],
  [
    "using the right amount of arguments in function call",
    "int z = 5\n func adder(x, y) -> int {\nreturn z\n} \n int t = adder(z, z)",
  ],
];

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  [
    "using undeclared identifiers",
    "print(x)",
    /Reference to: x which is not declared/,
  ],
  [
    "adding bools",
    "int x = 5\n bool y = false\n x = x + y",
    /Int or Double expected/,
  ],
  [
    "adding arrays",
    "int x = 5\n array[int] y = [1, 4, 5]\n x = x + y",
    /Int or Double expected/,
  ],
  [
    "adding strings",
    'int x = 5\n string y = "hello"\n x = x + y',
    /Int or Double expected/,
  ],
  [
    "just adding in conditional in conditional",
    "int x = 4\n int y = 5\n if x + y { \n print(5) \n }",
    /Expected a bool/,
  ],
  [
    "using differen types in ternary conditional",
    "int x = 3\n double y = 5.4\n print(true ? x : y)",
    /Must be same type/,
  ],
  [
    "iterating a bool",
    "bool x = false\n for val in x {\n print(4)\n }",
    /Expected an Array or Int/,
  ],
  [
    "iterating a double",
    "double x = 10.5\n for val in x {\n print(4)\n }",
    /Expected an Array or Int/,
  ],
  [
    "iterating a string",
    "double x = 10.5\n for val in x {\n print(4)\n }",
    /Expected an Array or Int/,
  ],
  [
    "returning value in void function",
    "int z = 5\n func adder(x, y) -> void {\nreturn z\n}",
    /Cannot return in a void function/,
  ],
  [
    "no return value in non-void function",
    "int z = 5\n func adder(x, y) -> int {\nreturn\n}",
    /No value returned/,
  ],
  [
    "using wrong amount of arguments",
    "int z = 5\n func adder(x, y) -> int {\nreturn z\n} \n int t = adder(z, z, z)",
    /Wrong number of arguments passed/,
  ],
  [
    "using returns outside of functions",
    "int x = 5\n return x",
    /Return can only appear in a function/,
  ],
];

describe("The analyzer", () => {
  it("throws on syntax errors", () => {
    assert.throws(() => analyze("*(^%$"));
  });
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(source));
    });
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(source), errorMessagePattern);
    });
  }
});
