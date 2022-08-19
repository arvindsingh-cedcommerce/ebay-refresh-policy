import React from "react";
import {Badge, ButtonGroup, Card, DataTable, Icon, Stack, Tooltip} from "@shopify/polaris";
import {ViewMajorMonotone} from "@shopify/polaris-icons";
import {
    button, checkbox,
    rangeSlider,
    ReactJsonStructure,
    select,
    textField,
    textFieldreadOnly
} from "../../../../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../../../../PolarisComponents/InfoGroups";
import {getStatusBatch} from "../../Amazon/Orders/amazonorderhelper";


export const pageSizeOptionProducts = [25,50,75];

export const filterCondition =  [
    {label: 'equals', value: "1"},
    {label: 'not equals', value: "2"},
    {label: 'contains', value: "3"},
    {label: 'does not contains', value: "4"},
    {label: 'starts with', value: "5"},
    {label: 'ends with', value: "6"}
];

export const selectedOrderActions = [
    {label:'Upload product(s)', value:'upload_product', modaltext:'Do you want to proceed with uploading product(s) ?'},
    {label:'Sync product from Shopify', value:'select_sync_from_shopify', modaltext:'Do you want to proceed with syncing product(s) from Shopify ?'},
];

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Markteplace details",field: "marketplace_details", pinned: 'left',resizable: true,cellStyle: { 'white-space': 'normal' }, headerCheckboxSelection:true,    checkboxSelection: true, autoHeight: true ,cellRendererFramework: marketplaceDetails.bind(this, incellElement.bind(this))
    },
    {
        headerName: "Shopify details",cellRendererFramework: shopifyDetails.bind(this, incellElement.bind(this)) ,field: "meta_detail", resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Customer details", field: "customer_details",  resizable: true, cellRendererFramework: customerDetails, cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Account id", field: "account_id",  resizable: true, cellStyle: { 'white-space': 'normal' }, autoHeight: true
    }
] };

export const filterOptions = [
    {
        headerName: "eBay order Id",field: "source_order_id"
    },
    {
        headerName: "Shopify order Id", field: "target_order_id"
    }
];

export function extractValuesfromRequest(rows=[]){
    let modifiedRows = [];
    rows.forEach( row => {
        let { source_order_id, created_at, total_price, total_tax, taxes_included, target_order_id, shopify_order_name, imported_at, processed_at, client_details, target_status : status, _id, country} = row;
        let { contact_email, name:customer_name} = client_details;
        modifiedRows.push({
            source_order_id,
            id: _id,
            created_at : processed_at, total_price,
            total_tax, tax_included: taxes_included, target_order_id, shopify_order_name, contact_email, customer_name, imported_at,
            // status,   account_id: country.label, country
        });
    });
    return modifiedRows;
}

function marketplaceDetails(incellElement, params){
    let { source_order_id, created_at, total_price, total_tax } = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} >Order id - {source_order_id}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Price - {total_price}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Total tax - {total_tax}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Created at - {created_at}</div>
    </div>);
}

function shopifyDetails(incellElement, params){
    let { target_order_id, shopify_order_name, imported_at, status} = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} > Order id - {target_order_id}</div>
        <div className={"col-12"} >
            <Stack vertical={false}>
                <p>Status - {getStatusBatch(status)} /</p>
                <p onClick={(e) => {
                    incellElement('view_order', params.data);
                    e.preventDefault();
                }}><Tooltip content="View order"><Icon  source={ViewMajorMonotone}/></Tooltip>
                </p>
            </Stack>
        </div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Order name - {shopify_order_name}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Imported at - {imported_at}</div>
    </div>);
}

function customerDetails(params){
    let { contact_email, customer_name} = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} > Email - {contact_email}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Name - {customer_name}</div>
    </div>);
}

export const orderlistTabs = [
    {
        id: 'all-orders',
        content: 'All',
        title: 'All',
        accessibilityLabel: 'All orders',
        panelID: 'all-orders-content',
        type: 'all',
    },
    {
        id: 'unfulfilled-orders',
        content: 'Unfulfilled',
        title: 'Unfulfilled',
        panelID: 'unfulfilled-orders-content',
        type: 'unfulfilled',
    },
    {
        id: 'fulfilled-orders',
        content: 'Fulfilled',
        title: 'Fulfilled',
        panelID: 'fulfilled-orders-content',
        type: 'fulfilled',
    },
    {
        id: 'failed-orders',
        content: 'Failed',
        title: 'Failed',
        panelID: 'failed-orders-content',
        type: 'failed',
    },
    {
        id: 'cancelled-orders',
        content: 'Cancelled',
        title: 'Cancelled',
        panelID: 'cancelled-orders-content',
        type: 'cancelled',
    }
];

