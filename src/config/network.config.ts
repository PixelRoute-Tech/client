import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { clearStorage, getItem, storageKeys } from "@/utils/storage";
import axios from "axios";
const network = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

network.interceptors.request.use(
  (config) => {
    const details = getItem(storageKeys.user);
    if (details && details.token) {
      // Attach token to custom header
      config.headers["x-auth-token"] = details.token;
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
