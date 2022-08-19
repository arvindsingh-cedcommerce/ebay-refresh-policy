import React from "react";
import {Badge, Icon, Stack, Tag, Tooltip} from "@shopify/polaris";
import {DeleteMajorMonotone, EditMajorMonotone, MinusMinor} from "@shopify/polaris-icons";
import {isUndefined} from "util";
import {checkbox} from "../../../../../PolarisComponents/InputGroups";
import {polarisIcon} from "../../../../../PolarisComponents/InfoGroups";
import {json} from "../../../../../globalConstant/static-json";

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Actions", field: "actions",
        autoHeight: true,
        width: 75,
        pinned: 'right',
        cellRendererFramework:actionRenderer.bind(this, incellElement.bind(this))
    },{
        headerName: "Name",field: "name",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true , sortable:true, filter:'agTextColumnFilter'
    },
    {
        headerName: "Accounts",field: "account",resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true, cellRendererFramework:accountRenderer.bind(this, incellElement.bind(this))
    }
] }

export const ShippingPolicyServicetype = [
    {label:'Flat',value:'Flat'},
    {label:'Calculated',value:'Calculated'},
    {label:'Calculated Domestic Flat International',value:'CalculatedDomesticFlatInternational'},
    {label:'Flat Domestic Calculated International',value:'FlatDomesticCalculatedInternational'},
];

export const yesNoOptions =[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}];

export const countriestoInclude=[
    {value : 'Worldwide', label :'Worldwide', checked:false},
    {value : 'CA', label :'Canada', flag: 'https://www.countryflags.io/ca/flat/64.png', checked:false},
    {value : 'Americas', label :'Americas', flag: false, checked:false},
    {value:'Europe', label:'Europe', flag: false, checked:false},
    {value: 'Asia',label :'Asia', flag: false, checked:false},
    {value: 'AU',label :'Australia', flag: 'https://www.countryflags.io/au/flat/64.png', checked:false},
    {value: 'UK',label :'United Kingdom', flag: 'https://www.countryflags.io/uk/flat/64.png', checked:false},
    {value: 'MX',label :'Mexico', flag:'https://www.countryflags.io/mx/flat/64.png', checked:false},
    {value: 'DE',label :'Germany', flag: 'https://www.countryflags.io/de/flat/64.png', checked:false},
    {value: 'JP',label :'Japan', flag: 'https://www.countryflags.io/jp/flat/64.png', checked:false},
    {value: 'BR',label :'Brazil', flag: 'https://www.countryflags.io/br/flat/64.png', checked:false},
    {value: 'FR',label :'France', flag: 'https://www.countryflags.io/fr/flat/64.png', checked:false},
    {value: 'CN',label :'China', flag:  'https://www.countryflags.io/cn/flat/64.png', checked:false},
    {value: 'RU',label :'Russian Federation', flag: 'https://www.countryflags.io/ru/flat/64.png', checked:false},
    {value : 'Africa', label :'Africa', flag: 'https://www.countryflags.io/za/flat/64.png', checked:false},
    {value : 'Caribbean', label :'Caribbean', flag: false, checked:false},
    {value : 'EuropeanUnion', label:' European Union', flag: false, checked:false},
    {value : 'CustomCode', label :'Reserved for internal or future use', flag: false, checked:false},
    {value:'LatinAmerica',label:' Latin America', flag: false, checked:false},
    {value : 'MiddleEast',label:'Middle East', flag: false, checked:false},
    {value : 'None', label :'(description not yet available)', flag: false, checked:false},
    {value : 'NorthAmerica', label :' North America', flag: false, checked:false},
    {value : 'Oceania', label:' Oceania (Pacific region other than Asia)', flag: false, checked:false},
    {value : 'SouthAmerica', label :'South America', flag: false, checked:false},
];

