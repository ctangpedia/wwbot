const Discord = require("discord.js");
//const RandomOrg = require('random-org');// optional
const express = require('express');
const bodyParser = require('body-parser');
const util = require("./util.js");
String.prototype.shuffle = function() {
    let a = this.split(""),
        n = a.length;

    for(let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();
const client = new Discord.Client();

var c = [];
var prefix = process.env.PREFIX;
const wf = "wolf";
const wk = "wolf king";
const wb = "wolf beauty";
const ws = "wolf seer";
const whid = "hidden wolf";
const wg = "守護狼";
const sjg = "石像鬼";
const vl = "village";
const vg = "守護者";
const wc = "witch";
const se = "seer";
const ht = "hunter";
const id = "idiot";
const kt = "knight";
const fl = "fool";
const gd = "guard";
const tg = "tomb guard";
const bse = "禁言長老";
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
roles["wkw2wshk"] = [wk,wf,wf,wc,se,ht,kt];
roles["meh"] = [wb,wf,vl,vl,vl,se,wc,id];
roles["mek"] = [wk,wf,vl,vl,vl,se,wc,id];
roles["meht"] = [wk,wf,wf,vl,vl,se,wc,ht];
roles["fool"] = [wk,wf,wf,se,wc,ht,kt,fl];
roles["我要曲線自爆"] = [wk,wf,wc,se,ht,id,gd,fl];
roles["ur-ded"] = [wk,wf,wf,se,wc,ht,id,gd];
roles["wkwbwwshig"] = [wk,wb,wf,wc,se,ht,id,gd];
roles["w3v3wsh"] = [wf,wf,wf,vl,vl,vl,wc,se,ht];
roles["uh-huh"] = [wk,wf,wf,vl,vl,vl,se,wc,ht,gd];
roles["wkw2v3wshk"] = [wk,wf,wf,vl,vl,vl,wc,se,ht,kt];
roles["wkw2v3wshg"] = [wk,wf,wf,vl,vl,vl,wc,se,ht,gd];
roles["wkw3v4wshk"] = [wk,wf,wf,wf,vl,vl,vl,vl,wc,se,ht,kt];
roles["wkw3v4wshg"] = [wk,wf,wf,wf,vl,vl,vl,vl,wc,se,ht,gd];
roles["uh-huh12"] = [wk,wf,wf,wf,vl,vl,vl,vl,se,wc,ht,gd];
roles["wswkwwshike"] = [ws,wk,wf,wc,se,ht,id,kt,bse];
roles["rock"] = [sjg,wf,wf,wf,vl,vl,vl,vl,se,wc,ht,tg];
var list = [];
var tenorCooldown = [];
var showHWHelp = [];
showHWHelp["maths"] = [];
let maverick = true;
let aovbypass=[];
aovbypass.push("Bot Developer");

let memeusers = {};
let meCooldowns = {};
const memeCmd = ["beg","work","pm"];
for (let i = 0;i<memeCmd.length;i++){
  meCooldowns[memeCmd[i]] = [];
}
let begDonors = ["WS Tang", "C Tong", "YC Leung", "Fat Tam", "The guy who sits besides you and farts every 5 minutes", "Tonald Drump", "Foogle Inc.", "That girl whose bed you woke up in last night and you're too afraid to ask her name because you might come off as rude","Patty Kerry","An alien","A cookie","A cup of bear","69 moles of dihydrogen monoxide","Gordon't Ramsaid","Wumpus","Clyde","Markie Succkerburg"];
let begActions = ["donated", "gave", "sent"];
const statusCode = ["READY","CONNECTING","RECONNECTING","IDLE","NEARLY","DISCONNECTED"];
//var rorg = new RandomOrg({ apiKey: process.env.RORG });//optional

const helpEmbed = new Discord.MessageEmbed()
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
  for(let i=0;i<roles[code].length;i++){
    c[i]=thisGuild.channels.cache.find(x => x.name === String(i+1)+'號');
  }
  wdc[msg.guild.id] = thisGuild.channels.cache.find(x => x.name === "狼人討論");
  list[msg.guild.id] = "";
  wfs[msg.guild.id]=[];
  for(let j=0;j<roles[code].length;j++){
    c[j].send(roles[code][j]);
    if(roles[code][j]==wf||roles[code][j]==wk||roles[code][j]==wb||roles[code][j]==ws||roles[code][j]==wg||roles[code][j]==whwf||roles[code][j]==whwk){
      wfs[msg.guild.id].push(j);
    }
    if(roles[code][j]==se||roles[code][j]==whse){
      seer[msg.guild.id]=j;
    }
    list[msg.guild.id] += String(j+1)+". "+roles[code][j]+"\n";
  }
  for(let k=0;k<wfs[msg.guild.id].length;k++){
    wdc[msg.guild.id].updateOverwrite(
      msg.guild.roles.cache.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
      { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': true }
    ).catch(console.error);
  }
  thisGuild.channels.cache.find(x => x.name === 'bot-log').send(roles[code].length);
  thisGuild.channels.cache.find(x => x.name === 'spectators').send(list[msg.guild.id]);
  thisGuild.channels.cache.find(x => x.name === 'bot-roles').send(list[msg.guild.id]);
  msg.channel.send(":white_check_mark: Roles have been sent! :zzz: everyone sleep");
  thisGuild.channels.cache.find(x => x.name === String(parseInt(seer[msg.guild.id])+1)+'號').send("Good evening, seer! You can check other players and see if they are good (villagers or gods) or bad (wolves). You can check one player per night. To check a player, use the command /check as follows:\n```/check <no.>```where `<no.>` is the number of the player you want to check.");
  waitBefore(5, () => {wdc[msg.guild.id].send("Good evening, wolves! Your mission is to kill the good people. To do so, use the command /kill as follows:\n```/kill <no.>```where `<no.>` is the number of the player you want to kill.\n\n狼人們，晚上好！你們的任務是要殺死好人。想要達成任務，你們可以使用指令/kill，使用方法如下：```/kill <no.>````<no.>`為你們想殺的玩家號碼。");});
}

client.on("ready", () => {
  console.log(new Date()+` Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
        name: 'discord.js v12'
    }
  });
  memeusers = JSON.parse(fs.readFileSync('./memebot.json'));
  console.log(memeusers["531822031059288074"].wallet);
  console.log(memeusers["531822031059288074"].bank);
  //client.channels.cache.find(x => x.name === 'manage').send("Reconnected!");
  //client.channels.cache.find(x => x.name === 'bot').send("Reconnected!"); //ugh
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.content.substring(0,4) == "hey " && (msg.channel.id === "732479795144949791" || msg.channel.id === "654242712761139200")) {
    var args = msg.content.substring(4).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    switch (cmd) {
      case 'help':
        msg.channel.send("beg work pm bal rich dep");
      break;
      case 'beg':
        if(meCooldowns["beg"][msg.author.id] === undefined || meCooldowns["beg"][msg.author.id][0]){
          meCooldowns["beg"][msg.author.id] = [];
          meCooldowns["beg"][msg.author.id][0] = false;
          meCooldowns["beg"][msg.author.id][1] = Date.now()+util.getCooldown(msg.author.id,"beg");
          let ifGivesMoney = util.randomIntIncl(0,5);
          let begMoney;
          if(ifGivesMoney!=0){
            begMoney = util.randomIntIncl(2,815);
            msg.channel.send(`**${begDonors[Math.floor(Math.random() * begDonors.length)]}** ${begActions[Math.floor(Math.random() * begActions.length)]} ${begMoney} coins to <@${msg.author.id}>.`);
          }else{
            begMoney = 0;
            msg.channel.send(`**${begDonors[Math.floor(Math.random() * begDonors.length)]}** is not gonna give you any money haha <@${msg.author.id}>`);
          }
          if(memeusers[msg.author.id].wallet===undefined){memeusers[msg.author.id].wallet=begMoney;}else{memeusers[msg.author.id].wallet+=begMoney;}
          setTimeout(()=>{meCooldowns["beg"][msg.author.id][0] = true;},util.getCooldown(msg.author.id,"beg"));
        }else{
          msg.channel.send(`hey cool down you have to wait ${((meCooldowns["beg"][msg.author.id][1]-Date.now())/1000).toFixed(1)} seconds before you can beg again`);
        }
        let ifSpecialEvent = util.randomIntIncl(0,2);
        if(ifSpecialEvent == 0){
          const quiz = require('./spevents.json');
          const item = quiz[Math.floor(Math.random() * quiz.length)];
          const filter = response => {
	           return item.answers.some(answer => answer === response.content);//.toLowerCase()
          };

          msg.channel.send(item.question).then(() => {
	           msg.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
		           .then(collected => {
			              msg.channel.send(`${collected.first().author} got ${item.reward} coins`);
                    if(memeusers[collected.first().author.id].wallet===undefined){memeusers[collected.first().author.id].wallet=item.reward;}else{memeusers[collected.first().author.id].wallet+=item.reward;}
		           })
		           .catch(collected => {
			              msg.channel.send('event expired what are you guys even thinking smh it\'s free coins');
		           });
          });
        }
      break;
      case 'postmeme':
      case 'pm':
        //msg.channel.send(`no. nope. nah.`);
        if(meCooldowns["pm"][msg.author.id] === undefined || meCooldowns["pm"][msg.author.id][0]){
          meCooldowns["pm"][msg.author.id] = [];
          meCooldowns["pm"][msg.author.id][0] = false;
          meCooldowns["pm"][msg.author.id][1] = Date.now()+util.getCooldown(msg.author.id,"pm");
          if(memeusers[msg.author.id] === undefined){
            memeusers[msg.author.id]={id:msg.author.id,wallet:0,bank:0,bankcap:100};
            msg.channel.send("you know what you should probably start begging to get some coins first");
          }else{
            if(memeusers[msg.author.id].inv.laptop===undefined || memeusers[msg.author.id].inv.laptop==0){
              return msg.channel.send("how are you going to post a meme without a laptop...");
            }else{
              let karma = util.randomIntIncl(25,6000);
              let memeve = util.randomIntIncl(0,2);
              if(memeve==0){
                if(!!util.randomIntIncl(0,1)){
                  msg.channel.send(`Everyone **hates** your meme, and it ended up with **-${karma} karma**. You get 0 coins lol sucks to be you`);
                }else{
                  msg.channel.send(`Everyone **hates** your meme, and it ended up with **-${karma} karma**. You get 0 coins AND now your :computer: **Laptop** is broken lmao`);
                  memeusers[msg.author.id].inv.laptop-=1;
                }
              }else{
                let memeReward = util.randomIntIncl(30,1000);
                if(karma<2000){
                  msg.channel.send(`Your meme got **${karma} upvotes**. You get ${memeReward} coins from the ads`);
                }else{
                  msg.channel.send(`Your meme is __**TRENDING**__ with **${karma} karma**. You get ${memeReward} coins, niceeee meme bro`)
                }
                if(memeusers[msg.author.id].wallet===undefined){memeusers[msg.author.id].wallet=memeReward;}else{memeusers[msg.author.id].wallet+=memeReward;}
              }
            }
          }
          setTimeout(()=>{meCooldowns["pm"][msg.author.id][0] = true;},util.getCooldown(msg.author.id,"pm"));
        }else{
          msg.channel.send(`hey cool down you have to wait ${((meCooldowns["pm"][msg.author.id][1]-Date.now())/1000).toFixed(1)} seconds before you can post a meme again`);
        }

        /*
        Everyone **hates** your meme, and it ended up with **-1,471 karma**. You get 0 coins AND now your :laptop: **Laptop** is broken lmao
        Everyone **hates** your meme, and it ended up with **-608 karma**. You get 0 coins lol sucks to be you
        Your meme got **253 upvotes**. You get 202 coins from the ads
        Your meme is __**TRENDING**__ with **2,324 karma**. You get 192 coins, niceeee meme bro
        Your meme is __**TRENDING**__ with **4,145 karma**. You get 714 coins, also a fan of your memes sent you 1 :candy: **Candy**
        , also a fan of your memes sent you 1 :sand: Box of Sand
        */
      break;
      case 'work':
        if(meCooldowns["work"][msg.author.id] === undefined || meCooldowns["work"][msg.author.id][0]){
          meCooldowns["work"][msg.author.id] = [];
          meCooldowns["work"][msg.author.id][0] = false;
          meCooldowns["work"][msg.author.id][1] = Date.now()+util.getCooldown(msg.author.id,"work");
          let workStatus = util.randomIntIncl(1,6);
          let rewardMoney = 0;
          switch(workStatus){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              const quiz = require('./works.json');
              const item = quiz[Math.floor(Math.random() * quiz.length)];
              let word, filter;
              switch(item.type){
                case "reverse":
                  word = item.wordlist[Math.floor(Math.random() * item.wordlist.length)];
                  filter = response => {
                    return ((response.content.toLowerCase() === util.reverseString(word))&&response.author.id === msg.author.id);
                  };
                  msg.channel.send(item.question.replace(/\$1/,word)).then(() => {
                    msg.channel.awaitMessages(filter, { maxMatches: 1, time: item.time, errors: ['time'] })
                     .then(collected => {
                        rewardMoney += util.randomIntIncl(item.rewardmin,item.rewardmax);
                        msg.channel.send(item.response.replace(/\$1/,msg.author.id).replace(/\$2/,rewardMoney));
                        if(memeusers[msg.author.id].wallet===undefined){memeusers[msg.author.id].wallet=rewardMoney;}else{memeusers[msg.author.id].wallet+=rewardMoney;}
                     })
                     .catch(collected => {
                        msg.channel.send('**BOSS** is angry with your horrible work and refuses to give you any coins smh');
                     });
                  });
                break;
                case "unscramble":
                  word = item.wordlist[Math.floor(Math.random() * item.wordlist.length)];
                  filter = response => {
                    return ((response.content.toLowerCase() === word)&&response.author.id === msg.author.id);
                  };
                  msg.channel.send(item.question.replace(/\$1/,word.shuffle())).then(() => {
                    msg.channel.awaitMessages(filter, { maxMatches: 1, time: item.time, errors: ['time'] })
                     .then(collected => {
                        rewardMoney += util.randomIntIncl(item.rewardmin,item.rewardmax);
                        msg.channel.send(item.response.replace(/\$1/,msg.author.id).replace(/\$2/,rewardMoney));
                        if(memeusers[msg.author.id].wallet===undefined){memeusers[msg.author.id].wallet=rewardMoney;}else{memeusers[msg.author.id].wallet+=rewardMoney;}
                     })
                     .catch(collected => {
                        rewardMoney += 50;
                        msg.channel.send('**BOSS** is angry with your horrible work and decides to give you only 50 coins');
                        if(memeusers[msg.author.id].wallet===undefined){memeusers[msg.author.id].wallet=rewardMoney;}else{memeusers[msg.author.id].wallet+=rewardMoney;}
                     });
                  });
                break;
              }
              /*const filter = response => {
                return item.answers.some(answer => answer === response.content);//.toLowerCase()
              };

              msg.channel.send(item.question).then(() => {
                msg.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
                 .then(collected => {
                      msg.channel.send(`${collected.first().author} got ${item.reward} coins`);
                      if(wallets[collected.first().author.id]===undefined){wallets[collected.first().author.id]=item.reward;}else{wallets[collected.first().author.id]+=item.reward;}
                 })
                 .catch(collected => {
                      msg.channel.send('event expired what are you guys even thinking smh it\'s free coins');
                 });
              });*/
            break;
            case 6:
              msg.channel.send("no work for you lol try again later");
            break;
          }
          setTimeout(()=>{meCooldowns["work"][msg.author.id][0] = true;},util.getCooldown(msg.author.id,"work"));
        }else{
          msg.channel.send(`hey cool down you have to wait ${((meCooldowns["work"][msg.author.id][1]-Date.now())/1000).toFixed(1)} seconds before you can work again`);
        }
      break;
      case 'bal':
        if(memeusers[msg.author.id].wallet===undefined || memeusers[msg.author.id].wallet == 0){
          msg.channel.send(`you are poor I think you should start begging others for money with \`hey beg\``);
        }else{
          msg.channel.send(`<@${msg.author.id}>\nWallet: ${memeusers[msg.author.id].wallet}\nBank: ${memeusers[msg.author.id].bank}/${memeusers[msg.author.id].bankcap}`);
        }
      break;
      case 'rich':
        //msg.channel.send("I am rich haha");
        /* nah won't work ofc let richest = [Object.keys(memeusers)[0]];
        Object.keys(memeusers).forEach((key)=>{
          if(memeusers[key].wallet>=richest[0]){
            richest = [key, ...richest];
          }else{
            richest.push(key);
          }
        });
        console.log(richest);*/
        let richest = [];
        Object.keys(memeusers).forEach((key)=>{
          richest.push(memeusers[key]);
        })
        richest = richest.sort((a,b)=>{
          return b.wallet-a.wallet;
        });
        console.log(richest);
        let richmsg = "Richest users in this server\n";
        for(let i=0;i<richest.length;i++){
          richmsg+=`${i+1}. ${client.users.cache.get(richest[i].id).username}#${client.users.cache.get(richest[i].id).discriminator} - ${richest[i].wallet}\n`;
        }
        msg.channel.send(richmsg);
      break;
      case 'dep':
        //msg.channel.send(`why do you think I can deposit your money into the bank when you don't have a bank account?`);
        if(memeusers[msg.author.id] === undefined){
          memeusers[msg.author.id]={id:msg.author.id,wallet:0,bank:0,bankcap:100};
          msg.channel.send("you know what you should probably start begging to get some coins first");
        }else{
          if(memeusers[msg.author.id].bank===undefined||memeusers[msg.author.id].bankcap===undefined){return msg.channel.send("Your WWE meme bot profile is corrupted. Contact bot owner to fix it.")}
          if(isNaN(args[0])){
            if(args[0]=="all"){
              let bankdep = memeusers[msg.author.id].bankcap-memeusers[msg.author.id].bank;
              memeusers[msg.author.id].wallet-=bankdep;
              memeusers[msg.author.id].bank+=bankdep;
              msg.channel.send(`succesfully deposited ${bankdep} coins\n**PRO TIP**: If your bank account is full, there's nothing you could do other than waiting for the bot owner to randomly increase your bank account capacity lol`);
            }else{
              msg.channel.send(`smh that's not the correct syntax`);
            }
          }else{
            if(memeusers[msg.author.id].wallet<args[0]){return msg.channel.send(`don't trick me you don't have that much money :angry:`);}
            let availableBank = memeusers[msg.author.id].bankcap-memeusers[msg.author.id].bank;
            let bankdep = 0;
            if(args[0]>availableBank){bankdep=availableBank;}else{bankdep=args[0];}
            bankdep=Math.floor(bankdep);
            memeusers[msg.author.id].wallet-=bankdep;
            memeusers[msg.author.id].bank+=bankdep;
            msg.channel.send(`successfully deposited ${bankdep} coins`);
          }
        }
      break;
      case 'steal':
      case 'rob':
        msg.channel.send(`this bot is peacful no stealing or robbing ||before the bot owner decides to add this function||`);
        if(memeusers[msg.author.id].wallet===undefined || memeusers[msg.author.id].wallet < 250){return msg.channel.send('you have to possess at least 250 coins to steal from others');}
        const targetMember = msg.mentions.members.first().user;

        console.log(targetMember);
      break;
      case 'logusers':
        if(msg.author.id!="531822031059288074")return;
        console.log(memeusers);
        console.log(JSON.stringify(memeusers));
      break;
    }
  }
  if (msg.content.substring(0,1) == prefix) {
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    switch (cmd) {
      /*case 'temp':
        msg.channel.setRateLimitPerUser(3);
      break;*/
      case 'msgs':
        console.log(msg.channel.messages.fetch({ limit: 20 }));msg.delete();
        msg.channel.send("done").then(msg=>msg.delete({timeout:3000}));
      break;
      case 'help':
      case 'commands':
        msg.channel.send(helpEmbed);
      break;
      case 'mchelp':
        msg.channel.send("<@&629587170050703381>, https://discordapp.com/channels/629570161032036373/653957410607595530/663671180602900500");
      break;
      case 'role':
        //if (msg.guild.id=="629570161032036373"){msg.reply("The bot has been temporarily disabled on this server by the author.");return;}
      /*rorg.generateIntegers({ min: 1, max: 99, n: 2 })
      .then(function(result) {
        console.log(result.random.data);
      });*/
        if (!msg.member.roles.cache.some(role => role.name === 'MC')){msg.reply("you do not have sufficient permissions!"); return;} //||msg.guild.id!="653535903511216129"
        else {
          thisGuild=client.guilds.cache.find(x => x.id === msg.guild.id);
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
          case 'ur-ded':
          case '我要曲線自爆':
          case 'wkw3v4wshg':
          case 'wswkwwshike':
          case 'rock':
          case 'wkw2wshk':
          case 'wkw2v3wshg':
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
            msg.guild.channels.cache.find(x => x.name === 'spectators').send(list[msg.guild.id]);
          }else{
            msg.reply("NOPE! ||gfy|| ");
          }
        }else{
          msg.reply("no WWE games initiated after the bot reconnected!");
        }
      break;
      case 'endgame':
        if (!msg.member.roles.cache.some(role => role.name === 'MC')){msg.reply("this command could only be used by MCs. ||GFY!||");return;}
        wdc[msg.guild.id]=msg.guild.channels.cache.find(x => x.name === "狼人討論");
        for(var i=0;i<12;i++){
          wdc[msg.guild.id].updateOverwrite(
            msg.guild.roles.cache.find(n => n.name === String(i+1)+'號'),
            { 'VIEW_CHANNEL': false, 'SEND_MESSAGES': false }
          );
        }
        msg.guild.members.cache.forEach((member) => member.roles.remove(msg.guild.roles.cache.find(x=>x.name==="Dead")));
        msg.reply("done! If you want me to send out the role list **here**, click on the :white_check_mark: reaction. Otherwise, click the :negative_squared_cross_mark: reaction.").then((botmsg)=>{
          botmsg.react('✅').then(()=>{botmsg.react('❎')});
          const filter = (reaction,user) => {
            return ['✅','❎'].includes(reaction.emoji.name) && user.id === msg.author.id;
          };
          botmsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
          	.then(collected => {
          		const reaction = collected.first();

          		if (reaction.emoji.name === '✅') {
          			if(list[msg.guild.id]){msg.channel.send(list[msg.guild.id]);botmsg.edit(`<@${msg.author.id}>, done!`);botmsg.reactions.removeAll();}
                else{
                  msg.reply("no WWE games initiated after the bot reconnected! Fetching list from another source...").then((newmsg)=>{
                    msg.guild.channels.cache.find(x => x.name === "bot-roles").messages
                      .fetch({limit:1})
                      .then(messages => {msg.channel.send(messages.first().content);botmsg.edit(`<@${msg.author.id}>, done!`);botmsg.reactions.removeAll();newmsg.delete();});
                  });
                }
          		} else {
          			botmsg.edit(`<@${msg.author.id}>, done! You can view the role list in <#645150806848438303>`).then(msg=>msg.reactions.removeAll()).catch(console.error);//msg.reply('never mind. You can still find the role list in <#645150806848438303>');//... in #spectators
          		}
          	})
          	.catch(collected => {
          		console.log(collected);
          	});
        });
      break;
      case 'purge':
        //if (msg.guild.id=="629570161032036373"){msg.reply("this command has been temporarily disabled on this server by the author.");return;}
        if (msg.author.id=="395405722566918144"||msg.author.id=="531822031059288074"||msg.member.roles.cache.some(role => role.name === 'MC')){
          if(!isNaN(parseInt(args[0]))&&(parseInt(args[0]))<101){
            msg.channel.bulkDelete(args[0]).then(() => {
              msg.channel.send("Deleted "+args[0]+" messages. (This message will self-delete in 3 seconds.)").then(msg => msg.delete({timeout:3000}));
            });
          }else{
            msg.channel.send("Usage Instructions:\n!purge [number of messages you intend to delete in bulk]");
          }
        }else{msg.reply("this command could only be used by MCs. ||GFY!||");}
      break;
      case 'myid':
        msg.reply(msg.author.id);
      break;
      case 'reset-cooldown':
        if (!msg.member.roles.cache.some(role => role.name === 'Admin')){msg.reply("this command could only be used by admins. ||GFY!||");return;}
        if(args[0]){tenorCooldown[args[0]]=0;}
      break;
      case 'maverick':
        if (!msg.member.roles.cache.some(role => role.name === 'Admin')){msg.reply("this command could only be used by admins. ||GFY!||");msg.delete();return;}
        maverick=!maverick;
        msg.channel.send(maverick);
        msg.delete();
      break;
      case 'clanwar':
        axios.get(`https://api.clashroyale.com/v1/clans/%23${process.env.CRCLANTAG}/currentwar`,{headers:{"Accept":"application/json","Authorization":`Bearer ${process.env.CRTOKEN}`}})
          .then(function (response) {
            const data = response.data;
            let botmsg = "";
            switch(data.state){
              case 'notInWar':
              botmsg+="No active clan wars.";
              msg.channel.send(botmsg);
              break;
              case 'collectionDay':
              case 'matchmaking':
              let tss = data.collectionEndTime.split("T")[1].split(".")[0];
              let players ="";
              for(let i=0;i<data.clan.participants;i++){
                players+=`${data.participants[i].name}\n`;
              }
              const infoEmbed = new Discord.MessageEmbed()
              	.setColor('#0099ff')
              	.setTitle('CR Clan War Status')
              	.setAuthor(data.clan.name,`https://cdn.statsroyale.com/images/badges/${data.clan.badgeId}.png`)
              	.setDescription(`It's collection day!`)
              	.addField('Collection day ends', `${tss.slice(0,2)}:${tss.slice(2,4)}:${tss.slice(4,6)} (UTC)`, true)
              	.addField('Number of participants', data.clan.participants,true)
              	//.addField('Inline field title', 'Some value here', true)
                .addField('Participants', players)
              	//.addField('Inline field title', 'Some value here', true)
              	//.addField('Inline field title', 'Some value here', true)
              	//.addField('Regular field title', 'Some value here')
              	//.addBlankField()
              	.setTimestamp();
              msg.channel.send(infoEmbed);
              break;
              case 'warDay':
              //console.log(data);
              let tsy = data.warEndTime.split("T")[1].split(".")[0];
              let playerswd="";
              let clanranks="";
              for(let i=0;i<data.clan.participants;i++){
                playerswd+=`${data.participants[i].name}\n`;
              }
              for(let i=0;i<data.clans.length;i++){
                clanranks+=`${i+1}. ${data.clans[i].name}\n`;
              }
              const infoEmbedwd = new Discord.MessageEmbed()
              	.setColor('#0099ff')
              	.setTitle('CR Clan War Status')
              	.setAuthor(data.clan.name,`https://cdn.statsroyale.com/images/badges/${data.clan.badgeId}.png`)
              	.setDescription(`It's war day!`)
              	.addField('War day ends', `${tsy.slice(0,2)}:${tsy.slice(2,4)}:${tsy.slice(4,6)} (UTC)`, true)
              	.addField('Number of participants', data.clan.participants,true)
                .addField('Participants', playerswd)
                .addField('Battles played', data.clan.battlesPlayed,true)
              	.addField('Wins', data.clan.wins,true)
                .addField('Crowns', data.clan.crowns,true)
                .addField('Ranks', clanranks)
              	//.addField('Inline field title', 'Some value here', true)
              	//.addField('Inline field title', 'Some value here', true)
              	//.addField('Regular field title', 'Some value here')
              	//.addBlankField()
              	.setTimestamp();
              msg.channel.send(infoEmbedwd);
              break;
              default:
              botmsg+="Unknown response from server";
              msg.channel.send(botmsg);
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      break;/*
      case 'crchannel':
        msg.guild.createChannel('clash-royale', {type: 'text', parent: "681436879216050185", reason: "Clash Royale Channel created as per request",
        permissionOverwrites: [{
          id: msg.author,
          allow: ['MANAGE_CHANNELS']
        }] })
          .then(console.log)
          .catch(console.error);
      break;*/
      case 'doghaha':
        msg.channel.send(client.emojis.cache.get("716239626909777970").toString());
      break;
    }
  }else if(msg.content.startsWith("lemme ")&&msg.author.id=="531822031059288074"){
    let vc = msg.member.voiceChannel;
    if(!vc){return msg.reply("get into a vc first");}
    else{
      switch(msg.content.replace(/lemme /,"")){
        /* meh too lazy to fix case 'add my bot into vc and play a random mp3 from my computer':
          vc.join().then(con=>{
            let dispatcher = con.playFile('./shostakovich.mp3');
            dispatcher.on("end",end=>{vc.leave()})
          }).catch(e => console.error(e))
        break;*/
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
          wdc[msg.guild.id].updateOverwrite(
            msg.guild.roles.cache.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
            { 'VIEW_CHANNEL': true, 'SEND_MESSAGES': false }
          );
        }
      break;
      case 'night':
        if(typeof wfs[msg.guild.id]==="undefined"){return msg.reply("start a new game first!");}
        for(var k=0;k<wfs[msg.guild.id].length;k++){
          wdc[msg.guild.id].updateOverwrite(
            msg.guild.roles.cache.find(n => n.name === String(wfs[msg.guild.id][k]+1)+'號'),
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
              botmsg.edit(`<@${msg.author.id}>, Hi! Seems like you are asking a question related to maths! I might be able to help, but you would have to follow a format I can recognize, so that I can give detailed steps and the correct solution. Head to https://wwbot.github.io/ww/usage.html to see how you can ask me a maths question ;)`).then(msg=>msg.reactions.removeAll()).catch(console.error);
            } else {
              showHWHelp["maths"][msg.author.id]=false;
              botmsg.edit(`<@${msg.author.id}>, ok, I won't send you this message again unless I restart.`).then(msg=>msg.reactions.removeAll()).catch(console.error);
            }
          })
          .catch(collected => {
            console.log(collected);
          });
      });
    }else if(msg.content.match(/\d?\d\.\d?\dx?/i)&&(msg.content.toLowerCase().includes("ba")||msg.content.toLowerCase().includes("accounting")||msg.content.toLowerCase().includes("financial")||msg.content.toLowerCase().includes("business"))){
      msg.reply("Hi! Seems like you are asking a question related to BAFS! If you are looking for the answers of **FA1** Q"+msg.content.match(/(\d?\d\.\d?\d)x?/i)[0]+", use the command `!hw ba p fa1 "+msg.content.match(/(\d?\d\.\d?\d)x?/i)[1]+"`.");
    }
  }else if(msg.channel.id==="683914657626718208"&&msg.author.id==="399817995314003970"){
    if(!maverick)return;
    msg.delete();
  }
  if(msg.content.match(/[aàáâäæãåā@ａ]+\s*[oôöòóœøōõ0ｏ]+\s*[vｖ]+/i)||msg.content.match(/arena\s*of\s*valor/i)||msg.content.match(/(傳說|傳決對說)/i)||msg.content.match(/伝説/i)){
    for(let i=0;i<aovbypass.length;i++){
      if(msg.member.roles.cache.some(role => role.name === aovbypass[i]))return;
    }
    if(msg.content.match(/don'?t( play)? aov/i)||msg.content.match(/aov( is)? shit/i))return;
    msg.delete();
  }
});

