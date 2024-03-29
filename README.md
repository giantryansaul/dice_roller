# Dice Roller

![test-deploy workflow](https://github.com/giantryansaul/dice_roller/actions/workflows/test-deploy.yml/badge.svg)

A Discord bot and React app for rolling dice.

## Example Apps on Render

> [Render](https://render.com) is a free deployment app used to host this project.

* [React App](https://dice-roller-client.onrender.com/)

## Development Notes
[Development Notes](./notes.md) updated as I work on this project.

## Setup

### React App

1. `npm install` from the `client` directory.
2. `npm run start` to start the development server.

### Rest API Server

1. `npm install` from the `server` directory.
2. `npm run start:rest` to start the development server.

### Discord

1. Create a Discord application.
2. Create a bot for the application.
3. Add the bot to your server.
4. Copy the bot token and add it to the `.env` file.
5. For local testing, use ngrok to expose the local server to the internet.
    * Add the ngrok URL to the Discord application's redirect URL.
6. Run the bot with `npm run start:discord`.
