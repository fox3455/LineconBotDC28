// Load up the libraries
const Discord = require('discord.js');

// Importing config
const config = require('./config.json')

//User array and random number
let players = [];
let value = players[Math.floor(Math.random() * players.length)];

// Create client
const client = new Discord.Client();

// Filter for filtering out only the beach ball emote
const filter = (reaction) => {
	return reaction.emoji.id === config.emoteID;
};

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

		const emote = client.emojis.cache.get(config.emoteID)

		message.channel.send("Who wants to play with the beach ball?")
			.then(message => {
				// Reacts to its own message
				message.react(config.emoteID)
					.catch((err) => {
						console.error('Something went wrong', err)
					})

				message.awaitReactions(filter, {max: 25, time: 60000, errors: ['time']})
					.then(collected => {
						const reaction = collected.first();
						if (reaction.emoji === emote) {
							players = reaction.users;
						}
					})
			})
			.catch((err) => {
					console.error("Something went wrong!", err)
					return message.channel.send("Something went wrong..."
					)
				}
			)

		// going to change this to an on. statement and try making it more "JS" I think I see where you are going.


		//This will start passing the ball

		function ball(message) {
			message.reply(`${emote} ${value}`)
				.then(() => {
					message.react('config.emoteID')
				})
				.catch((err) => {
					console.error("something went wrong!", err)
					return message.channel.send("Something went wrong... I couldn't react.")
				})
		}

		message.reply("Let's start!").then(() => {
		})
		message.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
			.then(collected => {
				const reaction = collected.first();
				if (reaction.emoji === client.emojis.cache.get(config.emoteID)) {

				}
			})
	}
});

client.login(config.token).then(() => {
	console.log("Bot is logged in!")
});
