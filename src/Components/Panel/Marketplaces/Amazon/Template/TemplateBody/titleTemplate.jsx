import React, {Component} from 'react';
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {checkbox, ckeditor, select, textArea, textField} from "../../../../../../PolarisComponents/InputGroups";
import {getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import _ from 'lodash';
import {notify} from "../../../../../../services/notify";
import {withRouter} from "react-router-dom";

const AttributeMapoptions=[
    {label:'Title',value:'title'},
    {label:'Vendor',value:'vendor'},
    {label:'Description',value:'description'},
    {label:'Price',value:'price'},
    {label:'Product Type',value:'product_type'},
    {label:'Tags',value:'tags'},
    {label:'Set custom value',value:'default'},

];
const defaultAttributeoptions=[
    {label:'Title',value:'title'},
    {label:'Vendor',value:'vendor'},
    {label:'SKU',value:'sku'},
    {label:'Description',value:'description'},
    {label:'Price',value:'price'},
    {label:'Main image',value:'image_main'},
    {label:'Tags',value:'tags'},
    {label:'Product Type',value:'product_type'},

];

const parentSkuMapping = [
    {label:'Set a custom',value:'custom'},
    {label:'SKU',value:'sku'},
    {label:'Barcode',value:'barcode'},
    {label:'Tags',value:'tags'},
    {label:'Product Type',value:'product_type'},
];

class TitleTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            form_data: {
                name: '',
                amazon_product_sku : {
                    attribute_mapping : '',
                    custom : '',
                },
                title:{
                    selected:'title',
                    default_setting:{
                        value:'{{title}}',
                    },
                },
                subtitle:{
                    selected:'title',
                    default_setting:{
                        value:'{{title}}',
                    }
                },
                description:{
                    selected:'description',
                    default_setting:{
                        value:'{{description}}',
                    }
                }
            },
            default_settings:{
                title:'title',
                description:'description',
            },
            cardHeading:{
                title:'Title',
                description:'Description',
            },

            errors:{
                name:false
            }
        }
    }

    componentDidMount() {
        let { id } = this.props;
        this.setState({ _id: id }, ()=>{
            if(id)  this.getTemplateData(id);
        });
    }

    async getTemplateData(id){
        let { form_data } = this.state;
        let templatedata = {};
        if( id ){
            let { success, data } = await getTemplatebyId(id);
            if(success) templatedata = { ...data.data };
            let mergedData = _.merge(form_data, templatedata);
            this.setState({ form_data: {...mergedData}})
        }
    }

    feildsChangeName(key,value) {
        let {form_data} = this.state;
        form_data[key] = value;
        this.setState({form_data});
    }

    feildsChange(key,tag = false,value){
        let { form_data } = this.state;
        if(tag) form_data[key][tag]= value;
        else form_data[key] = value;
        this.setState({ form_data });
    }

    handleDefaultChangeValue(key,value)
    {
        let { form_data } = this.state;
        form_data[key].default_setting.value = value;
        this.setState({form_data});
    }

    handleDefaultChangeSelect(key,value)
    {
        let { default_settings, form_data } = this.state;
        default_settings[key] = value;
        form_data[key].default_setting.value+="{{"+default_settings[key]+"}}";
        this.setState({ form_data, default_settings});
    }

    renderTemplateBody(key){
        let temparr=[];
        let { cardHeading, form_data, default_settings } = this.state;
        temparr.push(
            <Card title={cardHeading[key]}  key={"feildsettings"+[key]}>
                <Card.Section>
                    <FormLayout>
                        {
                            select(`Mapping options for ${key} field`, AttributeMapoptions, this.feildsChange.bind(this,key,'selected'), form_data[key].selected )
                        }
                        {this.state.form_data[key].selected === 'default' &&

                        <Stack vertical={false}>
                            <Stack.Item key={`mapto ${key}`}>
                                {
                                    select("Choose to add attribute", defaultAttributeoptions, this.handleDefaultChangeSelect.bind(this,key), default_settings[key], "Please select..")
                                }
                            </Stack.Item>
                            <Stack.Item fill key={`component ${key}`}>
                                {key === 'description' ?
                                    <FormLayout>
                                        <FormLayout.Group condensed>
                                            {
                                                textArea("Value", form_data[key].default_setting.value, this.handleDefaultChangeValue.bind(this, key), 10, "")
                                            }
                                            {
                                                ckeditor(form_data[key].default_setting.value, ()=>{}, true)
                                            }
                                        </FormLayout.Group>
                                    </FormLayout> :
                                    textField("Value", form_data[key].default_setting.value, this.handleDefaultChangeValue.bind(this, key), "", "",false, "text", "","", 80)
                                }
                            </Stack.Item>
                        </Stack>
                        }
                    </FormLayout>
                </Card.Section>
            </Card>
        );
        return temparr;
    }

    formValidator(){
        let { form_data, errors:errorsTemplate } = this.state;
        let errors=0;
        Object.keys(form_data).map(key=>{
            switch(key){
                case 'name':
                    if(form_data[key]===''){
                        errorsTemplate.name=true;
                        errors+=1;
                    }
                    else errorsTemplate.name=false;
                    break;
                default:
                    break;
            }
            return true;
        });

        this.setState({ form_data, errors: {...errorsTemplate}});
        return errors===0;
    }

    async saveFormdata(){
        if(this.formValidator()) {
            let { form_data , _id } = this.state;
            let { name } =  form_data;
            let tempObj={
                title: name,
                type:'title',
                data: { ...form_data }
            };
            if(_id!=='') {
                tempObj['_id'] = _id;
            }
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

    render() {
        let { form_data, errors } = this.state;
        let { name, amazon_product_sku } =  form_data;
        let { name: nameError } = errors;
        return (
            <Card title={"Title template"} key={'titleTemplate'}
                  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}
            >
                <Card.Section>
                    {
                        bannerPolaris("", <p><b>Title template </b>helps you map desired Shopify attributes to Title, description attribute of Amazon. You can even pass combination of Shopify attributes and custom values to the aforementioned Amazon attributes.</p>, "info")
                    }
                </Card.Section>
                <Card.Section>
                    <Stack vertical={false} distribution={"fillEvenly"}>
                        {
                            textField("Template name", name, this.feildsChangeName.bind(this,'name'),"", "", nameError )
                        }

                    </Stack>
                </Card.Section>
                <Card.Section title={'Parent SKU mapping'}>
                    <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        select("", parentSkuMapping, this.feildsChange.bind(this, "amazon_product_sku", "attribute_mapping"), amazon_product_sku.attribute_mapping, "Choose an attribute for mapping..")
                    }
                    { amazon_product_sku.attribute_mapping === "custom" &&
                        textField("", amazon_product_sku.custom, this.feildsChange.bind(this, "amazon_product_sku", "custom"), "Please provide a custom value")
                    }
                    </Stack>
                </Card.Section>
                <Card.Section title={'Settings'}>
                    <FormLayout>
                        {
                            this.renderTemplateBody('title')
                        }
                        {
                            this.renderTemplateBody('description')
                        }
                    </FormLayout>
                </Card.Section>
            </Card>
        );
    }
}

export default withRouter(TitleTemplate);