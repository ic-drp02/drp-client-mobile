import Constants from "expo-constants";
import ApiClient from "drp-api-js";

const API_SERVER_BASE =
  (Constants.manifest.env && Constants.manifest.env.EXPO_API_SERVER_BASE) ||
<<<<<<< HEAD
  "https://icon.doc.ic.ac.uk";
=======
  "http://10.10.86.75:5000";
>>>>>>> Implement search through API with infinite scroll

console.log(API_SERVER_BASE);

export default new ApiClient(API_SERVER_BASE);
