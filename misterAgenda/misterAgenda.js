/**
* @author Ambroise Mostin
* @fileOverview Ce fichier contient les évenements pris en compte par l'agenda. Il est dépendant d'une base de donnée avec laquelle on interagit via l'ORM Sequelize.
* @requires discord.js
*
*/

/**
 * l'objet client execute des actions particulières pour l'event ready et message
 * en particulier message car il repond au differentes commandes
 */

/**
 * @constant librairies {object}
 * @description ces constantes permettent d'acceder à toute les fonctions, variables, etc. des librairies importées
 */
 
const Sequelize = require('sequelize');
const Discord = require('discord.js');
const fs = require("fs");

/**
 * @constant client {object}
 * @description cette constante permet d'acceder à toute les fonctions, variables, etc. de la classe Client de la librairie Discord
 */

const client = new Discord.Client();

/**
 * @constant Agenda {object}
 * @description cette constante permet d'acceder à la base de données
 * cette constante est un objet destructuré
 */

const { Agenda } = require('./dbObjects');

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
	
	Agenda.sync({ 
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
		
		else if (command === 'agenda'){
			
			/**
			 * @constant {string} commentaire 
			 * @description cette constante contient une chaine de caractere correspondant au commentaire
			 */
			
			const commentaire = input.slice(3).join(' ');
			
			/**
			 * @constant {objet} ligneTab 
			 * @description cette constante contient une collection dont les propriete valeur seront stockée dans la bdd
			 * @summary insert into table agenda values sujet, date, lieu, commentaire et après confirme par un message sur le channel
			 */
			
			const ligneTab = await Agenda.create({
				sujet: input[0],
				date: input[1],
				lieu: input[2],
				comment: commentaire,
			}).then(message.channel.send(`ligne ajoutée a agenda: ${input[0]} ${input[1]} ${input[2]}`));
		}
		
		/**
		 * @condition 
		 * @param command
		 * @param comment
		 * @description test si le message commence par 'amb comment'
		 * @usage amb comment <idRdv> <comentaire>
		 */
		
		else if (command === 'comment') {
			
			/**
			 * @constant {int} ligneTabModif 
			 * @description cette constante contient le nombre de ligne modifiée
			 * @summary set value where x = x
			 */
			
			const ligneTabModif = await Agenda.update({ comment: commandArgs }, { where: { id: input[0] } })
			.then(message.channel.send(`ligne ${input[0]} commentée:  ${commandArgs}`))
			.catch(console.error);
		}
		
		/**
		 * @condition 
		 * @param command
		 * @param montreagenda
		 * @description test si le message commence par 'amb montreagenda'
		 */
		
		else if (command === 'montreagenda') {
			console.log('ok montreagenda');
			console.log(input);
			
			/**
			 * @constant {objet} agendaList 
			 * @description cette constante contient une collection avec toutes les valeurs associée aux colonnesString
			 * @summary agendaList{colonne:valeur} (jpense)
			 */
			
			const agendaList = await Agenda.findAll();
			
			/**
			 * @condition 
			 * @param agendaList
			 * @description test si il y a quelque chose dans la bdd
			 */
			
			if(agendaList){
				console.log('agendalist crée');
				
				/**
				 * @constant {string} colonnesString 
				 * @description ces constantes contiennent chacune une chaine de toutes les valeurs de la colonne separées par des virgules
				 */
				
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