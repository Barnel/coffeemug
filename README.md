## Before starting
This project uses Node v18.
Make sure Node.js and MongoDB are installed, env file created, working properly (check ports etc...)

## Scripts
1. `npm install` installs dependencies
2. `npm start` starts the server
3. `npm test` executes the tests

## Project structure

### /src directory
1. `index.ts` entry point for the app
2. `controllers` directory - controllers for routes
3. `modules` directory - each model contains controllers, handlers and interfaces
5. `models` directory - schemas of MongoDB documents
6. `utils` directory - useful functions, constants etc...

### /test directory
Includes all test, uses jest test framework.