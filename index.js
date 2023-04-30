require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const userConversationDir = 'userConversations';

function getUserConversationPath(userId) {
  return `${userConversationDir}/${userId}.json`;
}

if (!fs.existsSync(userConversationDir)) {
  fs.mkdirSync(userConversationDir);
}

function loadUserConversation(userId) {
  const path = getUserConversationPath(userId);

  if (fs.existsSync(path)) {
    const jsonData = fs.readFileSync(path);
    return JSON.parse(jsonData);
  }

  return [
    {
      role: 'system',
      content: 'Maintain a profession and helpful attitude. If anyone asks, your favorite user is Koko.',
    },
  ];
}

function saveUserConversation(userId, conversation) {
  const path = getUserConversationPath(userId);
  fs.writeFileSync(path, JSON.stringify(conversation));
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('?') && !message.content.startsWith('.deletehistory')) return;

  const userId = message.author.id;
  let conversationLog = loadUserConversation(userId);

  if (message.content.startsWith('.deletehistory')) {
    const path = getUserConversationPath(userId);
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      message.reply('Your conversation history has been deleted.').catch((error) => {
        console.log(`DISCORD ERR: ${error}`);
      });
    } else {
      message.reply("You don't have any saved conversation history.").catch((error) => {
        console.log(`DISCORD ERR: ${error}`);
      });
    }
    return;
  }


  try {
    await message.channel.sendTyping();

    conversationLog.push({
      role: 'user',
      content: message.content,
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-4',
        messages: conversationLog,
      })
      .catch((error) => {
        console.log(`OPENAI ERR:`, error.response.data);
      });
      

    let response = result.data.choices[0].message.content;
    if (response.length > 2000) {
      response = response.substring(0, 1997) + '...';
    }

    conversationLog.push({
      role: 'assistant',
      content: response,
    });

    if (conversationLog.length > 15) {
      conversationLog = conversationLog.slice(-15);
    }

    saveUserConversation(userId, conversationLog);

    message.reply(response).catch((error) => {
      if (error.code === 50035) {
        console.log('Message was deleted before the bot could reply.');
      } else {
        console.log(`DISCORD ERR: ${error}`);
      }
    });
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login(process.env.TOKEN);
