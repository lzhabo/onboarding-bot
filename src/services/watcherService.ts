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

  constructor() {
    this.getData().then((data) => {
      this.timestamp = data[data.length - 1].timestamp;
    });
  }

  getUnsentData = async () => {
    const lastTimestamp = this.timestamp;
    const data = await this.getData();
    this.timestamp = data[data.length - 1].timestamp;
    return data.filter(({ timestamp }) => timestamp > lastTimestamp);
  };

  getCurrentWavesRate = async () => {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/waves?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"
    );
    return data.market_data.current_price.usd;
  };

  private getData = async () => {
    const { data }: TRespData = await axios.get(
      "https://duxplorer.com/auction/json"
    );
    return data.auctionData.sort((x, y) => x.timestamp - y.timestamp);
  };
}
export default new WatcherService();