export function getTabSelectedFilter(type){
    switch(type){
        case 'unfulfilled': return {'filter[status][1]' : 'inProgress'};
        case 'fulfilled': return {'filter[status][1]' : 'fulfilled'};
        case 'cancelled': return {'filter[status][1]' : 'cancelled'};
        case 'failed': return {'filter[failed][1]' : '1'};
        default : return {};
    }
}

export const orderViewtabs = [
    {
        id: 'details-shopify',
        content: 'Order details',
        title: 'Order details',
        accessibilityLabel: 'Order details',
        panelID: 'details-shopify',
        type: 'shopifydata',
    },
    {
        id: 'marketplace_order_details',
        content: 'eBay order data',
        title: 'eBay order data',
        panelID: 'marketplace-data',
        type: 'marketplacedata'
    },
    {
        id: 'buyer_details',
        content: 'Buyer details',
        title: 'Buyer details',
        panelID: 'buyer-details',
        type: 'buyer_details'
    },
    {
        id: 'payment_details',
        content: 'Payment details',
        title: 'Payment details',
        panelID: 'payment-details',
        type: 'payment_details'
    },
    {
        id: 'shipping_details',
        content: 'Shipping',
        title: 'Shipping details',
        panelID: 'shipping-details',
        type: 'shipping_details'
    },
    {
        id: 'fulfillments-details',
        content: 'Fulfillments',
        title: 'Fulfillments',
        panelID: 'fulfillments',
        type: 'fulfillments'
    }
];


export function getLineItemsRows(lines = []){
    let rows = [];
    lines.forEach(line => {
        let { title, quantity_ordered, unit_price, mpn } = line;
       rows = [...rows, [ title, quantity_ordered, unit_price, mpn]];
    });
    return rows;
}

export function getOrderviewTabsStructure(orderData, type){
    let { shopifydata, marketplacedata, shipping_details, payment_details, client_details, fulfillments } = orderData;
    switch(type){
        case 'shopifydata':
            let {    shopify_order_id , ebay_order_id , order_placed_at , line_items_count , ebay_reference_id,line_items } = shopifydata;
            let rows = [...getLineItemsRows(line_items)];
            return <Stack vertical={true} distribution={"fillEvenly"}>
                <Stack vertical={false} distribution={"fillEvenly"}>
                {
                    textFieldreadOnly('Shopify order id', shopify_order_id, true)
                }
                {
                    textFieldreadOnly('eBay order id', ebay_order_id, true)
                }
                </Stack>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Order date', order_placed_at, true)
                    }
                    {
                        textFieldreadOnly('Total items', line_items_count, true)
                    }
                </Stack>
                {
                    textFieldreadOnly('eBay refrence ID', ebay_reference_id, true)
                }
                <hr/>
                <p><b>Line items</b></p>
                    <DataTable
                        columnContentTypes={[
                            'text',
                            'numeric',
                            'numeric',
                            'text',
                        ]}
                        headings={[
                            'Product',
                            'Net quantity',
                            'Price',
                            'SKU Number',
                        ]}
                        rows={rows}
                    />

            </Stack>;
        case 'marketplacedata' : return <div style={{maxHeight: 400, overflowY: 'scroll'}}>{
            ReactJsonStructure(marketplacedata)
        }</div>;

        case 'shipping_details' :
            let  {   shipping_service , shipping_cost } = shipping_details;
            return <Stack vertical={false} distribution={'fillEvenly'}>
                {
                    textFieldreadOnly('Service', shipping_service, true)
                }
                {
                    textFieldreadOnly( 'Cost', shipping_cost, true)
                }
            </Stack>
        case 'fulfillments' :
            if(fulfillments) {
                let {tracking_company, tracking_number, created_at, updated_at} = fulfillments;
                return <Stack distribution={'fillEvenly'}>
                    {
                        textFieldreadOnly('Tracking company', tracking_company, true)
                    }
                    {
                        textFieldreadOnly('Tracking number', tracking_number, true)
                    }
                    {
                        textFieldreadOnly('Created at', created_at, true)
                    }
                    {
                        textFieldreadOnly('Updated at', updated_at, true)
                    }
                </Stack>
            }else {
                return bannerPolaris('', <p>Order not yet fulfilled</p>)
            }
        case 'buyer_details':
            let {   customer_name , contact_info, billing_address } =  client_details;
            let {  address ,phone , city , country , zip , country_code , province } = billing_address;
            return <Stack vertical={true}>
                <Card.Section title={'Contact info'}>
                  <Stack vertical={false} distribution={'fillEvenly'}>
                      {
                          textFieldreadOnly('Name', customer_name, true)
                      }
                      {
                          textFieldreadOnly('Email', contact_info, true)
                      }
                  </Stack>
                </Card.Section>
                <Card.Section title={'Address'}>
                    <Stack vertical={false} distribution={'fillEvenly'}>
                        {
                            textFieldreadOnly('Address', address, true)
                        }
                        {
                            textFieldreadOnly('Phone', phone, true)
                        }
                        {
                            textFieldreadOnly('City', city, true)
                        }
                        {
                            textFieldreadOnly('Country', country, true)
                        }
                        {
                            textFieldreadOnly('Zip', zip, true)
                        }
                        {
                            textFieldreadOnly('Country code', country_code, true)
                        }
                        {
                            textFieldreadOnly('Province', province, true)
                        }
                    </Stack>
                </Card.Section>

            </Stack>
        case 'payment_details' :
            let {  price , inclusive_tax , payment_method , taxes_applied } = payment_details;
            return <Card.Section title={'Payment'}>
            <Stack vertical={true}>
                <Stack vertical={false} distribution={'fillEvenly'}>
                    {
                        textFieldreadOnly('Payment method', payment_method, true)
                    }
                    {
                        textFieldreadOnly('Price', price, true)
                    }
                </Stack>
                <Stack vertical={false} distribution={'fillEvenly'}>
                    {
                        textFieldreadOnly('Taxes applied', taxes_applied, true)
                    }
                    {
                        textFieldreadOnly('Inclusive tax', inclusive_tax, true)
                    }
                </Stack>
            </Stack>
        </Card.Section>
        default : return [];
    }
}