export const countriestoExclude=[
    {value : 'Worldwide', label :'Worldwide', checked:false},
    {value : 'CA', label :'Canada', flag: 'https://www.countryflags.io/ca/flat/64.png', checked:false},
    {value : 'Americas', label :'Americas', flag: false, checked:false},
    {value:'Europe', label:'Europe', flag: false, checked:false},
    {value: 'Asia',label :'Asia', flag: false, checked:false},
    {value: 'AU',label :'Australia', flag: 'https://www.countryflags.io/au/flat/64.png', checked:false},
    {value: 'UK',label :'United Kingdom', flag: 'https://www.countryflags.io/uk/flat/64.png', checked:false},
    {value: 'MX',label :'Mexico', flag:'https://www.countryflags.io/mx/flat/64.png', checked:false},
    {value: 'DE',label :'Germany', flag: 'https://www.countryflags.io/de/flat/64.png', checked:false},
    {value: 'JP',label :'Japan', flag: 'https://www.countryflags.io/jp/flat/64.png', checked:false},
    {value: 'BR',label :'Brazil', flag: 'https://www.countryflags.io/br/flat/64.png', checked:false},
    {value: 'FR',label :'France', flag: 'https://www.countryflags.io/fr/flat/64.png', checked:false},
    {value: 'CN',label :'China', flag:  'https://www.countryflags.io/cn/flat/64.png', checked:false},
    {value: 'RU',label :'Russian Federation', flag: 'https://www.countryflags.io/ru/flat/64.png', checked:false},
    {value : 'Africa', label :'Africa', flag: 'https://www.countryflags.io/za/flat/64.png', checked:false},
    {value : 'Caribbean', label :'Caribbean', flag: false, checked:false},
    {value : 'EuropeanUnion', label:' European Union', flag: false, checked:false},
    {value : 'CustomCode', label :'Reserved for internal or future use', flag: false, checked:false},
    {value:'LatinAmerica',label:' Latin America', flag: false, checked:false},
    {value : 'MiddleEast',label:'Middle East', flag: false, checked:false},
    {value : 'None', label :'(description not yet available)', flag: false, checked:false},
    {value : 'NorthAmerica', label :' North America', flag: false, checked:false},
    {value : 'Oceania', label:' Oceania (Pacific region other than Asia)', flag: false, checked:false},
    {value : 'SouthAmerica', label :'South America', flag: false, checked:false},
];

export const tempObjShippingserviceDomestic= {service:'',charges:'',codfee:'',free_shipping:false,additional_charges:''};
export const  tempObjShippingserviceInternational=    {service:'',charges:'',additional_charges:'',codfee:'',ship_to:[]};

export function extractValuesfromRequest(rows=[], site_id = '', shop_id){
    let modifiedRows = [];
    rows.forEach( row =>{

        let {  title, type, data } = row;
        if(data && data.hasOwnProperty("profileId")){
            let { profileId } = data
            modifiedRows.push({
                id: profileId,
                type,
                name: title,
                site_id,
                shop_id
            });
        }
    });
    return modifiedRows;
}

export function getCollectionofTags(tagList = [] , options = []){
    let  tags = [];
    tagList.forEach( tag => {
        let getLabel = options.filter( opt => opt.value === tag);
        if(getLabel.length) tags =  [ ...tags, <Tag>{getLabel[0]['label']}</Tag>]
    });
    return tags;
}

function accountRenderer(func, params){
    let { data } = params;
    let { site_id } = data;
    let siteDetails = json.flag_country.filter(countryDet => countryDet.value === site_id );
    if(siteDetails.length) site_id = siteDetails[0]['label'];
    return site_id && site_id === ""? polarisIcon(MinusMinor): site_id;
}

function actionRenderer(incellFunc , params){
    return (
        <Stack vertical={false} alignment={"center"} distribution={"fill"} >
            <Tooltip content={"Edit"}>
                <p onClick={incellFunc.bind(this, 'edit', params.data)}>
                    <Icon source={EditMajorMonotone}  />
                </p>
            </Tooltip>
            <Tooltip content={"Delete"}>
                <p onClick={incellFunc.bind(this, 'delete', params.data)}>
                    <Icon source={DeleteMajorMonotone} />
                </p>
            </Tooltip>
        </Stack>
    );
}

