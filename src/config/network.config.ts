import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { clearStorage, getItem, storageKeys } from "@/utils/storage";
import axios from "axios";
export const baseURL = `${location.protocol}//${location.hostname}:${import.meta.env.VITE_PORT}`
console.log("url = ",baseURL)
const network = axios.create({
  baseURL,
});

network.interceptors.request.use(
  (config) => {
    const token = getItem(storageKeys.token);
    if (token) {
      // Attach token to custom header
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

network.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        clearStorage()
        router.navigate(routes.signout)
      }
    }
    return Promise.reject(error);
  }
);
export default network
