import { base58Decode } from '@waves/ts-lib-crypto';
import { _hashChain } from '@waves/ts-lib-crypto/crypto/hashing';
import axios from 'axios';
const ru = require('./ru.json');
const en = require('./en.json');
const database = require('./database');


export const updateUser = async (id, data) => {
    await database.updateData('users/' + id, data);
};

export const getUser = (id) => database.getData('users/' + id);


export const addParticipant = (id, data) => {
    return database.updateData('participants/' + id, data);
};

export const getUserLang = async (id): Promise<string> => await database.getData(`users/${id}/lang`) || 'en'

export function isValidAddress(address: string): boolean {

    try {
        const addressBytes = base58Decode(address);
        return (
            addressBytes.length === 26 &&
            addressBytes[0] === 1 &&
            addressBytes.slice(-4).toString() === _hashChain(addressBytes.slice(0, 22)).slice(0, 4).toString()
        );
    } catch (e) {
        // console.error(e)
    }
    return false;
}

export async function checkBoughtUSDN(address: string): Promise<boolean> {
    const url = `https://api.wavesplatform.com/v0/transactions/transfer?
    sender=3PGS9W5aZ4kdBFJJ9jxmgjLW8qfqu1b3Y66&
    recipient=${address}&
    assetId=DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p&
    sort=desc&
    timeStart=1584604800000&timeEnd=1587369600000&
    limit=100` ;
    const res = (await axios.get(url)).data.data;
    return res.length > 0 && res.some(({data: {amount}}: any) => +amount >= 10);
}

export async function checkStakeUSDN(address: string): Promise<boolean> {
    const url = `https://beta.neutrino.at/api/v1/rpd-user-balance/usd-nb_usd-n/${address}`;
    const res = (await axios.get(url)).data;
    return res && res.neutrino != null && res.neutrino.balance >= 10;
}

export const phrase = (lang: string, key: string) => lang === 'ru' ? ru[key] : en[key];
