const Discord = require("discord.js");
//const RandomOrg = require('random-org');// optional
const express = require('express');
const bodyParser = require('body-parser');
const util = require("./util.js");

require('dotenv').config();
const client = new Discord.Client();

var c = [];
var prefix = process.env.PREFIX;
const wf = "wolf";
const wk = "wolf king";
const wb = "wolf beauty";
const vl = "village";
const wc = "witch";
const se = "seer";
const ht = "hunter";
const id = "idiot";
const kt = "knight";
const fl = "fool";
const gd = "guard";
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
roles["mek"] = [wk,wf,vl,vl,vl,se,wc,id];
roles["meht"] = [wk,wf,wf,vl,vl,se,wc,ht];
roles["fool"] = [wk,wf,wf,se,wc,ht,kt,fl];
roles["wkwbwwshig"] = [wk,wb,wf,wc,se,ht,id,gd];
roles["w3v3wsh"] = [wf,wf,wf,vl,vl,vl,wc,se,ht];
roles["uh-huh"] = [wk,wf,wf,vl,vl,vl,se,wc,ht,gd];
roles["wkw2v3wshk"] = [wk,wf,wf,vl,vl,vl,wc,se,ht,kt];
roles["wkw3v4wshk"] = [wk,wf,wf,wf,vl,vl,vl,vl,wc,se,ht,kt];
roles["uh-huh12"] = [wk,wf,wf,wf,vl,vl,vl,vl,se,wc,ht,gd];
var list = [];
var tenorCooldown = [];
var showHWHelp = [];
showHWHelp["maths"] = [];
let maverick = true;

const statusCode = ["READY","CONNECTING","RECONNECTING","IDLE","NEARLY","DISCONNECTED"];

//var rorg = new RandomOrg({ apiKey: process.env.RORG });//optional

