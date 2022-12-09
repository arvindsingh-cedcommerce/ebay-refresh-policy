import { requests } from "../services/request";

export async function getProfiles(url, filters) {
  return await requests.getRequest(url, filters);
}
