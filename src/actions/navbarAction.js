import config from "../config/config";

import { Services } from "../services/services";

const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
console.log("logininfo inside navbar", loginInfo);

const notificationData = JSON.parse(sessionStorage.getItem("notificationData"));
// const notificationId = notificationData.id;
// console.log("selected notification id", notificationId);
const userId = loginInfo ? loginInfo.id : null;
const getNotifications = async () => {
  const apiEndPoint =
    config.baseUrl + config.apiEndPoints.getNotifications + "?userId=" + userId;
  try {
    const res = await Services.GET(apiEndPoint);
    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// PARAMS:

// const markNotifications = async () => {
//   const apiEndPoint =
//     config.baseUrl +
//     config.apiEndPoints.notificationMarkSeen +
//     "?id=" +
//     notificationId;
//   const res = await Services.POST(apiEndPoint);
//   if (res) {
//     return res;
//   } else {
//     return null;
//   }
// };

const markNotifications = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.notificationMarkSeen;
  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const navbarActions = { getNotifications, markNotifications };
