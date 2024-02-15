import config from "../config/config";
import { Services } from "../services/services";

const notification = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.getNotifications;

  const res = await Services.GET(apiEndPoint, {
    ...payload,
  });
  if (res) {
    return res;
  } else {
    return null;
  }
};

const seenNotification = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.notificationMarkSeen;

  const res = await Services.POST(apiEndPoint, null, {
    ...payload,
  });
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const NotificationModalAction = { notification, seenNotification };
