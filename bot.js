const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");

const newUsers = new Discord.Collection();


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.get("413750795528568843");
  console.log('join1');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
  console.log('join2');
});

client.on('messageCreate', msg => {
    console.log("message");
});

client.on("message", async message => {
  
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    const m = await message.channel.send("nop 5");
    //m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

});
client.login(config.token);
