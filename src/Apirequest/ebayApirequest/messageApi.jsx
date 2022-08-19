import {requests} from "../../services/request";

export async function getMessages(filters){
    return await requests.postRequest('ebay/request/getMessage', filters);
}