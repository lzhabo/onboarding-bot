import { phrase } from './helpers';

export const langKey = {
    reply_markup:
        {
            inline_keyboard: [[
                {text: 'Русский', callback_data: JSON.stringify({type: 'lang', data: 'ru'})},
                {text: 'English', callback_data: JSON.stringify({type: 'lang', data: 'en'})}
            ]]
        }
};

export const startKey = (lan) => ({
    reply_markup:
        {
            inline_keyboard: [[
                {text: phrase(lan, 'aboutBtn'), url: 'https://beta.neutrino.at'},
                {text: phrase(lan, 'startBtn'), callback_data: JSON.stringify({type: 'start'})}
            ]]
        }
});
