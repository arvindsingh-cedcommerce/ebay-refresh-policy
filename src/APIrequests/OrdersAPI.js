import { requests } from "../services/request";

export async function importOrders(url, data) {
  return await requests.postRequest(url, data);
}

export async function getOrders(url, data) {
  return await requests.getRequest(url, data);
}

// view order
export async function getOrder(url, data) {
  return await requests.getRequest(url, data);
}

// mass actions
export async function massAction(url, data) {
  return await requests.postRequest(url, data);
}
