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
function setValue(x) {
    memeChannel = x;
    fs_1.default.writeFileSync('mc.txt', x);
}
function setStartID(y) {
    startFromThisID = y;
    fs_1.default.writeFileSync('startid.txt', y);
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
    console.log('Ultimate MemeBOT is online!');
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (message.channelId.toString() === memeChannel && !message.author.bot && message.attachments.size > 0) {
        message.react('💀');
    }
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === 'ping' && ((_b = message.member) === null || _b === void 0 ? void 0 : _b.permissions.has('MANAGE_MESSAGES', true)) && !args[0]) {
        message.reply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
    else if (command === 'ping' && !((_c = message.member) === null || _c === void 0 ? void 0 : _c.permissions.has('MANAGE_MESSAGES', true))) {
        message.channel.send('Insufficient permissions, `Manage Messages` required!');
    }
    if (command === 'setmc' && ((_d = message.member) === null || _d === void 0 ? void 0 : _d.permissions.has('MANAGE_CHANNELS', true))) {
        if (!message.mentions.channels.first() || !args[0]) {
            message.channel.send('Please mention a channel!');
        }
        else if (args[0] !== ((_e = message.mentions.channels.first()) === null || _e === void 0 ? void 0 : _e.toString())) {
            message.channel.send('Please enter valid syntax!');
        }
        else if (((_f = message.mentions.channels.first()) === null || _f === void 0 ? void 0 : _f.id) === memeChannel) {
            message.channel.send('This has already been set!');
        }
        else if (args[0] === ((_g = message.mentions.channels.first()) === null || _g === void 0 ? void 0 : _g.toString())) {
            setValue((_h = message.mentions.channels.first()) === null || _h === void 0 ? void 0 : _h.id);
            message.channel.send(`Successfully set meme channel to <#${memeChannel}>`);
        }
    }
    else if (command === 'setmc' && !((_j = message.member) === null || _j === void 0 ? void 0 : _j.permissions.has('MANAGE_CHANNELS', true))) {
        message.channel.send('Insufficient permissions, `Manage Channels` required!');
    }
    if (command === 'start' && ((_k = message.member) === null || _k === void 0 ? void 0 : _k.permissions.has('MANAGE_CHANNELS', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        const latestmsg = yield message.channel.send('Started! All memes under this message are tallied till an admin runs `m?stop` !');
        setStartID(latestmsg.id.toString());
    }
    else if (command === 'start' && !((_l = message.member) === null || _l === void 0 ? void 0 : _l.permissions.has('MANAGE_CHANNELS', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Channels` required!');
    }
    else if (command === 'start' && ((_m = message.member) === null || _m === void 0 ? void 0 : _m.permissions.has('MANAGE_CHANNELS', true)) && !args[0] && message.channelId.toString() !== memeChannel) {
        message.channel.send(`Cannot start here because meme channel is set to <#${memeChannel}>. Please use m?setmc <channel> to set-up a new meme channel!`);
    }
    if (command === 'stop' && ((_o = message.member) === null || _o === void 0 ? void 0 : _o.permissions.has('MANAGE_CHANNELS', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        const reactionsArr = [];
        const msgArr = yield message.channel.messages.fetch({ limit: 100, after: startFromThisID });
        for (let [key, msg] of msgArr) {
            if (msg.reactions.cache.get('💀')) {
                // @ts-ignore
                reactionsArr.push((msg.reactions.cache.get('💀').count) - 1);
            }
        }
        if (reactionsArr.length !== 0) {
            let winner = Math.max(...reactionsArr);
            const winnerArr = [];
            for (let [winnerKey, winnerMsg] of msgArr) {
                if (winnerMsg.reactions.cache.get('💀')) {
                    // @ts-ignore
                    if (winnerMsg.reactions.cache.get('💀').count === winner) {
                        // @ts-ignore
                        winnerArr.push(winnerMsg.author.username);
                    }
                }
            }
            if (winnerArr.length === 1) {
                message.channel.send(`The highest scoring meme of this week is from ${winnerArr}... scoring ${winner} votes!`);
            }
            else if (winnerArr.length > 1) {
                message.channel.send(`The highest scoring memes of this week are from ${winnerArr}... scoring ${winner} votes each!`);
            }
        }
        else if (reactionsArr.length === 0) {
            message.channel.send('There were no memes to tally!');
        }
    }
    else if (command === 'stop' && !((_p = message.member) === null || _p === void 0 ? void 0 : _p.permissions.has('MANAGE_CHANNELS', true)) && !args[0] && message.channelId.toString() === memeChannel) {
        message.channel.send('Insufficient permissions, `Manage Channels` required!');
    }
}));
client.login(process.env.TOKEN);
