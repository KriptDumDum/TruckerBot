GPT-4 Discord Chat Bot
This repository contains a Discord chat bot that uses OpenAI's GPT-4 model to generate responses based on user input. The bot maintains separate conversation histories for each user and allows users to delete their conversation history.

Features
Utilizes OpenAI's GPT-4 model for generating responses
Maintains separate conversation histories for each user
Allows users to delete their conversation history

Prerequisites
Node.js (v16.6.0 or higher)
An OpenAI API key with access to the GPT-4 model
A Discord bot token

Installation
Clone the repository:

git clone https://github.com/yourusername/gpt4-discord-chat-bot.git
cd gpt4-discord-chat-bot

Install dependencies:

npm install
Create a .env file in the project root directory and add the following:

API_KEY=<Your_OpenAI_API_Key>
TOKEN=<Your_Discord_Bot_Token>
Replace <Your_OpenAI_API_Key> with your OpenAI API key and <Your_Discord_Bot_Token> with your Discord bot token.

Usage
Start the bot:

node index.js

Invite the bot to your Discord server.

Use the bot by sending a message starting with ? followed by your query.

Example:

? What's the weather like today?

To delete your conversation history with the bot, send a message starting with .deletehistory.
Example:

.deletehistory

License
This project is licensed under the MIT License. See the LICENSE file for details.