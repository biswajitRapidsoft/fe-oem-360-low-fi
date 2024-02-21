import { Services } from "../services/services";
import config from "../config/config";

const agmAndOemRecommendation = async () => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllRecommendation;

  try {
    const res = await Services.GET(apiEndPoint);
    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// function for appowner pending data table

const pendingTableDataForAppOwner = async () => {
  const apiEndPoint =
    config.baseUrl + config.apiEndPoints.getAllPendingRecommendationForAppOwner;

  try {
    const res = await Services.GET(apiEndPoint);
    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// function for getting data for approved table of appowner (samedata for gm it infra)

const approvedTableDataForAppOwner = async () => {
  const apiEndPoint =
    config.baseUrl +
    config.apiEndPoints.getAllApprovedRecommendationForAppOwner;

  try {
    const res = await Services.GET(apiEndPoint);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

export const dashAction = {
  agmAndOemRecommendation,
  pendingTableDataForAppOwner,
  approvedTableDataForAppOwner,
};
