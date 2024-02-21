import config from "../config/config";

import { Services } from "../services/services";

const getPieChartData = async (filter) => {
  const encodedFilter = encodeURIComponent(filter);

  const apiEndPoint =
    config.baseUrl +
    config.apiEndPoints.dashboardDetails +
    "?value=" +
    encodedFilter;
  try {
    const res = await Services.GET(apiEndPoint);
    if (res) {
      return res;
    }
  } catch (err) {
    console.error(err);
  }
};

export const pieChartActions = { getPieChartData };
