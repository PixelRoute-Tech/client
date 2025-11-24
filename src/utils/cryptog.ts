import moment from "moment";

export const createRandomId = (id?:string) => {
  return (id || "ID") + moment().format("YYYYMMDDHHmmss") + Math.random().toString(36).substring(2, 8);
};


