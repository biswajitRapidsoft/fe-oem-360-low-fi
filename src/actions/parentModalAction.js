import config from "../config/config";
import { Services } from "../services/services";

// accept by appowner
const handleAcceptByAppOwner = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.acceptByAppOwner;
  try {
    const res = await Services.POST(apiEndPoint, payload);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// approval from agm
const handleApproveByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.approveByAgm;
  try {
    const res = await Services.POST(apiEndPoint, payload);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// reverted by agm
const handleRevertByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.revertByAgm;
  try {
    const res = await Services.POST(apiEndPoint, payload);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// get all department
const allDepartments = async (params) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllDepartment;

  try {
    const res = await Services.GET(apiEndPoint, params);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

export const ParentModalAction = {
  handleAcceptByAppOwner,
  handleApproveByAgm,
  handleRevertByAgm,
  allDepartments,
};
