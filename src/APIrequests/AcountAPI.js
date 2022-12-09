import { requests } from "../services/request";

export async function getAllMessages(url, data) {
    return await requests.getRequest(url, data)
}