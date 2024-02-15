import config from "../config/config";
import { Services } from "../services/services";

const department = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllDepartment;

  const res = await Services.GET(apiEndPoint, {
    ...payload,
  });
  if (res) {
    return res;
  } else {
    return null;
  }
};

const submitApprovalAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.approveByAgm;

  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

const submitApprovalAppOwner = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.acceptByAppOwner;

  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

const revertByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.revertByAgm;

  const res = await Services.POST(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

export const AcceptModalAction = {
  department,
  submitApprovalAgm,
  submitApprovalAppOwner,
  revertByAgm,
};
