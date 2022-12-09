import { requests } from "../services/request";

export async function getTemplates(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getTemplatesPost(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function deleteTemplateID(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function getTemplatebyId(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function getAttributes(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getcategoryFeatures(url, filters) {
  return await requests.getRequest(url, filters);
}

export async function getConfigurablesAttributes(url) {
  return await requests.getRequest(url);
}

export async function getCategoriesAPI(url, filters) {
  return await requests.postRequest(url, filters);
}

export async function getAttributesCategoryWise(url, filters) {
  return await requests.getRequest(url, filters)
}