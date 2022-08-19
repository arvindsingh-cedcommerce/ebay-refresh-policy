import React, { Component } from 'react';
import {Card, Page, Stack, Tabs} from '@shopify/polaris';
import { accountLinking } from '../../../Subcomponents/Registration/AccountLinking';
import { json } from '../../../globalConstant/static-json';
import { stepsaveApi, validateFunction } from '../../../Subcomponents/Registration/stepCommonFunction';
import { notify } from '../../../services/notify';
import {accountsConnectedStructure, accountsSectiontabs, getgeneralModalStrucuture} from './accountsHelper';
import {getConnectedAccounts, updateactiveInactiveAccounts, viewUserDetailsEbay} from "../../../Apirequest/accountsApi";
import {modalPolaris} from "../../../PolarisComponents/ModalGroups";
import {getInstallationForm, redirectToURL} from "../../../Apirequest/registrationApi";
import {getMarketplaceConnectedAccount} from "../Marketplaces/Ebay/Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import {collapsiblePolaris, ReactJsonStructure} from "../../../PolarisComponents/InputGroups";
import {accountLinkCardStructure} from "../../../PolarisComponents/AccountconnectGroup";
import { environment } from '../../../environment/environment';
import { globalState } from '../../../services/globalstate';

class Accounts extends Component {

    constructor(props){
        super(props);
        this.state = {
            modal:{
                open: false,
                marketplace : '',
                data : {},
                modalToggle : this.modalClose.bind(this),
            },
            currentPathname : this.props.location.pathname,
            tabs : accountsSectiontabs,
            account_collapsible : false,
            tabselected : 0,
            accountsConnected : {
                ebay : [],
                amazon : [],
                shopify : []
            },
            selectedReconnectAccount : {},
            permissionModal : { open: false, modalToggle : this.modalClose.bind(this) },
            data: {
                ebay:{
                    image: "https://ebay.sellernext.com/marketplace-logos/ebay.png",
                    form_data:{
                        account_type:'production',
                        country_image : "http://icons.iconarchive.com/icons/wikipedia/flags/256/US-United-States-Flag-icon.png",
                        site_id:'0',
                    },
                    formDataChange: this.formDataChange.bind(this)
                },
                amazon:{
                    image: "https://ebay.sellernext.com/marketplace-logos/amazon.jpg",
                    form_data:{
                        regions_options: json.amazon_regions,
                        region_selected : '',
                    },
                    formDataChange: this.formDataChange.bind(this)
                },
                loader: false,
                modal:{
                    open: false,
                    marketplace : '',
                    modalToggle : this.modalClose.bind(this),
                },
                onChangeData : this.onChangeData.bind(this)
            },
            errors:{
                ebay:{

                },
                amazon:{
                    region_selected : false,
                }
            }
        }
    }

    modalClose( step, field = 'modal'){
        switch(step) {
            case 1:
                let { data } = this.state;
                data['modal']['open'] = false;
                data['modal']['marketplace'] = '';
                this.setState({data});
                break;
            case 2:
                let { modal } = this.state;
                modal['open'] = false;
                modal['data'] = {};
                modal['marketplace'] = '';
                this.setState({modal});
                break;
            default:
                let { permissionModal, selectedReconnectAccount } = this.state;
                permissionModal.open = false;
                selectedReconnectAccount = {};
                this.setState({ permissionModal, selectedReconnectAccount });
                break;
        }


    }

    async changeStep( data, errors){
        let { isValid, errors: errorField  } = await validateFunction(1, data, errors);
        if(isValid) await stepsaveApi(1, data);
        else notify.info("Please fill in all fields.")
        this.setState({ errors :{...errorField} });
    }

    formDataChange(field,formData, marketplace , value){
        let { data } = this.state;
        let { form_data } = data[marketplace];
        let obj = {};
        if(marketplace  === 'ebay' ) {
            if (field === 'account_type') obj = {...form_data, account_type: value};
            if (field === 'site_id') {
                let siteData = json.flag_country.filter(obj => obj.value === value);
                obj = {...form_data, site_id: value, country_image: siteData[0]['flag']}
            }
        }
        if(marketplace === 'amazon'){
            switch(field){
                case 'region_selected':
                    obj['marketplace_options'] = json.region_marketplace[value];
                    obj['markeplaceselected'] = [];
                    break;
                default:
                    break;
            }
            obj = { ...form_data, [field]: value, ...obj };
        }
        data[marketplace]['form_data'] = { ...obj};
        this.setState( { data });
    }

    onChangeData(field, step, value){
        let { data, modal } = this.state;
        switch (step) {
            case 1:
                if(field === 'marketplace') {
                    data['modal'][field] = value;
                    data['modal']['open'] = true;
                }
                if(field === 'loader'){
                    data[field] = value;
                }
                break;
            case 2:
                if(field === "modal_data"){
                    modal['data'] = { ...value };
                }
                if(field === 'marketplace') {
                    modal[field] = value;
                    modal['open'] = true;
                }
                break;
            default: break;
        }
        this.setState({data});
    }

