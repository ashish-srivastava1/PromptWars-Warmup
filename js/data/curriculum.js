/**
 * Learning Companion — Curriculum Data
 * Rich, multi-strategy content for JavaScript fundamentals.
 */

export const CURRICULUM = {
  id: 'javascript-fundamentals',
  title: 'JavaScript Fundamentals',
  description: 'Master the core building blocks of JavaScript programming.',
  topics: [
    {
      id: 'variables',
      title: 'Variables & Data Types',
      icon: '📦',
      description: 'Learn how to store and work with data in JavaScript.',
      prerequisites: [],
      concepts: [
        {
          id: 'var-let-const',
          title: 'var, let, and const',
          difficulty: 1,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `In JavaScript, you declare variables using three keywords:\n\n\`\`\`js\nvar name = "Alice";   // old way, function-scoped\nlet age = 25;         // modern, block-scoped, reassignable\nconst PI = 3.14159;   // block-scoped, cannot be reassigned\n\`\`\`\n\n**Key difference:** \`let\` and \`const\` respect block boundaries (if/for), while \`var\` does not.\n\n\`\`\`js\nif (true) {\n  let x = 10;\n  var y = 20;\n}\nconsole.log(y); // 20 — var leaks out!\nconsole.log(x); // ReferenceError — let stays inside\n\`\`\``
            },
            analogy: {
              title: 'Think of it Like…',
              content: `Imagine three types of containers:\n\n🗑️ **var** = A bucket with no lid. Anyone in the house can reach in and change what's inside, and it's visible from every room.\n\n📦 **let** = A box with a lid. It stays in the room where you put it, and you can swap its contents.\n\n🔒 **const** = A locked safe. It stays in its room, and once you put something in, you can't replace it.\n\nModern best practice: **Use \`const\` by default**, switch to \`let\` only when you need to reassign.`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Understand the need — programs store data in named slots called *variables*.\n\n**Step 2:** Choose your keyword:\n- Need to reassign later? → \`let\`\n- Value will never change? → \`const\`\n- Writing legacy code? → \`var\` (avoid in new code)\n\n**Step 3:** Declare and assign:\n\`\`\`js\nconst greeting = "Hello";\nlet count = 0;\ncount = count + 1; // ✅ allowed with let\n// greeting = "Hi"; // ❌ TypeError with const\n\`\`\`\n\n**Step 4:** Understand scoping — \`let\` and \`const\` are *block-scoped* (limited to the nearest \`{}\`), while \`var\` is *function-scoped*.`
            }
          },
          quiz: [
            { difficulty: 1, question: 'Which keyword declares a variable that cannot be reassigned?', options: ['var', 'let', 'const', 'def'], correct: 2, explanation: '`const` creates a binding that cannot be reassigned after initialization.' },
            { difficulty: 2, question: 'What happens when you access a `let` variable before its declaration?', options: ['Returns undefined', 'Returns null', 'ReferenceError', 'SyntaxError'], correct: 2, explanation: '`let` and `const` exist in a "temporal dead zone" from the start of the block until the declaration is reached.' },
            { difficulty: 3, question: 'Which statement is TRUE about `const` objects?', options: ['Their properties cannot be changed', 'They cannot be reassigned to a new object', 'They are deeply immutable', 'They must be initialized later'], correct: 1, explanation: '`const` prevents reassignment of the binding, but the object\'s properties can still be modified.' }
          ]
        },
        {
          id: 'data-types',
          title: 'Primitive Data Types',
          difficulty: 1,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `JavaScript has 7 primitive types:\n\n\`\`\`js\nlet str = "Hello";        // String\nlet num = 42;             // Number\nlet big = 9007199254740991n; // BigInt\nlet bool = true;          // Boolean\nlet empty = null;         // Null\nlet notSet;               // Undefined\nlet id = Symbol("id");    // Symbol\n\`\`\`\n\nUse \`typeof\` to check:\n\`\`\`js\ntypeof str   // "string"\ntypeof num   // "number"\ntypeof bool  // "boolean"\ntypeof null  // "object" ← famous JS bug!\n\`\`\``
            },
            analogy: {
              title: 'Think of it Like…',
              content: `Think of data types as different kinds of mail:\n\n✉️ **String** — A letter with text inside\n🔢 **Number** — A check with an amount\n✅ **Boolean** — A yes/no ballot\n📭 **Null** — An intentionally empty mailbox\n❓ **Undefined** — A mailbox that was never set up\n🏷️ **Symbol** — A unique, unforgeable stamp`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Primitives are the simplest data — they are *immutable* (you can't change "hello" in place; you create a new string).\n\n**Step 2:** The most common are:\n- \`string\` for text\n- \`number\` for integers AND decimals\n- \`boolean\` for true/false logic\n\n**Step 3:** Special values:\n- \`null\` means "intentionally empty"\n- \`undefined\` means "not yet assigned"\n\n**Step 4:** Type coercion — JS auto-converts types sometimes:\n\`\`\`js\n"5" + 3   // "53" (string wins)\n"5" - 3   // 2   (math wins)\n\`\`\``
            }
          },
          quiz: [
            { difficulty: 1, question: 'Which of these is NOT a primitive type in JavaScript?', options: ['String', 'Array', 'Boolean', 'Symbol'], correct: 1, explanation: 'Array is an object type, not a primitive. The 7 primitives are: string, number, bigint, boolean, null, undefined, symbol.' },
            { difficulty: 2, question: 'What does `typeof null` return?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correct: 2, explanation: 'This is a well-known JavaScript bug from the first implementation. `typeof null` returns "object" even though null is a primitive.' },
            { difficulty: 3, question: 'What is the result of `"5" + 3`?', options: ['8', '"53"', 'NaN', 'TypeError'], correct: 1, explanation: 'The + operator with a string triggers string concatenation, so the number 3 is converted to "3" and concatenated.' }
          ]
        }
      ]
    },
    {
      id: 'functions',
      title: 'Functions',
      icon: '⚡',
      description: 'Understand how to create reusable blocks of logic.',
      prerequisites: ['variables'],
      concepts: [
        {
          id: 'function-basics',
          title: 'Declaring Functions',
          difficulty: 2,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `Three ways to create functions:\n\n\`\`\`js\n// 1. Function Declaration (hoisted)\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\n// 2. Function Expression\nconst greet2 = function(name) {\n  return "Hello, " + name;\n};\n\n// 3. Arrow Function (ES6+)\nconst greet3 = (name) => "Hello, " + name;\n\`\`\`\n\nAll three are called the same way:\n\`\`\`js\ngreet("Alice"); // "Hello, Alice"\n\`\`\``
            },
            analogy: {
              title: 'Think of it Like…',
              content: `A function is like a **recipe card**:\n\n📝 **Name** = Recipe title (\"greet\")\n🥕 **Parameters** = Ingredients list (\"name\")\n👨‍🍳 **Body** = Cooking instructions\n🍽️ **Return value** = The finished dish\n\nYou write the recipe once, then "call" it whenever you need that dish — with different ingredients each time!`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Define the function with a name and parameters:\n\`\`\`js\nfunction add(a, b) { ... }\n\`\`\`\n\n**Step 2:** Write the logic inside the body.\n\n**Step 3:** Use \`return\` to send a value back:\n\`\`\`js\nfunction add(a, b) {\n  return a + b;\n}\n\`\`\`\n\n**Step 4:** Call the function:\n\`\`\`js\nlet result = add(3, 4); // 7\n\`\`\`\n\n**Step 5:** Arrow functions are shorthand:\n\`\`\`js\nconst add = (a, b) => a + b;\n\`\`\``
            }
          },
          quiz: [
            { difficulty: 1, question: 'What keyword is used to send a value back from a function?', options: ['send', 'output', 'return', 'yield'], correct: 2, explanation: '`return` exits the function and passes a value back to the caller.' },
            { difficulty: 2, question: 'Which function type is hoisted to the top of its scope?', options: ['Arrow function', 'Function expression', 'Function declaration', 'All of them'], correct: 2, explanation: 'Only function declarations are hoisted. Expressions and arrows behave like `let`/`const` variables.' },
            { difficulty: 3, question: 'What does a function return if there is no `return` statement?', options: ['null', '0', 'undefined', 'It throws an error'], correct: 2, explanation: 'Functions without an explicit return statement implicitly return `undefined`.' }
          ]
        },
        {
          id: 'closures',
          title: 'Closures',
          difficulty: 3,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `A closure is a function that remembers its outer variables:\n\n\`\`\`js\nfunction createCounter() {\n  let count = 0; // private variable\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\ncounter(); // 1\ncounter(); // 2\ncounter(); // 3\n\`\`\`\n\nThe inner function "closes over" \`count\` — it retains access even after \`createCounter\` has finished.`
            },
            analogy: {
              title: 'Think of it Like…',
              content: `Imagine a **backpack** 🎒:\n\nWhen a function is created inside another function, it packs up all the variables from its parent into a backpack. Even after leaving the parent's "room," the inner function still carries that backpack and can access everything inside.\n\nThe backpack is the **closure** — it's the hidden environment that travels with the function.`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** An outer function defines a local variable.\n\n**Step 2:** An inner function references that variable.\n\n**Step 3:** The outer function returns the inner function.\n\n**Step 4:** Even after the outer function finishes, the inner function still has access to the variable.\n\n\`\`\`js\nfunction makeMultiplier(factor) {\n  return (number) => number * factor;\n}\n\nconst double = makeMultiplier(2);\nconst triple = makeMultiplier(3);\n\ndouble(5); // 10\ntriple(5); // 15\n\`\`\`\n\nEach call creates a separate closure with its own \`factor\`.`
            }
          },
          quiz: [
            { difficulty: 2, question: 'What is a closure?', options: ['A function without parameters', 'A function that remembers its outer scope variables', 'A way to close a program', 'A type of loop'], correct: 1, explanation: 'A closure is a function bundled with references to its surrounding lexical environment.' },
            { difficulty: 3, question: 'What will this log?\n```js\nfunction make() {\n  let x = 1;\n  return () => x++;\n}\nconst fn = make();\nfn(); fn();\nconsole.log(fn());\n```', options: ['1', '2', '3', 'undefined'], correct: 2, explanation: 'Each call increments x (1→2→3) and returns the value before incrementing (post-increment returns old value, but x++ evaluates to old value). Actually x++ returns old value: first call returns 1 (x becomes 2), second returns 2 (x becomes 3), third returns 3 (x becomes 4). So it logs 3.' },
            { difficulty: 3, question: 'How many independent closures are created by calling `makeMultiplier` twice?', options: ['0', '1', '2', 'Depends on arguments'], correct: 2, explanation: 'Each call to the outer function creates a new execution context with its own copy of the closed-over variables.' }
          ]
        }
      ]
    },
    {
      id: 'arrays',
      title: 'Arrays & Iteration',
      icon: '📋',
      description: 'Work with ordered collections and transform data.',
      prerequisites: ['functions'],
      concepts: [
        {
          id: 'array-basics',
          title: 'Array Fundamentals',
          difficulty: 1,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `Arrays store ordered lists of values:\n\n\`\`\`js\nconst fruits = ["apple", "banana", "cherry"];\n\nfruits[0];        // "apple" (zero-indexed)\nfruits.length;    // 3\nfruits.push("date"); // add to end\nfruits.pop();     // remove from end\n\`\`\`\n\nArrays can hold mixed types:\n\`\`\`js\nconst mixed = [1, "two", true, null];\n\`\`\``
            },
            analogy: {
              title: 'Think of it Like…',
              content: `An array is like a **numbered train** 🚂:\n\n- Each car has a number (index), starting from 0\n- Cars hold one item each\n- You can add cars to the end (\`push\`) or remove the last car (\`pop\`)\n- You can look at any car by its number: \`train[2]\``
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Create an array with square brackets:\n\`\`\`js\nconst colors = ["red", "green", "blue"];\n\`\`\`\n\n**Step 2:** Access elements by index (starts at 0):\n\`\`\`js\ncolors[0] // "red"\ncolors[2] // "blue"\n\`\`\`\n\n**Step 3:** Modify arrays:\n\`\`\`js\ncolors.push("yellow"); // add to end\ncolors.unshift("pink"); // add to start\ncolors.splice(1, 1); // remove 1 item at index 1\n\`\`\`\n\n**Step 4:** Check length: \`colors.length\``
            }
          },
          quiz: [
            { difficulty: 1, question: 'What is the index of the first element in a JavaScript array?', options: ['1', '0', '-1', 'first'], correct: 1, explanation: 'JavaScript arrays are zero-indexed — the first element is at index 0.' },
            { difficulty: 2, question: 'What does `[1,2,3].push(4)` return?', options: ['[1,2,3,4]', '4', 'undefined', 'The new length: 4'], correct: 3, explanation: '`push()` adds the element and returns the new length of the array, not the array itself.' },
            { difficulty: 2, question: 'How do you remove the last element from an array?', options: ['.remove()', '.pop()', '.shift()', '.delete()'], correct: 1, explanation: '`.pop()` removes and returns the last element. `.shift()` removes the first.' }
          ]
        },
        {
          id: 'array-methods',
          title: 'Map, Filter, Reduce',
          difficulty: 3,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `The big three array methods:\n\n\`\`\`js\nconst nums = [1, 2, 3, 4, 5];\n\n// MAP: transform each element\nconst doubled = nums.map(n => n * 2);\n// [2, 4, 6, 8, 10]\n\n// FILTER: keep elements that pass a test\nconst evens = nums.filter(n => n % 2 === 0);\n// [2, 4]\n\n// REDUCE: combine all elements into one value\nconst sum = nums.reduce((acc, n) => acc + n, 0);\n// 15\n\`\`\`\n\nChain them together:\n\`\`\`js\nnums.filter(n => n > 2).map(n => n * 10);\n// [30, 40, 50]\n\`\`\``
            },
            analogy: {
              title: 'Think of it Like…',
              content: `Imagine a **factory assembly line** 🏭:\n\n🔄 **map** = A painting station. Every item goes through and comes out a different color. Same number of items in and out.\n\n🔍 **filter** = A quality check. Items that fail the test are removed. Fewer items come out.\n\n🧮 **reduce** = A compactor. All items go in, one result comes out (a sum, a combined object, etc.).`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** \`map(fn)\` — creates a new array by applying \`fn\` to every element:\n\`\`\`js\n[1,2,3].map(x => x + 10) // [11,12,13]\n\`\`\`\n\n**Step 2:** \`filter(fn)\` — creates a new array with only elements where \`fn\` returns true:\n\`\`\`js\n[1,2,3,4].filter(x => x > 2) // [3,4]\n\`\`\`\n\n**Step 3:** \`reduce(fn, init)\` — accumulates a single value:\n\`\`\`js\n[1,2,3].reduce((sum, x) => sum + x, 0) // 6\n\`\`\`\n\n**Key insight:** None of these mutate the original array — they return new arrays/values.`
            }
          },
          quiz: [
            { difficulty: 2, question: 'Which method returns a new array with each element transformed?', options: ['filter', 'reduce', 'map', 'forEach'], correct: 2, explanation: '`map` applies a function to each element and returns a new array of the results.' },
            { difficulty: 3, question: 'What does `[1,2,3].reduce((a,b) => a + b, 0)` return?', options: ['[1,2,3]', '"123"', '6', '0'], correct: 2, explanation: 'reduce accumulates: 0+1=1, 1+2=3, 3+3=6. The initial value is 0.' },
            { difficulty: 3, question: 'Do map/filter/reduce modify the original array?', options: ['Yes, always', 'Only reduce does', 'No, they return new values', 'Only if you reassign'], correct: 2, explanation: 'All three are non-mutating — they create and return new arrays or values without changing the original.' }
          ]
        }
      ]
    },
    {
      id: 'async',
      title: 'Async Programming',
      icon: '⏳',
      description: 'Handle asynchronous operations with Promises and async/await.',
      prerequisites: ['functions'],
      concepts: [
        {
          id: 'promises',
          title: 'Promises',
          difficulty: 3,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `A Promise represents a value that may not be available yet:\n\n\`\`\`js\nconst fetchData = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve({ name: "Alice", age: 25 });\n  }, 1000);\n});\n\nfetchData\n  .then(data => console.log(data.name)) // "Alice"\n  .catch(err => console.error(err));\n\`\`\`\n\nThree states: **pending** → **fulfilled** (resolved) or **rejected**.`
            },
            analogy: {
              title: 'Think of it Like…',
              content: `A Promise is like ordering at a **restaurant** 🍕:\n\n1. You place an order → **pending** (the kitchen is working)\n2. Food arrives → **fulfilled** (resolve with your meal)\n3. Kitchen is out of ingredients → **rejected** (error)\n\n\`.then()\` = what you do when food arrives (eat it)\n\`.catch()\` = what you do if the order fails (go elsewhere)\n\nYou don't wait idle — you can chat with friends while the kitchen works!`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Create a Promise with \`new Promise((resolve, reject) => { ... })\`\n\n**Step 2:** Inside, do async work. Call \`resolve(value)\` on success, \`reject(error)\` on failure.\n\n**Step 3:** Consume with \`.then()\` for success and \`.catch()\` for errors:\n\`\`\`js\nmyPromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error))\n  .finally(() => console.log("Done"));\n\`\`\`\n\n**Step 4:** Chain promises:\n\`\`\`js\nfetch(url)\n  .then(res => res.json())\n  .then(data => process(data));\n\`\`\``
            }
          },
          quiz: [
            { difficulty: 2, question: 'What are the three states of a Promise?', options: ['start, middle, end', 'pending, fulfilled, rejected', 'open, closed, error', 'new, used, done'], correct: 1, explanation: 'A Promise starts as pending, then transitions to either fulfilled (success) or rejected (failure).' },
            { difficulty: 3, question: 'What method handles a rejected Promise?', options: ['.then()', '.catch()', '.finally()', '.reject()'], correct: 1, explanation: '`.catch()` is called when a Promise is rejected or when an error is thrown inside a `.then()` handler.' },
            { difficulty: 3, question: 'What does `.finally()` do?', options: ['Runs only on success', 'Runs only on error', 'Runs regardless of outcome', 'Cancels the promise'], correct: 2, explanation: '`.finally()` executes a callback regardless of whether the promise was fulfilled or rejected — useful for cleanup.' }
          ]
        },
        {
          id: 'async-await',
          title: 'Async / Await',
          difficulty: 4,
          explanations: {
            example: {
              title: 'Learn by Example',
              content: `\`async/await\` is syntactic sugar over Promises:\n\n\`\`\`js\nasync function getUser(id) {\n  try {\n    const response = await fetch(\`/api/users/\${id}\`);\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error("Failed to fetch user:", error);\n  }\n}\n\n// Usage\nconst user = await getUser(42);\n\`\`\`\n\n\`await\` pauses execution until the Promise resolves — making async code read like synchronous code.`
            },
            analogy: {
              title: 'Think of it Like…',
              content: `If Promises are like ordering food with a buzzer 📟, then **async/await** is like having a **personal waiter** 🧑‍🍳:\n\n- You say \"await my appetizer\" → waiter brings it\n- Then \"await my main course\" → waiter brings it\n- Each step happens in order, but other tables (other code) aren't blocked\n\nThe \`async\` keyword tells JavaScript: \"This function contains waits.\" The \`await\` keyword says: \"Pause here until this is ready.\"`
            },
            stepByStep: {
              title: 'Step by Step',
              content: `**Step 1:** Mark the function with \`async\`:\n\`\`\`js\nasync function loadData() { ... }\n\`\`\`\n\n**Step 2:** Use \`await\` before any Promise:\n\`\`\`js\nconst data = await fetchSomething();\n\`\`\`\n\n**Step 3:** Handle errors with try/catch:\n\`\`\`js\ntry {\n  const data = await riskyOperation();\n} catch (err) {\n  console.error(err);\n}\n\`\`\`\n\n**Step 4:** Remember — \`await\` only works inside \`async\` functions (or at the top level of ES modules).`
            }
          },
          quiz: [
            { difficulty: 2, question: 'What does the `async` keyword do to a function?', options: ['Makes it run faster', 'Makes it return a Promise', 'Makes it synchronous', 'Nothing, it is decorative'], correct: 1, explanation: 'An `async` function always returns a Promise. If you return a value, it is wrapped in Promise.resolve().' },
            { difficulty: 3, question: 'Where can `await` be used?', options: ['Anywhere', 'Only inside async functions or ES module top-level', 'Only in loops', 'Only with fetch'], correct: 1, explanation: '`await` can only be used inside `async` functions or at the top level of ES modules.' },
            { difficulty: 3, question: 'How do you handle errors with async/await?', options: ['.catch() only', 'try/catch blocks', 'if/else blocks', 'Error callback'], correct: 1, explanation: 'With async/await, you use standard try/catch blocks for error handling, which makes the code read more naturally.' }
          ]
        }
      ]
    }
  ]
};

/** Get all concepts in flat list */
export function getAllConcepts(curriculum = CURRICULUM) {
  return curriculum.topics.flatMap(t => t.concepts.map(c => ({ ...c, topicId: t.id, topicTitle: t.title })));
}

/** Find a concept by ID */
export function findConcept(conceptId, curriculum = CURRICULUM) {
  for (const topic of curriculum.topics) {
    const concept = topic.concepts.find(c => c.id === conceptId);
    if (concept) return { ...concept, topicId: topic.id, topicTitle: topic.title };
  }
  return null;
}

/** Find a topic by ID */
export function findTopic(topicId, curriculum = CURRICULUM) {
  return curriculum.topics.find(t => t.id === topicId) || null;
}

/** Get concepts for a topic */
export function getTopicConcepts(topicId, curriculum = CURRICULUM) {
  const topic = findTopic(topicId, curriculum);
  return topic ? topic.concepts.map(c => ({ ...c, topicId: topic.id, topicTitle: topic.title })) : [];
}
