
# Dice Roller Design Notes

## Design Documentation and Roadmap

### Frontend

> Simple React App with components for dice rolls, logging previously dice rolls, and saving dice roll templates.

* [ ] React Components
    * [x] Dice rolls
        * Enter string and submit
        * Log of requests and responses
    * [ ] Save roll template
        * Enter multiple strings and save
    * [ ] Roll template
    * [ ] Login form
* [ ] Web App using components
    * [ ] Render app status indicator
    * [ ] Don't allow requests until app is ready

### Backend

> Node.js server with Express for handling incoming requests from Discord. Will need to handle authentication and authorization. Will need to store user profiles and roll templates.

* [x] Idempotent requests and responses for dice rolls.
* [ ] Load balancer for accepting incoming requests from Discord.
* [ ] Need to save roll templates with specified names and IDs.
* [ ] Authentication and authorization for users.
* [ ] User profiles saved with associated roll templates.
* [ ] Previous rolls could be saved.

### Deploy infrastructure.

> Deploy infrastructure to Render. Will need to setup a database and load balancer. A test -> prod pipeline would be nice.

* [x] Deployed through Render.
* [x] Auto-deploy on push to main.
* [ ] GHA job to gate deployment when tests fail.

## Developer Log

> The following is a log of my progress on this project. I will be updating it as I go along. I typically only have a few hours a week to work on this so it will be slow going. This log helps me keep track of what I'm doing and what I need to do next.

### 10-18-2022

* Installed example app 
* ngrok works
* Dice Roller app info: https://discord.com/developers/applications/1031816081301581845/information
* Get a simple d20 roller going first
* Write out other tasks to do
* Will need to create a docker image to host

### 10-20-2022

* Decided to begin a simple server project
* But I got frustrated with javascript not auto-completing
* Begin converting the project over to TypeScript
* Followed the following guide: https://javascript.plainenglish.io/how-to-convert-node-js-code-from-javascript-to-typescript-8e7d031a8f49
* Currently have all of the types working, but I cannot figure out how to run node app.ts

### 10-29-2022

[x] Finish up the typescript conversion.
[x] Connect local server to test discord.
[x] Get a basic test framework running.
[x] Work on the dice logic with some basic tests.

* Installed ESlint to VSCode and project.
* Fixed issues with Typescript setup.
* Had to downgrade the node-fetch version because of "ESM" errors: https://stackoverflow.com/questions/69613588/err-require-esm-typescript-nodemon-ts-node-node-fetch
* Got all of the testing aparatus setup and the initial util file created for diceUtil.
* Start with a simple parsing test and begin building it out from there.

### 10-30-2022

* Doing a parser is going to be a little trickier than I thought. Starting with just parsing out math operations, then evaluating everything by that.
* Set to work on figuring out some basic regex problems here. Have a regex for searching and matching the d6 parts of a string really well.
* Passing this off to a dice roller might be a little more difficult.
* Need to keep track of each die that gets rolls so we can display it back at the end.
* Testing: I haven't fully figured out how to get sinon to work so that I can mock out the `diceRoll()` function. If I can get this figured out I should be able to move pretty quickly on TDD here.
* After some trial and error I got mocks to work well using mockito. Sinon was too confusing in syntax for me. Good guide here: https://medium.com/passionate-people/testing-your-typescript-code-with-ts-mockito-ac439deae33e
* While getting testing to work I refactored into DieRoll and Dice classes, which should be more testable.
    * The `randomGenerator` parameter allows for easy testing and to pass the same random number generator around between classes.

#### Design note
I want to create a parser that extracts all of the "rolls", stores each roll as an object to be accessed later, then runs through all of the math operations after rolls have been completed.

Input: Dice string with math operators
Output: Result number and dice rolls object

* Some error handling for bad strings is going to be needed soon.
* Got a basic error handling test for the new `evalSplitInput` method. Took a little trial and error but figured out the right approach using chai. https://stackoverflow.com/questions/46018381/chai-expect-to-throw-exception-not-matching-same-exception-using-typescript

### 11-5-2022

* The last couple of days I was getting confused on why my tests weren't working. After some trial and error I found that 1) The global flag on REGEX string wasn't needed and 2) I need to escape the + symbol in regex if you want to scan for it (makes sense in retrospect).
* Fleshed out some more string input tests.
* I am going to need to come back to the string input stuff, need to support "advantage", "keep high" and multiplication and division. Might be good to just do this sooner than later.
* Unsure about support for floating point numbers (e.g. 0.5), I might want to have that option.
* Ran into a mocking blocker. I cannot mock out "new" instances in the code in mockito, but I could do it in Jest. I think this is a good time to just dump mocha/chai/mockito and move over to Jest. It will probably take a couple hours of work though.
* Split out into a "DiceGroup" class so that I can handle stuff like "2d6" as its own object and later stuff like "2d6kh" for advantage rolls, or exploding dice.
* Likely will just pool all the dice result values into a string array and run `eval()`, but we'll see.

### 11-6-2022

* Ported over the basic regex tests to Jest. It all is hooked up. Need to figure out how Mocks work in Jest.
* Just dabbled in getting jest mocks to work.

### 11-14-2022

* Resuming mocking from before, I had spent some hours trying to figure it out for Typescript class structures and haven't gotten too far. Very confusing documentation for this.
* This documented answer doesn't seem to solve what I'm doing:
https://stackoverflow.com/questions/52457575/jest-typescript-property-mock-does-not-exist-on-type
* I re-read through the Jest documentation and tried the SpyOn with "mockImplementation" function and got the results I wanted. [Documentation](https://jestjs.io/docs/es6-class-mocks#mocking-a-specific-method-of-a-class). I can finally start moving forward, this is much easier.
* Each class has a good base of unit tests, can start expanding the other things we want to add to DiceString.
* Expanded supported math operations and added tests for all. Very well tested now!

### 12-24-2022

* Began doing keep high logic and defining tests.
* The mocks for these tests ideally would be able to return 2 different values from the mocked `roll`, so need to figure out how to get a generator to work.
* Nevermind, no generator needed, just use `.mockReturnValueOnce(5).mockReturnValueOnce(3)` in a chain like this.
* Tests are all ready, just build out the logic in DiceGroup.

### 12-25-2022

* Created logic for `KeepDice` which will do keep high and keep low. All tests passing.

### 12-28-2022

* Installed a CI job for running tests on GHA.
* Branch created for exploding dice, not super important right now though.
* Next up lets create a good way to get the test server up and running and get a consistent server running that is always-on or at least on something like heroku. Maybe GHA has something simple to run.

### 03-13-2023

* Working more on the string function
* I need to track dice that were dropped, they need to be kept as an object.
* Use the dropped property on DieRoll. 
* Maybe before getting into dropped die, work on just getting the strings returned properly.
* Strings should be ready to be returned.

### 03-15-2023

* Adjusted the strings on the ouput of groups

### 04-01-2023

* The app itself with the discord bot is running well so I'd like to expand the scope some more.
* Going to design some of the infrastructure and deployment and figure out how to expand it going forward.
* Outlined at the top what I would like to see out of the final project.
* Should be done mostly in Terraform and AWS since I'm most familiar there.

* For database management, look into Sequelize for node

### 06-04-2023

* Forgotten to save some recent entries, but I've mostly worked on getting the Render deployment working for the Discord bot, frontend react, and backend node.
* Updated design notes at the top.
* The Render site is free tier, so I should create a status indicator for when the site is ready to accept requests.
* A "wake-up call" endpoint would be good for this.