import {requests} from "../../services/request";

export async function getPolicies(filters){
    return await requests.postRequest('ebay/policy/getPolicies', filters);
}

export async function getEbayshopSettings(reqObj = {}){
    return await requests.postRequest('ebay/request/getEbayDetails', reqObj);
}

export async function deletePolicy( reqObj ){
    return await requests.postRequest('ebay/policy/deletePolicy', { ...reqObj });
}

export async function saveBusinessPolicy(policy){
    // return await requests.postRequest('ebay/request/savePolicy', policy);
    return await requests.postRequest('ebay/policy/savePolicy', policy);
}

export async function getBusinessPolicy(profile_id){
    // return await requests.getRequest('ebay/request/getPolicybyId', { profile_id });
    return await requests.getRequest('ebay/policy/getPolicybyId', { profile_id });
}