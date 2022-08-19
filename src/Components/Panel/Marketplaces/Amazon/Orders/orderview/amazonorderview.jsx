import React, {Component} from 'react';
import {Card, Page, Tabs} from "@shopify/polaris";
import {parseQueryString} from "../../../../../../services/helperFunction";
import {getorderbyId} from "../../../../../../Apirequest/amazonApirequest/ordersApi";
import {getOrderviewTabsStructure, orderViewtabs} from "../amazonorderhelper";
import { getStatusBadge } from "../../../Ebay/Orders/ebayorderhelper";

class Amazonorderview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : '',
            region : '',
            tabs: orderViewtabs,
            tabselected : 0,
            orderData : {
                customer_info: {
                    contact_email: "",
                    name: "",
                },
                billing_info: {
                    delivery_details: {
                        full_name: '',
                        country: '',
                        phone: ''
                    },
                    tax_lines: [],
                    total_price: '',
                    total_tax: ''
                },
                shipping_info: {
                    ship_by_date: '',
                    details: {
                        method: '',
                        price: ''
                    }
                },
                order_details: {
                    order_name : '',
                    source_order_id: '',
                    target_order_id: '',
                    price: '',
                    qty: '',
                    placed_at: '',
                    line_items : []
                },
                marketplace_order: {order_json: {}},
                status : '',
                marketplace_status : '',
                shopify_error_message : '',

            },
            loaders:{
                initialLoad : true,
            }
        };
    }

    componentDidMount() {
        this.getParams();
    }

    getParams(){
        let { region, id } = parseQueryString(this.props.location.search);
        if(id) this.setState({region, id}, () => {
            if(id) this.getOrderbySourceId(id);
        } );
        else this.redirect('/panel/amazon/orders');
    }

    async getOrderbySourceId(source_order_id){
        let { loaders } = this.state;
        loaders.initialLoad = true;
        this.setState( { loaders });
        let { success, data } = await getorderbyId({ order_id : source_order_id });
        if(success) await this.modifyandStoreData(data);
        loaders.initialLoad = false;
        this.setState({ loaders });
    }

    modifyandStoreData(data){
        let { client_details, total_price, tax_lines, total_tax, shipping_address: delivery_details,
            ship_by_date, shipping_details, source_order_data: orderjson, line_items,
            source_order_id, target_order_id, price, qty, placed_at,
            marketplace_status, target_status : shopify_status, target_error_message: shopify_errorMessage, order_name } = data;
        let {method, price:shipPrice } = shipping_details;
        let { full_name, country, phone } = delivery_details;
        let { orderData } = this.state;
        let { customer_info, order_details, marketplace_order, shipping_info, billing_info} = orderData;
        customer_info = { ...customer_info, ...client_details};
        order_details = { ...order_details, ...{ order_name, source_order_id, target_order_id, price : total_price, qty, placed_at, line_items}};
        marketplace_order.order_json = {...orderjson};
        shipping_info = { ...shipping_info, ...{ ship_by_date ,
                details : {
                    method,
                    price: shipPrice
                }}};
        billing_info = { ...billing_info,
            delivery_details: {
                full_name,
                country,
                phone
            },
            tax_lines,
            total_price,
            total_tax
        };
        orderData = {...orderData, status: shopify_status, marketplace_status, shopify_error_message : shopify_errorMessage,
            billing_info,
            shipping_info,
            order_details,
            customer_info
        };
        this.setState({ orderData });

    }

    redirect(url){
        this.props.history.push(url);
    }

    handleTabSelect(tab){
        this.setState({ tabselected : tab});
    }

    render() {
        let { orderData, tabs, tabselected } = this.state;
        let tabType = (tabs.filter((tab, index) => index === tabselected))[0]['type'];
        let { order_details } = orderData;
        let { order_name } = order_details;
        return (
            <Page fullWidth={true} title={`Order ${order_name ? order_name: ''}`}
                  titleMetadata={getStatusBadge(orderData.status)}

                  breadcrumbs={[{content: 'Orders', onAction:this.redirect.bind(this,'/panel/amazon/orders')}]}
            >
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

export default Amazonorderview;