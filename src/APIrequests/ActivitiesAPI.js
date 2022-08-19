import { requests } from "../services/request";

export async function getAllNotifications(url, data) {
    return await requests.getRequest(url, data)
}