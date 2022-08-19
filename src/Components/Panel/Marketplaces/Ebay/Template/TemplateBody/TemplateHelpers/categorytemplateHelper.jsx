import React from "react";
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {select, textField} from "../../../../../../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../../../../../../PolarisComponents/InfoGroups";
import {isUndefined} from "util";
import {getConnectedAccounts} from "../../../../../../../Apirequest/accountsApi";
import {getSiteName} from "../../../../../Accounts/accountsHelper";
import {json} from "../../../../../../../globalConstant/static-json";

export function CategoryPath(categoryType, formData ){
    let tempString=Object.values(formData[categoryType].category_mapping_name);
    tempString=tempString.join(' / ');
    if(tempString===''){
        return 'Please select a category'
    }
    return tempString;
}

export function getoptionsFromRecommendation(data = {}){
    let option = [];
    Object.keys(data).map(value => {
        option = [ ...option, { label : data[value], value}];
        return true;
    });
    return option;
}

export function getLabelName(data, fields){
    let labelArray = [];
    fields.forEach(field => {
        if(data && data.hasOwnProperty(field)) labelArray = [...labelArray, data[field]];
    });
    return labelArray.join('-');

}

export async function getMarketplaceConnectedAccount(marketplace = 'ebay', siteNameOptions = ['user_id'], data = []){
    let sites = [];
    let success = true;
    if(!data.length) {
        let { success: successAccountFetch, data : accountdata } = await getConnectedAccounts();
        success = successAccountFetch;
        if(Array.isArray(accountdata)) data = [...accountdata];
    }

    if(success){
        switch (marketplace) {
            case 'ebay' : data.forEach((account) => {
                    if (account.marketplace === marketplace) {
                        let modifiedLabel = `${getSiteName(account.warehouses[0].site_id)}-${getLabelName(account.warehouses[0], siteNameOptions)}`;
                        sites = [...sites, {label: modifiedLabel, value: (account.id).toString(), ...account}]
                    }
                });
                break;
            case 'amazon':
                data.forEach((account) => {
                    if (account.marketplace === marketplace) {
                        let modifiedLabel = `${getLabelName(account.warehouses[0], ['region','seller_id'])}-${getMarketplaceCodefromId(account.warehouses[0]['marketplace_id'][0])}`;
                        sites = [...sites, {label: modifiedLabel, value: (account.id).toString(), ...account}]
                    }
                });
                break;
            case 'shopify':
                data.forEach((account) => {
                    if (account.marketplace === marketplace) {
                        let modifiedLabel = `${(account.name).toUpperCase()}-${(account.country).toUpperCase()}`;
                        sites = [...sites, {label: modifiedLabel, value: (account.id).toString(), ...account}]
                    }
                });
                break;
            default: break;
        }
    }
    return sites;
}

export function renderOptionalAttributeErrors(key, errors){
    let temparr=[];
    errors[key].optional_attributes.missingerrors.forEach((error)=>{
        temparr.push(<li className="mb-2">{error}</li>);
    });
    return ( bannerPolaris("",    <ul>
        {temparr}
    </ul>, "critical"));
}

export function renderReqAttributeErrors(key, errors){
    let temparr=[];
    errors[key].attributes.missingerrors.forEach((error,index)=>{
        temparr.push(<li className="mb-2" key={`errors-li-${index}`}>{error}</li>);
    });
    return( bannerPolaris("", <ul>
        {temparr}
    </ul>, "critical"));
}

export function getMarketplaceCodefromId(marketplaceId){
    let code = json.amazon_marketplaceid_code.filter(obj => obj.value === marketplaceId);
    if(code.length) return code[0]['label'];
    return ''
}

