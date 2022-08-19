import React, {Component} from 'react';
import {parseQueryString} from "../../../../../services/helperFunction";
import InventoryTemplate from "./TemplateBody/inventoryTemplate";
import {Page} from "@shopify/polaris";
import { saveTemplates} from "../../../../../Apirequest/ebayApirequest/templatesApi";
import {notify} from "../../../../../services/notify";
import TitleTemplate from "./TemplateBody/titleTemplate";
import PricingTemplate from "./TemplateBody/pricingTemplate";
import CategoryTemplate from "./TemplateBody/categoryTemplate";

class EbaytemplateHandler extends Component {

    constructor(props) {
        super(props);
        this.state={
            type:'',
            id:'',
            loader: false
        }
    }

    componentDidMount() {
            this.getParams();
    }

    async getParams(){
        let { type, id } = parseQueryString(this.props.location.search);
        if(type){
            this.setState({type, id});
        }else this.redirect('/panel/ebay/templates/list');
    }

    redirect(url){
        this.props.history.push(url);
    }
    loaderToggle(toggle){
        this.setState({loader:  toggle});
    }

    async recieveFormdata(data){
        data = { ...data, marketplace : 'ebay'}
        this.loaderToggle(true);
        let { success, message } = await saveTemplates(data);
        this.loaderToggle(false);
        if(success) {
            notify.success(message);
            return true;
        }else{
            notify.error(message);
            return false;
        }

    }

    getTemplatebody(type){
        let { id, loader } = this.state;
        switch (type) {
            case 'inventory':
                return <InventoryTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'title':
                return <TitleTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'price':
                return <PricingTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'category':
                return <CategoryTemplate id={id} loader={loader} showSecondaryCategory={true} recieveFormdata={this.recieveFormdata.bind(this)}  />
            default: return [];
        }
    }


    render() {
        let { type, id } = this.state;
        let title = !id ? 'Create template' : 'Edit template';
        return (
            <Page
                breadcrumbs={[{content: 'Templates', onAction:this.redirect.bind(this,'/panel/ebay/templates/list')}]}
                title={title} fullWidth={true}>
                {
                    this.getTemplatebody(type)
                }
            </Page>
        );
    }
}

export default EbaytemplateHandler;