import { requests } from "../services/request";

// product grid
export async function getProducts(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getProductsCount(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getrequest(url, filters = {}) {
  return await requests.getRequest(url);
}

// edit product
export async function fetchProductById(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function postActionOnProductById(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function editProductById(url, filters) {
  return await requests.postRequest(url, filters);
}
