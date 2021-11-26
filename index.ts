import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const prefix = 'm?'

let memeChannel = fs.readFileSync('mc.txt').toString();
let startFromThisID = fs.readFileSync('startid.txt').toString();

function setValue(x){
    memeChannel = x;
    fs.writeFileSync('mc.txt', x);
}

function setStartID(y){
    startFromThisID = y;
    fs.writeFileSync('startid.txt', y);
}


const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.on('ready', () => {
    console.log('Ultimate MemeBOT is online!');
})

client.on('messageCreate', async (message) => {

    if(message.channelId.toString() === memeChannel && !message.author.bot && message.attachments.size > 0){
        message.react('💀')
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();

    if(command === 'ping' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0]){
    message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    } else if(command === 'ping' && !message.member?.permissions.has('MANAGE_MESSAGES', true)){
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }

    if(command === 'setmc' && message.member?.permissions.has('MANAGE_CHANNELS', true)){
        if(!message.mentions.channels.first() || !args[0]){
            message.channel.send('Please mention a channel!')
        }else if(args[0] !== message.mentions.channels.first()?.toString()){
            message.channel.send('Please enter valid syntax!')
        }else if(message.mentions.channels.first()?.id === memeChannel){
            message.channel.send('This has already been set!')
        }else if(args[0] === message.mentions.channels.first()?.toString()){
            setValue(message.mentions.channels.first()?.id);
            message.channel.send(`Successfully set meme channel to <#${memeChannel}>`)
        }
    } else if(command === 'setmc' && !message.member?.permissions.has('MANAGE_CHANNELS', true)){
        message.channel.send('Insufficient permissions, `Manage Channels` required!');
    }

    if(command === 'start' && message.member?.permissions.has('MANAGE_CHANNELS', true) && !args[0] && message.channelId.toString() === memeChannel){
        
        const latestmsg = await message.channel.send('Started! All memes under this message are tallied till an admin runs `m?stop` !');
        setStartID(latestmsg.id.toString());
    } else if(command === 'start' && !message.member?.permissions.has('MANAGE_CHANNELS', true) && !args[0] && message.channelId.toString() === memeChannel){
        message.channel.send('Insufficient permissions, `Manage Channels` required!')
    } else if(command === 'start' && message.member?.permissions.has('MANAGE_CHANNELS', true) && !args[0] && message.channelId.toString() !== memeChannel){
        message.channel.send(`Cannot start here because meme channel is set to <#${memeChannel}>. Please use m?setmc <channel> to set-up a new meme channel!`)
    }

    if(command === 'stop' && message.member?.permissions.has('MANAGE_CHANNELS', true) && !args[0] && message.channelId.toString() === memeChannel){
        
        const reactionsArr = []
        const msgArr = await message.channel.messages.fetch({ limit: 100, after: startFromThisID})
        for(let [key, msg] of msgArr) {
            if(msg.reactions.cache.get('💀')){
                // @ts-ignore
                reactionsArr.push((msg.reactions.cache.get('💀').count) - 1);
            }
        }
        if(reactionsArr.length !== 0){
            let winner = Math.max(...reactionsArr);
            const winnerArr = [];
            for(let [winnerKey, winnerMsg] of msgArr){
                if(winnerMsg.reactions.cache.get('💀')){
                    // @ts-ignore
                    if(winnerMsg.reactions.cache.get('💀').count === winner){
                        // @ts-ignore
                        winnerArr.push(winnerMsg.author.username);
                    }
                }
            }
            if(winnerArr.length === 1){
                message.channel.send(`The highest scoring meme of this week is from ${winnerArr}... scoring ${winner} votes!`);
            } else if(winnerArr.length > 1){
                message.channel.send(`The highest scoring memes of this week are from ${winnerArr}... scoring ${winner} votes each!`);
            }

        } else if(reactionsArr.length === 0){
            message.channel.send('There were no memes to tally!')
        }
    } else if(command === 'stop' && !message.member?.permissions.has('MANAGE_CHANNELS', true) && !args[0] && message.channelId.toString() === memeChannel){
        message.channel.send('Insufficient permissions, `Manage Channels` required!')
    }
    
})

client.login(process.env.TOKEN);