// Load up the libraries
const Discord = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

// Importing config
const config = require('./config.json')

//User array and random user picker
var randomValue = myArray[Math.floor(Math.random() * myArray.length)];
var players = []
var value = players[Math.floor(Math.random() * myArray.length)];


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
		status: 'dnd',
	}).then(() => {
	});

	// Collects messages and reactions?
	const filter = (reaction) => {
		return reaction.emoji.name === '739737953181630584';
	};
	const collector = message.channel.createReactionCollector(filter, { time: 15000 });
})

client.on('message', () => {
	if (message.channel === 710574818222931968) {
		//Game function
		if (message.content === '!play') {
			message.reply("Who wants to play with the beach ball?");
			message.react('739737953181630584');
			// going to change this to an on. statement and try making it more "JS" I think I see where you are going.
			message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();
					if (reaction.emoji === '739737953181630584') {
						players = reaction.users;
					}
				})
      //This will start passing the ball
      let ball = message.reply("739737953181630584 <@" + value + ">") + message.react('739774044974481478')

      message.reply("Let's start!")
      message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();
					if (reaction.emoji === '739774044974481478') {


					}
				})
		}
	}
});

client.login(config.token);
