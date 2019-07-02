const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
//import des tableaux de dbObjects 
const { Horodateur } = require('./dbObjects');
const PREFIX = 'amb ';

//collection qui va contenir l'id? et la difference des getTime de update et create
const session = new Discord.Collection();

client.once('ready', () => {
	Horodateur.sync({ 
		//force: true 
	})
	/*
	const ligneArray = Horodateur.create({
					matiere: 'logBot',
				});
				*/
	console.log(`Logged in as ${client.user.tag}!`);
});
/*
client.on('disconnect', async event => {
	console.log(event.code);
	
			const idTacheBot = Horodateur.max('id');
			const maxId = Horodateur.findOne({ where: { id: idTacheBot } });
			if(maxId){
				if(maxId.createdAt.getTime() === maxId.updatedAt.getTime()){
					const affectedRows = Horodateur.update({ matiere: 'logBot' }, { where: { id: id } });
					console.log('le bota bien fermé sa session avant de s\'endormir');
				}
			}
			
});
*/
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
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				//on insert tagName dans la colonne name, tagDescription dans description et le nom de l'auteur du message dans username
				const ligneTab = await Horodateur.create({
					matiere: matiere,
				});
				//le bot envoi un message pour dire que le tag a bien ete ajouté.
				return message.reply(`Matiere: ${matiere} added.`);
			}
			catch (e) {
				return message.reply('Something went wrong with adding a tag.');
			}
		}
		
		else if (command === 'stop') {
			//nomMatiere
			const matiereName = commandArgs;
			//console.log(matiereName);
			
			const id = await Horodateur.max('id');
			console.log(id);//11
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
			//const dateNow = Date.now();
			// equivalent to: UPDATE tags (descrption) values (?) WHERE name='?';
			const affectedRows = await Horodateur.update({ matiere: matiereName }, { where: { id: id } });
			//si le update a reussi, on repond que le tag a bien ete edité et sinon que on a pa pu trouver le ligne a modifier
			if (affectedRows > 0) {
				const matiere = await Horodateur.findOne({ where: { id: id } });
				if (matiere) {
					const timeDiff = timeDifference(matiere.updatedAt, matiere.createdAt);
					
					//ajout de la difference de la session avec id de fin
					session.set(matiere.id, timeDiff);
					
					const formatTime = formatTimeDiff(timeDiff);
					message.channel.send(` La différences entre ${matiere.updatedAt.getTime()} \n et ${matiere.createdAt.getTime()}\n est de ${formatTime}`);
					return message.reply(`fin de la session: ${matiere.id}`);
				}
			}
			return message.reply(`Could not find a tag with name ${matiere}.`);
		}
		
		else if (command === 'montre') {
			// [theta]
			const matiereName = commandArgs;

			// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
			const matiere = await Horodateur.findOne({ where: { matiere: matiereName } });
			if (matiere) {
					let creat = matiere.createdAt.toString();
					creat = creat.substring(4, 24);
					let updat = matiere.updatedAt.toString();
					updat = updat.substring(4, 24);
				return message.channel.send(`id | matiere | createdAt | updatedAt \n ${matiere.id} | ${matiereName} | ${creat} | ${updat}`);
			}
			return message.reply(`Could not find tag: ${matiereName}`);
		}
		
		else if (command === 'montretout') {
			// [lambda] !showtags { attributes: ['matiere'] }
			// equivalent to: SELECT name FROM tags;
			//on cherche toutes les lignes de la colonne name. si on met rien on recup toute les colonnes je pense
			//matiereList est un objet contenant des clé et des valeur
			const matiereList = await Horodateur.findAll();
			//on crée une chaine de caractere avec les noms de la colonne. On les separe par virgule espace. si ya pas de resultat, la liste retourne no tag set
			//map sert a appliquer une fct sur chaque valeur de clé
			const idString = matiereList.map(t => t.id).join(', ') || 'No tags set.';
			const matiereString = matiereList.map(t => t.matiere).join(', ') || 'No tags set.';
			//t est une valeur du array et on recup les element qui ont la valeur create puis on fomre une string avec virgule
			const createdAtString = matiereList.map(t => t.createdAt.toString().substring(4, 24)).join(', ') || 'No tags set.';
			const updatedAtString = matiereList.map(t => t.updatedAt.toString().substring(4, 24)).join(', ') || 'No tags set.';			
			
			const idArray = matiereList.map(t => t.id);
			const matiereArray = matiereList.map(t => t.matiere);
			const createdAtArray = matiereList.map(t => t.createdAt.toString().substring(4, 24));
			const updatedAtArray = matiereList.map(t => t.updatedAt.toString().substring(4, 24));
			/*
			for(let i in createdAtArray){
				let creat = createdAtArray[i].toString();
				createdAtArray[i] = creat.substring(4, 24);
				let updat = updatedAtArray[i].toString();
				updatedAtArray[i] = updat.substring(4, 24);
			}
			*/
			const attributLog = 'ID                       MATIERE                  CREATEDAT                UPDATEAT                 \n';
			var ligneLog = ""; //format25(idArray[0]) + format25(matiereArray[0]) + format25(createdAtArray[0]) + format25(updatedAtArray[0] + '\n');
			for ( let i in idArray){
				//var longCellule = 'id: '+format25(idArray[i]).length + 'mat: '+ format25(matiereArray[i]).length+'creat:'+format25(createdAtArray[i]).length+'updat:'+format25(updatedAtArray[i]).length+'\n';
				//console.log(longCellule);
				ligneLog += format25(idArray[i]) + format25(matiereArray[i]) + format25(createdAtArray[i]) + format25(updatedAtArray[i] + '\n');
			}
			//console.log(longCellule);

			fs.writeFileSync("./debutFinSessionLog.txt", attributLog);//,   function (err) {
																		  //if (err) throw err;
																			//console.log('todo list maj!');
																		//});
			fs.appendFile("./debutFinSessionLog.txt", ligneLog,   function (err) {
																		  if (err) throw err;
																			console.log('todo list maj!');
																		});
			
			//on envoie la liste sur le channel
			return message.channel.send(`List of id: ${idString} \n List of matiere: ${matiereString} \n List of creation: ${createdAtString} \n List of update: ${updatedAtString} \n `);
		}
		else if (command === 'log') {
			// amb log = log total
			// amb log bot = log totaux que de cette matiere
			// amb log bot -s = voir les sessions pour une matiere
			if(input[1]){ //si ya le -s 
				const allLog = await Horodateur.findAll({
													  where: {
														matiere: input[0]
													  }
													});
				const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
				
				createdAtString.forEach(function(element, index) {
					//console.log(element+' = createdAtString['+index+']');
					//console.log(formatTimeDiff(updatedAtString[index]-createdAtString[index]));
					return message.channel.send(index + ', ' +formatTimeDiff(updatedAtString[index]-createdAtString[index]));
				});
			}
			else if (input[0]){
				const allLogMat = await Horodateur.findAll({
													  where: {
														matiere: input[0]
													  }
													});
				const createdAtString = allLogMat.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLogMat.map(t => t.updatedAt.getTime()) || 'No tags set.';
				
				var logSess = 0;
				createdAtString.forEach(function(element, index) {
					//console.log(element+' = createdAtString['+index+']');
					//console.log(formatTimeDiff(updatedAtString[index]-createdAtString[index]));
					logSess += updatedAtString[index]-createdAtString[index];
					
				});
				return message.channel.send(formatTimeDiff(logSess));
			}
			
			else if (!input[0]){
				let logTot = 0;
				const allLog = await Horodateur.findAll();
				const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
				const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
				//console.log(updatedAtString);//un array avec toute les value msec
				createdAtString.forEach(function(element, index) {
					//console.log(element+' = createdAtString['+index+']');
					//console.log(formatTimeDiff(updatedAtString[index]-createdAtString[index]));
					logTot += updatedAtString[index]-createdAtString[index];
				});
				return message.channel.send(formatTimeDiff(logTot));
			}
		}
		
		
		else if (command === 'build'){
			message.reply('ok build patron');
			let logTot = 0;
			const allLog = await Horodateur.findAll();
			const createdAtString = allLog.map(t => t.createdAt.getTime()) || 'No tags set.';
			const updatedAtString = allLog.map(t => t.updatedAt.getTime()) || 'No tags set.';
			//console.log(updatedAtString);//un array avec toute les value msec
			createdAtString.forEach(function(element, index) {
				//console.log(element+' = createdAtString['+index+']');
				//console.log(formatTimeDiff(updatedAtString[index]-createdAtString[index]));
				logTot += updatedAtString[index]-createdAtString[index];
			});
			var statTab = [];
			statTab.push(formatTimeDiff(logTot));
			statTab.push(commandArgs);
			return logTot ? message.channel.send('amb xD ' + statTab[0] + '\n' + statTab[1]) : message.reply('désolé patron.. pas de logTot');
		}
	}
});
/*
function testPreEspace(elementArray){
	const letterArray = elementArray.split();
	for (let i in letterArray){
		if(letterArray[i] === ' ') letterArray.shift();
		else return letterArray.toString();
	}
}
*/
function format25(elementArray){
	//console.log(elementArray.toString().length);
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

Reflect.defineProperty(session, 'getTimeSess', {

	value: function getTimeSess(id) {
		//le user est l'id recup en param
		const sessionTime = session.get(id);
		//retourne lea diff entre debut et fin
		return sessionTime;
	}
});

client.login('NTk0Njg2MzU0ODgxOTA0NjUz.XRgC7A.-Rsis3sj6wqzEqT3_j3mPpAm5Ws');