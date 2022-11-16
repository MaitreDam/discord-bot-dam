const { Client, Collection } = require('v11-discord.js');
const { PREFIX } = require('./config');
const { readdirSync } = require('fs');

const client = new Client();
client.commands = new Collection();
["commands", "cooldowns"].forEach(x => client[x] = new Collection());

const loadCommands = (dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

        for (const file of commands) {
            const getFileName = require(`${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Commande chargée: ${getFileName.help.name}`);
        };
    });
};

loadCommands();

client.on('message', message => {
    if (message.author.id !== client.user.id || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName)); 
    if (!command) return;

    if (command.help.args && !args.length) {
        let noArgsReply = `il faut des arguments pour cette commande !`

        if (command.help.usage) noArgsReply += `\nVoici comment utiliser la commande: \`${PREFIX}${command.help.name} ${command.help.usage}\``

        return message.reply(noArgsReply);
    }

    if (!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new Collection());
    }

    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5) * 1000;
    
    if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
            timeLeft = [cdExpirationTime - timeNow] / 1000;
            return message.reply(`mollo l'asticot ! Tu écris la commande trop rapidement, merci d'attendre ${timeLeft.toFixed(0)}secondes avant de ré-utiliser la commande \`${command.help.name}\`.`)
        }
    }

    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    command.run(client, message, args);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN).catch(err =>{
  if(err.toString().includes('Incorrect login details were provided'.red) || err.toString().includes('An invalid token was provided'.red)) {
      console.log('Token invalid!\nChange ton token dans le config.json'.red)
  }})