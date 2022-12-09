import React from "react";
import {Card, Stack} from "@shopify/polaris";
import {displayText} from "../../PolarisComponents/InfoGroups";
import {button, choiceList} from "../../PolarisComponents/InputGroups";

export function planBody(activeStep, data, onChange, stepChange) {
    // get modal from data
    let  { onPlanSelect, plans } = data;
    return <Stack alignment={"center"}>{constructPlansBody(plans, onPlanSelect)}</Stack>
}

function getServiceOptions(services){
    let serviceOption = [];
    let selectedOption = [];
    services.forEach((service, index) => {
        let { title, code} = service;
        selectedOption.push(code);
        serviceOption.push(
            { label : title, value:code}
        );
    });
    return {servicesOptions : [...serviceOption], selectedOptions: [...selectedOption]};
}

function constructPlansBody(plans = [], onPlanSelect){
    let body = [];
    plans.forEach((plan, index) => {
        let { custom_price, description, title, validity, services_groups } = plan;
        let {  title: serviceTitle , services } = services_groups[0];
        let  { servicesOptions, selectedOptions } = {...getServiceOptions(services)};
        let duration = validity === "30"? 'month':'year';
        body.push(<div style={{maxWidth:300}}>
            <Card key={title}>
                <Card.Section>
                    <Stack alignment={"center"} vertical={true} spacing={"loose"} >
                        {
                            displayText("extraLarge", "h2", `$ ${custom_price}`)
                        }
                        {
                            displayText("small", "h2", <b><sub>/ {duration}</sub></b>)
                        }
                        {
                            button('Choose this plan', onPlanSelect.bind(this, plan), false, false, true, 'large')
                        }
                        {
                            displayText('small','h1', <b>{title}</b>)
                        }
                        <p >{description}</p>
                        {
                            choiceList(serviceTitle,servicesOptions,selectedOptions,()=>{},false, true)
                        }
                    </Stack>

                </Card.Section>
            </Card>
            </div>

        )
    });
    return body;
}