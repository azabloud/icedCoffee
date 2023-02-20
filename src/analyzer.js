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
      return new core.Program(body.rep());
    },
  });

  const match = icedCoffeeGrammar.match(sourceCode);
  if (!match.succeeded()) error(match.message);
}
