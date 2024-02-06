import config from "../config/config";
import services from "../services/services";

const Login = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.login;
  // debugger
  try {
    const response = await services.loginPost(apiEndPoint, payload);
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const LoginAction = { Login };

export default LoginAction;
