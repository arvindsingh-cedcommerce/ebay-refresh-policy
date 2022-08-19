import React from "react";
import {Spinner, Stack} from "@shopify/polaris";
import {displayText} from "../../PolarisComponents/InfoGroups";
const SuccessCheck = require('../../assets/successcheck.png');

export function stepCompletedBody(){
    return <Stack vertical={true} alignment={"center"}>
        <img alt={'Registraction success'} src={SuccessCheck} width={100}/>
        <p style={{fontSize: 19}}>Please wait, while we prepare your panel</p>
        {displayText( "medium", "h4", <p>Redirecting...<Spinner accessibilityLabel="Spinner example" size="large" color="teal" /></p> )}
    </Stack>;
}