export function attachCountTabTitle(tabs, type,  rows){
    let count = 0;
    if(type!=='all'){
        rows.forEach(row =>{
            if(row.type === type) count++;
        })}
    else count = rows.length;
    tabs.forEach((tab, index) =>{
        if(tab.type === type) tabs[index].content = <p>{tabs[index].title} <Badge status={"info"}>{`${count}`}</Badge></p>
    })
    return tabs;
}

export const policiestabs = [
    {
        id: 'all-policies',
        content: 'All',
        title: 'All',
        accessibilityLabel: 'All policies',
        panelID: 'all-policies-content',
        type: 'all',
    },
    {
        id: 'shipping-policies',
        content: 'Shipping',
        title: 'Shipping',
        panelID: 'shipping-policies-content',
        type: 'shipping'
    },
    {
        id: 'payment_policies',
        content: 'Payment',
        title: 'Payment',
        panelID: 'payment-policies-content',
        type: 'payment'
    },
    {
        id: 'return-policies',
        content: 'Return',
        title: 'Return',
        panelID: 'return-policies-content',
        type: 'return'
    }
];

export function getCountryStructure(countryArr = [], type, selectedOptions, onSelect, index =false  ){
    let structure = [];
    countryArr.forEach((country) => {
        structure = [ ...structure,
            checkbox(country.label, selectedOptions.indexOf(country.value) > -1, onSelect.bind(this, type, country.value, index))
        ]
    });
    return <Stack vertical={false} distribution={"leading"}>{structure}</Stack>;
}

export const selectedPolciesActions = [
    {label:'Upload product(s)', value:'upload_product', modaltext:'Do you want to proceed with uploading product(s) ?'},
    {label:'Sync product from Shopify', value:'select_sync_from_shopify', modaltext:'Do you want to proceed with syncing product(s) from Shopify ?'},
];

export const pageSizeOptionProducts = [25,50,75];

export const filterCondition =  [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];

function getServiceType(Service){

    let service_type='';
    let flat=0;
    let calculated=0;

    Object.keys(Service).map(key=>{
        switch(Service[key]){
            case 'Calculated': calculated++;
                break;
            case 'Flat': flat++;
                break;
            default: break;
        }
        return true;
    });
    if( (calculated === 2 || calculated ===1) && flat === 0) service_type='Calculated';
    else if (calculated === 0 && (flat===2 || flat === 1) ) {
        service_type='Flat';
    }else if(calculated ===1 && flat ===1){
        if(Service.international === 'Calculated' && Service.domestic === 'Flat') service_type='FlatDomesticCalculatedInternational';
        else if(Service.domestic === 'Calculated' && Service.international === 'Flat') service_type='CalculatedDomesticFlatInternational';
    }else if(calculated ===0 && flat ===0) service_type='FreightFlat';

    return service_type;
}

export function getTypeoftabs(tab){
    return policiestabs[tab]['type'];
}

