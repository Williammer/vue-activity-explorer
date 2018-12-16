import axios from "axios";
import { getBaseReqConfig, resetLoginSession, sendRequest } from "../utils";
import { apiUrl } from "../config";

async function login(username, password) {
  const config = {
    url: `${apiUrl}/auth/token`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify({
      username,
      password
    })
  };

  try {
    const { data, status } = await axios(config);
    if (status !== 200) {
      return;
    }

    const { token, user } = data;
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return user;
  } catch (error) {
    resetLoginSession();
    console.error("[login] login failed. ", error);
  }
}

export async function signIn(username, password) {
  const data = {
    username,
    password,
    email: "william@shopee.com",
    avatar: "https://coding.net/static/fruit_avatar/Fruit-19.png"
  };
  const config = {
    url: `${apiUrl}/join`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(data)
  };

  try {
    await axios(config);
    return login(username, password); // auto-login after signIn
  } catch (error) {
    console.warn("[signIn] signIn failed. ", error);
    if (error.message.includes("403")) {
      return login(username, password); // login if user exist
    }
  }
}

export async function logout() {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  const config = getBaseReqConfig("DELETE", `${apiUrl}/auth/token`);
  await axios(config);
  localStorage.removeItem("token");
}

export async function getMyDetails() {
  const config = getBaseReqConfig("GET", `${apiUrl}/user`);
  return sendRequest(config);
}

export async function getMyEvents(type, options) {
  const config = {
    ...getBaseReqConfig("GET", `${apiUrl}/user/events`),
    params: { type, ...options }
  };
  return sendRequest(config);
}

export async function getUserDetails(userId) {
  const config = getBaseReqConfig("GET", `${apiUrl}/user/${userId}`);
  return sendRequest(config);
}

export async function getUserEvents(userId, type, options) {
  const config = {
    ...getBaseReqConfig("GET", `${apiUrl}/user/${userId}/events`),
    params: { type, ...options }
  };
  return sendRequest(config);
}
