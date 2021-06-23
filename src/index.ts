import * as TelegramBot from "node-telegram-bot-api";
import watcherService from "./services/watcherService";
import { getDuckName } from "./utils";
// import * as Twitter from "twitter";

require("dotenv").config();

const telegram = new TelegramBot(process.env.TOKEN, { polling: true });

// const twitter = new Twitter({
//   consumer_key: process.env.CONSUMER_KEY,
//   consumer_secret: process.env.CONSUMER_SECRET,
//   access_token_key: process.env.ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.ACCESS_TOKEN_SECRET,
// });

telegram.onText(/\/start/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, "I`m alive");
});
telegram.onText(/\/id/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, String(id));
});
telegram.onText(/\/rate/, async ({ chat: { id } }) => {
  const rate = await watcherService.getCurrentWavesRate();
  await telegram.sendMessage(id, rate);
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const decimals = 1e8;

(async () => {
  setInterval(async () => {
    const data = await watcherService.getUnsentData();
    const rate = await watcherService.getCurrentWavesRate();

    for (let i = 0; i < data.length; i++) {
      const duck = data[i];

      await telegram
        .sendMessage(
          process.env.GROUP_ID,
          `Duck ${getDuckName(duck.duckName)} was purchased for ${
            duck.amount / decimals
          } Waves ($${((duck.amount / decimals) * rate).toFixed(
            2
          )} USD) \n\nhttps://wavesducks.com/duck/${duck.NFT}`
        )
        .catch();

      // twitter.post(
      //   "statuses/update",
      //   { status: `hello` },
      //   function (error, tweet, response) {
      //     if (!error) {
      //       console.log(tweet);
      //     }
      //   }
      // );

      await sleep(1000);
    }
  }, 30 * 1000);
})();

process.stdout.write("Bot has been started ✅ ");
