import React from "react";
import {Card, DisplayText, Stack} from "@shopify/polaris";
import {bannerPolaris, thumbnail} from "../../PolarisComponents/InfoGroups";
import {button, select} from "../../PolarisComponents/InputGroups";
import {json} from "../../globalConstant/static-json";
import {modalPolaris} from "../../PolarisComponents/ModalGroups";

const optionsAccountType = [
    { label : 'Sandbox', value:'sandbox' },
    { label : 'Live', value:'production' }
];


export function accountLinking(activeStep, data, onChange, errors, stepChange, showregistrationBanner = true, pathname = false){
    let { ebay, amazon, modal, loader: formSubmitLoader } =  data;
    let { open: openModal, marketplace: marketplaceToShow, modalToggle } = modal;
    let { image:imageeBay, loader:eBayloader, form_data: formeBay, formDataChange } = ebay;
    let { image:imageAmazon, loader:amazonloader, form_data:formAmazon } = amazon;
    let Structure =[];
    switch (marketplaceToShow) {
        case 'ebay' :
            Structure = getEbayStructure(formeBay, formDataChange,errors['ebay']);
            break;
        case 'amazon':
            Structure = getAmazonStructure(formAmazon, formDataChange, errors['amazon']);
            break;
        default:
            break;
    }

    return <Card>
        {/*{ showregistrationBanner &&*/}
        {/*<Card.Section>*/}
        {/*    { */}
        {/*        bannerPolaris('Please note', <DisplayText size={"small"} element={"h6"}>You need to connect either eBay or Amazon seller account to proceed</DisplayText> )*/}
        {/*    }*/}
        {/*</Card.Section>*/}
        {/*}*/}
        <Card.Section>
            <Stack vertical={false} spacing={"loose"} distribution={"fillEvenly"}>
                { (!pathname || pathname.includes('ebay')) &&
                    getAccountCard(imageeBay, 'eBay account', onChange.bind(this, 'marketplace', activeStep, 'ebay'),  'ebay', eBayloader )
                }
                {/*{ (!pathname || pathname.includes('amazon')) &&*/}
                {/*    getAccountCard(imageAmazon, 'Amazon account', onChange.bind(this, 'marketplace', activeStep, 'amazon'),  'amazon', amazonloader )*/}
                {/*}*/}
            </Stack>
        </Card.Section>
        {
            modalPolaris('Authorization form', openModal, modalToggle.bind(this,activeStep, modal), {content: 'Submit', onAction:stepChange, loading: formSubmitLoader}, Structure)
        }
    </Card>
}

export function getEbayStructure(data, onChange, errors = {}){
    let {account_type, country_image, site_id} = data;
    return [
        <Stack vertical={false} distribution={"center"} key={'ebay-structure'}>
            {
                select('', optionsAccountType, onChange.bind(this,'account_type', data, 'ebay'),account_type )
            }
            {
                thumbnail(country_image, `${site_id}`,'small')
            }
            {
                select('', json.flag_country, onChange.bind(this,'site_id',data, 'ebay'), site_id )
            }
        </Stack>
    ];
}

// function getLinkforcedCredentials(region) {
//     switch (region) {
//         case 'north_america': return json.region_link.north_america;
//         case 'europe': return json.region_link.europe;
//         case 'india': return  json.region_link.india;
//         case 'far_east': return  json.region_link.far_east;
//         default: return '';
//     }
// }

