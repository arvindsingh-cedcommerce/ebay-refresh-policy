import {productsStatus} from "../../Ebay/Products/ebayproducthelper";
import React from "react";
import { DataTable, Stack, Tooltip} from "@shopify/polaris";
import {ReactJsonStructure, select, textField, textFieldreadOnly} from "../../../../../PolarisComponents/InputGroups";
import {bannerPolaris, getBadgePolaris, polarisIcon, thumbnail} from "../../../../../PolarisComponents/InfoGroups";
import {ViewMajorMonotone} from "@shopify/polaris-icons";
import {getLineItemsRows} from "../../Ebay/Orders/ebayorderhelper";

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
    {label:'Ship order(Amazon)', value:'ship_order_amazon', modaltext:'Do you want to ship the selected order(s) on Amazon ?'},
    {label:'Create order(Shopify)', value:'create_order_shopify', modaltext:'Do you want to create the selected order(s) on Shopify ?'},
    {label:'Sync order(Amazon)', value:'sync_order_amazon', modaltext:'Do you want to sync the selected order(s) on Amazon ?'},
];

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

export function gridPropColumns ( incellElement = () =>{}) { return [
    {
        headerName: "Markteplace details",field: "marketplace_details",resizable: true,cellStyle: { 'white-space': 'normal' },  headerCheckboxSelection:true, checkboxSelection: true,   cellRendererFramework: marketplaceDetails.bind(this, incellElement.bind(this))  , autoHeight: true, width: 400,
    },
    {
        headerName: "Shopify details",cellRendererFramework: shopifyDetails.bind(this, incellElement.bind(this)) ,field: "meta_detail", resizable: true,cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Customer details", field: "customer_details",  resizable: true, cellRendererFramework: customerDetails, cellStyle: { 'white-space': 'normal' }, autoHeight: true
    },
    {
        headerName: "Account id", field: "account_id",  resizable: true, cellRendererFramework: renderAccountId,cellStyle: { 'white-space': 'normal' }, autoHeight: true
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
    rows.forEach( row =>{
        let { source_order_id, processed_at:placed_at, total_price, total_tax, taxes_included, target_order_id, shopify_order_name, imported_at, client_details, source_status: marketplace_status, target_status : shopify_status, target_error_message : shopify_errorMessage, region, source_error_message : errorMessage, country} = row;
        let { contact_email, name:customer_name} = client_details;
        modifiedRows.push({
            source_order_id,
            marketplace_error_message : errorMessage,
            country,
            placed_at : placed_at ?(new Date(placed_at)).toUTCString(): '', total_price,
            total_tax, tax_included: taxes_included, target_order_id, shopify_order_name, contact_email, customer_name, imported_at,
            marketplace_status, shopify_status,  shopify_error_message : shopify_errorMessage, account_id: region.toUpperCase()
        });
    })
    return modifiedRows;
}

function renderAccountId(params){
    let { account_id, country } = params.data

    return <Stack vertical={false} spacing={"extraTight"} wrap={true}>
        <p>{account_id}</p>
        <p>{country.label}</p>
        {
            thumbnail(country.flag, country.label, 'small')
        }
    </Stack>
}

function marketplaceDetails(incellElement, params){
    let { source_order_id, placed_at, total_price, marketplace_status } = params.data;

    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} >
            <Stack vertical={false}>
            <p>Order id - {source_order_id} </p>
            <p style={{ cursor: 'pointer'}} onClick={incellElement.bind(this, 'marketplace_details', { field : 'status', data: params.data})}><span>{getStatusBatch(marketplace_status)}</span></p>
        </Stack>
        </div>
        <div className={"col-12"} style={{color:"dimgrey"}}><Stack><p>Price - {total_price}</p><p>/</p><p onClick={incellElement.bind(this, 'view_order', params.data)}><Tooltip content={"View"}>{polarisIcon(ViewMajorMonotone)}</Tooltip></p></Stack></div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Placed at - {placed_at}</div>
    </div>);
}

export function getStatusBatch( status){
    switch(status){
        case 'error':
            return getBadgePolaris('Error', 'critical');
        case 'Pending':
            return getBadgePolaris('Pending', 'attention');
        case 'pending':
            return getBadgePolaris('Pending', 'attention');
        case 'Unshipped':
            return getBadgePolaris('Unshipped', 'attention');
        case 'Shipped':
            return getBadgePolaris('Shipped', 'success');
        case 'fulfilled':
            return getBadgePolaris('Fulfilled', 'success');
        case 'Cancelled':
            return getBadgePolaris('Cancelled', 'critical');
        default: return [];
    }
}

function shopifyDetails(incellElement, params){
    let { target_order_id, shopify_order_name, imported_at, shopify_status} = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"}> Order id - {target_order_id?target_order_id:'N/A' }</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Order name - {shopify_order_name}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Imported at - {imported_at}</div>
        <div className={"col-12"} style={{color:"dimgrey", cursor: 'pointer'}}><p onClick={incellElement.bind(this, 'shopify_status', { field : 'status', data: params.data})}><span>Status - {getStatusBatch(shopify_status)}</span></p></div>
    </div>);
}

function customerDetails(params){
    let { contact_email, customer_name} = params.data;
    return (<div className={"row w-100"} style={{lineHeight: 1.8}}>
        <div className={"col-12"} > Email - {contact_email}</div>
        <div className={"col-12"} style={{color:"dimgrey"}}>Name - {customer_name}</div>
    </div>);
}

