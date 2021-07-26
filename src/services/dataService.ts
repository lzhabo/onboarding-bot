import axios from "axios";
import watcherService from "./watcherService";

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

type TRespData = { data: { auctionData: IDuck[] } };
type THatchingRespData = { data: { duckData: IHatchDuck[] } };

const decimals = 1e8;

export const getDucksSalesInTotal = async () => {
  const { data } = await axios.get("https://duxplorer.com/auction/json");
  return data.auctionData.reduce(
    (acc, { amount }) => acc + amount / decimals,
    0
  );
};
export const getDucksSalesInLast24Hours = async () => {
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const { data } = await axios.get("https://duxplorer.com/auction/json");
  const filteredArray = data.auctionData.filter(
    (duck) => duck.timestamp >= yesterday
  );
  return filteredArray.reduce((acc, { amount }) => acc + amount / decimals, 0);
};
export const getDucksHatchedAmount = async (total = false) => {
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).getTime();
  const { data } = await axios.get("https://duxplorer.com/hatching/json");
  return total
    ? data.duckData.length
    : data.duckData.filter((duck) => duck.timestamp >= yesterday).length;
};
export const getFarmingPower = async () => {
  const { data } = await axios.get("https://duxplorer.com/farming/json");
  return data.farmData.reduce((acc, { farmingPower }) => acc + farmingPower, 0);
};
export const getTopDuck = async () => {
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).getTime();
  const { data }: TRespData = await axios.get(
    "https://duxplorer.com/auction/json"
  );

  const filteredArray = data.auctionData.filter(
    (duck) => duck.timestamp >= yesterday
  );
  const topDuck = filteredArray.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current
  );
  return topDuck.duckName;
};
export const getHatchPrice = async () => {
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).getTime();
  const { data }: THatchingRespData = await axios.get(
    "https://duxplorer.com/hatching/json"
  );

  const lastDayHatching = data.duckData.filter(
    (duck) => duck.timestamp >= yesterday
  );
  const average =
    lastDayHatching.reduce(
      (total, { duckPrice }) => total + duckPrice / 100,
      0
    ) / lastDayHatching.length;
  return average.toFixed(2);
};
export const getCurrentWavesRate = async () => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/waves?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
  );
  return data.market_data.current_price.usd;
};

export const getTotalInfo = async () => {
  const {
    data: { auctionData },
  } = await axios.get("https://duxplorer.com/auction/json");
  const {
    data: { duckData },
  } = await axios.get("https://duxplorer.com/hatching/json");
  const farmingPower = await getFarmingPower();
  const rate = await getCurrentWavesRate();
  //ducksSalesInTotal
  const ducksSalesInTotal = auctionData.reduce(
    (acc, { amount }) => acc + amount / decimals,
    0
  );

  //getDucksSalesInLast24Hours
  const yesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  ).getTime();
  const filteredArray = auctionData.filter(
    (duck) => duck.timestamp >= yesterday
  );
  const ducksSalesInLast24Hours = filteredArray.reduce(
    (acc, { amount }) => acc + amount / decimals,
    0
  );

  //ducksHatchedAmount
  const ducksHatchedAmount = duckData.length;
  const ducksHatchedAmountForDay = duckData.filter(
    (duck) => duck.timestamp >= yesterday
  ).length;

  //topDuck
  const topDuck = filteredArray.reduce((prev, current) =>
    prev.amount > current.amount ? prev : current
  );
  // hatchPrice
  const lastDayHatching = duckData.filter(
    (duck) => duck.timestamp >= yesterday
  );
  const average =
    lastDayHatching.reduce(
      (total, { duckPrice }) => total + duckPrice / 100,
      0
    ) / lastDayHatching.length;
  const hatchPrice = average.toFixed(2);
  return {
    ducksSalesInTotal,
    ducksSalesInLast24Hours,
    ducksHatchedAmount,
    ducksHatchedAmountForDay,
    farmingPower,
    topDuck,
    hatchPrice,
    rate,
  };
};
