import { requests } from "../services/request";

export async function submitIssue(url, filters) {
  return await requests.postRequest(url, filters);
}
