const Discord = require("discord.js");
const RandomOrg = require('random-org');// optional
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

require('dotenv').config();
const port = process.env.PORT;
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
const whht = "暴躁病患";
const whwc = "民俗老中醫";
const whkt = "海關檢疫員";
var roles = [];
var thisGuild;
var wfs = [];
var wdc = []; //wolf discussion channel
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

var rorg = new RandomOrg({ apiKey: process.env.RORG });//optional

const helpEmbed = new Discord.RichEmbed()
    .setColor('#ffc800')
    .setTitle('Werewolf Bot Help')
  	//.setURL('https://ctangpedia.ga/')
    .addField('Current Prefix', prefix)
  	.addField('Available commands for MC', '!role\n!listroles\n!endgame')
    .addField('Available commands for players with Dead role', '!listroles')
  	.setTimestamp()
  	.setFooter('Powered by Werewolf Bot', 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
// credits to CoolAJ86 @ StackOverflow https://stackoverflow.com/a/2450976

const sendroles = (msg,players) => {
  console.log(players);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
        name: '2 servers | !help'
    }
  });
  //client.channels.find(x => x.name === 'manage').send("Reconnected!");
  //client.channels.find(x => x.name === 'bot').send("Reconnected!"); //ugh
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
      case 'role':
        //if (msg.guild.id=="629570161032036373"){msg.reply("The bot has been temporarily disabled on this server by the author.");return;}
      /*rorg.generateIntegers({ min: 1, max: 99, n: 2 })
      .then(function(result) {
        console.log(result.random.data);
      });*/
        if (!msg.member.roles.some(role => role.name === 'MC')){msg.reply("you do not have sufficient permissions!"); return;} //||msg.guild.id!="653535903511216129"
        else {
          thisGuild=client.guilds.find(x => x.id === msg.guild.id);
        switch (args[0]) {
          case 'w2v2wsh':
          case 'wuhan-w2v2wsh':
          case 'w2v2wsk':
          case 'w2v2wsi':
            roles[args[0]] = shuffle(roles[args[0]]);
            for(var i=0;i<7;i++){
              c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
            }
            wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
            list[msg.guild.id] = "";
            wfs[msg.guild.id]=[];
            for(var j=0;j<7;j++){
              c[j].send(roles[args[0]][j]);
              if(roles[args[0]][j]==wf){
                wfs[msg.guild.id].push(j);
              }
              list[msg.guild.id] += String(j+1)+". "+roles[args[0]][j]+"\n";
            }
            for(var k=0;k<wfs[msg.guild.id].length;k++){
              wdc[msg.guild.id].overwritePermissions(
                msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
                { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
              );
            }
            thisGuild.channels.find(x => x.name === 'bot-log').send("7");
            thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
            msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
          break;
          case 'meh':
          case 'meht':
            roles[args[0]] = shuffle(roles[args[0]]);
            for(var i=0;i<8;i++){
              c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
            }
            wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
            list[msg.guild.id] = "";
            wfs[msg.guild.id]=[];
            for(var j=0;j<8;j++){
              c[j].send(roles[args[0]][j]);
              if(roles[args[0]][j]==wf){
                wfs[msg.guild.id].push(j);
              }
              list[msg.guild.id] += String(j+1)+". "+roles[args[0]][j]+"\n";
            }
            for(var k=0;k<wfs[msg.guild.id].length;k++){
              wdc[msg.guild.id].overwritePermissions(
                msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
                { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
              );
            }
            thisGuild.channels.find(x => x.name === 'bot-log').send("8");
            thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
            msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
          break;
          case 'w3v3wsh':
            roles[args[0]] = shuffle(roles[args[0]]);
            for(var i=0;i<9;i++){
              c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
            }
            wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
            list[msg.guild.id] = "";
            wfs[msg.guild.id]=[];
            for(var j=0;j<9;j++){
              c[j].send(roles[args[0]][j]);
              if(roles[args[0]][j]==wf){
                wfs[msg.guild.id].push(j);
              }
              list[msg.guild.id] += String(j+1)+". "+roles[args[0]][j]+"\n";
            }
            for(var k=0;k<wfs[msg.guild.id].length;k++){
              wdc[msg.guild.id].overwritePermissions(
                msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
                { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
              );
            }
            thisGuild.channels.find(x => x.name === 'bot-log').send("9");
            thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
            msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
          break;
          case 'wkw2v3wshk':
            roles[args[0]] = shuffle(roles[args[0]]);
            for(var i=0;i<10;i++){
              c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
            }
            wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
            list[msg.guild.id] = "";
            wfs[msg.guild.id]=[];
            for(var j=0;j<10;j++){
              c[j].send(roles[args[0]][j]);
              if(roles[args[0]][j]==wf){
                wfs[msg.guild.id].push(j);
              }
              list[msg.guild.id] += String(j+1)+". "+roles[args[0]][j]+"\n";
            }
            for(var k=0;k<wfs[msg.guild.id].length;k++){
              wdc[msg.guild.id].overwritePermissions(
                msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
                { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
              );
            }
            thisGuild.channels.find(x => x.name === 'bot-log').send("10");
            thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
            msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
          break;
          case 'wkw3v4wshk':
            roles[args[0]] = shuffle(roles[args[0]]);
            for(var i=0;i<12;i++){
              c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
            }
            wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
            list[msg.guild.id] = "";
            wfs[msg.guild.id]=[];
            for(var j=0;j<12;j++){
              c[j].send(roles[args[0]][j]);
              if(roles[args[0]][j]==wf){
                wfs[msg.guild.id].push(j);
              }
              list[msg.guild.id] += String(j+1)+". "+roles[args[0]][j]+"\n";
            }
            for(var k=0;k<wfs[msg.guild.id].length;k++){
              wdc[msg.guild.id].overwritePermissions(
                msg.guild.roles.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
                { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
              );
            }
            thisGuild.channels.find(x => x.name === 'bot-log').send("12");
            thisGuild.channels.find(x => x.name === 'spectators').send(list[msg.guild.id]);
            msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
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
        msg.reply("done!");
      break;
      case 'purge':
        //if (msg.guild.id=="629570161032036373"){msg.reply("this command has been temporarily disabled on this server by the author.");return;}
        if (!msg.member.roles.some(role => role.name === 'MC')){msg.reply("this command could only be used by MCs. ||GFY!||");return;}
        if(!isNaN(parseInt(args[0]))&&(parseInt(args[0]))<101){
          msg.channel.bulkDelete(args[0]).then(() => {
            msg.channel.send("Deleted "+args[0]+" messages. (This message will self-delete in 3 seconds.)").then(msg => msg.delete(3000));
          });
        }else{
          msg.channel.send("Usage Instructions:\n!purge [number of messages you intend to delete in bulk]");
        }
      break;
      case 'myid':
        msg.reply(msg.author.id);
      break;
    }
  }else if(msg.content.startsWith("lemme ")&&msg.author.id=="531822031059288074"){
    let vc = msg.member.voiceChannel;
    if(!vc){return msg.reply("get into a vc first");}
    else{
      switch(msg.content.replace(/lemme /,"")){
        case 'add my bot into vc and play a random mp3 from my computer':
          vc.join().then(con=>{
            let dispatcher = con.playFile('./shostakovich.mp3');
            dispatcher.on("end",end=>{vc.leave()})
          }).catch(e => console.error(e))
        break;
        case 'simply add my bot into vc':
          vc.join();
        break;
        case 'kick the bot out of vc':
          vc.leave();
        break;
      }
    }
  }else if(msg.content.startsWith("What does the bot say?")&&(msg.author.id=="531822031059288074"||msg.author.id=="149763661630537729")){
    let vc = msg.member.voiceChannel;
    if(!vc){return msg.reply("get into a vc first");}
    else{
        vc.join().then(con=>{
          let dispatcher = con.playFile('./voices/goodpeople.mp3');
          dispatcher.on("end",end=>{vc.leave()})
        }).catch(e => console.error(e))
    }
  }
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));

client.login();
app.get('/', (req, res) => res.send('<!doctype html>\n<head>\n<title>WBCP backend</title>\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body><h2>WBCP backend</h2><p>This is the backend API service for the <b>W</b>erewolf <b>B</b>ot <b>C</b>ontrol <b>P</b>anel. Visit github repo for more info.</p></body>'));
app.get('/disconnected', (req,res) => {client.channels.find(x => x.name === 'bot').send("Disconnected!");res.json({response: 200});});
app.post('/presence', (req,res) => {res.json({presence: req.body.presence});client.user.setPresence({
  game: {
      name: req.body.presence
  }
});});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
