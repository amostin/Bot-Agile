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
				message.pin();
				console.log('pinné');
			});
		}
		
		else if (command === "fini"){
			// Get pinned messages
			message.channel.fetchPinnedMessages()
			  .then(
				messages => {
					//1 pinné message.reply(`Received ${messages.size} messages`);
					//object message.reply(`${typeof(messages)}`);
					console.log('ok1');
					for (let key of messages) {
						console.log('ok2');
						  //if (messages.hasOwnProperty(key)) {
							  console.log('ok3');
								console.log(messages[key]);
						  //}
					}
					//message.reply(`${messages[key]}`);
				}
			  )
			  .catch(console.error);
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
			fs.open('./test.txt', 'w', function (err, fd) {
										if (err) throw err;
										console.log('test.txt ouvert!');
					
										let modif = 'Possibilité de "cocher" ce qui est fait  👍👍👍👍👍';
										fs.write(fd, modif, function (err, written, string) {
																							if (err) {
																								throw err;
																							}
													
										});
										fs.close(fd, (err) => {
														if (err) throw err;
														console.log('test.txt fermé');
													});
			});			


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

/*
			//putain les flags je les ai cherché et jaurais du insister direct car cest pour ca que ça ecrivait a la fin tj 
			fs.open('./doneLog.txt', 'w+', function (err, fd) {
										if (err) throw err;
										console.log('doneLog.txt ouvert!');

					fs.readFile("./todoLog.txt", 'utf8', function read(err, data) {
														if (err) {
															throw err;
														}

							//on stocke le buffer de maniere durable
							//wtf une fois ça marche avec data, une fois const, ...
							const content = data;
							//console.log(data);
							//message.reply(content);
							const contentUtile = content.substring(2, 197).split('\n');
							//message.reply(contentUtile);
							console.log('todoLog.txt lu!');
							//message.reply(contentUtile[commandArgs] + ' 👍👍👍👍👍');
							
							//let longueurInutile = contentUtile.toString().length;
							console.log(contentUtile);
							fs.write(fd, contentUtile[commandArgs] + ' 👍👍👍👍👍', function (err, written, string) {
																			if (err) {
																				throw err;
																			}
												return message.reply(contentUtile[commandArgs] + ' 👍👍👍👍👍');
									});
									fs.close(fd, (err) => {
													if (err) throw err;
													console.log('todoLog.txt fermé');
												});
					});		
			});
*/