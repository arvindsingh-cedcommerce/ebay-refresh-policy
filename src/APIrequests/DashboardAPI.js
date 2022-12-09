import { requests } from "../services/request";

export async function getDashboardData(url, data) {
  return await requests.getRequest(url, data);
}

export async function getMethod(url, data) {
  return await requests.getRequest(url, data);
}