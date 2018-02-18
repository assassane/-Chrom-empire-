const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");

const newUsers = new Discord.Collection();


client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
  
  const channel = member.guild.channels.get("413750795528568843");

  if (!channel) return;
  
  channel.send(`Welcome to the server, ${member}`);
  
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
