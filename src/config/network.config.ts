import routes from "@/routes/routeList";
import router from "@/routes/routes";
import { ApiResponseType } from "@/types/network.type";
import { clearAllCookies, clearStorage, getItem, storageKeys } from "@/utils/storage";
import axios from "axios";
export const baseURL = `${location.protocol}//${location.hostname}:${
  import.meta.env.VITE_PORT
}`;

const network = axios.create({
  baseURL,
  withCredentials: true 
});

// export const tokenServices = async (token: string): ApiResponseType<string> => {
//   const result = await axios.get(``, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return result.data;
// };

// network.interceptors.request.use(
//   (config) => {
//     const token = getItem(storageKeys.token);
//     if (token) {
//       config.headers["x-auth-token"] = token;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// network.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry
//     ) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({
//             resolve: (token: string) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               resolve(network(originalRequest));
//             },
//             reject: (err: any) => reject(err),
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;
//       try {
//         const details = getItem(storageKeys.user);
//         const { data } = await tokenServices(details.refreshtoken);
//         setItem(storageKeys.accessToken, data);
//         network.defaults.headers.common["Authorization"] = `Bearer ${data}`;
//         processQueue(null, data);
//         return network(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

network.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        clearStorage();
        clearAllCookies();
        router.navigate(routes.signout,{replace:true});
      }
    }
    return Promise.reject(error);
  }
);
export default network;