export function getModalStructure(type='', data, onChange ){
    let { data: errors } = data;
    switch(type){
        case 'fetch_orders':
            let { order_id, buyer_email, shop_id, accounts_options, status, status_options, limit, created_after } = data;
            return <Stack vertical={true} distribution={"fillEvenly"}>
                {
                    select('Accounts', accounts_options, onChange.bind(this, 'fetch_orders', 'shop_id'), shop_id, 'Please Select account...')
                }
                {
                    textField('Order Id', order_id, onChange.bind(this, 'fetch_orders', 'order_id'), 'Amazon order Id')
                }
                {
                    textField("Buyer's email", buyer_email, onChange.bind(this, 'fetch_orders', 'buyer_email'), "Buyer's email")
                }
                {
                    select('Status', status_options, onChange.bind(this, 'fetch_orders', 'status'), status, 'Please Select Status...')
                }
                {
                    textField('Number of Order(s)', limit, onChange.bind(this, 'fetch_orders', 'limit'), 'Enter the Maximum number of order(s) you want to fetch')
                }
                {
                    textField('Created after', created_after, onChange.bind(this, 'fetch_orders', 'created_after'), 'Order(s) created after', "", false, "date")
                }
            </Stack>;
        case 'marketplace_status':
            let { marketplace_error_message } = errors;
            if(marketplace_error_message) return bannerPolaris("Error", marketplace_error_message, "critical");
            else return bannerPolaris("Info", 'Errors not found', "info");
        case 'shopify_status':
            let { shopify_error_message } = errors;
            if(shopify_error_message) return bannerPolaris("Error", shopify_error_message, "critical");
            else return bannerPolaris("Info", 'Errors not found', "info");
        default:
            return [];
    }
}

export function ordersStatus(){
    let orderstatusvalue = ["Pending", "Unshipped", "Partially Shipped", "Shipped", "Completed", "Cancelled"]
    let optionsPrepared = [];
    orderstatusvalue.forEach( value => {
       optionsPrepared = [ ...optionsPrepared, { label: value, value}];
    });
    return optionsPrepared;
}

export const orderViewtabs = [
    {
        id: 'details-shopify',
        content: 'Order details',
        title: 'Order details',
        accessibilityLabel: 'Order details',
        panelID: 'details-shopify',
        type: 'order_details',
    },
    {
        id: 'marketplace_order_details',
        content: 'Amazon order data',
        title: 'Amazon order data',
        panelID: 'marketplace-data',
        type: 'marketplace_order'
    },
    {
        id: 'buyer_details',
        content: 'Buyer details',
        title: 'Buyer details',
        panelID: 'buyer-details',
        type: 'customer_info'
    },
    {
        id: 'shipping_details',
        content: 'Shipping',
        title: 'Shipping details',
        panelID: 'shipping-details',
        type: 'shipping_info'
    },
    {
        id: 'billing_info',
        content: 'Billing info',
        title: 'Billing details',
        panelID: 'billing-info',
        type: 'billing_info'
    }
];

function getTaxLines(taxLines = []){
    let rows =[];
    let heading = [];
    let fields = [];
    if(taxLines.length) {
        heading = [...Object.keys(taxLines[0])];
        heading.forEach(() => {
           fields.push("text");
        });
        taxLines.forEach(tax => {
            rows = [...rows, Object.values(tax)];
        });
    }
    return { rows, heading, fields };
}

export function getOrderviewTabsStructure(orderData, type){
    let { customer_info, billing_info, shipping_info, order_details, marketplace_order } = orderData;
    switch(type){
        case 'order_details':
            let {    source_order_id , target_order_id , price  , qty, placed_at, line_items } = order_details;
            let rows = [...getLineItemsRows(line_items)];
            return <Stack vertical={true} distribution={"fillEvenly"}>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Shopify order id', target_order_id, true)
                    }
                    {
                        textFieldreadOnly('Amazon order id', source_order_id, true)
                    }
                </Stack>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Order date', placed_at, true)
                    }
                    {
                        textFieldreadOnly('Quantity', (qty).toString(), true)
                    }
                </Stack>
                {
                    textFieldreadOnly('Price', price, true)
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
        case 'marketplace_order' : return <div style={{maxHeight: 400, overflowY: 'scroll'}}>{
            ReactJsonStructure(marketplace_order.order_json)
        }</div>;
        case 'shipping_info':
            let { ship_by_date, details } = shipping_info;
            return <Stack vertical={true} distribution={"fillEvenly"}>
                {
                    textFieldreadOnly('Shipping date', ship_by_date, true)
                }
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Ship method', details.method, true)
                    }
                    {
                        textFieldreadOnly('Shipping price', details.price, true)
                    }
                </Stack>
            </Stack>
        case 'customer_info' :
            let { contact_email, name } = customer_info;
            return <Stack vertical={false} distribution={"fillEvenly"}>
                {
                    textFieldreadOnly('Contact email', contact_email, true)
                }
                {
                    textFieldreadOnly('Name', name, true)
                }
            </Stack>
        case 'billing_info':
            let { delivery_details, tax_lines, total_price, total_tax} = billing_info;
            let { rows: taxRows, heading: taxHeading, fields: taxFields } = getTaxLines(tax_lines);
            return <Stack vertical={true} distribution={"fillEvenly"}>
                <p><b>Delivery details</b></p>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Full name', delivery_details.full_name, true)
                    }
                    {
                        textFieldreadOnly('Country', delivery_details.country, true)
                    }
                    {
                        textFieldreadOnly('Phone', delivery_details.phone, true)
                    }
                </Stack>
                <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textFieldreadOnly('Total price', total_price, true)
                    }
                    {
                        textFieldreadOnly('Total tax', total_tax, true)
                    }
                </Stack>
                <hr/>
                <p><b>Tax lines</b></p>
                <DataTable
                    columnContentTypes={taxFields}
                    headings={taxHeading}
                    rows={taxRows}
                />
            </Stack>
        default : return [];
    }
}
