import config from "../config/config";
import services from "../services/services";

const recommendationAgnAndOem = async (params) => {
  const apiEndPoint = config.baseUrl + config.apiName.getAllRecommendation;

  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const allPendingRecommendationForAppOwner = async (params) => {
  const apiEndPoint =
    config.baseUrl + config.apiName.getAllPendingRecommendationForAppOwner;

  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const allApprovedRecommendationForAppOwnerAndGmItInfra = async (params) => {
  const apiEndPoint =
    config.baseUrl + config.apiName.getAllApprovedRecommendationForAppOwner;
  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const funcDashboardDetails = async (params) => {
  const apiEndPoint = config.baseUrl + config.apiName.dashboardDetails;

  try {
    const response = await services.get(apiEndPoint, params);

    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const DashboardAction = {
  recommendationAgnAndOem,
  allPendingRecommendationForAppOwner,
  allApprovedRecommendationForAppOwnerAndGmItInfra,
  funcDashboardDetails,
};

export default DashboardAction;

// DETAILS API VALUE  >>>  value: This Week  (send string)
