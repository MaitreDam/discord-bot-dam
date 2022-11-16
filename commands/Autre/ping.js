module.exports.run =(client, message, args) => {
  message.edit('Pong!');
  message.edit(`${client.ping}ms`);
};

module.exports.help = {
  name: "ping",
  aliases: ['ping'],
  description: "Pong !",
  cooldown: 0,
  usage: '',
  args: false,
};