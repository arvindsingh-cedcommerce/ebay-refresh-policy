import {requests} from "../services/request";

export async function getConnectedAccounts(){
    return await requests.getRequest('ebay/account/getAllConnectedAccounts');
}

export async function updateactiveInactiveAccounts(data){
    return await requests.postRequest('ebay/account/updateActiveInactiveShop', data);
}

export async function viewUserDetailsEbay(data){
    return await requests.getRequest('ebay/request/userDetails', data);
}

export async function uploadPic(data) {
    return await requests.postRequest('ebay/userprofile/userProfilePhoto', data);
}

export async function uploadCustomData(data) {
    return await requests.postRequest('ebay/userprofile/userProfileData', data);
}

export async function getProfileImage(){
    return await requests.getRequest('ebay/userprofile/getUserPhoto');
}