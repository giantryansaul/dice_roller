## 10-18-2022

* Installed example app 
* ngrok works
* Dice Roller app info: https://discord.com/developers/applications/1031816081301581845/information
* Get a simple d20 roller going first
* Write out other tasks to do
* Will need to create a docker image to host

## 10-20-2022

* Decided to begin a simple server project
* But I got frustrated with javascript not auto-completing
* Begin converting the project over to TypeScript
* Followed the following guide: https://javascript.plainenglish.io/how-to-convert-node-js-code-from-javascript-to-typescript-8e7d031a8f49
* Currently have all of the types working, but I cannot figure out how to run node app.ts

## 10-29-2022

[x] Finish up the typescript conversion.
[x] Connect local server to test discord.
[x] Get a basic test framework running.
[x] Work on the dice logic with some basic tests.

* Installed ESlint to VSCode and project.
* Fixed issues with Typescript setup.
* Had to downgrade the node-fetch version because of "ESM" errors: https://stackoverflow.com/questions/69613588/err-require-esm-typescript-nodemon-ts-node-node-fetch
* Got all of the testing aparatus setup and the initial util file created for diceUtil.
* Start with a simple parsing test and begin building it out from there.

## 10-30-2022

* Doing a parser is going to be a little trickier than I thought. Starting with just parsing out math operations, then evaluating everything by that.
* Set to work on figuring out some basic regex problems here. Have a regex for searching and matching the d6 parts of a string really well.
* Passing this off to a dice roller might be a little more difficult.
* Need to keep track of each die that gets rolls so we can display it back at the end.
* Testing: I haven't fully figured out how to get sinon to work so that I can mock out the `diceRoll()` function. If I can get this figured out I should be able to move pretty quickly on TDD here.
* After some trial and error I got mocks to work well using mockito. Sinon was too confusing in syntax for me. Good guide here: https://medium.com/passionate-people/testing-your-typescript-code-with-ts-mockito-ac439deae33e
* While getting testing to work I refactored into DieRoll and Dice classes, which should be more testable.
    * The `randomGenerator` parameter allows for easy testing and to pass the same random number generator around between classes.

### Design note
I want to create a parser that extracts all of the "rolls", stores each roll as an object to be accessed later, then runs through all of the math operations after rolls have been completed.

Input: Dice string with math operators
Output: Result number and dice rolls object

* Some error handling for bad strings is going to be needed soon.
* Got a basic error handling test for the new `evalSplitInput` method. Took a little trial and error but figured out the right approach using chai. https://stackoverflow.com/questions/46018381/chai-expect-to-throw-exception-not-matching-same-exception-using-typescript

## 11-5-2022

* The last couple of days I was getting confused on why my tests weren't working. After some trial and error I found that 1) The global flag on REGEX string wasn't needed and 2) I need to escape the + symbol in regex if you want to scan for it (makes sense in retrospect).
* Fleshed out some more string input tests.
* I am going to need to come back to the string input stuff, need to support "advantage", "keep high" and multiplication and division. Might be good to just do this sooner than later.
* Unsure about support for floating point numbers (e.g. 0.5), I might want to have that option.
* Ran into a mocking blocker. I cannot mock out "new" instances in the code in mockito, but I could do it in Jest. I think this is a good time to just dump mocha/chai/mockito and move over to Jest. It will probably take a couple hours of work though.
* Split out into a "DiceGroup" class so that I can handle stuff like "2d6" as its own object and later stuff like "2d6kh" for advantage rolls, or exploding dice.
* Likely will just pool all the dice result values into a string array and run `eval()`, but we'll see.

## 11-6-2022

* Ported over the basic regex tests to Jest. It all is hooked up. Need to figure out how Mocks work in Jest.
* Just dabbled in getting jest mocks to work.