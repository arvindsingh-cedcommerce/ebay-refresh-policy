import React, {Component} from 'react';
import {Card, Page, Tabs} from "@shopify/polaris";
import {parseQueryString} from "../../../../../services/helperFunction";
import {fetchOrderById} from "../../../../../Apirequest/ebayApirequest/ordersApi";
import {getOrderviewTabsStructure, getStatusBadge, orderViewtabs} from "./ebayorderhelper";
import _ from 'lodash';

class Ebayorderview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id :'',
            tabs: orderViewtabs,
            tabselected : 0,
            orderData : {
                status : '',
                shopifydata : {
                    shopify_order_id: '',
                    ebay_order_id: '',
                    order_name: '',
                    order_placed_at: '',
                    line_items_count: '',
                    ebay_reference_id: '',
                    line_items: []
                },
                marketplacedata : {
                    order_json : '',
                },
                shipping_details : {
                   shipping_service : '',
                    shipping_cost :'',
                },
                client_details : {
                    customer_name : '',
                    contact_info : '',
                    billing_address : {
                        address : '',
                        phone : '',
                        city : '',
                        country : '',
                        zip : '',
                        country_code :'',
                        province : ''
                    }
                },
                payment_details : {
                    price : '',
                    inclusive_tax : '',
                    payment_method : '',
                    taxes_applied : '',
                },
                fulfillments : {
                    tracking_company : '',
                    tracking_number : '',
                    created_at : '',
                    updated_at : ''
                }

            },
            loaders:{
                initialLoad : true,
            }
        };
    }

    componentDidMount() {
        this.getOrderByID();
    }

    handleTabSelect(tab){
        this.setState({ tabselected : tab});
    }

    redirect(url){
        this.props.history.push(url);
    }

    getOrderByID(){
        let { id } = parseQueryString(this.props.location.search);
        let { loaders } = this.state;
        loaders.initialLoad = true;
        this.setState( { loaders });
        if(id){
            this.setState({ id }, async () =>{
                let { success, data } = await fetchOrderById({order_id : id});
                if(success) await this.modifyandStoreData(data);
            });
        }else this.redirect('/panel/ebay/products');
        loaders.initialLoad = false;
        this.setState({ loaders });
    }

    modifyandStoreData(data){
        let { orderData }  = this.state;
        let { source_order_data, client_details, shipping_address : delivery_details, line_items, payment_method, shipping_cost_details, tax_lines, total_tax, total_price, source_order_id, target_order_id, shopify_order_name,  target_status : status, target_error_message: shopify_errorMessage, placed_at: paid_at, fulfillments} = data;
        orderData.status = status;
        orderData.shopifydata = _.merge( orderData.shopifydata, {
            shopify_order_id : target_order_id,
            ebay_order_id : source_order_id,
            order_name : shopify_order_name,
            order_placed_at : paid_at,
            line_items_count : (Object.keys(line_items)).length,
            ebay_reference_id : source_order_data ? source_order_data.ExtendedOrderID:''
        });
        orderData.marketplacedata.order_json = source_order_data;
        orderData.shipping_details = _.merge( orderData.shipping_details, {
            shipping_service : shipping_cost_details ? shipping_cost_details.title: '',
            shipping_cost : shipping_cost_details ? shipping_cost_details.cost: '',
        });
        orderData.shopifydata.line_items = Object.keys(line_items).map(lineitemObj => line_items[lineitemObj]);
        orderData.client_details = _.merge( orderData.client_details, {
            customer_name : client_details.name,
            contact_info : client_details.contact_email,
            billing_address : {
                address : delivery_details.address1,
                phone : delivery_details.phone_number,
                city : delivery_details.city,
                country : delivery_details.country,
                zip : delivery_details.zip,
                country_code :delivery_details.country_code,
                province : delivery_details.province
            }
        });
        let taxesArray = Object.keys(tax_lines).map( taxObj => tax_lines[taxObj].title);
        orderData.payment_details = _.merge( orderData.payment_details, {
            price : total_price,
            inclusive_tax : total_tax,
            payment_method : payment_method ? payment_method.payment_method : '',
            taxes_applied : taxesArray.length ? taxesArray.join(','):'',
        });
        if(fulfillments) {
            orderData.fulfillments =  {
                tracking_company : fulfillments['0'].tracking_company,
                tracking_number : fulfillments['0'].tracking_number,
                created_at : fulfillments['0'].created_at,
                updated_at : fulfillments['0'].updated_at
            };
        }else{
            orderData.fulfillments = false;
        }
        this.setState({ orderData });
    }



    render() {
        let  { orderData, tabs, tabselected  } = this.state;
        let tabType = (tabs.filter((tab, index) => index === tabselected))[0]['type'];
        let { shopifydata } = orderData;
        let { order_name } = shopifydata;
        return (
            <Page title={`Order ${order_name}`}
                  titleMetadata={getStatusBadge(orderData.status)}
                  breadcrumbs={[{content: 'Orders', onAction:this.redirect.bind(this,'/panel/ebay/orders')}]}
                  fullWidth={true}>
                <Card>
                <Tabs tabs={tabs} fitted={true} selected={tabselected} onSelect={this.handleTabSelect.bind(this)}>
                    <Card.Section title={tabs[tabselected].content}>
                    {
                        getOrderviewTabsStructure( orderData, tabType)
                    }
                    </Card.Section>
                </Tabs>
                </Card>
            </Page>
        );
    }
}

export default Ebayorderview;