    async getAllConnectedAccounts(){
        let { success, data: accounts } = await getConnectedAccounts();
        let { accountsConnected } =  this.state;
        if(success) {
            accountsConnected['ebay'] = await getMarketplaceConnectedAccount('ebay', ['user_id'],  accounts);
            accountsConnected['amazon'] = await getMarketplaceConnectedAccount('amazon', ['seller_id'],  accounts);
            accountsConnected['shopify'] = await getMarketplaceConnectedAccount('shopify', [],  accounts);
            this.setState({ accountsConnected });
        }
    }

    componentDidMount(){
        this.getAllConnectedAccounts();
    }

    handleTabChange(tab, key = "tabselected"){
        this.setState({ [key] : tab});
    }

    async reconnectAccount(){
        let { selectedReconnectAccount } = this.state;
        let {site_id, mode} = selectedReconnectAccount;
        // let accountConnected = await getInstallationForm(selectedReconnectAccount);
          window.open(
            `${
              environment.API_ENDPOINT
            }/connector/get/installationForm?code=ebay&site_id=${site_id}&mode=${mode}&bearer=${globalState.getLocalStorage(
              "auth_token"
            )}`,
            "_parent"
          );
        // if(accountConnected.success){
        //     redirectToURL(accountConnected.data);
        // }else{
        //     notify.error('account redirect failed');
        // }
    }

    async activeInactiveFunction(action, state){
        let { marketplace, id } = action;
        let { success, message } = await updateactiveInactiveAccounts({ marketplace, state, shop_id: id });
        if(!success) notify.error(message);
        this.getAllConnectedAccounts();
    }

    connectedAccountActions(action){
        let { selectedReconnectAccount, permissionModal } = this.state;
        let { marketplace, warehouses  } = action;
        warehouses = warehouses[0];
        switch(marketplace){
            case 'ebay':
                selectedReconnectAccount = { site_id: warehouses.site_id, mode : warehouses.sandbox === "1"?"sandbox":"production", code:'ebay'};
                permissionModal.open = true;
                break;
            case 'amazon':
                permissionModal.open = true;
                selectedReconnectAccount = { region: warehouses.region, code:'amazon'};
                break
            default: break;
        }
        this.setState({ selectedReconnectAccount, permissionModal });
    }

    handleTabStructure(tab){
        let { data, errors, currentPathname, accountsConnected } = this.state;
        switch(tab){
            case 1: return accountLinking(1 , data, this.onChangeData.bind(this), errors, this.changeStep.bind(this, data, errors), false, currentPathname);
            case 0 : return accountsConnectedStructure(accountsConnected, this.connectedAccountActions.bind(this), currentPathname, this.activeInactiveFunction.bind(this), this.showUserDetails.bind(this));
            default : break;
        }
    }

    async showUserDetails(marketplace, data){
        switch(marketplace){
            case 'ebay':
                this.onChangeData("marketplace", 2, data.label);
                let { success, data: marketplace_shop_details} =  await viewUserDetailsEbay({ marketplace, shop_id : data.value});
                if(success) {
                    this.onChangeData("modal_data", 2, {...marketplace_shop_details});
                    this.onChangeData("marketplace", 2, data.label);
                }
                break;
            default: break;
        }
    }

    render() {
        let { modal, tabselected, permissionModal, selectedReconnectAccount, account_collapsible } = this.state;
        let generalmodalStructure = Object.keys(modal.data).length > 0 ?getgeneralModalStrucuture( "react_json", modal.data) : getgeneralModalStrucuture("loader");
        return (
            <Page title={'Accounts'} fullWidth={true} primaryAction={{content:"Add accounts", primary : account_collapsible, onAction: this.handleTabChange.bind(this, !account_collapsible, "account_collapsible")}}>
                <Stack vertical={true} spacing={"loose"}>
                {
                    collapsiblePolaris(account_collapsible, this.handleTabStructure(1))
                }
                {
                    this.handleTabStructure(tabselected)
                }
                </Stack>
                {
                    modalPolaris("Permission required", permissionModal.open, (permissionModal.modalToggle).bind(this, 9), { content :'Reconnect', onAction: this.reconnectAccount.bind(this)},
                        <p>{`Do you want to reconnect the ${selectedReconnectAccount.code === 'ebay'? 'eBay': 'Amazon'} account ?`}</p>
                    )
                }
                {
                    modalPolaris(`${modal.marketplace}`, modal.open, this.modalClose.bind(this, 2), false, generalmodalStructure)
                }
            </Page>
        );
    }
}

export default Accounts;