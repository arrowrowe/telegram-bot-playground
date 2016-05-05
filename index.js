/******************************************************************************
 * Initialize Express
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/******************************************************************************
 * Custom initializations
 */
const request = require('request');

const tbConfig = require('./.tb-config.js');
const log = require('./log.js');

/******************************************************************************
 * Routes
 */
app.post('/api/v1/from-outgoing', (req, res) => {
  const body = req.body;
  const token = body.token;
  const hook = tbConfig.hooks[token];
  const messagePrefix = `Token "$${token}"`;

  const endWith = (message, extra) => {
    if (extra) {
      log.trace(messagePrefix, message, extra);
      extra.message = message;
    } else {
      log.trace(messagePrefix, message);
      extra = Object.create({});
    }
    res.json(extra);
  };

  if (!hook || hook.disabled || ('enabled' in hook && !hook.enabled)) {
    endWith('disbaled or not configured');
    return;
  }

  const bot = hook.bot;
  if (!bot) {
    endWith('has no bot');
    return;
  }

  log.info('calling telegram...');
  request.post(
    {
      url: `https://api.telegram.org/bot${bot.token}/sendMessage`,
      form: {
        chat_id: bot.chatId,
        text: body.text
      },
      json: true
    },
    (err, telegramRes, telegramResBody) => {
      if (err) {
        endWith('got an error', {err, telegramRes, telegramResBody});
        return;
      }
      endWith('got success', {raw: JSON.stringify(telegramResBody)})
    }
  );
});

/******************************************************************************
 * Launch
 */
const server = app.listen(tbConfig.server.port, function () {
  const address = server.address();
  log.trace(`TB listening at http://${address.address}:${address.port}`);
});
