import {requests} from "../../services/request";

export async function getproducts(filters = {}){
    return await requests.getRequest('connector/product/getProducts', filters);
}

export async function getproductsCount(filters = {}){
    return await requests.getRequest('connector/product/getProductsCount', filters);
}

export async function fetchProductById(data){
    return await requests.getRequest('connector/product/getProducts', { ...data })
    // return await requests.getRequest('connector/product/getProductById', { ...data })
}

export async function testController(data){
    return await requests.getRequest('ebay/product/testQueue',  data )
}