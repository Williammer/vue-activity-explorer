import { getBaseReqConfig, sendRequest } from "../utils/request.js";
import { apiUrl } from "../config";

export async function getChannels() {
  const config = getBaseReqConfig("GET", `${apiUrl}/channels`);
  return sendRequest(config);
}

export async function getEvents(options) {
  const config = {
    ...getBaseReqConfig("GET", `${apiUrl}/events`),
    params: options
  };
  return sendRequest(config);
}

export async function getEventById(id) {
  const config = getBaseReqConfig("GET", `${apiUrl}/events/${id}`);
  return sendRequest(config);
}

export async function getEventParticipantsById(id) {
  const config = getBaseReqConfig("GET", `${apiUrl}/events/${id}/participants`);
  return sendRequest(config);
}

export async function getEventCommentsById(id, options) {
  const config = {
    ...getBaseReqConfig("GET", `${apiUrl}/events/${id}/comments`),
    params: options
  };
  return sendRequest(config);
}

export async function getEventLikesById(id, options) {
  const config = {
    ...getBaseReqConfig("GET", `${apiUrl}/events/${id}/likes`),
    params: options
  };
  return sendRequest(config);
}

export async function postComment(id, comment) {
  const config = {
    ...getBaseReqConfig("POST", `${apiUrl}/events/${id}/comments`),
    data: JSON.stringify({ comment })
  };
  return sendRequest(config);
}

export async function participate(id) {
  const config = getBaseReqConfig(
    "POST",
    `${apiUrl}/events/${id}/participants`
  );
  return sendRequest(config);
}

export async function cancelParticipation(id) {
  const config = getBaseReqConfig(
    "DELETE",
    `${apiUrl}/events/${id}/participants`
  );
  return sendRequest(config);
}

export async function postLike(id) {
  const config = getBaseReqConfig("POST", `${apiUrl}/events/${id}/likes`);
  return sendRequest(config);
}

export async function removeLike(id) {
  const config = getBaseReqConfig("DELETE", `${apiUrl}/events/${id}/likes`);
  return sendRequest(config);
}
