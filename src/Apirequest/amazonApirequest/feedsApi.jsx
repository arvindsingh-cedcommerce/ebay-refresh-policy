import {requests} from "../../services/request";

export async function getallfeeds(filters = {}){
    return await requests.getRequest('amazon/request/getAllFeeds', filters);
}

export async function syncFeed(data){
    return await requests.postRequest('amazon/request/syncFeed', data);
}

export async function deleteFeed(data){
    return await requests.postRequest('amazon/request/deleteFeed', data);
}
export async function syncfeedbulk(){
    return await requests.getRequest('amazon/request/syncfeedbulk');
}
export async function deletefeedbulk(){
    return await requests.getRequest('amazon/request/deletefeedbulk');
}