const helpEmbed = new Discord.RichEmbed()
    .setColor('#ffc800')
    .setTitle('Werewolf Bot Help')
    .addField('Current Prefix', prefix)
  	.addField('Available commands for MC', '!role\n!listroles\n!endgame')
    .addField('Available commands for players with Dead role', '!listroles')
  	.setTimestamp()
  	.setFooter('Powered by Werewolf Bot', 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const waitBefore = async (tm, fn) => {await sleep(tm*1000);fn()}
/* src: https://stackoverflow.com/questions/48891218/how-to-sleep-in-node-js-v9-with-es6 */

/**
 * Send out roles to respective channels and grant permissions to wolf discussion channel.
 * @param {Message} msg - The message/command sent to trigger this function.
 * @param {string} code - role code, see roles[].
 */
const sendroles = (msg,code) => {
  roles[code] = util.shuffle(roles[code]);
  for(var i=0;i<roles[code].length;i++){
    c[i]=thisGuild.channels.find(x => x.name === String(i+1)+'號');
  }
  wdc[msg.guild.id] = thisGuild.channels.find(x => x.name === "狼人討論");
  list[msg.guild.id] = "";
  wfs[msg.guild.id]=[];
  for(var j=0;j<roles[code].length;j++){
    c[j].send(roles[code][j]);
    if(roles[code][j]==wf||roles[code][j]==wk||roles[code][j]==wb||roles[code][j]==whwf||roles[code][j]==whwk){
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
  console.log(new Date()+` Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
        name: 'help: https://wwbot.ctptools.ga/ww/usage.html'
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
      case 'mchelp':
        msg.channel.send("<@&629587170050703381>, https://discordapp.com/channels/629570161032036373/653957410607595530/663671180602900500");
      break;
      case 'commands':
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
          case 'meh':
          case 'mek':
          case 'meht':
          case 'w3v3wsh':
          case 'wkw2v3wshk':
          case 'wkw3v4wshk':
          case '6':
          case 'uh-huh':
          case 'uh-huh12':
          case 'wkwbwwshig':
          case 'fool':
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
      case 'hw':
        switch(args[0].toLowerCase()){
          case 'bafs':
          case 'ba':
          case 'bafs-a':
            switch(args[1].toLowerCase()){
              case 'pearson':
              case 'p':
                switch(args[2].toLowerCase()){
                  case 'fa1':
                    if(!process.env.HWENABLED){msg.channel.send("Answers for NSS BAFS Pearson FA1 (2nd edition): https://drive.google.com/drive/folders/0B1Wkt8GlusGrX3U1czc4TDFIeXM");}else{
                    switch(args[3].toLowerCase()){
                      case '4.1':
                      case '4.2':
                      case '4.2x':
                      case '4.3':
                      case '4.3x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/5.png"]});
                      break;
                      case '4.4':
                      case '4.5':
                      case '4.5x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/6.png"]});
                      break;
                      case '4.6':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/7.png","./hw/bafs/pearson/fa1/4/8.png"]});
                      break;
                      case '4.7':
                      case '4.7x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/8.png"]});
                      break;
                      case '4.8':
                      case '4.8x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/9.png","./hw/bafs/pearson/fa1/4/10.png"]});
                      break;
                      case '4.9':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/10.png","./hw/bafs/pearson/fa1/4/11.png"]});
                      break;
                      case '4.10':
                      case '4.10x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/11.png","./hw/bafs/pearson/fa1/4/12.png"]});
                      break;
                      case '4.11':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/12.png"]});
                      break;
                      case '4.12':
                      case '4.12x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/12.png","./hw/bafs/pearson/fa1/4/13.png"]});
                      break;
                      case '4.13':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/13.png"]});
                      break;
                      case '4.14':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/14.png"]});
                      break;
                      case '4.15':
                      case '4.15x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/15.png","./hw/bafs/pearson/fa1/4/16.png"]});
                      break;
                      case '4.16':
                      case '4.16x':
                        msg.channel.send("",{files: ["./hw/bafs/pearson/fa1/4/16.png","./hw/bafs/pearson/fa1/4/17.png"]});
                      break;
                    }}
                  break;
                }
              break;
            }
          break;
        }
      break;
      case 'reset-cooldown':
        if (!msg.member.roles.some(role => role.name === 'Admin')){msg.reply("this command could only be used by admins. ||GFY!||");return;}
        if(args[0]){tenorCooldown[args[0]]=0;}
      break;
      case 'maverick':
        if (!msg.member.roles.some(role => role.name === 'Admin')){msg.reply("this command could only be used by admins. ||GFY!||");msg.delete();return;}
        maverick=!maverick;
        msg.channel.send(maverick);
        msg.delete();
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
  }else if(msg.content.startsWith("大眾銀行 vs. Simon Lo")){
    let vc = msg.member.voiceChannel;
    if(!vc){return msg.reply("get into a vc first");}
    else{
      vc.join().then(con=>{
        let dr = con.playFile('./voices/public-bank.mp3');
        dr.on("end",end=>{vc.leave()})
      }).catch(e=>console.error(e))
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
  }else if(msg.content.toLowerCase().includes("tenor.com/view/")){
    if(msg.channel.id==="681430411406213130"){
      return;
    }else if(tenorCooldown[msg.author.id]>=4){
      msg.delete();
    }else if(isNaN(tenorCooldown[msg.author.id])){
      tenorCooldown[msg.author.id]=1;
    }else{
      tenorCooldown[msg.author.id]+=1;
    }
  }else if(msg.channel.id==="678630062488289364"||msg.channel.id==="654242712761139200"){
    if(msg.content.toLowerCase().includes("math")&&msg.content.toLowerCase().includes("help")&&showHWHelp["maths"][msg.author.id]!=false){
      msg.reply("Hi! Seems like you are asking a question related to maths! I might be able to help, but you would have to follow a format I can recognize, so that I can give detailed steps and the correct solution. Head to https://wwbot.github.io/ww/usage.html to see how you can ask me a maths question ;)\n(If you don't want to see this message again, click ❎. Otherwise, click ✅.").then((botmsg)=>{
        botmsg.react('✅').then(()=>{botmsg.react('❎')});
        const filter = (reaction,user) => {
          return ['✅','❎'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };
        botmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
          .then(collected => {
            const reaction = collected.first();

            if (reaction.emoji.name === '✅') {
              botmsg.edit(`<@${msg.author.id}>, Hi! Seems like you are asking a question related to maths! I might be able to help, but you would have to follow a format I can recognize, so that I can give detailed steps and the correct solution. Head to https://wwbot.github.io/ww/usage.html to see how you can ask me a maths question ;)`).then(msg=>msg.clearReactions()).catch(console.error);
            } else {
              showHWHelp["maths"][msg.author.id]=false;
              botmsg.edit(`<@${msg.author.id}>, ok, I won't send you this message again unless I restart.`).then(msg=>msg.clearReactions()).catch(console.error);
            }
          })
          .catch(collected => {
            console.log(collected);
          });
      });
    }else if(msg.content.match(/\d?\d\.\d?\dx?/i)&&(msg.content.toLowerCase().includes("ba")||msg.content.toLowerCase().includes("accounting")||msg.content.toLowerCase().includes("financial")||msg.content.toLowerCase().includes("business"))){
      msg.reply("Hi! Seems like you are asking a question related to BAFS! If you are looking for the answers of **FA1** Q"+msg.content.match(/(\d?\d\.\d?\d)x?/i)[0]+", use the command `!hw ba p fa1 "+msg.content.match(/(\d?\d\.\d?\d)x?/i)[1]+"`.");
    }else if(msg.channel.id==="644812476382445569"&&msg.content.includes("遊戲結束")){
      client.guilds.find(x => x.id === msg.guild.id).channels.find(x => x.name === "no-mic").send("MC, please use the command `!endgame` if the game has ended. Thank you!");
    }
  }else if(msg.channel.id==="683914657626718208"&&msg.author.id==="399817995314003970"){
    if(!maverick)return;
    msg.delete();
  }
  if(msg.content.toLowerCase().includes("aov")||msg.content.toLowerCase().includes("a0v")||msg.content.toLowerCase().includes("@0v")||msg.content.toLowerCase().includes("@ov")||msg.content.toLowerCase().includes("a o v")||msg.content.toLowerCase().includes("arena of")||msg.content.toLowerCase().includes("arena 0f val0r")||msg.content.toLowerCase().includes("a.o.v")&&(!msg.content.toLowerCase().includes("aov is shit"))&&(!msg.content.toLowerCase().includes("delete aov"))&&(!msg.content.toLowerCase().includes("don't aov"))&&(!msg.content.toLowerCase().includes("don't play aov"))&&(!msg.content.toLowerCase().includes("don't want to play aov"))&&(!msg.content.toLowerCase().includes("no one wants to play aov"))&&(!msg.content.toLowerCase().includes("fuck aov"))&&(!msg.content.toLowerCase().includes("fk aov"))){
    if(msg.channel.id==="681436538810400769"||msg.member.roles.some(role => role.name === 'Bot Developer')||msg.author.id=="531822031059288074")return;
    msg.delete();
  }
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));

