import Constants from "expo-constants";
import ApiClient from "drp-api-js";

const API_SERVER_BASE =
  (Constants.manifest.env && Constants.manifest.env.EXPO_API_SERVER_BASE) ||
  "http://10.10.86.75:5000";

console.log(API_SERVER_BASE);

export default new ApiClient(API_SERVER_BASE);
