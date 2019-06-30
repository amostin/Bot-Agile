const Discord = require('discord.js');
const client = new Discord.Client();
//import des tableaux de dbObjects 
const { Horodateur } = require('./dbObjects');
const PREFIX = 'amb ';

//collection qui va contenir l'id? et la difference des getTime de update et create
const session = new Discord.Collection();

client.once('ready', () => {
	Horodateur.sync({ force: true })
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	//si le message commence avec le prefixe on execute ce qui suit et sinon on fait rien
	if (message.content.startsWith(PREFIX)) {
		//on fait une copie du contenu du message en enlevant le prefixe et on met chaque element separé par un espace dans un tableau
		const input = message.content.slice(PREFIX.length).split(' ');
		//ici on recupere que le premier element du tableau qui est la commande sans les eventuels arguments
		const command = input.shift();
		//ici on crée une chaine de charactere avec les element restant du tableau (les arguments) et on met des espace entre chaque
		const commandArgs = input.join(' ');
		//cette commande est utile a ajouter des valeur dans le tableau
		//si les caractere suivant le prefixe sont addtag alors on effectue ces actions
		if (command === 'start') {
			//[delta]
			//on remet les arguments dans un tableau 
			const splitArgs = commandArgs.split(' ');
			//on prend le premier
			const matiere = splitArgs.shift();
			//on remet les arguments en chaine de caractere
			//const autreCol = splitArgs.join(' ');

			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				//on insert tagName dans la colonne name, tagDescription dans description et le nom de l'auteur du message dans username
				const ligneTab = await Horodateur.create({
					matiere: matiere,
					//description: description,
					//username: message.author.username,

				});
				//le bot envoi un message pour dire que le tag a bien ete ajouté.
				return message.reply(`Matiere: ${matiere} added.`);
			}
			catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					return message.reply('That tag already exists.');
				}
				return message.reply('Something went wrong with adding a tag.');
			}
		}
		else if (command === 'montre') {
			// [theta]
			const matiereName = commandArgs;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const matiere = await Horodateur.findOne({ where: { matiere: matiereName } });
			if (matiere) {
				return message.channel.send(`id | matiere | createdAt | updatedAt \n --------------------------------------- \n ${matiere.id} | ${matiereName} | ${matiere.createdAt} | ${matiere.updatedAt}`);
			}
			return message.reply(`Could not find tag: ${matiereName}`);
		}
		
		else if (command === 'montretout') {
			// [lambda] !showtags { attributes: ['matiere'] }
			// equivalent to: SELECT name FROM tags;
			//on cherche toutes les lignes de la colonne name. si on met rien on recup toute les colonnes je pense
			const matiereList = await Horodateur.findAll();
			//on crée une chaine de caractere avec les noms de la colonne. On les separe par virgule espace. si ya pas de resultat, la liste retourne no tag set
			const idString = matiereList.map(t => t.id).join(', ') || 'No tags set.';
			const matiereString = matiereList.map(t => t.matiere).join(', ') || 'No tags set.';
			const createdAtString = matiereList.map(t => t.createdAt).join(', ') || 'No tags set.';
			const updatedAtString = matiereList.map(t => t.updatedAt).join(', ') || 'No tags set.';
			//on envoie la liste sur le channel
			return message.channel.send(`List of id: ${idString} \n List of matiere: ${matiereString} \n List of creation: ${createdAtString} \n List of update: ${updatedAtString} \n `);
		}
		
		else if (command === 'stop') {
			// [zeta] !edittag ancienNom nveauNom
			//amb stop nomInchangé
			//met les arguments dans un tableau
			const splitArgs = commandArgs.split(' ');
			//on prend le premier (le nom)
			const matiere = splitArgs.shift();
			//on prend ce qui reste (description)
			//const nouvMatiere = splitArgs.join(' ');
			const matiereName = commandArgs;

			// equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
			const affectedRows = await Horodateur.update({ matiere: matiere }, { where: { matiere: matiere } });
			//si le update a reussi, on repond que le tag a bien ete edité et sinon que on a pa pu trouver le ligne a modifier
			if (affectedRows > 0) {
				const matiere = await Horodateur.findOne({ where: { matiere: matiereName } });
				if (matiere) {
					const timeDiff = timeDifference(matiere.updatedAt, matiere.createdAt);
					
					//ajout de la difference de la session avec id de fin
					session.set(matiere.id, timeDiff);
					
					const formatTime = formatTimeDiff(timeDiff);
					message.channel.send(` La différences entre ${matiere.updatedAt.getTime()} \n et ${matiere.createdAt.getTime()}\n est de ${formatTime}`);
					return message.reply(`fin de la session: ${matiere}`);
				}
			}
			return message.reply(`Could not find a tag with name ${matiere}.`);
		}
		
		else if (command === 'log') {
			// amb log math
			//je dois recup une matiere et retourner update - create
			const matiereName = commandArgs;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const matiere = await Horodateur.findOne({ where: { matiere: matiereName } });
			if (matiere) {
				const timeDiff = timeDifference(matiere.updatedAt, matiere.createdAt);
				const formatTimeDiff = formatTimeDiff(timeDiff);
				return message.channel.send(` La différences entre ${matiere.updatedAt.getTime()} \n et ${matiere.createdAt.getTime()}\n est de ${formatTimeDiff}`);
			}
			return message.reply(`Could not find tag: ${matiereName}`);
		}
		else if (command === 'ajoute') {
			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				//on insert tagName dans la colonne name, tagDescription dans description et le nom de l'auteur du message dans username
				const ligneTab = await Horodateur.create({
					matiere: 'math',
					createdAt: 'Sun Jun 20 2019 23:50:00 GMT+0200 (Paris, Madrid (heure d’été))',
					updatedAt: 'Sun Jun 21 2019 00:10:00 GMT+0200 (Paris, Madrid (heure d’été))',
				});
				//le bot envoi un message pour dire que le tag a bien ete ajouté.
				return message.reply(`la session bug minuit est finie`);
			}
			catch (e) {
				return message.reply('Something went wrong with adding a tag.');
			}
		}
	}
});

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

     return timeDiff = 'difference = ' + daysDifference + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ';
};


client.login('NTk0Njg2MzU0ODgxOTA0NjUz.XRgC7A.-Rsis3sj6wqzEqT3_j3mPpAm5Ws');