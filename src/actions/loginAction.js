// import config from "../config/Config";
import config from "../config/config";

import { Services } from "../services/services";

const Login = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.login;

  const res = await Services.LoginPOST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const LoginAction = { Login };