export function renderRequired(categoryType, form_data, handleMappingChange){
    let temparr=[];

    form_data[categoryType].attribute_mapping.required_map.forEach((value,index)=>{
        let ebayRecommendationsoptions =   form_data[categoryType].attribute_mapping.required_map[index].ebayAttrib !== '' && form_data[categoryType].attribute_mapping.required_map[index].shopifyAttrib === 'recommendation' && form_data[categoryType].attribute_mapping.ebayAttribInfo.hasOwnProperty(form_data[categoryType].attribute_mapping.required_map[index].ebayAttrib) ?
            form_data[categoryType].attribute_mapping.ebayAttribInfo[form_data[categoryType].attribute_mapping.required_map[index].ebayAttrib].recommendedoptions : [];
        temparr.push(
            <Card key={'required-attribute-'+index} title={"# "+(index+1)}>
                <Card.Section>
                    <Stack vertical={false}>
                        <Stack.Item fill>
                            <FormLayout>
                                <FormLayout.Group condensed>
                                    {
                                        select("eBay attributes", form_data[categoryType].attribute_mapping.ebayAttrib, handleMappingChange.bind(this,'ebayAttrib','required',index,categoryType), form_data[categoryType].attribute_mapping.required_map[index].ebayAttrib, 'Select..', false, false, true )
                                    }
                                    {
                                        select("Shopify attributes", form_data[categoryType].attribute_mapping.shopifyAttrib, handleMappingChange.bind(this,'shopifyAttrib','required',index,categoryType), form_data[categoryType].attribute_mapping.required_map[index].shopifyAttrib, 'Select..', false, false )
                                    }
                                    {form_data[categoryType].attribute_mapping.required_map[index].shopifyAttrib==='recommendation' &&
                                    select("eBay Recommendations", ebayRecommendationsoptions, handleMappingChange.bind(this, 'recommendation', 'required', index, categoryType), form_data[categoryType].attribute_mapping.required_map[index].recommendation, 'Select..', false, false, form_data[categoryType].attribute_mapping.required_map[index].shopifyAttrib !== 'recommendation' )
                                    }
                                    {
                                        form_data[categoryType].attribute_mapping.required_map[index].ebayAttrib !== '' && form_data[categoryType].attribute_mapping.required_map[index].shopifyAttrib === 'recommendation' && form_data[categoryType].attribute_mapping.required_map[index].recommendation ==='custom' &&
                                        textField("Custom Value", form_data[categoryType].attribute_mapping.required_map[index].defaultText, handleMappingChange.bind(this, 'defaultText', 'required', index,categoryType), "", '*required', false, "text", "","", false, form_data[categoryType].attribute_mapping.required_map[index].recommendation !== 'custom')
                                    }
                                </FormLayout.Group>
                            </FormLayout>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
            </Card>
        );
    })
    return temparr;
}

export function renderOptional(categoryType, form_data, handleDelete, handleMappingChange){
    let temparr=[];
    form_data[categoryType].attribute_mapping.optional_map.forEach((value,index)=>{
        let ebayRecommendationsoptions = form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib !== '' && form_data[categoryType].attribute_mapping.optional_map[index].shopifyAttrib === 'recommendation' && form_data[categoryType].attribute_mapping.ebayAttribInfo.hasOwnProperty(form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib) ?
            form_data[categoryType].attribute_mapping.ebayAttribInfo[form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib].recommendedoptions : [];

        temparr.push(
            <Card key={'optionalcategory'+index} title={"# "+(index+1)} actions={[{content:'Delete',onAction:handleDelete.bind(this,index,'optional',categoryType) ,disabled: form_data[categoryType].attribute_mapping.optional_map.length===0}]}>
                <Card.Section>
                    { form_data[categoryType].attribute_mapping.optional_map.length>0 &&
                    <Stack vertical={false}>
                        <Stack.Item fill>
                            <FormLayout>
                                <FormLayout.Group condensed>
                                    {
                                        select( "eBay attributes", form_data[categoryType].attribute_mapping.ebayAttrib, handleMappingChange.bind(this, 'ebayAttrib', 'optional', index,categoryType), form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib, 'Select..')
                                    }
                                    {
                                        select( "Shopify attributes", form_data[categoryType].attribute_mapping.shopifyAttrib, handleMappingChange.bind(this, 'shopifyAttrib', 'optional', index,categoryType), form_data[categoryType].attribute_mapping.optional_map[index].shopifyAttrib, 'Select..', false, false, form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib === '')
                                    }
                                    {
                                        form_data[categoryType].attribute_mapping.optional_map[index].shopifyAttrib === 'recommendation' &&
                                            select("eBay Recommendations", ebayRecommendationsoptions, handleMappingChange.bind(this, 'recommendation', 'optional', index, categoryType), form_data[categoryType].attribute_mapping.optional_map[index].recommendation, 'Select..', false, false, form_data[categoryType].attribute_mapping.optional_map[index].shopifyAttrib !== 'recommendation')
                                    }
                                    {
                                        form_data[categoryType].attribute_mapping.optional_map[index].ebayAttrib !== '' && form_data[categoryType].attribute_mapping.optional_map[index].shopifyAttrib === 'recommendation' && form_data[categoryType].attribute_mapping.optional_map[index].recommendation === 'custom' &&
                                            textField("Custom Value", form_data[categoryType].attribute_mapping.optional_map[index].defaultText, handleMappingChange.bind(this, 'defaultText', 'optional', index,categoryType), "", '*required', false, "text", "",  "", false, form_data[categoryType].attribute_mapping.optional_map[index].recommendation !== 'custom')
                                    }
                                </FormLayout.Group>
                            </FormLayout>
                        </Stack.Item>
                    </Stack>
                    }
                </Card.Section>
            </Card>
        );
    });
    return temparr;
}

