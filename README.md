# Telegram Bot Playground

> Just a toy bot.

## Install

```
$ git clone https://github.com/arrowrowe/telegram-bot-playground.git && cd telegram-bot-playground
$ npm install
```

## Configuration and Launch

```
$ cp .tb-config.js.example .tb-config.js
```

Now edit `.tb-config.js` as you like.

To launch the app, run `node index.js`, or call [PM2](http://pm2.keymetrics.io/) with `pm2 start index.js --name 'a-pretty-name-you-like'`.

## Usage

Any POST to `//<your-domain>:<port>/api/v1/from-outgoing` (with `token` and `text`),
triggers a `sendMessage` action of a bot to a chat, as you've configured.
