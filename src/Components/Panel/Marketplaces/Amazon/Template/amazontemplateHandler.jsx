import React, {Component} from 'react';
import {parseQueryString} from "../../../../../services/helperFunction";
import {Page} from "@shopify/polaris";
import InventoryTemplate from "./TemplateBody/inventoryTemplate";
import PriceTemplate from "./TemplateBody/priceTemplate";
import {saveTemplates} from "../../../../../Apirequest/ebayApirequest/templatesApi";
import {notify} from "../../../../../services/notify";
import TitleTemplate from "./TemplateBody/titleTemplate";
import CategoryTemplate from "./TemplateBody/categoryTemplate";

class AmazontemplateHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:'',
            id:'',
            loader: false
        }
    }

    componentDidMount() {
        this.getParams();
    }

    getParams(){
        let { type, id } = parseQueryString(this.props.location.search);
        if(type) this.setState({type, id});
        else this.redirect('/panel/amazon/templates/list');

    }

    redirect(url){
        this.props.history.push(url);
    }

    async recieveFormdata(data){
        data = { ...data, marketplace : 'amazon'}
        this.loaderToggle(true);
        let { success, message } = await saveTemplates(data);
        // Save Amazon template data
        this.loaderToggle(false);
        if(success) {
            notify.success(message);
            return true;
        }else{
            notify.error(message);
            return false;
        }
    }

    loaderToggle(toggle){
        this.setState({loader:  toggle});
    }

    getTemplatebody(type){
        let { id, loader } = this.state;
        switch (type) {
            case 'inventory':
                return <InventoryTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'price':
                return <PriceTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'title':
                return <TitleTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            case 'category':
                return <CategoryTemplate id={id} loader={loader} recieveFormdata={this.recieveFormdata.bind(this)} />
            default: return [];
        }
    }


    render() {
        let { type, id } = this.state;
        let title = !id ? 'Create template' : 'Edit template';
        return (
            <Page
                breadcrumbs={[{content: 'Templates', onAction:this.redirect.bind(this,'/panel/amazon/templates/list')}]}
                title={title} fullWidth={true}>
                {
                    this.getTemplatebody(type)
                }
            </Page>
        );
    }
}

export default AmazontemplateHandler;