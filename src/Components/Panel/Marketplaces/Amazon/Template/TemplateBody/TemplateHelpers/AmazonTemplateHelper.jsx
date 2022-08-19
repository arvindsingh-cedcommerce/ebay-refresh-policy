import {prepareChoiceforArray} from "../../../../../../../services/helperFunction";
import {prepareChoiceoption} from "../../../../../../../Subcomponents/Aggrid/gridHelper";
let attribute={amazon_attribute:'',shopify_attribute:'',recommendation:'', custom_text:''};

export const changeValuetype = [
    {label:'Increase by', value:'increase'},
    {label:'Decrease by', value:'decrease'},
];

export const changeValueby = [
    { label: 'Percentage', value:'percentage' },
    { label: 'Value', value:'value' },
];

export const changeRequired = [
    { label: 'Use default', value:'default' },
    { label: 'Change', value:'change' },
];

export const priceModifieroptions = [
    { label: 'Use modifier', value:'modifier' },
    { label: 'Map to attribute or custom value', value:'map' },
];

export const yesNoOptions = [
    { label:'Yes', value: 'yes' },
    { label:'No', value: 'no' }
];

export const Shopifyattributes = [
    { label:'Set a custom', value: 'custom' },
    { label:'Price', value: 'price' }
];

export const templatetabs = [
    {
        id: 'all-template',
        content: 'All',
        title: 'All',
        accessibilityLabel: 'All templates',
        panelID: 'all-template-content',
        type: 'all',
    },
    {
        id: 'pricing_template',
        content: 'Pricing',
        title: 'Pricing',
        panelID: 'pricing-template-content',
        type: 'price',
    },
    {
        id: 'inventory-template',
        content: 'Inventory',
        title: 'Inventory',
        panelID: 'inventory-template-content',
        type: 'inventory',
    },
    {
        id: 'title-template',
        content: 'Title',
        title: 'Title',
        panelID: 'title-template-content',
        type: 'title',
    },
    {
        id: 'category-template',
        content: 'Category',
        title: 'Category',
        panelID: 'category-template-content',
        type: 'category',
    }
]

export function getTypeoftabs(tab){
    return templatetabs[tab]['type'];
}


export function inventoryTemplateFormValidator(form_data, errorsObj){

        let errors=0;
        Object.keys(form_data).map(key => {
            switch(key){
                case 'name':
                    if(form_data[key]===''){
                        errorsObj['name'] = true;
                        errors+=1;
                    }
                    else errorsObj['name'] = false;
                    break;
                case 'change_price':
                    if(form_data[key] === 'custom'){
                        Object.keys(form_data['modify_price']).map(modifypricekey =>{
                            switch (modifypricekey) {
                                case 'change_type':
                                    if(form_data['modify_price'][modifypricekey] === ''){
                                        errorsObj['modify_price'][modifypricekey] = true;
                                        errors+=1;
                                    }else  errorsObj['modify_price'][modifypricekey] = false;
                                    break;
                                case 'change_by':
                                    if(form_data['modify_price'][modifypricekey] === ''){
                                        errorsObj['modify_price'][modifypricekey] = true;
                                        errors+=1;
                                    }else  errorsObj['modify_price'][modifypricekey] = false;
                                    break;
                                case 'change_value':
                                    if(form_data['modify_price'][modifypricekey] === '' || form_data['modify_price'][modifypricekey] < 0 ){
                                        errorsObj['modify_price'][modifypricekey] = true;
                                        errors+=1;
                                    }else  errorsObj['modify_price'][modifypricekey] = false;
                                    break;
                                default: break;
                            }
                            return true;
                        });
                    }else errorsObj['modify_price'] = {  change_type:false, change_by :false, change_value:false};
                    break;
                case 'allow_business_price':
                    if(form_data[key] === 'yes' && form_data['use_default_business_price'] === 'no'){
                        if(form_data['business_price']['attribute'] === ''){
                            errorsObj['business_price']['attribute'] = true;
                            errors+=1;
                        }else errorsObj['business_price']['attribute'] = false;

                        if(form_data['business_price']['attribute'] === 'custom' && form_data['business_price']['price'] === '' ){
                            errorsObj['business_price']['price'] = true;
                            errors+=1;
                        }else errorsObj['business_price'] = {  attribute: false, price: false }
                    }else errorsObj['business_price'] = {  attribute: false, price: false }
                    break;
                default:
                    break;
            }
            return true;
        });
        return { canSubmit: errors===0, errors : errorsObj}
}

