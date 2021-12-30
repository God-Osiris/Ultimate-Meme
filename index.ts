import DiscordJS, { Guild, GuildEmoji, Intents } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const prefix = 'm?'

let memeChannel = fs.readFileSync('mc.txt').toString();
let startFromThisID = fs.readFileSync('startid.txt').toString();
let emoji = fs.readFileSync('emoji.txt').toString();

function setValue(x){
    memeChannel = x;
    fs.writeFileSync('mc.txt', x);
}

function setStartID(y){
    startFromThisID = y;
    fs.writeFileSync('startid.txt', y);
}

function setEmoji(z){
    emoji = z;
    fs.writeFileSync('emoji.txt', z)
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
    client.user?.setActivity(`your memes!`, {type: 'WATCHING'});
})

client.on('messageCreate', async (message) => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();

    if(command === 'setemoji' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !message.author.bot){
        if(!args[0]){
            message.channel.send('Invalid Syntax! Please use `m?setemoji anyEmojiHere`!')
        } else if(args[0]){
            setEmoji(args[0])
            message.channel.send(`Reaction emoji set to: ${emoji}`)
        }
    } else if(command === 'setemoji' && !message.member?.permissions.has('MANAGE_MESSAGES', false) && !message.author.bot){
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }

    if(command === 'emoji' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !message.author.bot){
        if(args[0]){
            message.channel.send('Invalid Syntax! Use `m?emoji` to check current reaction emoji!')
        } else if(!args[0]){
            message.channel.send(`Current emoji is: ${emoji}`)
        }
    } else if(command === 'emoji' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !message.author.bot){
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }

    if(message.channelId.toString() === memeChannel && !message.author.bot){
        if(message.attachments.size > 0){
            message.react(emoji);
        } else if(!message.member?.permissions.has('MANAGE_MESSAGES')){
            message.author.send('Your meme does not contain an attachment so it was deleted. Please do not send text messages or link embeds in the channel, only attachments work.')
            message.delete()
        }
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if(command === 'ping' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0]){
        message.reply('Calculating latency...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            resultMessage.edit(`Bot latency: ${ping}ms\nAPI Latency: ${client.ws.ping}ms`)
        })
    } else if(command === 'ping' && !message.member?.permissions.has('MANAGE_MESSAGES', true)){
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }

    if(command === 'setmc' && message.member?.permissions.has('MANAGE_MESSAGES', true)){
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
    } else if(command === 'setmc' && !message.member?.permissions.has('MANAGE_MESSAGES', true)){
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }

    if(command === 'start' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() === memeChannel){
        
        const latestmsg = await message.channel.send('Started! All memes under this message are tallied till an admin runs `m?stop` !');
        setStartID(latestmsg.id.toString());
    } else if(command === 'start' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() === memeChannel){
        message.channel.send('Insufficient permissions, `Manage Messages` required!')
    } else if(command === 'start' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() !== memeChannel){
        message.channel.send(`Cannot start here because meme channel is set to <#${memeChannel}>. Please use m?setmc <channel> to set-up a new meme channel!`)
    } else if(command === 'start' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() !== memeChannel){
        message.channel.send('Insufficient permissions, `Manage Messages` required!')
    }

    if(command === 'stop' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() === memeChannel){

        const msgArr = await message.channel.messages.fetch({ limit: 100, after: startFromThisID})
        const reactionsArr = [];
        // @ts-ignore
        const emojiID = emoji.match(/(\d+)/)[0];
        for(let [key, msg] of msgArr) {
            if(msg.reactions.cache.get(emojiID)){
                // @ts-ignore
                reactionsArr.push((msg.reactions.cache.get(emojiID).count));
                
            }
        }
        if(reactionsArr.length !== 0){
            let winner = Math.max(...reactionsArr);
            const winnerArr = [];
            let winningMeme;
            for(let [winnerKey, winnerMsg] of msgArr){
                if(winnerMsg.reactions.cache.get(emojiID)){
                    // @ts-ignore
                    if(winnerMsg.reactions.cache.get(emojiID).count === winner){
                        // @ts-ignore
                        winnerArr.push(winnerMsg.author.id);
                        winningMeme = winnerMsg.attachments.first()?.url;
                    }
                }
            }
            if(winnerArr.length === 1){
                message.channel.send(`The highest scoring meme of this week is from <@${winnerArr}>... scoring ${winner}${emoji}. Please DM <@831342804457357354> to claim your 25$ steam giftcard!\n${winningMeme}`);
            } else if(winnerArr.length > 1){
                message.channel.send(`The highest scoring memes of this week are from ${winnerArr.map(u => `<@${u}>`)}... scoring ${winner}${emoji} each! It's a tie admins, what you gonna do about it?`);
            }

        } else if(reactionsArr.length === 0){
            message.channel.send('There were no memes to tally!')
        }
    } else if(command === 'stop' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() === memeChannel){
        message.channel.send('Insufficient permissions, `Manage Messages` required!')
    } else if(command === 'stop' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() !== memeChannel){
        message.channel.send(`Cannot stop here because meme channel is set to <#${memeChannel}>.`)
    } else if(command === 'stop' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0] && message.channelId.toString() !== memeChannel){
        message.channel.send('Insufficient permissions, `Manage Messages` required!')
    }

    if(command === 'help' && message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0]){
        message.channel.send('The prefix is m?.\n`m?ping`: Returns bot latency and Discord.js API latency.\n`m?help`: Shows this message.\n`m?emoji`: Shows currently set reaction emoji.\n`m?setemoji emoji`: Sets the reaction emoji.\n`m?setmc #channel`: Sets the meme channel.\n`m?start`: Any meme under this message will be reacted automatically and will be in the final tally.\n`m?stop`: Tallies the reaction count of all memes and announces the winner.')
    } else if(command === 'help' && !message.member?.permissions.has('MANAGE_MESSAGES', true) && !args[0]){
        message.channel.send('Insufficient permissions, `Manage Messages` required!')
    }
    
})

client.login(process.env.TOKEN);