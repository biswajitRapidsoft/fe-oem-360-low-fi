import config from "../config/config";
import services from "../services/services";

const funcGetNotifications = async (params) => {
  const apiEndPoint = config.baseUrl + config.apiName.getNotifications;

  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcNotificationMarkSeen = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.notificationMarkSeen;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const navbarAction = { funcGetNotifications, funcNotificationMarkSeen };

export default navbarAction;
