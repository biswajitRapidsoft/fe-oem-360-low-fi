import config from "../config/config";
import { Services } from "../services/services";

// rejected by appowner
const handleRejectByAppOwner = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.rejectByAppOwner;

  try {
    const res = await Services.POST(apiEndPoint, payload);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

// rejected by agm

const handleRejectByAgm = async (payload) => {
  const apiEndPoint = config.baseUrl + config.apiEndPoints.rejectByAgm;

  try {
    const res = await Services.POST(apiEndPoint, payload);

    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

export const RejectModalAction = { handleRejectByAppOwner, handleRejectByAgm };
