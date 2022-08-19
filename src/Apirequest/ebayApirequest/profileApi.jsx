import {requests} from "../../services/request";

export async function getFilterAttributes(filters = {}){
    return await requests.getRequest('ebay/category/getSourceAttributes', filters);
}

export async function getProductsbyquery(filters = {}){
    return await  requests.postRequest("ebay/product/productsByQuery", filters);
}

export async function saveProfile(data){
    // return await  requests.postRequest("connector/profile/set", data);
    return await  requests.postRequest("ebay/profile/saveProfile", data);
}

export async function deleteProfile(id){
    return await  requests.postRequest("ebay/profile/deleteProfile", { id });
}

export async function getallProfile(filter = {} ){
    return await  requests.getRequest("connector/profile/getAllProfiles", filter );
}

export async function getProfilebyId( id ){
    return await  requests.getRequest("ebay/profile/getProfilebyId", { id } );
}

