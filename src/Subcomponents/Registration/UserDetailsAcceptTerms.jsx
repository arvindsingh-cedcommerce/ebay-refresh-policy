import React from "react";
import {Card, Icon, Stack, Tooltip} from "@shopify/polaris";
import {checkbox, select, textField, textFieldwithConnectedComponent} from "../../PolarisComponents/InputGroups";
import {json} from "../../globalConstant/static-json";
import {term_and_conditon} from "../../globalConstant/term&condition";
import {ImportMinor} from "@shopify/polaris-icons";

export function userDetails(activeStep, data={}, onChange, errors={}){
    let { full_name, email, mobile, country, how_u_know_about_us, accept_terms, mobile_code } = data;
    let { email: emailError, accept_terms: acceptTermsError } = errors;
    let {country_mobile_code, sources} = json;
    return (
        <Card>
            <Card.Section title={'User Details'}>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textField('Name',full_name,onChange.bind(this,'full_name',activeStep))
                    }
                    {
                        textField('Email',email,onChange.bind(this,'email',activeStep),"","",emailError)
                    }
                    {
                        textFieldwithConnectedComponent('Mobile', mobile, onChange.bind(this,'mobile',activeStep),
                            "", mobile_code,
                            select('', country_mobile_code ,onChange.bind(this,'country',activeStep),country)
                        )
                    }
                </Stack>
            </Card.Section>
            <Card.Section title={'Where do you come to know about us'}>
                {
                    select('', sources ,onChange.bind(this,'how_u_know_about_us',activeStep),how_u_know_about_us)
                }
            </Card.Section>
            <Card.Section title={'Privacy policy'}>
                <Stack vertical={true} spacing={"loose"}>
                    <div style={{maxHeight : 200, overflowY:'scroll'}} >
                        {
                            term_and_conditon()
                        }
                    </div>
                    <Stack vertical={false}>
                        {
                            checkbox('Accept terms & conditions', accept_terms, onChange.bind(this, 'accept_terms',activeStep), acceptTermsError)
                        }
                        <div style={{cursor: 'pointer'}} onClick={downloadPrivacyPolicy.bind(this)}>
                            <Tooltip content={'Download privacy policy'}>
                                <Icon source={ImportMinor} color={"blueDark"}/>
                            </Tooltip>
                        </div>
                    </Stack>
                </Stack>
            </Card.Section>
        </Card>
    );
}

export function downloadPrivacyPolicy(){
    window.open("https://ebay-multiaccount.sellernext.com/cedcommerce-privacy-policy.pdf","_blank")
}

export function getMobileCode(countryCode){
    let mobileCode = '';
    json.country_mobile_code.forEach((countryMobilecode) => {
        if( countryMobilecode.value === countryCode) mobileCode = countryMobilecode.phone_code
    });
    return mobileCode;
}

