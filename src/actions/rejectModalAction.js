import config from "../config/config";
import services from "../services/services";

const funcRejectByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.rejectByAgm;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcRejectByAppOwner = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.rejectByAppOwner;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const RejectModalAction = { funcRejectByAgm, funcRejectByAppOwner };

export default RejectModalAction;
