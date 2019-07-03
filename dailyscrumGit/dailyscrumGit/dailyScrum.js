const Discord = require('discord.js');
//utile pour lire et ecrire fichier en local
const fs = require("fs");
const client = new Discord.Client();
const { Daily_scrum } = require('./dbObjects');
const { Horodateur } = require('../mostinGuide/dbObjects');
const PREFIX = 'amb ';
var stat = new Object();

client.once('ready', () => {
	Horodateur.sync({ 
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
		/*
Qu’ai-je fait hier ?

Je sais stocker les données grace au bot.

Je sais recup temps de session pour chaque matiere, tot de chaque matiere et tot global.

Que vais-je faire  aujourd'hui ?

DailyScrumBot: quil pose les 3 questions

Stocke les reponses

Possibilité de recup la liste de chose a faire pour ajd (pe hier et+)

Possibilité de "cocher" ce qui est fait

Qu’est-ce qui me bloque ?

 Manque de connaissance en "collecteur discord.js" voir guide
		*/
		else if (command === 'rapport'){
			//pas ecrire ce que le bot ecrit
			if(message.author.bot) return;
			//message.reply(commandArgs);
			const rapportTab = message.content.slice(PREFIX.length+command.length).split('?');
			
			let date = new Date();
			let rapportTotal = `\n\n Le ${parseJour(date.getDay())} ${date.getDate()} ${parseMois(date.getMonth())} ${date.getFullYear()} \n`;
			for(let i = 0; i<rapportTab.length; i++){
				if (!(i == rapportTab.length-1)) rapportTotal += rapportTab[i] + '?'; 
				else rapportTotal += rapportTab[i];
			}
			fs.writeFile("./rapportLog.txt", rapportTotal,  function (err) {
																  if (err) throw err;
																	
																	console.log('rapport loggé!');
																});
			
			//let todoArray = rapportTab[2].split('\r\n');
			//console.log(todoArray[0]);
			
			let todoList = `\n\n Le ${parseJour(date.getDay())} ${date.getDate()} ${parseMois(date.getMonth())} ${date.getFullYear()} ${rapportTab[2]}`;
			//.getDate().getMonth().getFullYear()
			//for(let i = 0; i<todoArray.length; i++){
				//todoList += todoArray[i]; //+'<?>';
			//}
			longTodoList = todoList.length;
			todoList = todoList.substring(0, (longTodoList-25));
			fs.writeFile("./todoLog.txt", todoList,  function (err) {
														  if (err) throw err;
															console.log('todo list maj!');
														});
														
														
			message.reply(`rapport loggé: ${rapportTotal}\n------------------------------todo list mise à jour: ${todoList}`);
			message.channel.send('amb todolist ');
			//message.reply(`longueur: ${rapportTab.length}\n 1er elem: ${rapportTab[0]}\n 2eme elem: ${rapportTab[1]}\n 3eme elem: ${rapportTab[2]}\n 4eme elem: ${rapportTab[3]}\n`);
			
			const hierBdd = getRapportBdd(rapportTab, 1, 32);
			const ajdBdd = getRapportBdd(rapportTab, 2, 25);
			const blokeBdd = getRapportBdd(rapportTab, 3);
			console.log(ajdBdd[0]);
			//console.log(`premiere question sans le ?: ${rapportTab[0]}\n 1ere reponse et 2eme question: ${rapportTab[1]}`);
			/*
			const hier = rapportTab[1].toString();
			const longHier = hier.length;
			const hierString = hier.substring(0, (longHier-32));
			console.log(hierString);
			const hierTab = hierString.split('\n');
			console.log(hierTab);
			const hierTabFiltr = hierTab.filter(word => word.length > 1);
			hierTabFiltr.forEach( element => console.log(element));
			console.log(hierTabFiltr.length);
			*/
		}
		
		else if (command === "todolist"){
			//si on met pas utf8 on recoit un buffer brut alors qu'on veut une string
			fs.readFile("./todoLog.txt", 'utf8', function read(err, data) {
													if (err) {
														throw err;
													}
											const content = data;
				//console.log(data);
				//message.reply(content);
				const contentUtile = content.substring(2, 197).split('\n');
				const contentIndesirableDebut = contentUtile.splice(0, 2);
				contentUtile.pop();
				contentUtile.pop();
				//var contentIndesirableFin = contentUtile.splice(((contentIndesirableDebut.length)-2), 2);
				//contentIndesirableFin = contentIndesirableDebut.shift();
				console.log(contentUtile);
				let contentUtileSansFut = "";
				for(let i = 0; i<contentUtile.length; i++){
					//if(i>= contentUtile.length) break;
					contentUtileSansFut += contentUtile[i] + '\n';
				}
				
				message.channel.send(`amb pin \n ${contentUtileSansFut}`);
			});
		}
		
		else if (command === "fini"){
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
							message.channel.send('amb pin 👍 ' + contentUtile[commandArgs*2]);
							console.log(contentUtile.length);
							console.log(commandArgs*2);
							if((commandArgs*2) === (contentUtile.length-3)){
								message.reply('BRAVO ! TU AS FINI TES TACHES POUR AUJOURDHUI !!\n Tu vas recevoir un badge avec le jour où ça à été fait pour qu\'on puisse voir si t\'es endurant');
								let date = new Date();
								stat.finTodoJournalier = date.toString().substring(0, 25);
								console.log(stat);
								message.channel.send('amb build '+ stat.finTodoJournalier);
							}
			});
		}
		
		else if(command === 'pin'){
			//console.log('yaas');
			//commandInutile = message.content.slice(PREFIX.length+command.length);
			//console.log(commandInutile);
			message.pin();
		}
		
		else if (command === "xD") {
			let statLogTemp = message;
			console.log(statLogTemp);
			//le premier elem du tabLog sera tj le log logGlobal
			stat.logGlobal = statLogTemp.content.substring(7, 44);
			console.log(stat);
			message.channel.send('amb myspace');
		}
		
		
		else if (command === "myspace") {
			
//message.reply('je ne trouve rien patron...')};
			
			
			
			
			const exampleEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle('AMBROISE MOSTIN')
			//.setURL('https://discord.js.org/')
			//.setAuthor('Je suis l\'auteur de ce paradis', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
			.setDescription('Nous voici face a ton espace de satisfaction. \n Ici tu as accès à toute les stats dispo pour prendre conscience du chemin parcouru.')
			//.setThumbnail('https://i.imgur.com/wSTFkRM.png')
			.addField('Temps de connexion total: ', `${stat.logGlobal}`)
			//.addBlankField()
			.addField('moment où tu as réussis à finir tes taches quotidiennes', `${stat.finTodoJournalier}`, true)
			.addField('Temps de connexion total par session', 'Some value here', true)
			.addField('Inline field title', 'Some value here', true)
			.setImage('https://i.imgur.com/wSTFkRM.png')
			.setTimestamp()
			.setFooter('Dernière connexion: ', 'https://i.imgur.com/wSTFkRM.png');
		message.channel.send(exampleEmbed);
		console.log(stat);
		}

		
		

	}
});
//prend un tableau et enleve infos impertinente puis renvoi un tab clean avec juste les datas a envoyer a bdd
function getRapportBdd(rapportTab, index, offset = 0){
	const colonne = rapportTab[index].toString();
	const longColonne = colonne.length;
	const colonneString = colonne.substring(0, (longColonne-offset));
	console.log(colonneString);
	const colonneTab = colonneString.split('\n');
	console.log(colonneTab);
	const colonneTabFiltr = colonneTab.filter(word => word.length > 1);
	colonneTabFiltr.forEach( element => console.log(element));
	console.log(colonneTabFiltr.length);
	return colonneTabFiltr;
}

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
*/