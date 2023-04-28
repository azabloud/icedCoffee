![icedCoffee](/docs/icedCoffeeLogo.png)

# icedCoffee

A compiler for the language icedCoffee

## About

icedCoffee is a programming language created to be as simple and powerful as a cup of iced coffee. The language is designed to be as intuitive as possible to allow for beginners to use the language with ease.

## Features

- Statically typed
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
