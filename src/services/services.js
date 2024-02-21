import axios from "axios";

// function to extract the token from sessionStorage
const getToken = () => {
  const loginInfo = JSON.parse(sessionStorage.getItem("loginresponse"));
  const token = loginInfo?.token || "";
  console.log("token inside services", token);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return headers;
};

const POST = async (apiEndPoint, payload) => {
  // let tokenData = sessionStorage.getItem('token');
  try {
    const res = await axios.post(apiEndPoint, payload, {
      // headers: {
      //   Authorization: "Bearer " + tokenData,
      // },
      headers: getToken(),
    });
    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (error) {
    return error?.response;
  }
};
const LoginPOST = async (apiEndPoint, payload) => {
  const res = await axios.post(apiEndPoint, payload);

  if (res) {
    return res;
  } else {
    return null;
  }
};

const GET = async (apiEndPoint, params = {}) => {
  // let tokenData = sessionStorage.getItem('token');

  try {
    const res = await axios.get(apiEndPoint, {
      headers: getToken(),
      // headers: {
      //   Authorization: "Bearer " + tokenData,
      // },
      params: {
        ...params,
      },
    });

    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (error) {
    return error?.response;
  }
};

export const Services = {
  POST,
  LoginPOST,
  GET,
};
