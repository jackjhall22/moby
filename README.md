# Moby 

Creates a list of the 100 most common three word sequences.

## Installing / Getting started

1. Clone repository
  ```shell
    git clone https://github.com/jackjhall22/moby.git
    cd moby
  ```
2. Install with [`npm`](https://www.npmjs.com/)
  ```shell
    npm install
  ```
3. Execute by navigating to the `src/main` directory
  ```shell
    cd src/main 
    cat ../test/resources/mobyDick.txt | ./index.js
  ```
or
  ```shell
  ./index.js ../test/resources/mobyDick.txt
  ```
4. Extra: you can write to the `answers.txt`
  ```shell
    cat ../test/resources/mobyDick.txt | ./index.js 1> answers.txt
  ```

## Features

* The program accepts as arguments a list of one or more file paths ( e.g `./index.js file1.txt file2.txt` )
* The program also accepts input on stdin. ( e.g `cat file1.txt | .index.js` )
* The program outputs a list of the 100 most common three word sequences.
* Handles unicode characters(eg. the ¨ in S¨sse or ß in Straße).
* Sort of process files that are over 400MB (need to run with `node --max-old-space-size=8192 <FILE NAME>.js`)


  1. Generate a big file using `scripts/createBigFile.js`
  2. Execute by pasting in terminal `npm run big`
  3. Open `answer.txt`

## Developing
 * How to run unit test with [`jest`](https://jestjs.io/docs/getting-started)
  ```shell
    npm test
  ```
  * Fixture data located in the `test/resources` directory
  * Script to create a large file `scrpts/createBigFile.js`

## Issues/Todo
  * handle error/exceptions
  * more tests / write integration test
  * improve performance processing files over 400M
  * Dockerize

## Known Bugs
  * should provide a meaningful error message if no valid file is provided

## Contributing

  TODO: Make a `CONTRIBUTING.md` 

## Licensing

"The code in this project is licensed under ISC license."
