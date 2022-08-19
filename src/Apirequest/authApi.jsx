import {requests} from "../services/request";

export async function login(credentials){
    return await requests.getRequest('user/login', credentials);
}

// export async function login(credentials){
//     return await requests.getRequest('user/login', credentials);
// }