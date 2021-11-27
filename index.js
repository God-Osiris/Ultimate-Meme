"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const prefix = 'm?';
let memeChannel = fs_1.default.readFileSync('mc.txt').toString();
let startFromThisID = fs_1.default.readFileSync('startid.txt').toString();
let emoji = fs_1.default.readFileSync('emoji.txt').toString();
function setValue(x) {
    memeChannel = x;
    fs_1.default.writeFileSync('mc.txt', x);
}
function setStartID(y) {
    startFromThisID = y;
    fs_1.default.writeFileSync('startid.txt', y);
}
function setEmoji(z) {
    emoji = z;
    fs_1.default.writeFileSync('emoji.txt', z);
}
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});
client.on('ready', () => {
    var _a;
    console.log('Ultimate MemeBOT is online!');
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`your memes!`, { type: 'WATCHING' });
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === 'setemoji' && ((_b = message.member) === null || _b === void 0 ? void 0 : _b.permissions.has('MANAGE_MESSAGES', true)) && !message.author.bot) {
        if (!args[0]) {
            message.channel.send('Invalid Syntax! Please use `m?setemoji anyEmojiHere`!');
        }
        else if (args[0]) {
            setEmoji(args[0]);
            message.channel.send(`Reaction emoji set to: ${emoji}`);
        }
    }
    else if (command === 'setemoji' && !((_c = message.member) === null || _c === void 0 ? void 0 : _c.permissions.has('MANAGE_MESSAGES', false)) && !message.author.bot) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'emoji' && ((_d = message.member) === null || _d === void 0 ? void 0 : _d.permissions.has('MANAGE_MESSAGES', true)) && !message.author.bot) {
        if (args[0]) {
            message.channel.send('Invalid Syntax! Use `m?emoji` to check current reaction emoji!');
        }
        else if (!args[0]) {
            message.channel.send(`Current emoji is: ${emoji}`);
        }
    }
    else if (command === 'emoji' && !((_e = message.member) === null || _e === void 0 ? void 0 : _e.permissions.has('MANAGE_MESSAGES', true)) && !message.author.bot) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (message.channelId.toString() === memeChannel && !message.author.bot && message.attachments.size > 0) {
        message.react(emoji);
    }
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    if (command === 'ping' && ((_f = message.member) === null || _f === void 0 ? void 0 : _f.permissions.has('MANAGE_MESSAGES', true)) && !args[0]) {
        message.reply('Calculating latency...').then(resultMessage => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp;
            resultMessage.edit(`Bot latency: ${ping}ms\nAPI Latency: ${client.ws.ping}ms`);
        });
    }
    else if (command === 'ping' && !((_g = message.member) === null || _g === void 0 ? void 0 : _g.permissions.has('MANAGE_MESSAGES', true))) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'setmc' && ((_h = message.member) === null || _h === void 0 ? void 0 : _h.permissions.has('MANAGE_MESSAGES', true))) {
        if (!message.mentions.channels.first() || !args[0]) {
            message.channel.send('Please mention a channel!');
        }
        else if (args[0] !== ((_j = message.mentions.channels.first()) === null || _j === void 0 ? void 0 : _j.toString())) {
            message.channel.send('Please enter valid syntax!');
        }
        else if (((_k = message.mentions.channels.first()) === null || _k === void 0 ? void 0 : _k.id) === memeChannel) {
            message.channel.send('This has already been set!');
        }
        else if (args[0] === ((_l = message.mentions.channels.first()) === null || _l === void 0 ? void 0 : _l.toString())) {
            setValue((_m = message.mentions.channels.first()) === null || _m === void 0 ? void 0 : _m.id);
            message.channel.send(`Successfully set meme channel to <#${memeChannel}>`);
        }
    }
    else if (command === 'setmc' && !((_o = message.member) === null || _o === void 0 ? void 0 : _o.permissions.has('MANAGE_MESSAGES', true))) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'start' && ((_p = message.member) === null || _p === void 0 ? void 0 : _p.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        const latestmsg = yield message.channel.send('Started! All memes under this message are tallied till an admin runs `m?stop` !');
        setStartID(latestmsg.id.toString());
    }
    else if (command === 'start' && !((_q = message.member) === null || _q === void 0 ? void 0 : _q.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    else if (command === 'start' && ((_r = message.member) === null || _r === void 0 ? void 0 : _r.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() !== memeChannel) {
        message.channel.send(`Cannot start here because meme channel is set to <#${memeChannel}>. Please use m?setmc <channel> to set-up a new meme channel!`);
    }
    else if (command === 'start' && !((_s = message.member) === null || _s === void 0 ? void 0 : _s.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() !== memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'stop' && ((_t = message.member) === null || _t === void 0 ? void 0 : _t.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        const msgArr = yield message.channel.messages.fetch({ limit: 100, after: startFromThisID });
        const reactionsArr = [];
        // @ts-ignore
        const emojiID = emoji.match(/(\d+)/)[0];
        for (let [key, msg] of msgArr) {
            if (msg.reactions.cache.get(emojiID)) {
                // @ts-ignore
                reactionsArr.push((msg.reactions.cache.get(emojiID).count));
            }
        }
        if (reactionsArr.length !== 0) {
            let winner = Math.max(...reactionsArr);
            const winnerArr = [];
            for (let [winnerKey, winnerMsg] of msgArr) {
                if (winnerMsg.reactions.cache.get(emojiID)) {
                    // @ts-ignore
                    if (winnerMsg.reactions.cache.get(emojiID).count === winner) {
                        // @ts-ignore
                        winnerArr.push(winnerMsg.author.username);
                    }
                }
            }
            if (winnerArr.length === 1) {
                message.channel.send(`The highest scoring meme of this week is from ${winnerArr}... scoring ${winner}${emoji}!`);
            }
            else if (winnerArr.length > 1) {
                message.channel.send(`The highest scoring memes of this week are from ${winnerArr}... scoring ${winner}${emoji} each!`);
            }
        }
        else if (reactionsArr.length === 0) {
            message.channel.send('There were no memes to tally!');
        }
    }
    else if (command === 'stop' && !((_u = message.member) === null || _u === void 0 ? void 0 : _u.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    else if (command === 'stop' && ((_v = message.member) === null || _v === void 0 ? void 0 : _v.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() !== memeChannel) {
        message.channel.send(`Cannot stop here because meme channel is set to <#${memeChannel}>.`);
    }
    else if (command === 'stop' && !((_w = message.member) === null || _w === void 0 ? void 0 : _w.permissions.has('MANAGE_MESSAGES', true)) && !args[0] && message.channelId.toString() !== memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'help' && ((_x = message.member) === null || _x === void 0 ? void 0 : _x.permissions.has('MANAGE_MESSAGES', true)) && !args[0]) {
        message.channel.send('The prefix is m?.\n`m?ping`: Returns bot latency and Discord.js API latency.\n`m?help`: Shows this message.\n`m?emoji`: Shows currently set reaction emoji.\n`m?setemoji emoji`: Sets the reaction emoji.\n`m?setmc #channel`: Sets the meme channel.\n`m?start`: Any meme under this message will be reacted automatically and will be in the final tally.\n`m?stop`: Tallies the reaction count of all memes and announces the winner.');
    }
    else if (command === 'help' && !((_y = message.member) === null || _y === void 0 ? void 0 : _y.permissions.has('MANAGE_MESSAGES', true)) && !args[0]) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
}));
client.login(process.env.TOKEN);
