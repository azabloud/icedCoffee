![icedCoffee](/docs/icedCoffeeLogo.png)

# icedCoffee

A compiler for the language icedCoffee

## About

icedCoffee is a programming language created to be as simple and powerful as a cup of iced coffee. The language syntax is primarily inspired by a combination of Swift and Python, and is designed to be as intuitive as possible to allow for beginners to use the language with ease.

## Features

- Statically typed
- Data structures
- Variable assignments
- If statements
- Loops
- Functions
- Single line comment with ##
- Multi-line comment with ###
- .icedCoffee file extention

## Examples

### Hello World

```
print("Hello world!")
```

### Arithmetic

Addition: `5 + 3`
\
Subtraction: `37 - 5`
\
Multiplication: `17 * 3`
\
Division: `80 / 10`
\
Exponent: `7^3`
\
Modulus: `50 % 4`

### Operators

```
x && y
x || y
x < y
x > y
x <= y
x >= y
x != y
```

### Variable Declaration

```
int x = 15
double q = 47.26
string y = "hello"
bool z = true
array[int] j = [5, 2, 6]
```

### Function Declaration

```
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
```

### If Statements

```
if x == 27 {
    return true
} else if x == 13 {
    return false
} else {
    x += 1
}
```

### Loops

```
int x = 30
while x < 50 {
    print("Less!")
    x = x + 1
}

int y = 5
for val in y {
    print(val)
}

array[int] z = [3,6,4,2]
for val in z {
    print(val)
}

```

### Comments

```
## Single line comment

###
multi
line
comment
###
```

### Fibonacci

```
func fibonacci(n) -> int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}
```

### Error Types

- Referencing an undeclared id
- Adding/subtracting non-numbers
- Conditional not using bool
- Iterating a var that isn't an int or array in 'for in' loop
- Returning value in a void function
- No return value in non-void funciton
- Passing the wrong amount of arguments
- Using return outside of a function

### Usage

To run from the command line:

```
node src/icedCoffee.js <filename> <outputType>
```

Output types:

- analyzed
- optimized
- js
  analyzed produces AST
  optimized produces decorated AST
  js produces the translation of the program to JavaScript

# Example Runs

```
node src/icedCoffee.js examples/forInExample.icedCoffee analyzed
   1 | Program statements=[#2,#5,#7,#9,#17,#19,#20,#22,#23,#25]
   2 | VariableDeclaration variable=#3 initializer='1, 2, 3, 4'
   3 | Variable id='x' type=#4
   4 | ArrayType description='array[undefined]' baseType='int'
   5 | VariableDeclaration variable=#6 initializer=false
   6 | Variable id='y' type='bool'
   7 | VariableDeclaration variable=#8 initializer=0
   8 | Variable id='z' type='int'
   9 | ForStatement iterable=#10 collection=#3 consequent=[#11,#13,#15]
  10 | Variable id='num' type='int'
  11 | PrintStatement argument=#12
  12 | BinaryExpression op='^' left=#10 right=2 type=undefined
  13 | AssignmentStatement target=#6 eq='=' source=#14
  14 | UnaryExpression op='!' operand=#6 type='bool'
  15 | AssignmentStatement target=#8 eq='+=' source=#16
  16 | BinaryExpression op='^' left=#10 right=2 type=undefined
  17 | PrintStatement argument=#18
  18 | StringLiteral contents='y: '
  19 | PrintStatement argument=#6
  20 | PrintStatement argument=#21
  21 | StringLiteral contents='z: '
  22 | PrintStatement argument=#8
  23 | PrintStatement argument=#24
  24 | StringLiteral contents='Count from zero to four'
  25 | ForStatement iterable=#26 collection='5' consequent=[#27]
  26 | Variable id='num' type='int'
  27 | PrintStatement argument=#26
```

```
examples/forInExample.icedCoffee optimized

   1 | Program statements=[#2,#5,#7,#9,#17,#19,#20,#22,#23,#25]
   2 | VariableDeclaration variable=#3 initializer='1, 2, 3, 4'
   3 | Variable id='x' type=#4
   4 | ArrayType description='array[undefined]' baseType='int'
   5 | VariableDeclaration variable=#6 initializer=false
   6 | Variable id='y' type='bool'
   7 | VariableDeclaration variable=#8 initializer=0
   8 | Variable id='z' type='int'
   9 | ForStatement iterable=#10 collection=#3 consequent=[#11,#13,#15]
  10 | Variable id='num' type='int'
  11 | PrintStatement argument=#12
  12 | BinaryExpression op='^' left=#10 right=2 type=undefined
  13 | AssignmentStatement target=#6 eq='=' source=#14
  14 | UnaryExpression op='!' operand=#6 type='bool'
  15 | AssignmentStatement target=#8 eq='+=' source=#16
  16 | BinaryExpression op='^' left=#10 right=2 type=undefined
  17 | PrintStatement argument=#18
  18 | StringLiteral contents='y: '
  19 | PrintStatement argument=#6
  20 | PrintStatement argument=#21
  21 | StringLiteral contents='z: '
  22 | PrintStatement argument=#8
  23 | PrintStatement argument=#24
  24 | StringLiteral contents='Count from zero to four'
  25 | ForStatement iterable=#26 collection='5' consequent=[#27]
  26 | Variable id='num' type='int'
  27 | PrintStatement argument=#26
```

```
node src/icedCoffee.js examples/forInExample.icedCoffee js
let x = [1, 2, 3, 4];
let y = false;
let z = 0;
for (const num of x) {
console.log((num ** 2));
y = (!y);
z += (num ** 2);
}
console.log("y: ");
console.log(y);
console.log("z: ");
console.log(z);
console.log("Count from zero to four");
for (let num = 0; num < 5; num++) {
console.log(num);
}
```

## Developer Bio

The icedCoffee language was developed by Adam Zabloudil for a project in Languages and Automata II, a Computer Science course at Loyola Marymount University.

## GH Pages:

https://azabloud.github.io/icedCoffee/

## GH Repo

https://github.com/azabloud/icedCoffee

###### Logo Credit

Credit to
https://icons8.com/
and
https://www.flaticon.com/
for icons used for the icedCoffee logo