export function  extractDatafromPolicy(data, type){
    let policyData = {};
    switch (type) {
        case 'payment':
            let { profileName , paymentInfo } = data;
            let  { immediatePay, acceptedPaymentMethod,  paymentInstructions, paypalEmailAddress,  depositDetails } = paymentInfo;

            policyData = {
                name: profileName ? profileName : '',
                immediate_pay: immediatePay ? immediatePay : false,
                payment_methods: [...acceptedPaymentMethod ],
                checkout_instruction: paymentInstructions ? paymentInstructions : '',
                paypal_email: paypalEmailAddress ? paypalEmailAddress :'',
            }

            if(depositDetails) {
                let { hoursToDeposit, depositAmount, daysToFullPayment } = depositDetails;
                policyData = { ...policyData,  deposit_details:{
                        days_to_full_payment: daysToFullPayment,
                        deposit_amount: depositAmount,
                        hours_to_deposit: hoursToDeposit,
                    }}
            }
            break;
        case "return":
            let { profileName: returnProfileName, returnPolicyInfo } = data;
            let { returnsAcceptedOption,  refundOption, returnsWithinOption, shippingCostPaidByOption, description} = returnPolicyInfo;
            policyData = {
                name : returnProfileName? returnProfileName:'',
                returns_accepted_option : returnPolicyInfo && returnsAcceptedOption ? returnsAcceptedOption === 'ReturnsAccepted': false,
                return_option : refundOption,
                domestic : {
                    return_within : returnsWithinOption,
                    return_paid_by : shippingCostPaidByOption,
                    return_description : description
                }
            }
            break;
        case 'shipping':
            let { profileName: shippingprofileName , shippingPolicyInfo } = data;
            let { GlobalShipping, excludeShipToLocation, internationalPackagingHandlingCosts, shipToLocations, dispatchTimeMax, packagingHandlingCosts, shippingProfileDiscountInfo, intlShippingType, domesticShippingType, domesticShippingPolicyInfoService, intlShippingPolicyInfoService } = shippingPolicyInfo;
            policyData = {
                name : shippingprofileName ? shippingprofileName : '',
                global_shipping : GlobalShipping ? GlobalShipping : false,
                exclude_locations : excludeShipToLocation,
                excluded_shipping_location : excludeShipToLocation ? excludeShipToLocation : [],
                international : {
                    handling_cost : internationalPackagingHandlingCosts ? (internationalPackagingHandlingCosts.value).toString() : '0',
                    global_ship_to : shipToLocations ? shipToLocations : [],
                    InternationalPromotionalShippingDiscount : shippingProfileDiscountInfo && shippingProfileDiscountInfo.hasOwnProperty('applyIntlPromoShippingProfile') ? shippingProfileDiscountInfo['applyIntlPromoShippingProfile'] : false
                },
                domestic : {
                    handling_time : dispatchTimeMax ? dispatchTimeMax.toString() : '1',
                    handling_cost : packagingHandlingCosts ? (packagingHandlingCosts.value).toString() : 0,
                    PromotionalShippingDiscount : shippingProfileDiscountInfo && shippingProfileDiscountInfo.hasOwnProperty('applyDomesticPromoShippingProfile') ? shippingProfileDiscountInfo['applyDomesticPromoShippingProfile'] : false
                },
            }
            let serVicetype={
                international:  intlShippingType ? intlShippingType:false,
                domestic : domesticShippingType ? domesticShippingType:false
            };
            policyData = {...policyData, service_type : getServiceType(serVicetype)};

            let domesticServices=[];
            let internationalServices=[];
            if(domesticShippingPolicyInfoService)
            {
                domesticShippingPolicyInfoService.forEach((value)=>{
                    let { buyerResponsibleForPickup, buyerResponsibleForShipping, shippingSurcharge, shippingService, freeShipping, codFee, shippingServiceAdditionalCost, shippingServiceCost} = value;

                    policyData.domestic = { ...policyData.domestic, ...{
                            buyer_responsible_for_pickup : buyerResponsibleForPickup ? buyerResponsibleForPickup:'',
                            buyer_responsible_for_shipping :buyerResponsibleForShipping? buyerResponsibleForShipping:false,
                            shipping_surcharge : shippingSurcharge ? shippingSurcharge.toString():'0'
                        }};
                    let tempdomesticObj={...tempObjShippingserviceDomestic , ...{
                            service : shippingService ? shippingService:'',
                            free_shipping : freeShipping ? freeShipping: false,
                            codfee : codFee? codFee.toString():'',
                            additional_charges: shippingServiceAdditionalCost? (shippingServiceAdditionalCost.value).toString():'',
                            charges :  shippingServiceCost? (shippingServiceCost.value).toString():""
                        }};
                    domesticServices = [ ...domesticServices, tempdomesticObj];
                });
                if(domesticServices.length>0) policyData.shipping_service_domestic= [...domesticServices];
            }

            if(intlShippingPolicyInfoService)
            {
                intlShippingPolicyInfoService.forEach((value)=>{
                    let { shippingService, freeShipping, codFee, shippingServiceAdditionalCost, shipToLocation, shippingServiceCost, shippingSurcharge, buyerResponsibleForShipping, buyerResponsibleForPickup} = value;

                    policyData.international = { ...policyData.international, ...{
                            shipping_surcharge : shippingSurcharge?shippingSurcharge :0,
                            buyer_responsible_for_shipping:     buyerResponsibleForShipping?buyerResponsibleForShipping:'',
                            buyer_responsible_for_pickup : buyerResponsibleForPickup ? buyerResponsibleForPickup:''
                        }};
                    internationalServices = [ ...internationalServices, {...tempObjShippingserviceInternational, ...{
                            service :shippingService?shippingService:'',
                            free_shipping : freeShipping? freeShipping:'',
                            codfee : codFee? codFee.toString():'',
                            additional_charges : shippingServiceAdditionalCost? (shippingServiceAdditionalCost.value).toString(): '',
                            ship_to : shipToLocation? shipToLocation:'',
                            charges : shippingServiceCost ? (shippingServiceCost.value).toString():''
                        }}];
                });
                if(internationalServices.length>0) policyData.shipping_service_international=[...internationalServices];
            }
            break;
        default: break;
    }
    return { ...policyData };
}

