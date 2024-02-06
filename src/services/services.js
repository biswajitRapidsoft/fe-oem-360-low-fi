import axios from "axios";

const getOptions = () => {
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const token = loginData?.token || "";

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return headers;
};

const loginPost = async (apiEndPoint, payload) => {
  // debugger

  try {
    const response = await axios.post(apiEndPoint, payload);

    if (response) {
      return response;
    }
  } catch (error) {
    return error?.response || error;
  }
};

const get = async (apiEndPoint, params = {}) => {
  try {
    const response = await axios.get(apiEndPoint, {
      params: {
        ...params,
      },
      headers: getOptions(),
    });

    if (response) {
      return response;
    }
  } catch (error) {
    return error?.response || error;
  }
};

const post = async (apiEndPoint, payload) => {
  try {
    const response = await axios.post(apiEndPoint, payload, {
      headers: getOptions(),
    });

    if (response) {
      return response;
    }
  } catch (error) {
    return error?.response || error;
  }
};

const services = {
  loginPost,
  get,
  post,
};

export default services;
