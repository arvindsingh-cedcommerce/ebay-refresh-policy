import {requests} from "../../services/request";

export async function getorders(filters = {}){
    return await requests.getRequest('connector/order/getOrders', filters);
}

export async function fetchOrderById(data){
    return await requests.getRequest('connector/order/getOrder', data)
}

export async function fetchOrders(data){
    // return await requests.postRequest("ebay/request/fetchorder", data);
    return await requests.postRequest("ebay/order/fetchorder", data);
}