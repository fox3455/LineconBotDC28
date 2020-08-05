// Load up the libraries
const Discord = require('discord.js');

// Importing config
const config = require('./config.json')

// Create client
const client = new Discord.Client();

// Triggers when the bot is logged in and
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
	if (command === "play") {
		//making the filters for the collectors


		// Makes a message saying Who wants to play?
		message.channel.send("who wants to play a game?")
			.then(message => {
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

							message.channel.send(`<:BeachBall:739941658639990866> ${(players[0].toString()).slice(19)}`).then(message => {
								message.react(config.emoteID).then( () => {
									const roundone = (reaction, user) => {
										return reaction.emoji.name === config.emoteID && user.id !== '223215601638703105' //&& user === players[0]
									}
									const collector = message.createReactionCollector(roundone, {
										// Sets the maximums to 1 type of emoji, 25 reactions, 25 users, in 60 Seconds
										max: 2,
										maxUsers: 2,
										time: 10000
									})

									collector.on("collect", () => {
										function ball() {
											// Generates a random number from 0 to players.length
											let num = Math.floor(Math.random() * (players.length));
											console.log(num)

											//sends a message with the beach ball emote and pings a player
											message.channel.send(`<:BeachBall:739941658639990866> ${(players[num].toString()).slice(19)}`).then(message => {
												// Reacts the message with hands
												message.react(config.emoteID).then(() => {

													// Makes a filter that allows the hand emoji and only form the player that was randomly picked
													const handfilter = (reaction, user) => {
														return reaction.emoji.id === config.emoteID && user.id !== '223215601638703105' //&& reaction.user === players[num]
													}
													const collector = message.createReactionCollector(handfilter, {
														// Sets the maximums to 1 type of emoji, 25 reactions, 25 users, in 60 Seconds
														max: 2,
														maxUsers: 2,
														time: 10000
													})

													//on collection play again
													collector.on("collect", () => {
														ball()
													})
												})
											})
										}

										ball()
									})

									collector.on("end", () => {
										message.channel.send("Ouch!")
										console.log(Array.from(collector.users))
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