export function rendercustom(categoryType, form_data, handleDelete, handleMappingChange){
    let temparr=[];
    if(!isUndefined(form_data[categoryType].attribute_mapping.custom_map)) {
        form_data[categoryType].attribute_mapping.custom_map.forEach((value, index) => {
            temparr.push(
                <Card key={'customcategory' + index} title={"# " + (index + 1)} actions={[{
                    content: 'Delete',
                    onAction: handleDelete.bind(this, index, 'custom', categoryType),
                    disabled: form_data[categoryType].attribute_mapping.custom_map.length === 0
                }]}>
                    <Card.Section>
                        { form_data[categoryType].attribute_mapping.custom_map.length > 0 &&
                        <Stack vertical={false}>
                            <Stack.Item fill>
                                <FormLayout>
                                    <FormLayout.Group condensed>
                                        {
                                            textField("Custom attribute", form_data[categoryType].attribute_mapping.custom_map[index].customAttrib, handleMappingChange.bind(this, 'customAttrib', 'custom', index, categoryType), 'Create..')
                                        }
                                        {
                                            select("Shopify attributes",form_data[categoryType].attribute_mapping.customShopifyAttrib, handleMappingChange.bind(this, 'shopifyAttrib', 'custom', index, categoryType), form_data[categoryType].attribute_mapping.custom_map[index].shopifyAttrib, 'Select..', false, false, form_data[categoryType].attribute_mapping.custom_map[index].customAttrib === '' )
                                        }
                                        { form_data[categoryType].attribute_mapping.custom_map[index].customAttrib !== '' && form_data[categoryType].attribute_mapping.custom_map[index].shopifyAttrib === 'custom' &&
                                        textField( "Custom Value", form_data[categoryType].attribute_mapping.custom_map[index].defaultText, handleMappingChange.bind(this, 'defaultText', 'custom', index, categoryType), "", "*required", false, "text", "", "", false, form_data[categoryType].attribute_mapping.custom_map[index].shopifyAttrib !== 'custom')
                                        }
                                    </FormLayout.Group>
                                </FormLayout>
                            </Stack.Item>
                        </Stack>
                        }
                    </Card.Section>
                </Card>
            );
        });
    }
    return temparr;
}

export const sites = [
    { label : "UK", value: "UK"},
    { label : "US", value: "US"},
];

