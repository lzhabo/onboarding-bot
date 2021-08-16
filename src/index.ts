import * as TelegramBot from "node-telegram-bot-api";
import { BUTTONS, messages } from "./library";

require("dotenv").config();

const telegram = new TelegramBot(process.env.TOKEN, { polling: true });
const parse_mode = "Markdown";
telegram.on("message", async (msg) => {
  try {
    const chatId = msg.chat.id;
    let res;
    switch (msg.text) {
      case "/start":
        await telegram.sendMessage(chatId, messages.introMsg, {
          parse_mode,
          reply_markup: {
            keyboard: [[{ text: BUTTONS.START_TO_PLAY }]],
          },
        });
        break;
      case (BUTTONS.START_TO_PLAY, BUTTONS.CREATE_ACCOUNT):
        await telegram.sendMessage(chatId, messages.startToPlayMsg, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.GAME_ARTIFACTS:
        await telegram.sendMessage(chatId, messages.gameArtifacts, {
          parse_mode,
          reply_markup: {
            keyboard: [
              [{ text: BUTTONS.CREATE_ACCOUNT }],
              [{ text: BUTTONS.GET_EGGS_FREE }],
            ],
          },
        });
        break;
      case BUTTONS.GET_EGGS_FREE:
        await telegram.sendMessage(chatId, messages.getEggFree, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.BUY_EGGS_CREDIT_CARD:
        await telegram.sendMessage(chatId, messages.buyEggFromCard, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.GET_DUCK_FROM_EGG:
        await telegram.sendMessage(chatId, messages.getDuckFromEgg, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.CROSS_DUCKS:
        await telegram.sendMessage(chatId, messages.crossDucks, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.GENOTYPE_GENERATION:
        await telegram.sendMessage(chatId, messages.genotypesAndGenerations, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      case BUTTONS.BUY_DUCK_MARKETPLACE:
        await telegram.sendMessage(chatId, messages.buyDuckOnMarketplace, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        await sleep(5000);
        await telegram.sendMessage(chatId, messages.passiveIncome, {
          parse_mode,
          reply_markup: {
            keyboard: [[{ text: BUTTONS.FARMING_EGG }]],
          },
        });
        break;
      case BUTTONS.FARMING_EGG:
        await telegram.sendMessage(chatId, messages.howFarmingWorks, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        await sleep(5000);
        await telegram.sendMessage(chatId, messages.final, {
          parse_mode,
          reply_markup: {
            remove_keyboard: true,
          },
        });
        break;
      default:
        await telegram.sendMessage(chatId, "oooops....");
    }
  } catch (e) {
    console.error(e);
  }
});

telegram.onText(/\/id/, async ({ chat: { id } }) => {
  //todo add logic for checking link to wallet
  //(Если человек прислал неправильный адрес кошелька, то ему сразу же высылается следующее сообщение):
  // «Ты прислал неправильный адрес кошелька, скопируй адрес в правом верхнем углу, находясь залогиненным на https://wavesducks.com/»
  //«Класс! Твой аккаунт зареган и для игры нужна внутриигровая валюта - EGG или яица.
  // Яйца можно купить на бирже, купить с карты и получить, участвуя в специальных раундах.
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
