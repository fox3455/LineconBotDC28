// Load up the libraries
const Discord = require('discord.js');
const _ = require('lodash');
// Importing config
const config = require('./config.json')

// Create client
const client = new Discord.Client();

// Triggers when the bot is logged in and
client.on('ready', () => {
	//logs when the bot comes online
	console.info(
		'Bot has started, with' + client.users.cache.size + 'users, in ' + client.channels.cache.size + 'channels of ' + client.guilds.cache.size + ' guilds.');
	// Sets bots status to "Playing with beachballs"
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

// List of channels with currently ongoing games
let lock = [];

client.on('message', async message => {
	// Message processing


	// Discards messages from bots
	if (message.author.bot) return;

	// Discards messages that dont being with the prefix
	if (message.content.indexOf(config.prefix) !== 0) return;

	// Makes the message into an array then cuts off the beginning and puts it in the command variable
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// The main function of this bot. To play games!
	if (command === "play") {
		// Makes it so one game at a time
		if (lock.includes(message.channel.id)) return

		// Makes a message saying Who wants to play?
		message.channel.send("who wants to play a game?")
			.then(message => {
				lock.push(message.channel.id)
				// Reacts with a beach ball
				message.react("739941658639990866")
					.then(() => {
						// Collects reactions on the previous message
						const beachballfilter = (reaction, user) => {
							return reaction.emoji.id === '739941658639990866' && user.id !== '223215601638703105'
						}
						const collector = message.createReactionCollector(beachballfilter, {
							// Sets the maximums to 1 type of emoji, 25 reactions, 25 users, in 60 Seconds
							max: 25,
							maxUsers: 25,
							time: 10000
						})


						// Triggers when someone joins the react
						collector.on("end", () => {
							const players = Array.from(collector.users)

							console.log(players)
							console.log(players.length + " players")


							message.channel.send('<:BeachBall:739941658639990866> ' + (players[0].toString()).slice(19)).then(message => {
								message.react(config.emoteID).then(() => {
									const roundone = (reaction, user) => {
										return reaction.emoji.name === config.emoteID && user.id !== '223215601638703105' && user.id === (players[0].toString()).substr(0, 18)
									}
									const collector = message.createReactionCollector(roundone, {
										// Sets the maximums to 1 type of emoji, 25 reactions, 25 users, in 60 Seconds
										max: 1,
										maxUsers: 1,
										time: 5000
									})

									collector.on("collect", () => {
										function ball() {
											setTimeout(function () {
												// Generates a random number from 0 to players.length
												let num = Math.floor(Math.random() * (players.length));
												console.log(num);

												//sends a message with the beach ball emote and pings a player
												message.channel.send('<:BeachBall:739941658639990866> ' + (players[num].toString()).slice(19)).then(message => {
													// Reacts the message with hands
													message.react(config.emoteID).then(() => {
														// Keeping the lock locked
														lock = true
														// Makes a filter that allows the hand emoji and only form the player that was randomly picked
														const handfilter = (reaction, user) => {
															return reaction.emoji.name === config.emoteID && user.id !== '223215601638703105' && user.id === (players[num].toString()).substr(0, 18)
														}

														// Creates
														const collector = message.createReactionCollector(handfilter, {
															// Sets the maximums to 1 type of emoji, 25 reactions, 25 users, in 10 Seconds
															max: 1,
															maxUsers: 1,
															time: 5000
														})

														//on collection play again
														collector.on("collect", () => {
															ball()
														})

														// When the 10s ends
														collector.on("end", () => {
															if (collector.users.size === 0) {
																_.pull(lock, message.channel.id)
																return message.channel.send((players[num].toString()).slice(19) + ' got hit in the head!');
															}
														})
													})
												})
											}, Math.floor(Math.random() * (3000)))
										}

										// This is the game function being used.
										ball()
									})
									collector.on("end", () => {
										if (collector.users.size === 0) {
											_.pull(lock, message.channel.id)
											return message.channel.send('Somehow ' + (players[0].toString()).slice(19) + ' got hit.');
										}
									})
								})
							})
						})
					})
			})
	}
});

client.login(config.token).then(() => {
	console.log("logged in")
})