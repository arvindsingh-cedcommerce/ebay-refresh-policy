import {requests} from "../../services/request";

export async function importProducts(filters = {}){
    return requests.getRequest('connector/product/import', filters);
}