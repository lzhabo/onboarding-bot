import axios from "axios";
import { getCurrentWavesRate } from "./services/dataService";
import { Logger } from "selenium-webdriver/lib/logging";

export const lastPriceForEgg = async () => {
  const hatching = await axios.get("https://duxplorer.com/hatching/json");
  const breeding = await axios.get("https://duxplorer.com/breeding/json");
  const ducks = hatching.data.duckData.length + breeding.data.duckData.length;
  console.log(hatching.data);
  console.log(breeding.data);
  console.log(ducks);
};

lastPriceForEgg();
