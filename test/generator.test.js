import assert from "node:assert/strict";
import analyze from "../src/analyzer.js";
import optimize from "../src/optimizer.js";
import generate from "../src/generator.js";

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim();
}

const fixtures = [
  {
    name: "small",
    source: `
      int x = 3
      x += 1
      x -= 1
      bool y = true
      print((y && y) || x != 5)
    `,
    expected: dedent`
      let x = 3;
      x += 1;
      x -= 1;
      let y = true;
      console.log(((y && y) || (x !== 5)));
    `,
  },
  {
    name: "if",
    source: `
    int x = 13
    if x == 27 {
      x += 3
    } else if x == 13 {
      x += 2
    } else {
      x += 1
    }
  `,
    expected: dedent`
    let x = 13;
    if ((x == 27)) {
      x += 3;
    } else if ((x == 13)) {
      x += 2;
    } else {
      x += 1;
    }
  `,
  },
  {
    name: "while",
    source: `
      int x = 0
      while x < 5 {
        int y = 0
        while y < 5 {
          print(x * y)
          y += 1
        }
        x += 1
      }
    `,
    expected: dedent`
      let x = 0;
      while ((x < 5)) {
        let y = 0;
        while ((y < 5)) {
          console.log((x * y));
          y += 1;
        }
        x += 1;
      }
    `,
  },
  {
    name: "small functions",
    source: `
      func smallFunc(n) -> int {
        return n
      }
      int x = 5
      int y = smallFunc(x)
      print(y)
    `,
    expected: dedent`
      function smallFunc(n) {
        return n;
      }
      let x = 5;
      let y = smallFunc(x);
      console.log(y);
    `,
  },
  {
    name: "arrays",
    source: `
      array[bool] a = [true, false, true]
      array[int] b = [10, 20, 30]
      print(a[1])
    `,
    expected: dedent`
      let a = [true, false, true];
      let b = [10, 20, 30];
      console.log(a[1]);
    `,
  },
  {
    name: "for loops",
    source: `
      array[int] x = [1, 2, 3]
      for num in x {
        print(num^2)
      }
    `,
    expected: dedent`
      let x = [1, 2, 3];
      for (const num of x) {
        console.log((num ** 2));
      }
    `,
  },
  {
    name: "IfStatement with else if and no else",
    source: `
    int x = 5
    if x > 10 {
      print("x is greater than 10")
    } else if x < 5 {
      print("x is less than 5")
    }
  `,
    expected: dedent`
    let x = 5;
    if ((x > 10)) {
      console.log("x is greater than 10");
    } else if ((x < 5)) {
      console.log("x is less than 5");
    }
  `,
  },
  {
    name: "IfStatement without else if and else",
    source: `
    int x = 5
    if x > 10 {
      print("x is greater than 10")
    }
  `,
    expected: dedent`
    let x = 5;
    if ((x > 10)) {
      console.log("x is greater than 10");
    }
  `,
  },
  {
    name: "UnaryExpression",
    source: `
    int x = 5
    int y = -x
    bool a = true
    bool b = !a
    print(y)
    print(b)
  `,
    expected: dedent`
    let x = 5;
    let y = (-x);
    let a = true;
    let b = (!a);
    console.log(y);
    console.log(b);
  `,
  },
  {
    name: "TernaryExpression",
    source: `
    int x = 5
    int y = 10
    int z = x > y ? x : y
    print(z)
  `,
    expected: dedent`
    let x = 5;
    let y = 10;
    let z = ((x > y) ? x : y);
    console.log(z);
  `,
  },
  {
    name: "Function using paramters",
    source: `
    func square(x) -> int {
      return x * x
    }
    int a = 4
    int b = square(a)
    print(b)
  `,
    expected: dedent`
    function square(x) {
      return (x * x);
    }
    let a = 4;
    let b = square(a);
    console.log(b);
  `,
  },
  {
    name: "Function declarations",
    source: `
    func adder(x, y) -> int {
      return x + y
    }
    func isTrue(x) -> bool {
      if x == true {
        return true
      } else {
        return false
      }
    }
    func printHello() -> void {
      print("Hello!")
    }
  `,
    expected: dedent`
    function adder(x,y) {
      return (x + y);
    }
    function isTrue(x) {
      if ((x == true)) {
        return true;
      } else {
        return false;
      }
    }
    function printHello() {
      console.log("Hello!");
    }
  `,
  },
  {
    name: "for loop iterating an int",
    source: `
    int y = 5
    for val in y {
      print(val)
    }
  `,
    expected: dedent`
    let y = 5;
    for (let val = 0; val < y; val++) {
      console.log(val);
    }
  `,
  },
];

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(fixture.source)));
      assert.deepEqual(actual, fixture.expected);
    });
  }
});
