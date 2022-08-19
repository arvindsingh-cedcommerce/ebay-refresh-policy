import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import PaymentPolicy from "./PolicyBody/paymentPolicy";
import {parseQueryString} from "../../../../../services/helperFunction";
import {notify} from "../../../../../services/notify";
import {saveBusinessPolicy} from "../../../../../Apirequest/ebayApirequest/policiesApi";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import {bannerPolaris} from "../../../../../PolarisComponents/InfoGroups";
import {CircleAlertMajorMonotone} from "@shopify/polaris-icons";
import ReturnPolicy from "./PolicyBody/returnPolicy";
import ShippingPolicy from "./PolicyBody/shippingPolicy";
import { PageHeader } from 'antd';
import ShippingPolicyUtkarsh from './PolicyBody/ShippingPolicyUtkarsh';
import PaymentPolicyComponent from './PolicyBody/PaymentPolicyComponent';
import ReturnPolicyComponent from './PolicyBody/ReturnPolicyComponent';
import PaymentPolicyUtkarsh from './PolicyBody/PaymentPolicyUtkarsh';
import ReturnPolicyComponentUtkarsh from './ReturnPolicyComponentUtkarsh';
import ShippingPolicyComponent from './PolicyBody/ShippingPolicyComponent';
import PaymentPolicyUtkarshNew from './PolicyBody/PaymentPolicyUtkarshNew';
import ShippingPolicyUtkarshNew from './PolicyBody/ShippingPolicyUtkarshNew';
import { withRouter } from 'react-router-dom';

class PolicyHandler extends Component {

    constructor(props) {
        super(props);
        this.state={
            type:'',
            id:'',
            shop_id:'',
            loader: false,
            site_id : '',
            errors_recieved_policy:[],
        };
    }

    redirect(url){
        this.props.history.push(url);
    }

    getPolicybody(type){
        let { id, loader, site_id, shop_id } = this.state;
        // console.log('shop_id', shop_id);
        switch (type.toLowerCase()) {
            case "payment":
                // return <PaymentPolicy id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
                // return <PaymentPolicyComponent id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
                // return <PaymentPolicyUtkarsh type={type} id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
                return <PaymentPolicyUtkarshNew type={type} id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
            case "return":
                // return <ReturnPolicy id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
                // return <ReturnPolicyComponent id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
                return <ReturnPolicyComponentUtkarsh id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} type={type}/>
            case "shipping":
                // return <ShippingPolicy id={id} site_id={site_id}  loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)}/>
                // return <ShippingPolicyComponent id={id} site_id={site_id}  loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)}/>
                return <ShippingPolicyUtkarsh id={id} site_id={site_id}  loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} type={type}/>
                // return <ShippingPolicyUtkarshNew id={id} site_id={site_id}  loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)}/>
            default: return [];
        }
    }

    componentDidMount() {
        this.getParams();
    }

    loaderToggle(toggle){
        this.setState({loader:  toggle});
    }

    prepareErrorModal(data){
        console.log('data', data);
        let temparr =[];
        Object.keys(data).map(key => {
            data[key].forEach((value) => {
                temparr.push(
                    bannerPolaris("",
                    `${key.toUpperCase()} Policy : ${value.hasOwnProperty('message')?value.message: value}`, "critical", CircleAlertMajorMonotone)
                )
            });
            return true;
        });
        this.setState({ errors_recieved_policy : [...temparr]});
    }

    async recieveFormdata(policy){
        let { site_id, shop_id, id } = this.state;
        this.loaderToggle(true);
        let requestData = { data : policy, site_id, shop_id, type : Object.keys(policy)[0] };
        if(id !== '') requestData = { ...requestData, profileId: id };
        let { success, data, code, message } = await saveBusinessPolicy(requestData);
        this.loaderToggle(false);
        if(success) {
            notify.success("Business policy saved successfully");
            return true;
        }else{
            if(code && code !== 'something_went_wrong') this.prepareErrorModal(data);
            else notify.error(message);
            return false;
        }
    }

    closeErrorModal(){
        this.setState({ errors_recieved_policy: []});
    }

    async getParams(){
        let { type, id, site_id, shop_id } = parseQueryString(this.props.location.search);
        if(type){
            this.setState({type, id, site_id, shop_id}, () => {
                // console.log('first',type, id, site_id, shop_id);
            });
        }else this.redirect('/panel/ebay/policiesUS');
    }

    render() {
        let { type, id, errors_recieved_policy } = this.state;
        let openModal = errors_recieved_policy.length;
        let title = !id ? 'Create policy' : 'Edit policy';
        return (
            // <Page
            //     title={title} fullWidth={true}
            //     breadcrumbs={[{content: 'Policies', onAction:this.redirect.bind(this,'/panel/ebay/policiesUS')}]}>

            <PageHeader
            className="site-page-header-responsive"
            title={!id ? 'Create policy' : 'View policy'}
            ghost={true}
            onBack={()=>{this.redirect('/panel/ebay/policiesUS')}}
            >
                {
                    this.getPolicybody(type)
                }
                {
                    modalPolaris(`Policy creation errors`, openModal, this.closeErrorModal.bind(this), false, errors_recieved_policy)
                }
            </PageHeader>
            // {/* </Page> */}
        );
    }
}

export default withRouter(PolicyHandler);