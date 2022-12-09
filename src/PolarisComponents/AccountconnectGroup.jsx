import React from "react";
import {
    AccountConnection,
    Avatar,
    ButtonGroup,
    Card,
    Heading,
    Layout,
    Stack,
    TextContainer,
    Tooltip
} from "@shopify/polaris";
import {button} from "./InputGroups";
import {polarisIcon} from "./InfoGroups";
import {ViewMajorMonotone} from "@shopify/polaris-icons";

export function accountLink(accountName, titleText, actionText, onAction, avatarUrl = '', details='', terms ='', connected=false, actionButtonDisabled = false){
    return (<AccountConnection
        key={`${accountName + details + titleText}`}
        accountName={accountName}
        title={titleText}
        avatarUrl={avatarUrl}
        action={{
            content: actionText,
            onAction: onAction,
            disabled: actionButtonDisabled,
        }}
        details={details}
        termsOfService={terms}
        connected={connected}/>);
}

export function accountLinkCardStructure(reconnectFunction = ()=>{}, activeInactiveFunction = ()=>{}, active = false, heading = "", subheading="", showUserDetails = () => {}, displayViewShopDetailsMarker = false){
    return <Card key={heading}>
        <Card.Section>
            <Layout>
                <Layout.Section>
                    <Stack vertical={false} distribution={"leading"}>
                        <TextContainer >
                            <Heading>{heading}</Heading>
                            <p>{subheading}</p>
                        </TextContainer>
                        {displayViewShopDetailsMarker && <div style={{cursor:"pointer"}} onClick={(e)=>{
                            showUserDetails();
                            e.preventDefault();
                        }}><Tooltip content={"View user details"}>{polarisIcon(ViewMajorMonotone)}</Tooltip></div>}
                    </Stack>
                </Layout.Section>
                <Layout.Section secondary={true}>
                    <Stack vertical={false} distribution={"trailing"} spacing={"loose"}>
                        {
                            button("ReConnect", reconnectFunction.bind(this), false, false, false)
                        }
                        <ButtonGroup segmented={true}>
                            {
                                button("Active", activeInactiveFunction.bind(this,"active"), false, false, active)
                            }
                            {
                                button("Inactive", activeInactiveFunction.bind(this,"inactive"), false, false, !active)
                            }
                        </ButtonGroup>
                    </Stack>
                </Layout.Section>

            </Layout>
        </Card.Section>
    </Card>
}