export function getStatusBadge(status){
    switch(status){
        case 'paid': return <Badge status={'success'}>{status}</Badge>
        default : return <Badge status={'info'}>{status}</Badge>
    }
}

export function getModalStructure(type='', data, onChange ){
    switch(type) {
        case 'fetch_orders':
            let {accounts_options, days, shop_id, order_ids, date_modified_from, date_modified_to, date_created_from, date_created_to, add_filters_fetch_orders } = data;
            let { add_more_filters, order_ids: orderIdsFilter, date_modified, date_created } = add_filters_fetch_orders;
            return <Stack vertical={true} distribution={"fillEvenly"}>
                {
                    select('Accounts', accounts_options, onChange.bind(this, 'fetch_orders', 'shop_id'), shop_id, 'Please Select account...')
                }
                {
                    rangeSlider(`Days (${days})`, days, onChange.bind(this, "fetch_orders", "days"), true, 0, 30)
                }
                {
                    checkbox("Add more filters", add_more_filters, onChange.bind(this, "add_filters_fetch_orders", "add_more_filters"), false, "*check this box for adding more filters for fetching orders.")
                }
                <Card>
                    {add_more_filters &&
                    <Card.Section title={"Filter options"}>
                        <Stack vertical={false} spacing={"loose"}>
                        {
                            checkbox("Order ids", orderIdsFilter, onChange.bind(this, "add_filters_fetch_orders", "order_ids"))
                        }
                        {
                            checkbox("Order created at", date_created, onChange.bind(this, "add_filters_fetch_orders", "date_created"))
                        }
                        {
                            checkbox("Order modified at", date_modified, onChange.bind(this, "add_filters_fetch_orders", "date_modified"))
                        }
                        </Stack>
                    </Card.Section>
                    }
                    {orderIdsFilter &&
                    <Card.Section title={"Order Ids"}>
                        {
                            textField("", order_ids, onChange.bind(this, "fetch_orders", "order_ids"), "multiple order IDs allow in ,(comma) separated form")
                        }
                    </Card.Section>
                    }
                    {date_created &&
                    <Card.Section title={"Order created"}>
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                textField("From", date_created_from, onChange.bind(this, "fetch_orders", "date_created_from" ), "", "", false, "datetime-local")
                            }
                            {
                                textField("To", date_created_to, onChange.bind(this, "fetch_orders", "date_created_to" ),  "", "", false, "datetime-local")
                            }
                        </Stack>
                    </Card.Section>
                    }
                    {date_modified &&
                    <Card.Section title={"Order modified"}>
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                textField("From", date_modified_from, onChange.bind(this, "fetch_orders", "date_modified_from" ),  "", "", false, "datetime-local")
                            }
                            {
                                textField("To", date_modified_to, onChange.bind(this, "fetch_orders", "date_modified_to" ),  "", "", false, "datetime-local")
                            }
                        </Stack>
                    </Card.Section>
                    }
                </Card>
            </Stack>
        default :
            break;
    }
}