export function formValidator( form_data, errors, primary_category_feature_options  ){
    let Errors=0;
    Object.keys( form_data ).map(key => {
        switch(key){
            case 'name':
                if( form_data[key]===''){
                    errors.name=true;
                    Errors+=1;
                }
                else errors.name=false;
                break;
            case 'primaryCategory':
                if(!isUndefined( form_data[key].category_mapping) && Object.keys(form_data[key].category_mapping).length ===0){
                    errors.primaryCategory.noCategorySelected=true;
                    Errors+=1;
                }
                else{
                    errors.primaryCategory.noCategorySelected=false;
                    if(Object.keys(form_data[key].category_mapping).length<Object.keys(form_data[key].category_mapping_options).length){
                        errors.primaryCategory.leafCategoryMissing=true;
                        Errors+=1;
                    }
                    else{
                       errors.primaryCategory.leafCategoryMissing=false;
                        if(form_data[key].required_attribute_count>0 && form_data[key].show_Attribute_mapping){
                            let tempError=[];
                            form_data[key].attribute_mapping.required_map.forEach((reqattrib,positions)=>{
                                let shopifyAtr=false;
                                let recommen=false;
                                let defauText=false;
                                if(reqattrib.shopifyAttrib===''){
                                    shopifyAtr=true;
                                }else{
                                    shopifyAtr=false;
                                    if(reqattrib.shopifyAttrib==='recommendation'){
                                        if(reqattrib.recommendation===''){
                                            recommen=true;
                                        }else{
                                            recommen=false;
                                            if(reqattrib.recommendation==='custom'){
                                                defauText= reqattrib.defaultText==='';
                                            }
                                        }
                                    }
                                }

                                if(shopifyAtr || recommen || defauText){
                                    let tempTextShopifyAttr= shopifyAtr?' Shopify attribute':'';
                                    let tempTextrecommenAttr= recommen?' eBay recommendation':'';
                                    let tempdefaultText= defauText?' Custom field':'';
                                    tempError.push(
                                        `Missing fields in required attribute #${(positions+1)}${tempTextShopifyAttr}${tempTextrecommenAttr}${tempdefaultText}`
                                    )
                                }
                            });
                            if(tempError.length>0){
                                errors.primaryCategory.attributes.missingerrors= [...tempError];
                                Errors+=1;
                            }else errors.primaryCategory.attributes.missingerrors=false;
                        }
                        if( form_data[key].optional_attribute_count>0 && form_data[key].show_Attribute_mapping){
                            let tempError=[];
                            form_data[key].attribute_mapping.optional_map.forEach((optionattrib,positions)=>{
                                let shopifyAtr=false;
                                let recommen=false;
                                let defauText=false;
                                if(optionattrib.ebayAttrib!=='') {
                                    if (optionattrib.shopifyAttrib === '') {
                                        shopifyAtr = true;
                                    } else {
                                        shopifyAtr = false;
                                        if (optionattrib.shopifyAttrib === 'recommendation') {
                                            if (optionattrib.recommendation === '') {
                                                recommen = true;
                                            } else {
                                                recommen = false;
                                                if (optionattrib.recommendation === 'custom')
                                                    defauText = optionattrib.defaultText === '';
                                            }
                                        }
                                    }

                                    if (shopifyAtr || recommen || defauText) {
                                        let tempTextShopifyAttr = shopifyAtr ? ' Shopify attribute' : '';
                                        let tempTextrecommenAttr = recommen ? ' eBay recommendation' : '';
                                        let tempdefaultText = defauText ? ' Custom field' : '';

                                        tempError.push(
                                            'Missing fields in optional attribute #' + (positions + 1) + tempTextShopifyAttr + tempTextrecommenAttr + tempdefaultText
                                        )
                                    }
                                }
                            });
                            if(tempError.length>0){
                                errors.primaryCategory.optional_attributes.missingerrors= [...tempError];
                                Errors+=1;
                            }else{
                                errors.primaryCategory.optional_attributes.missingerrors=false;
                            }

                        }
                    }
                }
                if(!isUndefined(primary_category_feature_options) && primary_category_feature_options.length>0){
                    if(form_data[key].category_feature === ''){
                        errors.primaryCategory.category_feature=true;
                        Errors+=1;
                    }else errors.primaryCategory.category_feature=false;
                }
                break;
            case 'secondaryCategory':
                if(form_data.enable_advance_options) {
                    if (!isUndefined(form_data[key].category_mapping) && Object.keys(form_data[key].category_mapping).length === 0) {
                        errors.secondaryCategory.noCategorySelected = true;
                        Errors += 1;
                    }
                    else {
                        errors.secondaryCategory.noCategorySelected = false;
                        if (Object.keys(form_data[key].category_mapping).length < Object.keys(form_data[key].category_mapping_options).length) {
                            errors.secondaryCategory.leafCategoryMissing = true;
                            Errors += 1;
                        } else errors.secondaryCategory.leafCategoryMissing = false;
                    }
                }
                break;
            default : break;
        }
        return true;
    });
    return { errors, errorFree : Errors ===0 }
}

export const variateType=[
    {label:'Increase',value:'increase'},
    {label:'Decrease',value:'decrease'},
];

export const levels = [
    { label : "6", value : "6"},
    { label : "5", value : "5"},
    { label : "4", value : "4"},
    { label : "3", value : "3"},
    { label : "2", value : "2"},
    { label : "1", value : "1"},
];