export function extractShippingDetails(data){

    let shipping_service= {
        domestic: {
            Flat: [],
            Calculated: [],
            FreightFlat: [],
        },
        international :{
            Flat:[],
            Calculated:[],
            FreightFlat:[],
        }
    };

    let analysis_arr=[];

    let levelTwoObject_categorywise={
        domestic:{
            Flat:{},
            Calculated:{}
        },
        international:{
            Flat:{},
            Calculated:{}
        }
    };
    Object.keys(data).map(key=>{
            let options_analysis={};
            let { ShippingCategory,  Description, ShippingService, InternationalService, ServiceType } = data[key];
            options_analysis = {
                category : ShippingCategory,
                label : Description,
                value : ShippingService,
                area : InternationalService?'international':'domestic'
            }
            let serviceTypePresent=[];
            if(ServiceType) {
                if (Array.isArray(ServiceType)) serviceTypePresent = [...ServiceType];
                else serviceTypePresent = Object.values(ServiceType);
            } else serviceTypePresent = ["Flat","Calculated"];

            if(serviceTypePresent.indexOf("Flat")>-1 && serviceTypePresent.indexOf("Calculated")>-1) options_analysis['service_type']='both';
            else if(serviceTypePresent.indexOf('Flat')>-1) options_analysis['service_type']='Flat';
            else if(serviceTypePresent.indexOf('Calculated')>-1) options_analysis['service_type']='Calculated';
            else if(serviceTypePresent.indexOf('Freight')>-1) options_analysis['service_type']='FreightFlat';
            analysis_arr.push(options_analysis);
            return true;
        }
    );
    analysis_arr.forEach((value)=> {
        let { service_type, area, category } = value;
        if(service_type==='both'){
            levelTwoObject_categorywise[area].Flat[category]=[];
            levelTwoObject_categorywise[area].Calculated[category]=[];
        }
        else {
            if(isUndefined(levelTwoObject_categorywise[area][service_type])){
                levelTwoObject_categorywise[area][service_type]={};
                levelTwoObject_categorywise[area][service_type][category]=[];
            }
            else levelTwoObject_categorywise[area][service_type][category]=[];
        }
    });

    analysis_arr.forEach((value)=>{
        let { service_type, area, category, label, value: val } = value;
        if(service_type==='both') {
            levelTwoObject_categorywise[area].Flat[category].push(
                {label ,value: val }
            );
            levelTwoObject_categorywise[area].Calculated[category].push(
                { label,value:val}
            );
        }
        else{
            levelTwoObject_categorywise[area][service_type][category].push(
                {label,value:val}
            );
        }
    });

    Object.keys(levelTwoObject_categorywise).map(region=>{
        Object.keys(levelTwoObject_categorywise[region]).map(servicetype=>{
            Object.keys(levelTwoObject_categorywise[region][servicetype]).map(heading=>{
                shipping_service[region][servicetype].push({
                    // title:heading,options:[...levelTwoObject_categorywise[region][servicetype][heading]]
                    title:heading,options:[...levelTwoObject_categorywise[region][servicetype][heading]]
                });
                return true;
            });
            return true;
        });
        return true;
    });
    return {
        shipping_service,
        shipping_service_options :{
            domestic : shipping_service.domestic.Flat,
            international : shipping_service.international.Flat,
        }
    }
}