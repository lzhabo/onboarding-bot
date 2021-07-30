import * as TelegramBot from "node-telegram-bot-api";
import watcherService from "./services/watcherService";
import { getDuckName } from "./utils";
import * as commitCount from "git-commit-count";
import axios from "axios";
import * as Twit from "twit";
import {
  ducksSalesWeeklyInTotal,
  getCurrentWavesRate,
  lastDuckPriceForHatching,
  lastPriceForEgg,
  numberOfDucksHatchedInTotalToday,
  topDuck,
  totalNumberOfDucks,
} from "./services/dataService";

require("dotenv").config();

const telegram = new TelegramBot(process.env.TOKEN, { polling: true });

const twitter = new Twit({
  consumer_key: "kjzrtE8Wl5Q4yiR9AOgRYsBda",
  consumer_secret: "Lrzc2iLzc2G8XXMldwNXe0NScCBWqjtrhiqrQTtty8wFGnVu7R",
  access_token: "1411844553351467008-DoA7Icg0ohPc15mKWRGR545FJFM3mc",
  access_token_secret: "AoBwxMaiTPt0GDuthAz3zuJLimK6SHUJQlzACQllwib1k",
});

telegram.onText(/\/start/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, "I`m alive");
});
telegram.onText(/\/id/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, String(id));
});
telegram.onText(/\/rate/, async ({ chat: { id } }) => {
  const rate = await getCurrentWavesRate();
  await telegram.sendMessage(id, rate);
});
telegram.onText(/\/version/, async ({ chat: { id } }) => {
  await telegram.sendMessage(id, commitCount("chlenc/big-black-duck-bot/"));
});

telegram.onText(/\/analytics/, async ({ chat: { id } }) => {
  const data: any = (
    await Promise.all(
      Object.entries({
        lastPriceForEgg: lastPriceForEgg(),
        lastDuckPriceForHatching: lastDuckPriceForHatching(),
        totalNumberOfDucks: totalNumberOfDucks(),
        numberOfDucksHatchedInTotalToday: numberOfDucksHatchedInTotalToday(),
        topDuck: topDuck(),
        ducksSalesWeeklyInTotal: ducksSalesWeeklyInTotal(),
      }).map(
        ([key, promise]) =>
          new Promise(async (r) => {
            const result = await promise;
            return r({ key, result });
          })
      )
    )
  ).reduce((acc, { key, result }) => {
    //{ ...acc, [key]: result }
    acc[key] = result;
    return acc;
  }, {} as Record<string, any>);
  const msg = `Last price for EGG: ${data.lastPriceForEgg} USDN
  
Last duck price for hatching: ${data.lastDuckPriceForHatching} EGG

Total number of ducks: ${data.totalNumberOfDucks}

Number of ducks hatched in total / today: ${
    data.numberOfDucksHatchedInTotalToday.total
  } / ${data.numberOfDucksHatchedInTotalToday.today}
  
Ducks sales weekly / in total: $${
    data.ducksSalesWeeklyInTotal.lastWeekSales
  } (${data.ducksSalesWeeklyInTotal.lessZero ? "⬇️" : "⬆️"}️${
    data.ducksSalesWeeklyInTotal.difference
  }%) / $${data.ducksSalesWeeklyInTotal.totalSales}
  
Top Duck ${data.topDuck.duckRealName} sold for ${data.topDuck.amount} Waves (${
    data.topDuck.inDollar
  }$) 
https://wavesducks.com/duck/${data.topDuck.NFT}`;
  await telegram.sendMessage(id, msg);
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sendChanelMessage = async (id: string, msg: string) => {
  try {
    await telegram.sendMessage(id, msg);
    await sleep(2000);
  } catch (e) {
    console.log(`❌ failed to send message to the group ${id}`);
  }
};

const decimals = 1e8;

(async () => {
  setInterval(async () => {
    const data = await watcherService.getUnsentData();
    const rate = await getCurrentWavesRate();
    const { data: dict } = await axios.get(
      "https://wavesducks.com/api/v1/duck-names"
    );
    for (let i = 0; i < data.length; i++) {
      const duck = data[i];

      const name = getDuckName(duck.duckName, dict);
      const wavesAmount = duck.amount / decimals;
      const usdAmount = (wavesAmount * rate).toFixed(2);
      let duckNumber = "-";
      let duckCacheId = "";
      try {
        const obj = {
          "69j44Y5MPCfBySvNSMRMRrEJ3HnoY2Bsr3zm2VqJCjuJ": {
            a: [],
            n: 12459,
          },
        };
        const { data: numberRawData } = await axios.get(
          `https://wavesducks.com/api/v0/achievements?ids=${duck.NFT}`
        );
        const {
          data: { cacheId },
        } = await axios.get(
          `https://wavesducks.com/api/v1/preview/preload/duck/${duck.NFT}`
        );
        duckCacheId = cacheId;
        duckNumber =
          numberRawData[duck.NFT].n != null ? numberRawData[duck.NFT].n : "-";
      } catch (e) {}
      if (wavesAmount < 1000 / rate) continue;
      const link = `https://wavesducks.com/duck/${duck.NFT}?cacheId=${duckCacheId}`;

      const ruMsg = `Утка ${name} (#${duckNumber}) была приобретена за ${wavesAmount} Waves ($${usdAmount} USD) \n\n${link}`;
      const enMsg = `Duck ${name} (#${duckNumber}) was purchased for ${wavesAmount} Waves ($${usdAmount} USD) \n\n${link}`;
      const twitterMsg = `Duck ${name} (#${duckNumber}) was purchased for ${wavesAmount} Waves ($${usdAmount} USD) \n#WavesDucks #NFT\n\n${link}`;

      await sendChanelMessage(process.env.RU_GROUP_ID, ruMsg);
      await sendChanelMessage(process.env.EN_GROUP_ID, enMsg);
      await sendChanelMessage(process.env.ES_GROUP_ID, enMsg);
      await sendChanelMessage(process.env.AR_GROUP_ID, enMsg);

      const twitterErr = await new Promise((r) =>
        twitter.post("statuses/update", { status: twitterMsg }, (err) => r(err))
      );
      if (twitterErr) {
        console.log(twitterErr);
      }
      await sleep(1000);
    }
  }, 60 * 1000);
})();

process.stdout.write("Bot has been started ✅ ");