export function prepareCategoryOptions(data = []){
    let options = [];
    if(data && Array.isArray(data)) {
        data.forEach(option => {
            let {label, value, optgroup} = option;
            let singleOption = {};
            singleOption = {...singleOption, title: label};
            if (optgroup) {
                singleOption = {...singleOption, options: [...prepareChoiceoption(optgroup, "label", "value")]};
                singleOption.options.forEach((opt, index) => {
                    singleOption.options[index] = {...singleOption.options[index], parent_id: value};
                });
            } else singleOption = {...singleOption, value, parent_id: value};
            options = [...options, {...singleOption}];
        });
    }
    return options;
}

export function getChosenCategorySearchOption(choice, categoryoptions ){
    let option = {};
    categoryoptions.forEach( category => {
       if(category.hasOwnProperty('options')){
           category.options.forEach(subcategory => {
               if(subcategory.value === choice) option = {...subcategory};
           });
       }
    });
    return option;
}

export function prepareAutocompleteoptions(search = '', categoryoptions = []){
    let autocompleteOptions = [];
    if(search === ''){
        categoryoptions.forEach(category => {
            if(category.hasOwnProperty('options')) autocompleteOptions = [ ...autocompleteOptions, ...category.options]
        })
    }else{
        categoryoptions.forEach(category => {
           if(category.hasOwnProperty('options')){
               category.options.forEach(subCategory => {
                  if(subCategory.label.match(search)) autocompleteOptions = [...autocompleteOptions, subCategory];
               });
           }
        });
    }
    return autocompleteOptions;
}

export function attributesSeperator(options = []){
    let required_attributes = [];
    let optional_attributes = [];
    let amazon_options = [];
    let required_attribute_mapping = [];
    let amazon_attribute_max_occurence = {};
    let recommendation_mapping = {};
    let required_attribute_present = false;
    let optional_attribute_present = false;
    if(options && Array.isArray(options)) {
        options.forEach(option => {
            let {label, value} = option;
            if (label === 'Required Attributes') {
                required_attribute_present = true;
                Object.keys(value).map(opt => {
                    let {minOccurs, maxOccurs, name, restriction} = value[opt];
                    let optionValues = false;
                    if (restriction && restriction.hasOwnProperty('optionValues')) optionValues = restriction.optionValues;
                    recommendation_mapping[opt] = optionValues ? [{
                        label: 'Set a custom',
                        value: 'custom'
                    }, ...prepareChoiceforArray(optionValues)] : [{label: 'Set a custom', value: 'custom'}];
                    amazon_attribute_max_occurence[opt] = Math.max(parseInt(minOccurs), parseInt(maxOccurs));
                    required_attributes = [...required_attributes, {label: name, value: opt, disabled: true}];
                    required_attribute_mapping = [...required_attribute_mapping, {...attribute, ...{amazon_attribute: opt}}]
                });
                if (required_attributes.length) {
                    amazon_options.push({title: label, options: [...required_attributes]});
                }
            }
            if (label === 'Optional Attributes') {
                optional_attribute_present = true;
                Object.keys(value).map(opt => {
                    let {minOccurs, maxOccurs, name, restriction} = value[opt];
                    let optionValues = false;
                    if (restriction && restriction.hasOwnProperty('optionValues')) optionValues = restriction.optionValues;
                    recommendation_mapping[opt] = optionValues ? [{
                        label: 'Set a custom',
                        value: 'custom'
                    }, ...prepareChoiceforArray(optionValues)] : [{label: 'Set a custom', value: 'custom'}];
                    amazon_attribute_max_occurence[opt] = Math.max(minOccurs ? parseInt(minOccurs) : 1, maxOccurs ? parseInt(maxOccurs) : 1);
                    optional_attributes = [...optional_attributes, {label: name, value: opt}];
                });
                if (optional_attributes.length) {
                    amazon_options.push({title: label, options: [...optional_attributes]});
                }
            }
        });
    }
    return { amazon_options,  required_attribute_mapping, amazon_attribute_max_occurence, recommendation_mapping, optional_attribute_present, required_attribute_present };

}