
import { Challenge, Difficulty } from './types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: '1',
    topic: 'Variables',
    difficulty: Difficulty.BEGINNER,
    description: 'What will be the output of this code?',
    code: `name = "QuickCode"\nprint(name)`,
    options: ['"QuickCode"', 'QuickCode', 'name', 'Error'],
    correctAnswer: 'QuickCode',
    explanation: 'Printing a string variable outputs its contents without quotes.'
  },
  {
    id: '2',
    topic: 'Conditions',
    difficulty: Difficulty.BEGINNER,
    description: 'Fill in the blank to check if x is greater than 10.',
    code: `x = 15\nif x ____ 10:\n    print("Large")`,
    options: ['<', '==', '>', 'is'],
    correctAnswer: '>',
    explanation: 'The > operator is used to check if the left value is strictly greater than the right value.'
  },
  {
    id: '3',
    topic: 'Lists',
    difficulty: Difficulty.BEGINNER,
    description: 'What is the index of "Python" in this list?',
    code: `languages = ["C++", "Java", "Python"]`,
    options: ['0', '1', '2', '3'],
    correctAnswer: '2',
    explanation: 'In Python, list indexing starts at 0. So "C++" is 0, "Java" is 1, and "Python" is 2.'
  },
  {
    id: '4',
    topic: 'Loops',
    difficulty: Difficulty.INTERMEDIATE,
    description: 'How many times will "Hello" be printed?',
    code: `for i in range(3):\n    print("Hello")`,
    options: ['2', '3', '4', '0'],
    correctAnswer: '3',
    explanation: 'range(3) generates numbers 0, 1, 2, which results in exactly 3 iterations.'
  },
  {
    id: '5',
    topic: 'Functions',
    difficulty: Difficulty.INTERMEDIATE,
    description: 'Complete the function definition.',
    code: `____ greet(name):\n    return "Hi " + name`,
    options: ['func', 'define', 'def', 'function'],
    correctAnswer: 'def',
    explanation: 'Python uses the keyword "def" to define a function.'
  }
];

export const XP_PER_CHALLENGE = 20;
export const XP_PER_LEVEL = 100;
