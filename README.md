# pcap_bot
Bot to capture player connection/disconnection event in valheim dedicated server

<br>

## Requirements
- PCAP
- [Steam web api key](https://steamcommunity.com/dev/apikey)
- Node JS v14 or above
- [Jobe bot](https://github.com/ShikyoKira/jobe_bot) (for tracking player online status)

<br>

## Steps for linux

### Without Node JS installed

1. Updating the package repository 
```
sudo apt update
```

2. Install Node JS
```
sudo apt install nodejs
```

3. Install Node Package Manager
```
sudo apt install npm
``` 

<br>
<br>

### Normal Installation

4. Clone this repo
```
git clone https://github.com/ShikyoKira/pcap_bot.git
```

5. Go to jobe_bot directory
```
cd jobe_bot
```

6. Install Discord JS
```
npm install discord.js
```

7. Install PM2 Product Process Manager (For server). Skip this step if you have done it
```
sudo npm i -g pm2
```

8. Edit pcap.js by adding your [private ip](http://www.whatismyip.com) and bot token generated from discord
```
vi index.js
```
```
const privateip = '<PRIVATE IP>';           <---- CHANGE THIS TO YOUR PRIVATE IP
const steamkey = '<STEAM_WEB_API_KEY>';     <---- CHANGE THIS TO THE API KEY YOU GET FROM STEAM
const jobebotpath = '<PATH_TO_JOBE_BOT>';   <---- CHANGE THIS TO THE PATH TO JOBE BOT

const pcap = require("pcap");
```

9. Press ESC and type `:wq!` to save and quit

<br>

## Operations

- To start the bot

```
pm2 start pcap.js
```

<br>

- To stop the bot

```
pm2 stop pcap.js
```

<br>

- To restart the bot

```
pm2 restart pcap.js
```

<br>

- To check the logs

```
pm2 logs
```
