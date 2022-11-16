module.exports.run =(client, message) => {
    const channel = client.channels.get("1042221114224549959");
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
      message.edit("Je suis connecté !");
    }).catch(e => {
      console.error(e);
    });
};

module.exports.help = {
  name: "join",
  aliases: ['vc'],
  description: "join a voice channel.",
  cooldown: 0,
  usage: '',
  args: false,
};