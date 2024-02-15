import axios from "axios";

//token
//  const datas = sessionStorage.getItem("data");
//  const data = JSON.parse(datas);
//  const token = data.token;
//  const userType = data.userType;

const POST = async (apiEndPoint, payload, params = {}) => {
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;

  try {
    const res = await axios.post(apiEndPoint, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
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

const LoginPOST = async (apiEndPoint, payload) => {
  const res = await axios.post(apiEndPoint, payload);
  if (res) {
    return res;
  } else {
    return null;
  }
};

const OEMFORM_POST = async (apiEndPoint, payload) => {
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const createdById = data?.id;
  const userType = data?.userType;
  const companyId = data?.company.id;

  try {
    const res = await axios.post(apiEndPoint, payload, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
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

const POSTSEEN = async (apiEndPoint, params = {}) => {
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  console.log(token, "token");

  try {
    const res = await axios.post(apiEndPoint, null, {
      headers: {
        Authorization: "Bearer " + token,
      },
      params: {
        ...params,
      },
    });

    console.log(res, "res");

    if (res) {
      return res;
    } else {
      return null;
    }
  } catch (error) {
    return error?.response;
  }
};

const GET = async (apiEndPoint, params = {}) => {
  const datas = sessionStorage.getItem("data");
  const data = JSON.parse(datas);
  const token = data.token;
  const createdById = data?.id;
  const userType = data?.userType;
  const companyId = data?.company.id;

  try {
    const res = await axios.get(apiEndPoint, {
      headers: {
        Authorization: "Bearer " + token,
      },
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
  OEMFORM_POST,
  POSTSEEN,
};
