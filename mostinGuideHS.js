const Discord = require('discord.js');
const client = new Discord.Client();
//import des tableaux de dbObjects 
const { Horodateur } = require('./dbObjects');
const PREFIX = 'amb';

client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;
	
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
	const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

	if (command === 'balance') {
		return message.channel.send(`ambroise get 💰`);
	} else if (command === 'start') {
		//[start]
		const splitArgs = commandArgs.split(' ');
		const tagName = splitArgs.shift();
		const tagDescription = splitArgs.join(' ');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Horodateur.create({
				horodateur_id: tagName,
				matiere: tagDescription,
			});
			return message.reply(`Tag ${tag.matiere} added.`);
		}
		catch (e) {
			if (e.name === 'SequelizeUniqueConstraintError') {
				return message.reply('That tag already exists.');
			}
			return message.reply('Something went wrong with adding a tag.');
		}
		
	} else if (command === 'end') {
		//[end]
	} else if (command === 'buy') {

	} else if (command === 'shop') {

	} else if (command === 'leaderboard') {

	}
});

client.login('NTk0Njg2MzU0ODgxOTA0NjUz.XRgC7A.-Rsis3sj6wqzEqT3_j3mPpAm5Ws');