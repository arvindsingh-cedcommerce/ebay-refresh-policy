import React from "react";
import {Card, DataTable, FormLayout} from "@shopify/polaris";
import {button, select, textField} from "../../../../../PolarisComponents/InputGroups";
import {DeleteMajorMonotone} from "@shopify/polaris-icons";
import {bannerPolaris} from "../../../../../PolarisComponents/InfoGroups";

export const pageSizeOption = [25,50,75, 100];

export function getContentFilter( data_filter, onDataChange, shops = [] ){
    let { date_filter, shop_id } = data_filter;
    let { from, to } = date_filter;
    return <Card primaryFooterAction={{content :'Get messages',onAction: onDataChange.bind(this, 'filter_modal', false, false)}}>
        <Card.Section title={"Choose an account"}>
            {
                select("", shops, onDataChange.bind(this, "shop_id", false), shop_id)
            }
        </Card.Section>
        { shop_id !== '' &&
        <Card.Section title={'Date filter'}>
            <FormLayout condensed>
                <FormLayout.Group>
                    {
                        textField('From', from, onDataChange.bind(this, 'date_filter', 'from'), "", "", false, "date" )
                    }
                    {
                        textField('To', to, onDataChange.bind(this, 'date_filter', 'to'), "", "", false, "date" )
                    }
                </FormLayout.Group>
            </FormLayout>
        </Card.Section>
        }
    </Card>
}

export function getMessageModifiedData(data = [], onDataChange){
    return data.length ? data.map((message, index) => {
        return [
            message.Sender,
            <p onClick={(e) => {
                onDataChange('message_modal', false, { open :true, title: message.ItemTitle, content: <React.Fragment>
                        <Card title={`Item id ${message.ItemID}`}>
                            <Card.Section>
                                {
                                    bannerPolaris("",  message.Subject)
                                }
                            </Card.Section>
                        </Card>
                    </React.Fragment>})
                e.preventDefault();
            }} style={{textDecoration:'underline',color: 'blue', cursor:'pointer'}}>{message.MessageID}</p>,
            message.ReceiveDate,
            message.ExpirationDate,
            button("", onDataChange.bind(this, 'delete_message', false, index), false, false, true, "medium", false, false, DeleteMajorMonotone)
        ]
    }) : [];
}

export function getMessageDataGrid(rows = []){
    return <div style={{maxHeight:360, overflowY:'scroll'}}>
        <DataTable
            columnContentTypes={[
                'text',
                'text',
                'text',
                'text',
                'text',
            ]}
            headings={[
                'Sender',
                'Message ID',
                'Recieved Date',
                'Expiration Date',
                'Actions',
            ]}
            rows={rows}
        />
    </div>
}