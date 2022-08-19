import {requests} from "../../services/request";

export async function getorders(filters = {}){
    return await requests.getRequest('connector/order/getOrders', filters);
}

export async function fetchOrders(filters = {}){
    return await requests.postRequest('amazon/request/order', filters);
}

export async function shiporderonAmazon(data = {}){
    return await requests.postRequest('amazon/request/shiporderonAmazon', data);
}

export async function createorderonShopify(data = {}){
    return await requests.postRequest('amazon/request/createOrderonShopify', data);
}

export async function syncorderonAmazon(data = {}){
    return await requests.postRequest('amazon/request/syncorderonAmazon', data);
}

export async function getorderbyId( data = {}){
    return await requests.postRequest('connector/order/getOrder', data)
}