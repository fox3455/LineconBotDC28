// Load up the libraries
const Discord = require('discord.js');

// Importing config
const config = require('./config.json')

//User array and random number
let players = [];
let value = players[Math.floor(Math.random() * players.length)];

// Create client
const client = new Discord.Client();


client.on('ready', () => {
	//logs when the bot comes online
	console.info(
		`Bot has started, with ${client.users.cache.size} users, in \
      ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	// Sits bots status to "Playing with beachballs"
	client.user.setPresence({
		activity: {
			name: `with beachballs`,
			type: 'PLAYING',
		},
		status: 'idle',
	}).then(() => {
		console.log("Status set!")
	});

})


client.on('message', async message => {
	// Message processing

	// Only can be used in #linecon
	// let okchannel = client.channels.cache.get("710574818222931968")
	// if (!(message.channel === okchannel)) return;

	// Discards messages from bots
	if (message.author.bot) return;

	// Discards messages that dont being with the prefix
	if (message.content.indexOf(config.prefix) !== 0) return;

	// Makes the message into an array then cuts off the beginning and puts it in the command variable
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// The main function of this bot. To play games!
	if (command === 'play') {

		// Filter for filtering out only the beach ball emote
		const filter = (reaction) => {
			return reaction.emoji.id === config.emoteID && !(message.author.bot);
		};

		const emote = client.emojis.cache.get(config.emoteID)

		message.channel.send("Who wants to play with the beach ball?")
			.then(message => {
				// Reacts to its own message
				message.react(config.emoteID)
					.catch((err) => {
						console.error('Something went wrong', err)
					})

				message.awaitReactions(filter, {max: 25, time: 300000, errors: ['time']})
					.then(collected => {
						const reaction = collected.first();
						if (reaction.emoji === emote) {
							players = reaction.users;
						}
					})
			})
			.catch((err) => {
				console.error("Something went wrong!", err)
				return message.channel.send("Something went wrong...")
			})

		// message.reply should start the game and call the first user.
		// After that it is based on the random user generator from our array

		setTimeout(() => {
			message.reply("Let's start!").then(message => {
				// Initiating ball function
				function ball() {
					// In theory sends a message
					message.channel.send(`${emote} ${value}`)
						.then(() => {
							message.react('config.emoteID')
						})

						.catch((err) => {
							console.error("something went wrong!", err)
							return message.channel.send("Something went wrong... I couldn't react.")
						})
				}

				message.react(config.emoteID)
					.then(() => {
						const collector = message.createReactionCollector(filter, {
							max: 2,
							time: 30000,
							errors: ['time']
						})

						collector.on("collect", () => {
							ball();
						})
					})


				// const collector = message.createReactionCollector(filter, {max: 1, time: 30000, errors: ['time']})
				//
				// collector.on("collect", () => {
				// 	ball();
				// })
				// 		message.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
				// 			.then(collected => {
				// 				const reaction = collected.first();
				// 				//VERY rough while statement should maybe work...? Need to update the bot and see
				// 				//what happens when it runs since I don't write in JS
				// 				while (true) {
				// 					if (reaction.emoji === client.emojis.cache.get(config.emoteID)) {
				// 							message.reply("Let's start!")
				// 							.then(() => {
				// 								message.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
				// 							}).catch(err => {
				// 							console.error("Something went wrong awaiting reactions", err)
				// 						})
				// 					}
				// 					else {
				// 						return message.channel.send("Ouch!")
				// 					}
				// 				}
			})
			// 	})
		}, 10000)

	}
});

client.login(config.token).then(() => {
	console.log("Bot is logged in!")
});
