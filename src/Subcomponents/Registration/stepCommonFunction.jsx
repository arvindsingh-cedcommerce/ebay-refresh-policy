import {userDetails} from "./UserDetailsAcceptTerms";
import React from "react";
import {
    getInstallationForm, redirectToURL,
    saveCompletedStep, saveFilters,
    saveUserDetails
} from "../../Apirequest/registrationApi";
import {notify} from "../../services/notify";
import {accountLinking} from "./AccountLinking";
import {planBody} from "./Plans";
import {stepCompletedBody} from "./registrationCompleted";
import {importSettingsStructure} from "./ImportsettingsBody";
import {importProducts} from "../../Apirequest/shopifyApirequest/shopifyproductsApi";
import {environment} from "../../environment/environment";
import {globalState} from "../../services/globalstate";
import SetDefaultPolicy from "./SetDefaultPolicy";

export  function stepsData(activeStep , anchor = null, data = {}, onChange, errors={}, stepChange ) {

    switch (anchor) {
        case 'U-INFO':
            return userDetails(activeStep, data, onChange, errors);
        case 'LINKED':
            return accountLinking(activeStep, data, onChange, errors, stepChange);
        case 'PLANS':
            return planBody(activeStep, data, onChange, stepChange);
        case 'IMPORT_SETTINGS':
            return importSettingsStructure(activeStep, data, onChange, errors);
        case 'DEFAULT_POLICY':
            return SetDefaultPolicy(activeStep, data, onChange, errors);
        case 'COMPLETED':
            return stepCompletedBody();
        default:return [];
    }
}

export async function validateFunction(step, data, errors ={}){
    switch (step) {
        case 0:
            let {accept_terms} = data;
            let {accept_terms:AcceptTerms, email:Email} = errors;
            AcceptTerms = !accept_terms;
            // let {success} = await checkEmailValidity(email);
            // Email = !success;
            Email = true; //bypass uncomment above line
            return { isValid: !(AcceptTerms && Email), errors:{ accept_terms: AcceptTerms, email: Email} };
        case 1:
            let { modal } = data;
            let { marketplace } = modal;
            let {amazon: amazonError, ebay: ebayError} = errors;
            let amazonValidity = false;
            if(marketplace === 'amazon') {
                let formData = {...data[marketplace]['form_data']};
                // let { auth_via_ced } = formData;
                let obj = {};
                Object.keys(formData).map( key => {
                    switch(key){
                        case 'region_selected' :
                            obj['region_selected'] = formData[key] === '';
                            break;
                        // case 'markeplaceselected' :
                        //     obj['markeplaceselected'] = formData[key].length === 0;
                        //     break;
                        // case 'auth_id' :
                        //     obj['auth_id'] = formData[key] === '';
                        //     break;
                        // case 'auth_token' :
                        //     obj['auth_token'] = formData[key] === '';
                        //     break;
                        // case 'aws_access_key_id' :
                        //     obj['aws_access_key_id'] = !auth_via_ced && formData[key] === '';
                        //     break;
                        // case 'aws_auth_id' :
                        //     obj['aws_auth_id'] = !auth_via_ced && formData[key] === '';
                        //     break;
                        default: break;
                    }
                    return true;
                });
                amazonError =  {...amazonError, ...obj};
                amazonValidity = Object.values(amazonError).indexOf(true) === -1;
            }else{
                amazonValidity = true;
            }
            return { isValid: amazonValidity, errors:{ ebay: {...ebayError}, amazon: {...amazonError}} };

        case 3 :
            let isValid = true;
            let { filters, accounts_connected } = data;
            let { shopify, ebay, amazon} = filters;
            // if( shopify && shopify.product_status === ''){
            //     isValid = false;
            //     errors['shopify']['product_status'] = true;
            // }else errors['shopify']['product_status'] = false;
            if(ebay && accounts_connected.indexOf('ebay') > -1) {
                ebay.forEach((ebayAttributeMapOption, ebayOptionIndex) => {
                    isValid = !(ebayAttributeMapOption.shopify_attribute === '') &&
                        !(ebayAttributeMapOption.marketplace_attribute === '') &&
                        !(ebayAttributeMapOption.shopify_attribute === 'custom' && ebayAttributeMapOption.custom === '');
                    errors['ebay'][ebayOptionIndex]['shopify_attribute'] = ebayAttributeMapOption.shopify_attribute === '';
                    errors['ebay'][ebayOptionIndex]['marketplace_attribute'] = ebayAttributeMapOption.marketplace_attribute === '';
                    errors['ebay'][ebayOptionIndex]['custom'] = ebayAttributeMapOption.shopify_attribute === 'custom' && ebayAttributeMapOption.custom === '';
                });
                if(!ebay.length) isValid = false
            }
            if(amazon && accounts_connected.indexOf('amazon') > -1) {
                amazon.forEach((amazonAttributeMapOption, amazonOptionIndex) => {
                    isValid = !(amazonAttributeMapOption.shopify_attribute === '') &&
                        !(amazonAttributeMapOption.marketplace_attribute === '') &&
                        !(amazonAttributeMapOption.shopify_attribute === 'custom' && amazonAttributeMapOption.custom === '');
                    errors['amazon'][amazonOptionIndex]['shopify_attribute'] = amazonAttributeMapOption.shopify_attribute === '';
                    errors['amazon'][amazonOptionIndex]['marketplace_attribute'] = amazonAttributeMapOption.marketplace_attribute === '';
                    errors['amazon'][amazonOptionIndex]['custom'] = amazonAttributeMapOption.shopify_attribute === 'custom' && amazonAttributeMapOption.custom === '';
                });
                if (!amazon.length ) isValid = false
            }
            return { isValid, errors };
        default:
            break;
    }
}

