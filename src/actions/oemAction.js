import config from "../config/config";

import { Services } from "../services/services";

const logindata = JSON.parse(sessionStorage.getItem("loginresponse"));
// console.log("login data in oemactions", logindata);

const companyId = sessionStorage.getItem("loginresponse")
  ? JSON.parse(sessionStorage.getItem("loginresponse")).company.id
  : null;
const token = sessionStorage.getItem("loginresponse")
  ? JSON.parse(sessionStorage.getItem("loginresponse")).token
  : null;

const Updatetype = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.pageData;
  const headers = {
    Authorization: `Bearer +' '+ ${token}`,
  };
  const res = await Services.GET(apiEndPoint, { companyId }, { headers });
  if (res) {
    return res;
  } else {
    return null;
  }
};

const recommendation = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.addRecommendation;

  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

const getTableData = async () => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllRecommendation;

  const res = await Services.GET(apiEndPoint);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const Oemactions = { Updatetype, recommendation, getTableData };
