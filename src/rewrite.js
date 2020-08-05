// Load up the libraries
const Discord = require('discord.js');

// Importing config
const config = require('./config.json')

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
	if (command === "play") {
		//making the filters for the collectors


		// Makes a message saying Who wants to play?
		message.channel.send("who wants to play a game?")
			.then( message => {
				// Reacts with a beach ball
				message.react("740294983982252203").then((reaction) => {
					const collector = new message.createReactionCollector( beachballfilter, {
						maxEmojis: 1,
						max: 25,
						maxUsers: 25,
						time: 60000
					})

					//
					let players
					// Triggers when someone joins the react
					collector.on("collect", (reaction) => {
					players = reaction.users.fetch({limit: 100})
					})

				})

			})
	}
});

client.login(config.token).then(() => {
	console.log("logged in")
})