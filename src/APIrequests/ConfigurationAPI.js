import { requests } from "../services/request";

export async function configurationAPI(url, filters) {
  return await requests.postRequest(url, filters);
}