client.login();

/* WBCP and Express API */
const app = express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

if(!!process.env.APIAUTH){
  app.use((req,res,next)=>{
    if(req.get("X-WBCP-TOKEN")!=process.env.APIAUTH){
      res.status(401);
      res.json({
        response: 401,
        error: "The provided token in the request headers does not match the APIAUTH token set in the environment variables."
      });
    }else{
      next();
    }
  });
}
app.get('/', (req, res) => res.send('<!doctype html>\n<head>\n<title>WBCP backend</title>\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body><h2>WBCP backend</h2><p>This is the backend API service for the <b>W</b>erewolf <b>B</b>ot <b>C</b>ontrol <b>P</b>anel. Visit github repo for more info.</p><h3>Quick Links</h3><ul><li><a href="/guilds.html">Joined Guilds</a></li><li><a href="/presence.html">Set Presence</a></li><li><a href="/send.html">Send a message</a></li></ul></body>'));
app.get('/disconnected', (req,res) => {client.channels.find(x => x.name === 'bot').send("Disconnected!");res.json({response: 200});});
app.get('/reconnected', (req,res) => {client.channels.find(x => x.name === 'bot').send("Reconnected!");res.json({response: 200});});
app.post('/presence', (req,res) => {res.json({presence: req.body.presence});client.user.setPresence({
  game: {
      name: req.body.presence
  }
});});
app.post('/send', (req,res) => {
  client.channels.find(x => x.name === 'bot').send(req.body.message);res.json({response: 200, message: req.body.message});
});
app.post('/send-nomic', (req,res) => {
  client.channels.find(x => x.name === 'no-mic').send(req.body.message);res.json({response: 200, message: req.body.message});
});
app.post('/send-botan', (req,res) => {
  client.channels.find(x => x.name === 'bot-announcements').send(req.body.message);res.json({response: 200, message: req.body.message});
});
app.get('/guilds', (req,res) => {
  res.json(Array.from(client.guilds.keys()));
  //console.log(client.guilds);
  //res.send('<!doctype html>\n<html>\n  <head>\n    <title>Guilds</title>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n  </head>\n  <body>\n  </body>\n</html>');
});
app.get('/ping', (req,res)=>{res.json({response: 200, ping: client.ping});});
app.get('/status', (req,res)=>{res.json({response: 200, status: client.status, parsedStatus: statusCode[client.status]});});
app.get('/resetcooldown/:id',(req,res)=>{res.status(405);res.set("Allow", "POST");res.json({response: 405, error: "Method not allowed. Please use POST method for this path."})});
app.post('/resetcooldown/:id',(req,res)=>{res.json({response: 200, userid: req.params.id, cooldown: 0, oldcooldown: tenorCooldown[req.params.id]});tenorCooldown[req.params.id]=0;});
app.get('/cooldown/:id',(req,res)=>{if(isNaN(tenorCooldown[req.params.id])){tenorCooldown[req.params.id]=0;}res.json({response: 200, userid: req.params.id, cooldown: tenorCooldown[req.params.id]})});
if(process.env.APIENABLED){app.listen(port, () => console.log(`WBCP listening on port ${port}!`));}
