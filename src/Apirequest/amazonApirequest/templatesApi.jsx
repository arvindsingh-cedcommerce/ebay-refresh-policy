import {requests} from "../../services/request";

export async function getallcategories(data = {}){
    return await requests.postRequest('amazon/request/getAmazonCategory', data);
}

export async function getAttributesForCategory(data = {}){
    return await requests.postRequest('amazon/request/getAmazonAttributes', data);
}