export function getAmazonStructure(data, onChange, errors = {}){
    let {  regions_options, region_selected  } = data;
    // let { auth_via_ced , aws_access_key_id, aws_auth_id, regions_options, region_selected, auth_id, auth_token, marketplace_options, markeplaceselected } = data;

    let { region_selected:selectedRegionError } = errors;
    // let { region_selected:selectedRegionError, markeplaceselected: marketplaceselectedError, auth_id: authIdError, auth_token: authTokenError, aws_access_key_id:awsAccessKeyIDError, aws_auth_id:awsAuthIDError } = errors;
    return (
        <Card title= {'Amazon'}>
            <Card.Section title={'Region'}>
                <Stack vertical={true} spacing={"loose"}>
                    {/* { !marketplace_options.length &&
                        bannerPolaris('','Please choose a Region for displaying marketplaces in the region', 'info')
                    } */}
                    {
                        select('', regions_options,onChange.bind(this,'region_selected',  data, 'amazon'),region_selected, 'Please Select', selectedRegionError)
                    }
                    {/*{ marketplace_options.length > 0 &&*/}
                    {/*choiceList('Marketplaces', marketplace_options, markeplaceselected, onChange.bind(this, 'markeplaceselected', data, 'amazon'),marketplaceselectedError)*/}
                    {/*}*/}
                </Stack>
            </Card.Section>
            {/*{auth_via_ced &&*/}
            {/*<Card.Section title={'Get CEDCOMMERCE credentials'}>*/}
            {/*    {region_selected!=='' &&*/}
            {/*    bannerPolaris(region_selected, <p>Please <a href={getLinkforcedCredentials(region_selected)}*/}
            {/*                                                target={'_blank'} rel="noopener noreferrer">click*/}
            {/*        here</a> to be redirected for credentials</p>, 'info')*/}
            {/*    }*/}
            {/*    {*/}
            {/*        region_selected === '' &&*/}
            {/*        bannerPolaris('Please note','Please select a region for getting the link for credentials')*/}
            {/*    }*/}
            {/*</Card.Section>*/}
            {/*}*/}
            {/*<Card.Section title={'Merchant Credential'}>*/}
            {/*    <Stack vertical={false} distribution={"fillEvenly"}>*/}
            {/*        {*/}
            {/*            textField('Auth ID', auth_id, onChange.bind(this, 'auth_id', data, 'amazon'),'','',authIdError)*/}
            {/*        }*/}
            {/*        {*/}
            {/*            textField('Auth Token', auth_token, onChange.bind(this, 'auth_token', data, 'amazon'),'','',authTokenError)*/}
            {/*        }*/}
            {/*        {*/}
            {/*            checkbox('Authenticate using CEDCOMMERCE', auth_via_ced, onChange.bind(this, 'auth_via_ced', data, 'amazon'))*/}
            {/*        }*/}
            {/*    </Stack>*/}
            {/*</Card.Section>*/}
            {/*{!auth_via_ced &&*/}
            {/*<Card.Section title={'AWS Credentials'}>*/}
            {/*    <Stack vertical={true}>*/}
            {/*        <Stack vertical={false} distribution={"fillEvenly"}>*/}
            {/*            {*/}
            {/*                textField('AWS Access Key ID', aws_access_key_id, onChange.bind(this, 'aws_access_key_id', data, 'amazon'), '', '', awsAccessKeyIDError)*/}
            {/*            }*/}
            {/*            {*/}
            {/*                textField('AWS Auth ID', aws_auth_id, onChange.bind(this, 'aws_auth_id', data, 'amazon'), '', '', awsAuthIDError)*/}
            {/*            }*/}
            {/*        </Stack>*/}
            {/*    </Stack>*/}
            {/*</Card.Section>*/}
            {/*}*/}
        </Card>
    );
}

export function getAccountCard(cardImage, cardImgAlt, onClick, marketplace,loader, customStructure = [] ) {
    return <Card>
        <Card.Section>
            <Stack distribution={"fillEvenly"} alignment={"center"} vertical={true}>
                <img src={cardImage} alt={cardImgAlt}/>
                {
                    customStructure
                }
            </Stack>
        </Card.Section>
        <Card.Section>
            <Stack distribution={"center"}>
                {
                    button('Connect', onClick, false, loader )
                }
            </Stack>
        </Card.Section>
    </Card>
}