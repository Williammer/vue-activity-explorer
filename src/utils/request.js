import axios from "axios";

export function getBaseReqConfig(method, url) {
  const token = localStorage.getItem("token");
  let headers = {
    "X-BLACKCAT-TOKEN": token
  };
  if (method === "POST") {
    headers["content-type"] = "application/json";
  }
  return {
    method,
    url,
    headers
  };
}

export async function sendRequest(config) {
  const { status, data } = await axios(config);
  if (status !== 200) {
    throw new Error(`Status ${status}. Response: ${JSON.stringify(data)}`);
  }
  if (data.error && data.message) {
    throw new Error(`Error returned. Code: ${data.error}. ${data.message}`);
  }
  return data;
}
