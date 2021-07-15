import * as TelegramBot from "node-telegram-bot-api";
import watcherService from "./services/watcherService";
import { getDuckName } from "./utils";
import * as commitCount from "git-commit-count";
import axios from "axios";

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
telegram.onText(/\/version/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, commitCount("chlenc/big-black-duck-bot/"));
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const decimals = 1e8;

(async () => {
  setInterval(async () => {
    const data = await watcherService.getUnsentData();
    const rate = await watcherService.getCurrentWavesRate();
    const { data: dict } = await axios.get(
      "https://wavesducks.com/api/v1/duck-names"
    );
    for (let i = 0; i < data.length; i++) {
      const duck = data[i];

      const name = getDuckName(duck.duckName, dict);
      const wavesAmount = duck.amount / decimals;
      const usdAmount = (wavesAmount * rate).toFixed(2);
      if (wavesAmount < 30) continue;
      const link = `https://wavesducks.com/duck/${duck.NFT}`;
      await telegram
        .sendMessage(
          process.env.EN_GROUP_ID,
          `Duck ${name} was purchased for ${wavesAmount} Waves ($${usdAmount} USD) \n\n${link}`
        )
        .catch();
      await sleep(1000);
      await telegram
        .sendMessage(
          process.env.ES_GROUP_ID,
          `Duck ${name} was purchased for ${wavesAmount} Waves ($${usdAmount} USD) \n\n${link}`
        )
        .catch();
      await sleep(1000);
      await telegram
        .sendMessage(
          process.env.RU_GROUP_ID,
          `Утка ${name} была приобретена за ${wavesAmount} Waves ($${usdAmount} USD) \n\n${link}`
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
