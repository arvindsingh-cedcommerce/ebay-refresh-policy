import React, {Component} from 'react';
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {checkbox, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {notify} from "../../../../../../services/notify";
import {getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {withRouter} from "react-router-dom";
import {variateType} from "./TemplateHelpers/categorytemplateHelper";

class InventoryTemplate extends Component {

    constructor(props) {
        super(props);
        this.state={
            _id:'',
            form_data:{
                name:'',
                fixed_inventory:'',
                threshold_inventory:'',
                delete_product_outofStock:false,
                QuantityRestrictPerBuyer:'',
                customize_inventory: false,
                custom_inventory:{
                    trend : 'increase',
                    value : ""
                },
            },
            errors:{
                name:false,
                threshold_inventory:false,
            }
        }

    }

    feildsChange(tag, subfield = false,value){
        let { form_data } = this.state;
        if(subfield) form_data[tag][subfield]= value;
        else form_data[tag]= value;
        this.setState({ form_data });
    }

    async saveFormdata(){
        if(this.formValidator()){
            let { _id } = this.state;
            let tempObj={
                title:this.state.form_data.name,
                type:'inventory',
                data:this.state.form_data,
            };
            if(_id !== '') tempObj['_id'] = _id;
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse){
                this.redirect('/panel/ebay/templates');
            }
        }else{
            notify.error('Kindly fill all the required fields');
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    async getTemplateData(id){
        let { form_data } = this.state;
        let templatedata = {};
        if( id ){
            let { success, data } = await getTemplatebyId(id);
            if(success) templatedata = { ...data.data };
            this.setState({ form_data: {...form_data, ...templatedata}})
        }
    }

     componentDidMount() {
        let { id } = this.props;
        this.setState({ _id: id }, ()=>{
            if(id)  this.getTemplateData(id);
        });
    }

    formValidator(){
        let { form_data,errors:errorsObj } = this.state;
        let errors=0;
        Object.keys(form_data).map(key => {
            switch(key){
                case 'name':
                    if(form_data[key]===''){
                        errorsObj['name'] = true;
                        errors+=1;
                    }
                    else errorsObj['name'] = false;
                    break;
                default:
                    break;
            }
            return true;
        });

        this.setState({errors: errorsObj});
        return errors===0;
    }

    render() {
        let { form_data, errors } = this.state;
        let {  name, fixed_inventory, customize_inventory, custom_inventory, threshold_inventory, delete_product_outofStock, QuantityRestrictPerBuyer } = form_data;
        let { name: nameError , threshold_inventory: thresholdError } = errors;
        return (
            <Card title={"Inventory template"}
                  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
                <Card.Section>
                    {
                        bannerPolaris("",<p> With the use of <b>Inventory template </b>you can assign properties like how much should be the inventory, what is its limit (threshold), restriction per buyer and whether to delete products when they are out of stock. So by simply using the template all of these conditions can be applied while listing on eBay.</p>,"info")
                    }
                </Card.Section>
                <Card.Section>
                    <FormLayout>
                        {
                            textField("Template name", name, this.feildsChange.bind(this,'name', false), "","*required", nameError )
                        }
                        {
                            textField("Fixed inventory", fixed_inventory, this.feildsChange.bind(this,'fixed_inventory', false), "","*When quantity is not managed through Shopify", false, "number" )
                        }
                        {
                            textField("Threshold inventory", threshold_inventory, this.feildsChange.bind(this,'threshold_inventory', false), "","*Below this inventory product will become out of stock.", thresholdError, "number" )
                        }
                        {
                            checkbox("Customize inventory", customize_inventory, this.feildsChange.bind(this,'customize_inventory', false))
                        }
                        {
                            customize_inventory && <Stack vertical={false} distribution={"fillEvenly"}>
                                {
                                    select("Choose trend", variateType, this.feildsChange.bind(this, "custom_inventory", "trend"), custom_inventory.trend)
                                }
                                {
                                    textField("Value", custom_inventory.value, this.feildsChange.bind(this, "custom_inventory", "value"), "", "", false, "number")
                                }
                            </Stack>
                        }
                        {
                            checkbox("Delete out of stock product", delete_product_outofStock, this.feildsChange.bind(this,'delete_product_outofStock', false) )
                        }
                        {
                            textField("Quantity restriction per buyer", QuantityRestrictPerBuyer, this.feildsChange.bind(this,'QuantityRestrictPerBuyer', false), "","", false, "number" )
                        }
                    </FormLayout>
                </Card.Section>
            </Card>

        );
    }
}

export default withRouter(InventoryTemplate);