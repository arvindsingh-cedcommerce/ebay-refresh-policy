import React, {Component} from 'react';
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {checkbox, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {changeRequired, changeValueby, changeValuetype} from "./TemplateHelpers/AmazonTemplateHelper";
import {notify} from "../../../../../../services/notify";
import {withRouter} from "react-router-dom";
import {getAttributesByProductQuery, getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {prepareChoiceoption} from "../../../../../../Subcomponents/Aggrid/gridHelper";

class InventoryTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            form_data:{
                name: '',
                delete_product_out_of_stock : false,
                threshold_inventory : '',
                fixed_inventory : '',
                inventory_fulfillment_latency_value:'',
                inventory_fulfillment_latency_mapping : '',
                change_inventory : 'default',
                modify_inventory : {
                    change_type:'',
                    change_by:'',
                    change_value:'',
                }
            },
            attribute_mappings : {
                shopify_options : [],
            },
            errors:{
                name : false,
                inventory_fulfillment_latency_value: false,
                modify_inventory : {
                    change_type:false,
                    change_by :false,
                    change_value:false,
                }
            }
        }
    }

    feildsChange(key, tag = false, value) {
        let {form_data} = this.state;
        if (tag) form_data[key][tag] = value;
        else form_data[key] = value;
        this.setState({form_data});
    }

    async saveFormdata(){
        if(this.formValidator()){
            let { _id, form_data } = this.state;
            let tempObj={
                title:form_data.name,
                type:'inventory',
                data: form_data,
            };
            if(_id !== '') tempObj['_id'] = _id;
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse){
                this.redirect('/panel/amazon/templates/list');
            }
        }else{
            notify.error('Kindly fill all the required fields');
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    componentDidMount() {
        let { id } = this.props;
        this.getShopifyAttributes();
        this.setState({ _id: id }, ()=>{
            if(id)  this.getTemplateData(id);
        });
    }

    async getShopifyAttributes(){
        let { success, data } = await getAttributesByProductQuery({marketplace:'shopify',query:'(price>-1)'});
        if(success) this.setShopifyAttribute(data);
    }

    async setShopifyAttribute(data){
        let { attribute_mappings } = this.state;
        attribute_mappings.shopify_options = [ {label:'Set custom',value:'custom'}, ...prepareChoiceoption(data, "title", "code")];
        this.setState({ attribute_mappings });
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
                case 'inventory_fulfillment_latency_value':
                    if(form_data['inventory_fulfillment_latency_mapping'] === 'custom' && form_data[key]===''){
                        errorsObj['inventory_fulfillment_latency_value'] = true;
                        errors+=1;
                    }
                    else errorsObj['inventory_fulfillment_latency_value'] = false;
                    break;
                case 'modify_inventory':
                    if(form_data['change_inventory'] === 'change') {
                        Object.keys(form_data[key]).map(mapkey => {
                            switch (mapkey) {
                                case 'change_type':
                                    if (form_data[key][mapkey] === '') {
                                        errorsObj[key][mapkey] = true;
                                        errors += 1;
                                    } else errorsObj[key][mapkey] = false;
                                    break;
                                case 'change_by':
                                    if (form_data[key][mapkey] === '') {
                                        errorsObj[key][mapkey] = true;
                                        errors += 1;
                                    } else errorsObj[key][mapkey] = false;
                                    break;
                                case 'change_value':
                                    if (form_data[key][mapkey] === '' || form_data[key][mapkey] <= 0) {
                                        errorsObj[key][mapkey] = true;
                                        errors += 1;
                                    } else errorsObj[key][mapkey] = false;
                                    break;
                                default :
                                    break;
                            }
                            return true;
                        })
                    }
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
        let { form_data, errors, attribute_mappings } = this.state;
        let { name: nameErrors, inventory_fulfillment_latency_value: inventoryFulfillmentlatency, modify_inventory: modifyError } = errors;
        let { name, fixed_inventory, threshold_inventory, delete_product_out_of_stock, inventory_fulfillment_latency_value, modify_inventory, change_inventory, inventory_fulfillment_latency_mapping } = form_data;
        let { change_by, change_type, change_value } = modify_inventory;
        let { change_by: changeByError, change_type: changeTypeError, change_value: changeValueError } = modifyError;
        return (
            <Card title={"Inventory template"}
                  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
                <Card.Section>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            textField("Name", name, this.feildsChange.bind(this,'name', false),  '', '*required', nameErrors)
                        }
                    </Stack>
                </Card.Section>
                <Card.Section title={"Inventory fulfillment latency"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("Choose an attribute for mapping", attribute_mappings.shopify_options, this.feildsChange.bind(this,'inventory_fulfillment_latency_mapping', false), inventory_fulfillment_latency_mapping)
                        }
                        { inventory_fulfillment_latency_mapping === 'custom' &&
                            textField("Inventory Fulfillment Latency",
                                inventory_fulfillment_latency_value,
                                this.feildsChange.bind(this, 'inventory_fulfillment_latency_value', false),
                                "",
                                "The number of days between the order date and the ship date (a whole number between 1 and 30).",
                                inventoryFulfillmentlatency,
                                "number")
                        }
                    </Stack>
                </Card.Section>
                <Card.Section title={"Change Inventory"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("", changeRequired, this.feildsChange.bind(this, 'change_inventory', false), change_inventory, "Please select")
                        }
                        {change_inventory === 'change' &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Change value type", changeValuetype, this.feildsChange.bind(this, 'modify_inventory', 'change_type'), change_type, "Please select", changeTypeError)
                            }
                            {
                                select("Change value by", changeValueby, this.feildsChange.bind(this, 'modify_inventory', 'change_by'), change_by, "Please select", changeByError)
                            }
                            {
                                textField("Change value", change_value, this.feildsChange.bind(this, 'modify_inventory', 'change_value'), change_value, "", changeValueError, 'number', "", change_by === 'percentage' ? "%" : "")
                            }
                        </Stack>
                        }
                        {
                            textField("Fixed inventory", fixed_inventory, this.feildsChange.bind(this,'fixed_inventory', false), "","*When quantity is not managed through Shopify", false, "number" )
                        }
                        {
                            textField("Threshold inventory", threshold_inventory, this.feildsChange.bind(this,'threshold_inventory', false), "","*Below this inventory product will become out of stock.", false, "number" )
                        }
                        {
                            checkbox("Delete out of stock product", delete_product_out_of_stock, this.feildsChange.bind(this,'delete_product_out_of_stock', false) )
                        }
                    </Stack>
                </Card.Section>
            </Card>
        );
    }
}

export default withRouter(InventoryTemplate);