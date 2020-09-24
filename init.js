const fs = require('fs');
const regex = RegExp('[MN][A-Za-z\\d]{23}\\.[\\w-]{6}\\.[\\w-]{27}','g');

try {
  if (fs.existsSync('./.env')){
    console.log(".env already exists! run node bot.js to get started!");
    return;
  }else{
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log(".env does not exist yet. This file (.env) is required for the bot to work properly, as it provides the configuration for the bot.\n");
    readline.question('Enter Discord bot token:\n> ', ans => {
      console.log(`Bot token: ${ans}`);
      if(regex.test(ans)){
        console.log(`Token seems valid, creating .env`);
        const data=`CLIENT_TOKEN=${ans}\nDISCORD_TOKEN=${ans}\nRORG=\nPREFIX=!\nPORT=\nAPIAUTH=\nAPIENABLED=\nHWENABLED=`;
        fs.writeFile("./.env",data,function(e){if(e){return console.error(e)}});
        console.log("Done! You can now run node simple-bot.js to start the bot.");
      }else{
        console.log("Bot token invalid! Please run this script again.");
      }
      readline.close();
    });
  }
} catch(e){
  console.error(e);
}