export async function stepsaveApi(step, data){
    switch (step) {
        case 0 :
            let { mobile, mobile_code,country, accept_terms } = data;
            let dataMatching = { mobile:mobile_code + '-' + mobile, term_and_conditon: accept_terms, country_code: country};
            delete data.country;
            delete data.accept_terms;
            delete data.mobile;
            let userDetailsforApi = { ...data, ...dataMatching};
            let {success, message } = await saveUserDetails(userDetailsforApi);
            if(success){
                notify.success(message);
                await saveCompletedStep( step);
            }
            else notify.error(message);
            break;
        case 1:
            let { modal, onChangeData, ebay, amazon } = data;
            let { marketplace, modalToggle } = modal;
            onChangeData('loader',1, true);
            if(marketplace === 'ebay'){
                let { form_data } = ebay;
                let { site_id, account_type } = form_data;
                let dataforApi = { code : 'ebay', site_id, mode: account_type};
                window.open(`${environment.API_ENDPOINT}/connector/get/installationForm?code=ebay&site_id=${site_id}&mode=${account_type}&bearer=${globalState.getLocalStorage("auth_token")}`, '_parent');
                // let accountConnected = await getInstallationForm(dataforApi);
                // if(accountConnected.success){
                //     redirectToURL(accountConnected.data);
                // }else{
                //     notify.error('eBay account redirect failed');
                // }
            }
            // else if(marketplace === 'amazon'){
            //     let { form_data } = amazon;
            //     let { region_selected } = form_data;
            //     let dataforApi = { code : 'amazon', region: region_selected};
            //     let accountConnected = await getInstallationForm(dataforApi);
            //     if(accountConnected.success){
            //         redirectToURL(accountConnected.data);
            //     }else{
            //         notify.error('Amazon account redirect failed');
            //     }
            // }
            onChangeData('loader', 1, false);
            modalToggle(step);
            break;
        case 3 :
            let { filters } = data;
            let {success : savedFilters, message: messageRecieved } = await saveFilters(filters);
            let { shopify } = filters;
            let { success : productImportSuccess, message :productImportMessage } = await importProducts({marketplace : 'shopify', ...shopify })
            if(productImportSuccess) notify.success(productImportMessage);
            else notify.error(productImportMessage);

            if(savedFilters) notify.success(messageRecieved);
            else notify.error(messageRecieved);

            if(savedFilters) await saveCompletedStep( step);
            break;
        default:
            break;
    }
}



export  function renderProgressindicator(activeStep, stepCount) {
    let i=0;
    let temparr=[];
    while(i < stepCount){
        if(i === activeStep) {
            temparr.push(<span key={"stepper-dot"+i} className="progress-dot-active"/>);
        }
        else {
            temparr.push(<span key={"stepper-dot"+i} className="progress-dot"/>);
        }
        i++;
    }
    return temparr
}
