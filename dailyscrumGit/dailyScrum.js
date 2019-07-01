const Discord = require('discord.js');
const client = new Discord.Client();
const { Daily_scrum } = require('./dbObjects');
const PREFIX = 'amb ';

client.once('ready', () => {
	Daily_scrum.sync({ 
		//force: true 
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
		
		else if (command === 'rapport'){
			//message.reply(commandArgs);
			const rapportTab = message.content.slice(PREFIX.length).split('?');
			message.reply(`longueur: ${rapportTab.length}\n 1er elem: ${rapportTab[0]}\n 2eme elem: ${rapportTab[1]}\n 3eme elem: ${rapportTab[2]}\n 4eme elem: ${rapportTab[3]}\n`);
		}
		
		
		else if(command === "ping"){ // Check if message is "!ping"
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
			.then((msg) => { // Resolve promise
				msg.edit("Ping: " + formatTimeDiff(msg.createdTimestamp - Date.now())) // Edits message with current timestamp minus timestamp of message
			});
		}
	}
});

function formatTimeDiff(difference){
	var daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24

       var hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60

        var minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60

        var secondsDifference = Math.floor(difference/1000);

     return timeDiff = daysDifference + ' jour ' + hoursDifference + ' heure ' + minutesDifference + ' minute ' + secondsDifference + ' seconde ' + difference + 'msec';
};

client.login('NTk0OTk5MDgxMDA5NDE0MTUw.XRkmHg.aa8u5sd1QhBP693Ln5r-Lf_t9ck');