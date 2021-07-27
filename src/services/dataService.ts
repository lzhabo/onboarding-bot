import axios from "axios";
import { prettifyNums } from "../utils";

const decimals = 1e8;

export interface IDuck {
  timestamp: number;
  duckName: string;
  amount: number; //waves
  NFT: string;
  date: string;
  buyType: "instantBuy" | "acceptBid";
}

export interface IHatchDuck {
  date: Date;
  timestamp: number;
  NFT: string;
  duckPrice: number;
  duckName: string;
}

type TLastPriceForEggsData = {
  success: boolean;
  height: number;
  data: {
    id: string;
    A_asset_balance: string;
    A_asset_id: string;
    B_asset_balance: string;
    B_asset_id: string;
    active: boolean;
    commission: number;
    commission_scale_delimiter: number;
    share_asset_id: string;
    share_asset_supply: string;
    version: string;
    first_harvest_height: number;
    A_asset_init: string;
    B_asset_init: string;
    share_limit_on_first_harvest: string;
    totalLiquidity: string;
    stakingIncome: string;
    txCount24: string;
    volume24: string;
    lpFees24: string;
  };
};
type TAuctionRespData = { data: { auctionData: IDuck[] } };
type THatchingRespData = { data: { duckData: IHatchDuck[] } };

export const lastPriceForEgg = async () => {
  const { data } = await axios.get(
    "https://backend.swop.fi/exchangers/3PEeJQRJT4v4XvSUBPmxhdWKz439nae7KtQ"
  );
  return (
    Number.parseInt(data.data.B_asset_balance) /
    1000000 /
    (Number.parseInt(data.data.A_asset_balance) / 100)
  ).toFixed(2);
};
export const lastDuckPriceForHatching = async () => {
  const { data } = await axios.get(
    "https://wavesducks.wavesnodes.com/addresses/data/3PEktVux2RhchSN63DsDo4b4mz4QqzKSeDv/ducks_last_price"
  );
  return data.value / 100;
};

export const getCurrentWavesRate = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/waves?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
  );
  return data.market_data.current_price.usd;
};
export const totalNumberOfDucks = async () => {
  const { data }: TAuctionRespData = await axios.get(
    "https://duxplorer.com/auction/json"
  );
  return data.auctionData.length;
};

export const numberOfDucksHatchedInTotalToday = async () => {
  const { data }: THatchingRespData = await axios.get(
    "https://duxplorer.com/hatching/json"
  );
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).getTime();
  const today = data.duckData.filter(
    (duck) => duck.timestamp >= yesterday
  ).length;
  return { total: data.duckData.length, today };
};
export const ducksSalesWeeklyInTotal = async () => {
  const { data }: TAuctionRespData = await axios.get(
    "https://duxplorer.com/auction/json"
  );
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  ).getTime();
  const twoWeekAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 14
  ).getTime();

  const rate = await getCurrentWavesRate();
  const twoWeekAgoDucks = data.auctionData.filter(
    (d) => d.timestamp >= twoWeekAgo && d.timestamp <= lastWeek
  );
  const lastWeekDucks = data.auctionData.filter((d) => d.timestamp >= lastWeek);
  const twoWeeksAgoSales =
    twoWeekAgoDucks.reduce((acc, { amount }) => acc + amount / decimals, 0) *
    rate;
  const lastWeekSales =
    lastWeekDucks.reduce((acc, { amount }) => acc + amount / decimals, 0) *
    rate;
  const totalSales =
    data.auctionData.reduce((acc, { amount }) => acc + amount / decimals, 0) *
    rate;
  const difference = ((lastWeekSales - twoWeeksAgoSales) / lastWeekSales) * 100;

  return {
    totalSales: prettifyNums(Math.round(totalSales)),
    lastWeekSales: prettifyNums(Math.round(lastWeekSales)),
    difference: Math.round(Math.abs(difference)),
    lessZero: difference < 0,
  };
};

export const topDuck = async () => {
  const { data }: TAuctionRespData = await axios.get(
    "https://duxplorer.com/auction/json"
  );
  const rate = await getCurrentWavesRate();
  const topDuck = data.auctionData.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current
  );
  return {
    ...topDuck,
    amount: topDuck.amount / decimals,
    inDollar: (topDuck.amount / decimals) * rate,
  };
};
