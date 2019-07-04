const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();

const { Agenda } = require('./dbObjects');
const PREFIX = 'amb ';

client.once('ready', () => {
	Agenda.sync({ 
		force: true 
	})
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');
		if (command === 'tchaud') { //amb tchaud
			message.reply('Oooh yeah ch\'ui bouillant !!');
		}
		
		else if (command === 'agenda'){
			//amb agenda <inscription 2d sess> <110820192359> <eperso>
			
		}
	}
});


client.login('NTk2MzAzNjQ1MjY0NDQ1NDQx.XR3lFQ.M0-PZMILXofJCP3vaSCrA5M1erA');