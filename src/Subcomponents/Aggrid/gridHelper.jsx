export function filterValidation(filters){
    let error = false;
    filters.forEach((filter) => {
        if(!error) {
            error = Object.values(filter).indexOf("") > -1;
        }
    });
    return error;
}

export const filterSchema = {
    attribute:'',
    condition:'',
    value:''
};

export function prepareChoiceoption(optionsArray = [], nameKey, nameValue){
    let options = [];
    optionsArray.forEach((option) =>{
        options.push({
            label: option[nameKey],
            value: option[nameValue].toString(),
            choices: option.hasOwnProperty('choices')?option['choices']:[],
            default_condition:option.hasOwnProperty('default_condition')?option['default_condition']:''
        })
    });
    return options;
}


export function getFilterSentence(filter, attributeoptions, filteroptions){
    let attribute = '';
    let condition = '';
    let filterValue = '';
    Object.keys(filter).forEach((key) =>{
        switch (key) {
            case 'attribute' :
                let attibuteFiltered = attributeoptions.filter( attribute => attribute.value === filter[key]);
                if(attibuteFiltered.length) attribute = attibuteFiltered[0]['label'];
                break;
            case 'condition':
                let conditionFiltered = filteroptions.filter( condition => condition.value === filter[key]);
                condition = conditionFiltered[0]['label'];
                break;
            case 'value':
                filterValue = filter[key];
                break;
            default: break;
        }
    });
    return `${attribute} ${condition} ${filterValue}`;
}