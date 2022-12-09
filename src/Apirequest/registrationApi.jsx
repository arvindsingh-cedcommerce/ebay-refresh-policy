import {requests} from "../services/request";

export async function checkStepCompleted () {
    let path = '/App/User/Step';
    return await requests.getRequest('ebay/onboarding/getStepCompleted',{path});
}

export async function getUserDetails (){
    return await requests.getRequest('ebay/onboarding/getRegistrationDetails');
}

export async function checkEmailValidity(email){
    return await requests.postRequest('frontend/app/verifyEmail', {email});
}

export async function saveUserDetails(data){
    return await requests.getRequest('ebay/onboarding/saveregistrationdata', data)
}
export async function importProduct() {
    return await requests.getRequest('ebay/product/importProduct')
}
export async function importCollectionProduct() {
    return await requests.getRequest('ebay/product/importCollectionProduct')
}

export async function initiateVendorProductTypeFetch() {
    return await requests.getRequest('ebay/account/initiateVendorProductTypeFetch')
}
export async function getImportAttribute() {
    return await requests.getRequest('ebay/account/getImportAttribute')
}
export async function saveFilters(data){
    return await requests.postRequest('ebay/request/savefilters', data)
}

export async function saveCompletedStep(step){
    return await requests.postRequest('ebay/onboarding/stepCompleted', {paths: ['/App/User/Step'], step: step+1});
}

export async function getInstallationForm(data){
    return await requests.getRequest('connector/get/installationForm', data);
}

export async function getPlans(){
    return await requests.getRequest('plan/plan/get');
}

export async function getActivePlan(){
    return await requests.getRequest('plan/plan/getActive');
}

export async function choosePlan(data){
    return await requests.getRequest('plan/plan/choose', data);
}

export async function getSiteID(){
    return await requests.getRequest('ebayV1/get/siteId');
}

// export async function getAccountsConnection(){
export async function checkAccountsConnected(){
    return await requests.getRequest('ebay/onboarding/checkaccountsconnected');
}

export function redirectToURL(data){
    let { post_type, action } = data;
    if(post_type === 'redirect')
        window.open(action, '_parent');
}