client.on("messageUpdate",(oldmsg,msg)=>{
  //console.log(msg.content);
  for(let i=0;i<aovbypass.length;i++){
    if(msg.member.roles.cache.some(role => role.name === aovbypass[i]))return;
  }
  if(msg.content.match(/don'?t( play )?aov/i)||msg.content.match(/aov( is )?shit/i))return;
  if(msg.content.match(/[aàáâäæãåā@ａ]+(\s|\.)*[oôöòóœøōõ0ｏ]+(\s|\.)*[vｖ]+/i)||msg.content.match(/arena\s*of\s*valor/i)||msg.content.match(/(傳說|傳決對說)/i)||msg.content.match(/伝説/i)){
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
app.get('/disconnected', (req,res) => {client.channels.cache.find(x => x.name === 'bot').send("Disconnected!");res.json({response: 200});});
app.get('/reconnected', (req,res) => {client.channels.cache.find(x => x.name === 'bot').send("Reconnected!");res.json({response: 200});});
app.post('/presence', (req,res) => {res.json({presence: req.body.presence});client.user.setPresence({
  game: {
      name: req.body.presence
  }
});});
app.post('/send', (req,res) => {
  client.channels.cache.find(x => x.name === 'bot').send(req.body.message);res.json({response: 200, message: req.body.message});
});
app.get('/guilds', (req,res) => {
  res.json(Array.from(client.guilds.cache.keys()));
  //console.log(client.guilds);
  //res.send('<!doctype html>\n<html>\n  <head>\n    <title>Guilds</title>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n  </head>\n  <body>\n  </body>\n</html>');
});
app.get('/aovbypass', (req,res) => {
  res.json(aovbypass);
});
app.post('/aovbypass', (req,res)=>{
  aovbypass.push(req.param.role);
  res.json({role: req.params.role});
});
app.get('/ping', (req,res)=>{res.json({response: 200, ping: client.ping});});
app.get('/status', (req,res)=>{res.json({response: 200, status: client.status, parsedStatus: statusCode[client.status]});});
app.get('/resetcooldown/:id',(req,res)=>{res.status(405);res.set("Allow", "POST");res.json({response: 405, error: "Method not allowed. Please use POST method for this path."})});
app.post('/resetcooldown/:id',(req,res)=>{res.json({response: 200, userid: req.params.id, cooldown: 0, oldcooldown: tenorCooldown[req.params.id]});tenorCooldown[req.params.id]=0;});
app.get('/cooldown/:id',(req,res)=>{if(isNaN(tenorCooldown[req.params.id])){tenorCooldown[req.params.id]=0;}res.json({response: 200, userid: req.params.id, cooldown: tenorCooldown[req.params.id]})});
app.get('/client',(req,res)=>{
  let guilds = Array.from(client.guilds.cache.keys());
  let response = "";
  response+=`<!DOCTYPE html><html><head><title>Discord</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><ul>`;
  for(let i=0;i<guilds.length;i++){
    console.log(client.guilds.cache.get(guilds[i]).name);
    response+=`<li><a href="/guild/${guilds[i]}">${client.guilds.cache.get(guilds[i]).name}</a></li>`;
  }
  response+="</ul></body></html>";
  res.send(response);
});
app.get('/guild/:id',(req,res)=>{
  let response = "";
  response+=`<!DOCTYPE html><html><head><title>Discord</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><p><a href="/client">&lt; Back</a></p>`;
  response+=`<h1>${client.guilds.cache.get(req.params.id).name}</h1><ul>`;
  let channels = client.guilds.cache.get(req.params.id).channels;
  let channelsArray = Array.from(channels.cache.keys());
  for(let i=0;i<channelsArray.length;i++){
    switch(channels.cache.get(channelsArray[i]).type){
      case 'voice':
      response+="";
      break;
      case 'category':
      response+=`<li>${channels.cache.get(channelsArray[i]).name}</li>`;
      break;
      default:
      response+=`<li><a href="/channel/${channelsArray[i]}">#${channels.cache.get(channelsArray[i]).name}</a></li>`;
      break;
    }
  }
  response+='</ul></body></html>';
  res.send(response)
});
app.get('/channel/:id',(req,res)=>{
  let response = "";
  let channel = client.channels.cache.get(req.params.id);
  response+=`<!DOCTYPE html><html><head><title>Discord</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><p><a href="javascript:window.history.back()">&lt; Back</a></p>`;
  switch(channel.type){
    case 'text':
      //console.log(Array.from(channel.messages.keys()));
      response+=`<h1>#${channel.name}</h1>`;
      response+=`<div><button onclick="toggleTyping();">Toggle typing</button><span>Typing: <span>${channel.typing}</span></div>`
      response+=`<div><label for="message">Message Text</label><br><textarea id="message" name="message" rows="25" cols="100"></textarea><br><!--
            --><button onclick="sendMsg();">Send</button></div>`;
      response+=`<script>
      const channelId = "${req.params.id}";
const xhr = new XMLHttpRequest();
function sendMsg(){
xhr.open("POST", '/send-client', true);

//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log(this.response);
    }
}
xhr.send(\`id=\${channelId}&msg=\${document.getElementById("message").value}\`);}
function toggleTyping(){
  xhr.open("POST", '/toggle-typing', true);

  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          console.log(this.response);
      }
  }
  xhr.send(\`id=\${channelId}\`);
}</script>`;

    break;
    default:
    response+="This type of channel is not supported.";
    break;
  }
  response+="</body></html>";
  res.send(response)
});
app.get('/messages/:id',(req,res)=>{
  let channel = client.channels.cache.get(req.params.id);
  let response = {};
  channel.messages.fetch({ limit: 20 }).then(msg=>{
    response.size=msg.size;
    response.msgs=[];
    //console.log(msg);
    msgs = Array.from(msg.keys());
    for(let i=0;i<msgs.length;i++){
      response.msgs[i]={id:msgs[i],content:msg.get(msgs[i]).content,user:msg.get(msgs[i]).author.username+"#"+msg.get(msgs[i]).author.discriminator};
      if(msg.get(msgs[i]).embeds!=0){
        response.msgs[i].embeds={type:msg.get(msgs[i]).embeds[0].type,title:msg.get(msgs[i]).embeds[0].title,description:msg.get(msgs[i]).embeds[0].description,url:msg.get(msgs[i]).embeds[0].url,color:msg.get(msgs[i]).embeds[0].color};
      }else{
        response.msgs[i].embeds=false;
      }
      console.log(response.msgs[i]);
    }
    console.log(response);
    res.json(response);
  });
});
/*app.get('/messages/:id',(req,res)=>{
  let channel = client.channels.get(req.params.id);
  console.log(Array.from(channel.messages.keys()));
  res.send(Array.from(channel.messages.keys()));
});*/
app.post('/send-client',(req,res)=>{
  let response = {};
  let channel = client.channels.cache.get(req.body.id);
  if(channel.type!="text"){
    console.log("not text channel");
    response["error"] = "not-text-channel";
    res.status(400);
  }else{
    channel.send(req.body.msg);
    response["success"] = "true";
    response["content"] = req.body.msg;
    res.status(200);
  }
  res.json(response);
});
app.post('/toggle-typing',(req,res)=>{
  let response={};
  let channel = client.channels.cache.get(req.body.id);
  if(channel.type!="text"){
    console.log("not text channel");
    response["error"] = "not-text-channel";
    res.status(400);
  }else{
    if(channel.typing){
      channel.stopTyping(true);
      response["success"] = "true";
      response["action"] = "stop-typing";
      response["force"] = "true";
    }else{
      channel.startTyping();
      response["success"] = "true";
      response["action"] = "start-typing";
    }
  }
  res.json(response);
});
if(process.env.APIENABLED){app.listen(port, () => console.log(`WBCP listening on port ${port}!`));}
