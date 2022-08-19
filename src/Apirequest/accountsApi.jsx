import {requests} from "../services/request";

export async function getConnectedAccounts(){
    return await requests.getRequest('ebay/account/getAllConnectedAccounts');
}

export async function updateactiveInactiveAccounts(data){
    return await requests.postRequest('ebay/account/updateActiveInactiveShop', data);
}

export async function viewUserDetailsEbay(data){
    return await requests.postRequest('ebay/request/userDetails', data);
}