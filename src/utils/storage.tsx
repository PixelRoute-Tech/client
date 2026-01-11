export const storageKeys = {
  user: "USER",
  token: "TOKEN",
  accessToken:"ACCESS_TOKEN",
  copied: "COPY",
};

export const setItem = (
  key: keyof typeof storageKeys | string,
  data: any
): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getItem = (
  key: keyof typeof storageKeys | string
): any | false => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || null);
    return data;
  } catch (error) {
    return false;
  }
};

export const clearStorage = () => {
  try {
    //   [storageKeys.user,storageKeys.token].forEach(key=>{
    //    localStorage.removeItem(key)
    //   })
    localStorage.clear();
    sessionStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
};

export const clearAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};