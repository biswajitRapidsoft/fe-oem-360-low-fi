import config from "../config/config";
import services from "../services/services";

const allDepartments = async (params) => {
  const apiEndPoint = config.baseUrl + config.apiName.getAllDepartment;

  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcAcceptByAppOwner = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.acceptByAppOwner;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcApproveByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.approveByAgm;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcRevertByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiName.revertByAgm;

  try {
    const response = await services.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const DetailedModalAction = {
  allDepartments,
  funcAcceptByAppOwner,
  funcApproveByAgm,
  funcRevertByAgm,
};

export default DetailedModalAction;
