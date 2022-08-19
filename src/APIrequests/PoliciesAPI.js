import { requests } from "../services/request";

export async function getPolicies(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getPoliciesPost(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function getRefreshPolicies(url, filters) {
  return await requests.postRequest(url, filters);
}
