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
	return reaction.emoji.name === '739737953181630584';
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
		status: 'dnd',
	}).then(() => {
	});

})

client.on('message', async message => {
	if ((message.channel === 710574818222931968)) return;
	//Game function
	if (message.content === '!play') {
		message.reply("Who wants to play with the beach ball?").then(() => {
			message.react('739737953181630584')
		})
			.catch((err) => {
					console.error("Something went wrong!", err)
					return message.channel.send("Something went wrong..."
					)
				}
			)
		;
		// going to change this to an on. statement and try making it more "JS" I think I see where you are going.
		message.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
			.then(collected => {
				const reaction = collected.first();
				if (reaction.emoji === filter) {
					players = reaction.users;
				}
			})
		//This will start passing the ball
		let ball = await message.reply("<:BeachBall1:737676787823411230> <@" + value + ">") + message.react('737676787823411230')

		message.reply("Let's start!").then(() => {
		})
		message.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
			.then(collected => {
				const reaction = collected.first();
				if (reaction.emoji === message.guild.cache.find(emoji => emoji.id('737676787823411230'))) {

				}
			})
	}

});

client.login(config.token);
