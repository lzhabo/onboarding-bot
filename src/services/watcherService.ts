import axios from "axios";

export interface IDuck {
  timestamp: number;
  duckName: string;
  amount: number; //waves
  NFT: string;
  date: string;
  buyType: "instantBuy" | "acceptBid";
}

type TRespData = { data: { auctionData: IDuck[] } };

class WatcherService {
  timestamp = new Date().getTime();
  getUnsentData = async () => {
    const lastTimestamp = this.timestamp;
    this.timestamp = new Date().getTime();
    const { data }: TRespData = await axios.get(
      "https://duxplorer.com/auction/json"
    );
    return data.auctionData
      .filter(({ timestamp }) => timestamp > lastTimestamp)
      .sort((x, y) => x.timestamp - y.timestamp);
  };

  getCurrentWavesRate = async () => {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/waves?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
    );
    return data.market_data.current_price.usd;
  };
}
export default new WatcherService();
