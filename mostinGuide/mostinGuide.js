/**
* @author Ambroise Mostin
* @fileOverview Ce fichier contient les évenements pris en compte par l'horodateur. Il est dépendant d'une base de donnée avec laquelle on interagit via l'ORM Sequelize.
* @requires discord.js
*
*/

/**
 * @constant librairies {object}
 * @description ces constantes permettent d'acceder à toute les fonctions, variables, etc. des librairies importées
 */

const Discord = require('discord.js');
const fs = require("fs");

/**
 * @constant client {object}
 * @description cette constante permet d'acceder à toute les fonctions, variables, etc. de la classe Client de la librairie Discord
 */

const client = new Discord.Client();

/**
 * @constant Daily_scrum {object}
 * @description cette constante permet d'acceder à la base de données
 * cette constante est un objet destructuré
 */

const { Horodateur } = require('./dbObjects');

/**
 * @constant {string} PREFIX 
 * @description cette constante determine le debut de la chaine de caractere à laquelle le bot réagira
 */

const PREFIX = 'amb ';

/**
 * @event ready
 * @description cet event prouve qu'on s'est bien connecté à la bdd
 * @hint si on decommente force: true la bdd se reinitialisera
 */

client.once('ready', () => {
	
	/**
	 * @condition 
	 * @param {object} 
	 * @description synchronise l'objet avec la base de données
	 */
	
	Horodateur.sync({ 
		//force: true 
	})
	console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * @event message
 * @description cet event permet au bot de recuperer les messages et faire des actions selon
 */

client.on('message', async message => {
	
	/**
	 * @condition 
	 * @param PREFIX
	 * @param message
	 * @description test si le message commence par 'amb '
	 */
	
	if (message.content.startsWith(PREFIX)) {
		
		/**
		 * @constant {Array} input 
		 * @description cette constante contient un tableau avec tout les mots suivants 'amb '
		 * @see command (car elle modifie ceci jpense)
		 * @summary le tableau [command] [args] ...
		 */
		
		const input = message.content.slice(PREFIX.length).split(' ');
		
		/**
		 * @constant {Array} command 
		 * @description cette constante contient le premier element du tableau retiré
		 * @see input
		 */
		
		const command = input.shift();
		
		/**
		 * @constant {string} commandArgs 
		 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
		 */
		
		const commandArgs = input.join(' ');
		
		/**
		 * @condition 
		 * @param command
		 * @param tchaud
		 * @description test si le message commence par 'amb tchaud' alors le bot envoi Oooh yeah...
		 */

		if (command === 'tchaud') { //amb tchaud
			message.reply('Oooh yeah ch\'ui bouillant !!');
		}
		
		/**
		 * @condition 
		 * @param command
		 * @param agenda
		 * @description test si le message commence par 'amb agenda'
		 * @usage amb agenda <sujetRDV> <dateHeureRDVjjmmaaaahhmm> [<lieuRDV>] [<commentaire>]
		 * @todo reconnaitre le lieu par defaut meme si on met un commentaire ce qui n'est pas le cas pour le moment
		 */
		
		else if (command === 'start') {
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const splitArgs = commandArgs.split(' ');
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const matiere = splitArgs.shift();
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const idTache = await Horodateur.max('id');

			if(idTache){
				const maxIdMat = await Horodateur.findOne({ where: { id: idTache } });
				if(maxIdMat){
					if(maxIdMat.createdAt.getTime() === maxIdMat.updatedAt.getTime()){
						return message.reply('la derniere session n\'a pas été fermée.');
					}
				}
			}

			try {
				const ligneTab = await Horodateur.create({
					matiere: matiere,
				});
				return message.reply(`Matiere: ${matiere} added.`);
			}
			catch (e) {
				return message.reply('Something went wrong with adding a tag.');
			}
		}
		
		else if (command === 'stop') {
			//amb stop nomMatiere
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const matiereName = commandArgs;

			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const id = await Horodateur.max('id');
			console.log(id);//11
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const maxIdMatiere = await Horodateur.findOne({ where: { id: id } });
			if(maxIdMatiere){
				if(maxIdMatiere.createdAt.getTime() !== maxIdMatiere.updatedAt.getTime()){
					let creat = maxIdMatiere.createdAt.toString();
					creat = creat.substring(4, 24);
					let updat = maxIdMatiere.updatedAt.toString();
					updat = updat.substring(4, 24);
					return message.reply(`la derniere session a déjà été fermée. creat: ${creat} updat: ${updat}`);
				}
			}
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const affectedRows = await Horodateur.update({ matiere: matiereName }, { where: { id: id } });
			if (affectedRows > 0) {
				
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
				
				const matiere = await Horodateur.findOne({ where: { id: id } });
				if (matiere) {
					
					/**
					 * @constant {string} commandArgs 
					 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
					 */
					
					const timeDiff = timeDifference(matiere.updatedAt, matiere.createdAt);
					
					/**
					 * @constant {string} commandArgs 
					 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
					 */
					
					const formatTime = formatTimeDiff(timeDiff);
					message.channel.send(` La différences entre ${matiere.updatedAt.getTime()} \n et ${matiere.createdAt.getTime()}\n est de ${formatTime}`);
					return message.reply(`fin de la session: ${matiere.id}`);
				}
			}
			return message.reply(`Could not find a tag with name ${matiere}.`);
		}
		
		else if (command === 'montre') {
			// [theta]
			//amb montre bot
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const matiereName = commandArgs;

			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const matiere = await Horodateur.findOne({ where: { matiere: matiereName } });
			if (matiere) {
				
					/**
					 * @constant {string} commandArgs 
					 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
					 */
				
					let creat = matiere.createdAt.toString();
					creat = creat.substring(4, 24);
					let updat = matiere.updatedAt.toString();
					updat = updat.substring(4, 24);
				return message.channel.send(`id | matiere | createdAt | updatedAt \n ${matiere.id} | ${matiereName} | ${creat} | ${updat}`);
			}
			return message.reply(`Could not find tag: ${matiereName}`);
		}
		
		else if (command === 'montretout') {
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const matiereList = await Horodateur.findAll();
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const idString = matiereList.map(t => t.id).join(', ') || 'No tags set.';
			const matiereString = matiereList.map(t => t.matiere).join(', ') || 'No tags set.';
			const createdAtString = matiereList.map(t => t.createdAt.toString().substring(4, 24)).join(', ') || 'No tags set.';
			const updatedAtString = matiereList.map(t => t.updatedAt.toString().substring(4, 24)).join(', ') || 'No tags set.';			
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const idArray = matiereList.map(t => t.id);
			const matiereArray = matiereList.map(t => t.matiere);
			const createdAtArray = matiereList.map(t => t.createdAt.toString().substring(4, 24));
			const updatedAtArray = matiereList.map(t => t.updatedAt.toString().substring(4, 24));
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const attributLog = 'ID                       MATIERE                  CREATEDAT                UPDATEAT                 \n';
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			var ligneLog = "";
			
			
			
			for ( let i in idArray){
				ligneLog += format25(idArray[i]) + format25(matiereArray[i]) + format25(createdAtArray[i]) + format25(updatedAtArray[i] + '\n');
			}

			fs.writeFileSync("./debutFinSessionLog.txt", attributLog);
			
			
			
			fs.appendFile("./debutFinSessionLog.txt", ligneLog,   function (err) {
																		  if (err) throw err;
																			console.log('todo list maj!');
																		});
			return message.channel.send(`List of id: ${idString} \n List of matiere: ${matiereString} \n List of creation: ${createdAtString} \n List of update: ${updatedAtString} \n `);
		}
		else if (command === 'log') {
			// amb log = log total
			// amb log bot = log totaux que de cette matiere
			// amb log bot -s = voir les sessions pour une matiere
			if(input[1]){ //si ya le -s 
			
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
			
				const allLog = await Horodateur.findAll({
													  where: {
														matiere: input[0]
													  }
													});
													
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
													
				const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
				
				createdAtString.forEach(function(element, index) {
					message.channel.send(index + ', ' +formatTimeDiff(updatedAtString[index]-createdAtString[index]));
				});
			}
			else if (input[0]){
				
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
				
				const allLogMat = await Horodateur.findAll({
													  where: {
														matiere: input[0]
													  }
													});
													
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
													
				const createdAtString = allLogMat.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLogMat.map(t => t.updatedAt.getTime()) || 'No tags set.';
				
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
				
				var logSess = 0;
				createdAtString.forEach(function(element, index) {
					logSess += updatedAtString[index]-createdAtString[index];
					
				});
				return message.channel.send(formatTimeDiff(logSess));
			}
			
			else if (!input[0]){
				
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
				
				let logTot = 0;
				const allLog = await Horodateur.findAll();
				
				/**
				 * @constant {string} commandArgs 
				 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
				 */
				
				const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
				createdAtString.forEach(function(element, index) {
					logTot += updatedAtString[index]-createdAtString[index];
				});
				return message.channel.send(formatTimeDiff(logTot));
			}
		}
		
		
		else if (command === 'build'){
			message.reply('ok build patron');
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			let logTot = 0;
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const allLog = await Horodateur.findAll();
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
			const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
			createdAtString.forEach(function(element, index) {
				logTot += updatedAtString[index]-createdAtString[index];
			});
			
			/**
			 * @constant {string} commandArgs 
			 * @description cette constante contient les mots suivants 'amb ' dans une chaine de caractere separes par un espace
			 */
			
			var statTab = [];
			statTab.push(formatTimeDiff(logTot));
			statTab.push(commandArgs);
			return logTot ? message.channel.send('amb xD ' + statTab[0] + '\n' + statTab[1]) : message.reply('désolé patron.. pas de logTot');
		}
	}
});



function format25(elementArray){
	const longueurElement = elementArray.toString().length;
	if(longueurElement < 25){
		const nbreEspaceManquant = 25 - longueurElement;
		var element25 = elementArray;
		for(let i = 0; i < nbreEspaceManquant; i++){
			element25 += ' ';
		}
		return element25;
	}
	else{
		return elementArray;
	}
}

function timeDifference(date1,date2) {
        return date1.getTime() - date2.getTime();
}

function formatTimeDiff(difference){
	var daysDifference = Math.floor(difference/1000/60/60/24);
        difference -= daysDifference*1000*60*60*24

       var hoursDifference = Math.floor(difference/1000/60/60);
        difference -= hoursDifference*1000*60*60

        var minutesDifference = Math.floor(difference/1000/60);
        difference -= minutesDifference*1000*60

        var secondsDifference = Math.floor(difference/1000);

     return timeDiff = daysDifference + ' jour ' + hoursDifference + ' heure ' + minutesDifference + ' minute ' + secondsDifference + ' seconde ';
};


client.login('NTk0Njg2MzU0ODgxOTA0NjUz.XRgC7A.-Rsis3sj6wqzEqT3_j3mPpAm5Ws');