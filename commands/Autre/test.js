module.exports.run = (client, message, args) => {
	message.delete();
	message.channel.send('Hello World !');
};

module.exports.help = {
	name: 'test',
	aliases: ['testing'],
	description: 'Hello World !',
	cooldown: 0,
	usage: '',
	args: false,
};