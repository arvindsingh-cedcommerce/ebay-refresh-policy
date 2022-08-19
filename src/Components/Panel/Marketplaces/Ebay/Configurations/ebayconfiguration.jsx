import React, {Component} from 'react';
import {Page, Tabs} from "@shopify/polaris";
import { ebayconfigSectiontabs, filterStructure } from './ebayconfigurationhelper';
import {
    marketplaceAttributeErrorMapSchema,
    marketplaceAttributeMapSchema
} from '../../../../../Subcomponents/Registration/ImportsettingsBody';
import {validateFunction} from "../../../../../Subcomponents/Registration/stepCommonFunction";
import {notify} from "../../../../../services/notify";
import {saveFilters} from "../../../../../Apirequest/registrationApi";
import {getConfigurations} from "../../../../../Apirequest/configurationsApi";
import {checkfilteralreadyPresent} from "../../../../Registration/RegistrationHelper/registrationHelper";

class Ebayconfiguration extends Component {

    constructor(props){
        super(props);
        this.state = {
            tabs: {
                tabList : ebayconfigSectiontabs,
                selectedTab : 0
            },
            product_filters :{
                shopify_import :{
                    product_status : 'active'
                },
                ebay_import : []
            },
            errors : {
                product_filters : {
                    shopify_import : { product_status : false},
                    ebay_import : []
                },

            },
            loader: false
        }
    }

    handleTabChange(tab){
        let { tabs } = this.state;
        tabs.selectedTab = tab
        this.setState({ tabs });
    }

    componentDidMount() {
        this.getConfigurations();
    }

    async getConfigurations(){
        let { success, data} = await getConfigurations('ebay');
        let { product_filters, errors } = this.state;
        if(success){
            let { filters } = data;
            if(filters){
                let { shopify, ebay } = filters;
                if(shopify) product_filters.shopify_import.product_status = shopify.status;
                if(ebay) {
                    product_filters.ebay_import = [...ebay];
                    ebay.forEach(() => {
                        errors['product_filters']['ebay_import'] = [...errors['product_filters']['ebay_import'], {...marketplaceAttributeErrorMapSchema}];
                    });
                }

            }
        }
        this.setState({ product_filters, errors });
    }

    handleConfigurationChange(config, field, subfield = false, index= false, subvalue= false, action = false, value){
        let { product_filters, errors } = this.state;
        if(subvalue === "marketplace_attribute" && checkfilteralreadyPresent(product_filters[field], 'marketplace_attribute', value)){
            notify.error("Attribute already present, Duplicate marketplace attribute can't be mapped");
            return true;
        }
        switch(config){
            case 'product_filters':
                if(field === 'shopify_import') product_filters[field][subfield] = value;
                if(field === 'ebay_import') {
                    switch(action){
                        case 'add' :
                            product_filters[field] = [ ...product_filters[field], {...marketplaceAttributeMapSchema}];
                            errors[config][field] = [ ...errors[config][field], { ...marketplaceAttributeErrorMapSchema }];
                            break;
                        case 'update':
                            product_filters[field][index][subvalue] = value;
                            break;
                        case 'delete':
                            product_filters[field] = (product_filters[field]).filter((obj, pos) => pos !== value);
                            errors[config][field] = (errors[config][field]).filter((obj, pos) => pos !== value);
                            break;
                        default : break;
                    }
                }
                break;
            default: break;
        }
        this.setState({ product_filters });
    }

    renderTabSelectedBody(tab){
        switch(tab){
            case 0 : 
            let { product_filters, loader, errors } = this.state;
            return filterStructure(product_filters, this.handleConfigurationChange.bind(this), 'ebay', this.configurationSaved.bind(this), loader, errors.product_filters)
            default : break;
        }
        return []
    }

    async configurationSaved(config){
        switch(config){
            case 'product_filters' :
                let { product_filters, errors } = this.state;
                let { shopify_import, ebay_import } = product_filters;
                let { product_filters: productFiltersErrors } = errors;
                let { isValid, errors: errorField  } = await validateFunction(3, {accounts_connected : ['ebay'], filters :{ /*shopify: shopify_import,*/ ebay: ebay_import}},
                    { shopify: {...productFiltersErrors.shopify_import}, ebay: {...productFiltersErrors.ebay_import}} );
                errors['product_filters']['shopiy_import'] = {...errorField.shopify};
                errors['product_filters']['ebay_import'] = [...Object.values(errorField.ebay)];
                if(isValid){
                    let {success : savedFilters, message: messageRecieved } = await saveFilters({ /*shopify : { status: shopify_import.product_status },*/ ebay: [...ebay_import]});
                    if(savedFilters) notify.success(messageRecieved);
                    else notify.warn(messageRecieved);
                }else notify.error('*Please fill all required fields');
                this.setState( { errors });
            break;
            default : break;
        }
    }

    render() {
        let { tabs } = this.state;
        let { tabList, selectedTab } = tabs;
        return (
            <Page fullWidth title={'Configurations'}>
                 <Tabs tabs={tabList} selected={selectedTab} onSelect={this.handleTabChange.bind(this)}/>
                {
                    this.renderTabSelectedBody(selectedTab)
                }
            </Page>
        );
    }
}

export default Ebayconfiguration;