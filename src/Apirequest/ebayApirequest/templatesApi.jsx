import {requests} from "../../services/request";

export async function getTemplates(filters){
    return await requests.postRequest('ebay/template/getTemplate', filters);
}

export async function getTemplatebyId(id){
    return await requests.postRequest('ebay/template/getTemplatebyId', {template_id: id});
}

export async function saveTemplates(data){
    // return await requests.postRequest('ebay/request/saveTemplate', data);
    return await requests.postRequest('ebay/template/saveTemplate', data);
}

export async function deleteTemplate(template_id){
    return await requests.postRequest('ebay/template/deleteTemplate', {template_id});
}

export async function getSiteId(){
    return await requests.getRequest('ebayV1/get/siteId');
}

export async function getCategoryPredictions(filter){
    // return await requests.getRequest("ebay/request/categoryPredictions", filter )
    return await requests.getRequest("ebay/category/categoryPredictions", filter )
}

export async function getParentCategories(filter){
    // return await requests.getRequest('ebay/request/getParentCategories',filter)
    return await requests.getRequest('ebay/category/getParentCategories',filter)
}

export async function getCategoriesApi(obj){
    // return await requests.postRequest("ebay/request/getCategories", obj);
    return await requests.postRequest("ebay/category/getCategories", obj);
}

export async function getattributesCategorywise( params ){
    // return await requests.getRequest('ebay/request/getAttributes', { ...params });
    return await requests.getRequest('ebay/category/getAttributes', { ...params });
}

export async function getcategoryFeatures( params ){
    // return await requests.getRequest('ebay/request/categoryFeatures', { ...params });
    return await requests.getRequest('ebay/category/categoryFeatures', { ...params });
}
export async function getEbayUserDetails( data ){
    return await requests.getRequest('ebayV1/get/userDetails', {...data});
}
export async function getStoreDetails(data) {
    return await requests.getRequest('ebay/request/storeDetails', {...data})
}
export async function getAttributesByProductQuery( filters = {} ){
    return await requests.getRequest('connector/product/getAttributesByProductQuery', filters);
}

export async function getMetafields() {
    return await requests.getRequest('ebay/product/getMetafields')
}

export async function getMetafieldsOptions( ){
    return await requests.getRequest('shopify/product/getMetafieldsOptions');
}

export async function getSiteid( ){
    return await requests.getRequest('ebayV1/get/siteId');
}

export async function getConfigurablesAttributes( ){
    return await requests.getRequest('ebay/template/configurableAttributes');
}

export async function duplicateTemplate(data) {
    return await requests.postRequest('ebay/Template/copyTemplate', data);
}
export async function saveTemplateToProfile(data) {
    return await requests.postRequest('ebay/Template/assigntemplateToProfile', data);
}