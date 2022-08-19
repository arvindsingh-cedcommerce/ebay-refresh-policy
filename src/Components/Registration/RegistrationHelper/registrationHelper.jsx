export function regapiDataModifier(stepTag = '', data = {}){
    switch (stepTag) {
        case 'user_details' :
            let {   email , shop_owner : full_name, country,  } = data;
            if(!full_name) full_name = data.full_name;
            return { email, full_name, country }
        default: return {}
    }
}

export function checkfilteralreadyPresent(data = [], fieldtoCheck = '', valueToCheck = ''){
    let filterDataExists = data.filter( filter => filter.hasOwnProperty(fieldtoCheck) && filter[fieldtoCheck] === valueToCheck);
    return !!filterDataExists.length;
}