import {requests} from "../services/request";

export async function getConfigurations (marketplace){
    return await requests.getRequest('ebay/configuration/getConfigurationInformation', { marketplace });
}
