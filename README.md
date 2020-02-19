# ctangpedia-wwbot
Discord Werewolf Bot source code

## What this bot does
- Distribute roles with a simple command
- Remove everyone's (except admins' and MC's) permission to view wolf discussion channel and remove "Dead" roles
- Allow "Dead" players to view role list
- Assist Ad Bot

## System requirements
- Memory: 128MB should be more than enough
- Storage: around 128MB; if you don't need audio, you can remove the related commands and remove the packages `ffmpeg-binaries` and `ffmpeg-static`.

## Run the bot yourself
1. Create a Discord bot, add your bot to a server and get the bot token. You can follow [this tutorial](https://anidiots.guide/getting-started/getting-started-long-version)
2. Download node.js, if you haven't :facepalm: (google it if you don't know how to)
3. Download this repo (https://github.com/ctangpedia/wwbot)
4. Navigate to the folder you downloaded this repo to and run `npm install`
5. Rename .env.example to .env and fill in the details. You can put down random nonsense in `RORG` as it's unused when this documentation is written
6. `node bot.js`

## Control Panel
The bot comes with a web-based control panel accessible locally. You can disable it in .env with `APIENABLED=`.
