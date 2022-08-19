import {requests} from "../../services/request";

export async function getproducts(filters = {}){
    return await requests.getRequest('connector/product/getProducts', filters);
}

export async function getproductsCount(filters = {}){
    return await requests.getRequest('connector/product/getProductsCount', filters);
}

export async function uploadproducts(filters = {}){
    return await requests.postRequest('amazon/request/uploadProduct', filters);
}

export async function matchproducts(filters = {}){
    return await requests.postRequest('amazon/request/matchProduct', filters);
}

export async function uploadprice(filters = {}){
    return await requests.postRequest('amazon/request/priceUpload', filters);
}
export async function uploadinventory(filters = {}){
    return await requests.postRequest('amazon/request/inventoryUpload', filters);
}
export async function uploadimage(filters = {}){
    return await requests.postRequest('amazon/request/imageUpload', filters);
}
export async function uploadrelationship(filters = {}){
    return await requests.postRequest('amazon/request/relationshipUpload', filters);
}
export async function deleteproduct(filters = {}){
    return await requests.postRequest('amazon/request/deleteProduct', filters);
}

export async function saveadditionalDetailsProduct(data = {}){
    return await requests.postRequest('amazon/request/saveproductadditional', data);
}