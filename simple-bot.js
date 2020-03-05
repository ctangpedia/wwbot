const Discord = require("discord.js");

require('dotenv').config();
const client = new Discord.Client();

var c = [];
var prefix = process.env.PREFIX;
const wf = "wolf";
const wk = "wolf king";
const wb = "狼美人";
const vl = "village";
const wc = "witch";
const se = "seer";
const ht = "hunter";
const id = "idiot";
const kt = "knight";
const whvl = "武漢民眾";
const whwf = "帶菌者";
const whse = "醫生";
const whwk = "暴躁病患";
const whwc = "民俗老中醫";
const whkt = "海關檢疫員";
var roles = [];
var thisGuild;
var wfs = []; //wolves
var seer = [];
var wdc = []; //wolf discussion channel
roles["6"] = [wf,wf,vl,vl,wc,se];
roles["w2v2wsi"] = [wf,wf,vl,vl,wc,se,id];
roles["w2v2wsh"] = [wf,wf,vl,vl,wc,se,ht];
roles["wuhan-w2v2wsk"] = [whwf,whwf,whvl,whvl,whwc,whse,whkt];
roles["w2v2wsk"] = [wf,wf,vl,vl,wc,se,kt];
roles["meh"] = [wb,wf,vl,vl,vl,se,wc,id];
roles["meht"] = [wk,wf,wf,vl,vl,se,wc,ht];
roles["w3v3wsh"] = [wf,wf,wf,vl,vl,vl,wc,se,ht];
roles["wkw2v3wshk"] = [wk,wf,wf,vl,vl,vl,wc,se,ht,kt];
roles["wkw3v4wshk"] = [wk,wf,wf,wf,vl,vl,vl,vl,wc,se,ht,kt];
var list = [];
const helpEmbed = new Discord.RichEmbed()
    .setColor('#ffc800')
    .setTitle('Werewolf Bot Help')
    .addField('Current Prefix', prefix)
  	.addField('Available commands for MC', '!role\n!listroles\n!endgame')
    .addField('Available commands for players with Dead role', '!listroles')
  	.setTimestamp()
  	.setFooter('Powered by Werewolf Bot', 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png');
/**
 * Shuffles the given array
 * @author CoolAJ86 via StackOverflow https://stackoverflow.com/a/2450976
 * @param {Array} array - an array to shuffle
 * @returns {Array} the shuffled array
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const waitBefore = async (tm, fn) => {await sleep(tm*1000);fn()}
/* src: https://stackoverflow.com/questions/48891218/how-to-sleep-in-node-js-v9-with-es6 */
/**
 * Send out roles to respective channels and grant permissions to wolf discussion channel.
 * @param {Message} msg - The message/command sent to trigger this function.
 * @param {string} code - role code, see roles[].
 */
const sendroles = (msg,code) => {
  roles[code] = shuffle(roles[code]);
  for(var i=0;i<roles[code].length;i++){
    c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
  }
  wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
  list[msg.guild.id] = "";
  wfs[msg.guild.id]=[];
  for(var j=0;j<roles[code].length;j++){
    c[j].send(roles[code][j]);
    if(roles[code][j]==wf||roles[code][j]==wk||roles[code][j]==whwf||roles[code][j]==whwk){
      wfs[msg.guild.id].push(j);
    }
    if(roles[code][j]==se||roles[code][j]==whse){
      seer[msg.guild.id]=j;
    }
    list[msg.guild.id] += String(j+1)+". "+roles[code][j]+"\n";
  }
  for(var k=0;k<wfs[msg.guild.id].length;k++){
    wdc[msg.guild.id].overwritePermissions(
      msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
      { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
    );
  }
  thisGuild.channels.find(x => x.name === 'bot-log').send(roles[code].length);
  thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
  thisGuild.channels.find(x => x.name === 'bot-roles').send(list[msg.guild.id]);
  msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
  thisGuild.channels.find(x => x.name === String(parseInt(seer[msg.guild.id])+1)+'號').send("Good evening, seer! You can check other players and see if they are good (villagers or gods) or bad (wolves). You can check one player per night. To check a player, use the command /check as follows:\n```/check <no.>```where `<no.>` is the number of the player you want to check.");
  waitBefore(5, () => {wdc[msg.guild.id].send("Good evening, wolves! Your mission is to kill the good people. To do so, use the command /kill as follows:\n```/kill <no.>```where `<no.>` is the number of the player you want to kill.\n\n狼人們，晚上好！你們的任務是要殺死好人。想要達成任務，你們可以使用指令/kill，使用方法如下：```/kill <no.>````<no.>`為你們想殺的玩家號碼。");});
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
        name: '!help'
    }
  });
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.substring(0,1) == prefix) {
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    switch (cmd) {
      case 'help':
        msg.channel.send(helpEmbed);
      break;
      case 'mchelp':
        msg.channel.send("<@&629587170050703381>, https://discordapp.com/channels/629570161032036373/653957410607595530/663671180602900500");
      break;
      case 'role':
        if (!msg.member.roles.some(role => role.name === 'MC')){msg.reply("you do not have sufficient permissions!"); return;} //||msg.guild.id!="653535903511216129"
        else {
          thisGuild=client.guilds.find(x => x.id === msg.guild.id);
        switch (args[0]) {
          case 'w2v2wsh':
          case 'wuhan-w2v2wsh':
          case 'w2v2wsk':
          case 'w2v2wsi':
          case 'meh':
          case 'meht':
          case 'w3v3wsh':
          case 'wkw2v3wshk':
          case 'wkw3v4wshk':
          case '6':
            sendroles(msg,args[0]);
          break;
          default:
            msg.reply("invalid roles id! see #bot-documentation for help");
        }
      }
      break;
      case 'listroles':
      case 'roleslist':
      case 'rolelist':
        if(list[msg.guild.id]){
          if(msg.channel.name=="spectators"){
            client.guilds.find(x => x.id === msg.guild.id).channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
          }else{
            msg.reply("NOPE! ||gfy|| ");
          }
        }else{
          msg.reply("no WWE games initiated after the bot reconnected!");
        }
      break;
      case 'endgame':
        if (!msg.member.roles.some(role => role.name === 'MC')){msg.reply("this command could only be used by MCs. ||GFY!||");return;}
        wdc[msg.guild.id]=client.guilds.find(x => x.id === msg.guild.id).channels.find(x => x.name === "狼人討論");
        for(var i=0;i<12;i++){
          wdc[msg.guild.id].overwritePermissions(
            msg.guild.roles.find(n => n.name === String(i+1)+'號'),
            { 'VIEW_CHANNEL': false, 'SEND_MESSAGES': false }
          );
        }
        msg.guild.members.forEach((member) => member.removeRole(msg.guild.roles.find(x=>x.name==="Dead")));
        msg.reply("done! If you want me to send out the role list **here**, click on the :white_check_mark: reaction. Otherwise, click the :negative_squared_cross_mark: reaction.").then((botmsg)=>{
          botmsg.react('✅').then(()=>{botmsg.react('❎')});
          const filter = (reaction,user) => {
            return ['✅','❎'].includes(reaction.emoji.name) && user.id === msg.author.id;
          };
          botmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
          	.then(collected => {
          		const reaction = collected.first();

          		if (reaction.emoji.name === '✅') {
          			if(list[msg.guild.id]){msg.channel.send(list[msg.guild.id]);botmsg.edit(`<@${msg.author.id}>, done!`);botmsg.clearReactions();}
                else{
                  msg.reply("no WWE games initiated after the bot reconnected! Fetching list from another source...").then((newmsg)=>{
                    client.guilds.find(x => x.id === msg.guild.id).channels.find(x => x.name === "bot-roles")
                      .fetchMessages({limit:1})
                      .then(messages => {msg.channel.send(messages.first().content);botmsg.edit(`<@${msg.author.id}>, done!`);botmsg.clearReactions();newmsg.delete();});
                  });
                }
          		} else {
          			botmsg.edit(`<@${msg.author.id}>, done! You can view the role list in <#645150806848438303>`).then(msg=>msg.clearReactions()).catch(console.error);//msg.reply('never mind. You can still find the role list in <#645150806848438303>');//... in #spectators
          		}
          	})
          	.catch(collected => {
          		console.log(collected);
          	});
        });
      break;
      case 'purge':
        if (!msg.member.roles.some(role => role.name === 'MC')){msg.reply("this command could only be used by MCs. ||GFY!||");return;}
        if(!isNaN(parseInt(args[0]))&&(parseInt(args[0]))<101){
          msg.channel.bulkDelete(args[0]).then(() => {
            msg.channel.send("Deleted "+args[0]+" messages. (This message will self-delete in 3 seconds.)").then(msg => msg.delete(3000));
          });
        }else{
          msg.channel.send("Usage Instructions:\n!purge [number of messages you intend to delete in bulk]");
        }
      break;
    }
  }else if (msg.content.substring(0,1) == "/"){
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    switch (cmd) {
      case 'day':
        if(typeof wfs[msg.guild.id]==="undefined"){return msg.reply("start a new game first!");}
        for(var k=0;k<wfs[msg.guild.id].length;k++){
          wdc[msg.guild.id].overwritePermissions(
            msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
            { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false }
          );
        }
      break;
      case 'night':
        if(typeof wfs[msg.guild.id]==="undefined"){return msg.reply("start a new game first!");}
        for(var k=0;k<wfs[msg.guild.id].length;k++){
          wdc[msg.guild.id].overwritePermissions(
            msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
            { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
          );
        }
      break;
    }
  }
});
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.login();
