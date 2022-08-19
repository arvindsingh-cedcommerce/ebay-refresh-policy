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

class EbayPolicyHandler extends Component {

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
        switch (type) {
            case "payment":
                return <PaymentPolicy id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
            case "return":
                return <ReturnPolicy id={id} site_id={site_id} loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)} />
            case "shipping":
                return <ShippingPolicy id={id} site_id={site_id}  loader={loader} shop_id={shop_id} recieveFormdata={this.recieveFormdata.bind(this)}/>
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
            this.setState({type, id, site_id, shop_id});
        }else this.redirect('/panel/ebay/policies');
    }

    render() {
        let { type, id, errors_recieved_policy } = this.state;
        let openModal = errors_recieved_policy.length;
        let title = !id ? 'Create policy' : 'Edit policy';
        return (
            <Page
                title={title} fullWidth={true}
                breadcrumbs={[{content: 'Policies', onAction:this.redirect.bind(this,'/panel/ebay/policies')}]}>
                {
                    this.getPolicybody(type)
                }
                {
                    modalPolaris(`Policy creation errors`, openModal, this.closeErrorModal.bind(this), false, errors_recieved_policy)
                }
            </Page>
        );
    }
}

export default EbayPolicyHandler;