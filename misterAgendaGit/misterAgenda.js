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
			
		
			var ligneTab = await Daily_scrum.create({
				sujet: input[0],
				date: input[1],
				lieu: input[2],
			}).then(message.channel.send(`ligne ajoutée a agenda: ${input[0]} ${input[1]} ${input[2]}`));
		
			
		}
		
		else if (command === 'montreagenda') {
			console.log('ok montreagenda');
			console.log(input);
			const agendaList = await Agenda.findAll();
			if(agendaList){
				console.log('agendalist crée');
				const idString = agendaList.map(t => t.id).join(', ') || 'No tags set.';
				const sujetString = agendaList.map(t => t.sujet).join(', ') || 'No tags set.';
				const dateString = agendaList.map(t => t.date).join(', ') || 'No tags set.';
				const lieuString = agendaList.map(t => t.lieu).join(', ') || 'No tags set.';
				const commentString = agendaList.map(t => t.comment).join(', ') || 'No tags set.';
				const createdAtString = agendaList.map(t => t.createdAt.toString().substring(4, 24)).join(', ') || 'No tags set.';
				const updatedAtString = agendaList.map(t => t.updatedAt.toString().substring(4, 24)).join(', ') || 'No tags set.';			
				
				return message.channel.send(`List of id: ${idString} \n List of sujet: ${sujetString} \n List of date: ${dateString} \n List of lieu: ${lieuString} \n  List of comment: ${commentString} \n List of creation: ${createdAtString} \n List of update: ${updatedAtString} \n `);
			}
			else return message.channel.send(`On dirait que la BDD est vide Patron!`);
		}
	}
});


client.login('NTk2MzAzNjQ1MjY0NDQ1NDQx.XR3lFQ.M0-PZMILXofJCP3vaSCrA5M1erA');