const Discord = require('discord.js');
//utile pour lire et ecrire fichier en local
const fs = require("fs");
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
			//pas ecrire ce que le bot ecrit
			if(message.author.bot) return;
			//message.reply(commandArgs);
			const rapportTab = message.content.slice(PREFIX.length+command.length).split('?');
			
			let date = new Date();
			let rapportTotal = `\n\n Le ${parseJour(date.getDay())} ${date.getDate()} ${parseMois(date.getMonth())} ${date.getFullYear()} \n`;
			for(let i = 0; i<rapportTab.length; i++){
				rapportTotal += rapportTab[i] + '?'; // +'<FIN PARTIE DU RAPPORT>';
			}
			fs.appendFile("./rapportLog.txt", rapportTotal,  function (err) {
																  if (err) throw err;
																	
																	console.log('rapport loggé!');
																});
			
			let todoArray = rapportTab[2].split('\r\n');
			let todoList = `\n\n Le ${parseJour(date.getDay())} ${date.getDate()} ${parseMois(date.getMonth())} ${date.getFullYear()}`;
			//.getDate().getMonth().getFullYear()
			for(let i = 0; i<todoArray.length; i++){
				todoList += todoArray[i]; //+'<?>';
			}
			todoList = todoList.substring();
			fs.appendFile("./todoLog.txt", todoList,  function (err) {
														  if (err) throw err;
															console.log('todo list maj!');
														});
														
														
			message.reply(`rapport loggé: ${rapportTotal}\n------------------------------todo list mise à jour: ${todoList}`);
			//message.reply(`longueur: ${rapportTab.length}\n 1er elem: ${rapportTab[0]}\n 2eme elem: ${rapportTab[1]}\n 3eme elem: ${rapportTab[2]}\n 4eme elem: ${rapportTab[3]}\n`);
		}
		
		else if (command === "todolist"){
			//si on met pas utf8 on recoit un buffer brut alors qu'on veut une string
			fs.readFile("./todoLog.txt", 'utf8', function read(err, data) {
													if (err) {
														throw err;
													}
				message.reply(data.substring(2, 197));
			});
		}
		
		else if (command === "fini"){
			fs.readFile("./todoLog.txt", 'utf8', function read(err, data) {
												if (err) {
													throw err;
												}
			data = data.substring(2, 197).split('\n');
			//let dataArray = data.split(' ');
			//let dataChecked = dataArray.map(() => );
			return message.reply(data[1] + ' 👍👍👍👍👍');
			});
		}
		
		
		else if(command === "ping"){ // Check if message is "!ping"
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
			.then((msg) => { // Resolve promise
				msg.edit("Ping: " + formatTimeDiff(msg.createdTimestamp - Date.now())) // Edits message with current timestamp minus timestamp of message
			});
		}
		else if (command === 'ouestu') {
			let names = client.guilds.map((u) => { return u.name });// ["Some name", "Other one"];
			let string = "";
			for(let i = 0; i<names.length; i++){
				string += names[i] +'\n';
			}
			fs.writeFileSync("./test.txt", 'ok regarde: '+string);
			message.reply(string);
		}
	}
});

function parseJour(indexDuJour){
		switch (indexDuJour){
			case 1:
		return 'Lundi';
			case 2:
		return 'Mardi';
			case 3:
		return 'Mercredi';
			case 4:
		return 'Jeudi';
			case 5:
		return 'Vendredi';
			case 6:
		return 'Samedi';
			case 7:
		return 'Dimanche';
	}
}

function parseMois(indexDuMois){
		switch (indexDuMois){
			case 0:
		return 'Janvier';
			case 1:
		return 'Février';
			case 2:
		return 'Mars';
			case 3:
		return 'Avril';
			case 4:
		return 'Mai';
			case 5:
		return 'Juin';
			case 6:
		return 'Juillet';
			case 7:
		return 'Aout';
			case 8:
		return 'Septembre';
			case 9:
		return 'Octobre';
			case 10:
		return 'Novembre';
			case 11:
		return 'Décembre';
	}
}

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