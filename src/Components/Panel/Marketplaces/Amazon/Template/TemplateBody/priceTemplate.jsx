import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Card, Stack} from "@shopify/polaris";
import {choiceList, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {
    changeRequired,
    changeValueby,
    changeValuetype, inventoryTemplateFormValidator, priceModifieroptions,
    Shopifyattributes,
    yesNoOptions
} from "./TemplateHelpers/AmazonTemplateHelper";
import {notify} from "../../../../../../services/notify";
import {getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";

class PriceTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            form_data:{
                name: '',
                change_price : 'default',
                modify_price : {
                    change_type:'',
                    change_by:'',
                    change_value:'',
                },
                allow_sale_price:'no',
                use_default_sale_price: 'yes',
                sale_price_modifier : '',
                modify_sale_price : {
                    change_type:'',
                    change_by:'',
                    change_value:'',
                },
                sale_price:{
                    price : '',
                    attribute: '',
                    start_date: '',
                    end_date : ''
                },
                allow_business_price:'no',
                business_price_modifier : '',
                business_price:{
                    price:'',
                    attribute:''
                },
                modify_business_price : {
                    change_type:'',
                    change_by:'',
                    change_value:'',
                },
                allow_minimum_price : "no",
                minimum_price: {
                    price:'',
                    attribute : ''
                },
                minimum_price_modifier : '',
                modify_minimum_price : {
                    change_type:'',
                    change_by:'',
                    change_value:'',
                },
            },
            errors : {
                name : false,
                modify_price : {
                    change_type:false,
                    change_by :false,
                    change_value:false,
                },
                sale_price:{
                    attribute: false,
                    price: false,
                    start_date: false,
                    end_date : false
                },
                business_price:{
                    attribute: false,
                    price: false,
                },
                minimum_price:{
                    attribute: false,
                    price: false,
                }
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
            this.setState({ form_data: {...form_data, ...templatedata}})
        }
    }

    async saveFormdata(){
        let { form_data, errors, _id } = this.state;
        let { canSubmit, errors: errorsObj} = inventoryTemplateFormValidator( form_data, errors);
        this.setState({ errors : errorsObj});
        if(canSubmit){
            let tempObj={
                title:form_data.name,
                type:'price',
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


    feildsChange(key, tag = false, value) {
        let {form_data} = this.state;
        if (tag) form_data[key][tag] = value;
        else form_data[key] = value;
        this.setState({form_data});
    }


    render() {
        let { form_data, errors } = this.state;
        let { name: nameErrors, modify_price: modifyError, sale_price:salePriceError, business_price:businessPriceError, minimum_price: minimumPriceError  } = errors;
        let { attribute: minimumPriceAttributeError, price: minimumPricevalueError} = minimumPriceError;
        let { attribute: salePriceAttributeError, price: salePricevalueError} = salePriceError;
        let { attribute: businessPriceAttributeError, price: businesspriceError } = businessPriceError;
        let { name, change_price, modify_price, allow_sale_price, sale_price, business_price, allow_business_price, allow_minimum_price, minimum_price, sale_price_modifier, business_price_modifier, minimum_price_modifier, modify_sale_price, modify_business_price, modify_minimum_price } = form_data;
        let { change_by, change_type, change_value } = modify_price;
        let { attribute, start_date, end_date, price } = sale_price;
        let { attribute:businessPriceattribute, price:priceBusinessPrice } = business_price;
        let { change_by: changeByError, change_type: changeTypeError, change_value: changeValueError } = modifyError;
        return (
            <Card title={"Pricing template"}
                  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}
            >
                <Card.Section>
                    {
                        textField("Name", name, this.feildsChange.bind(this,'name', false),  '', '*required', nameErrors)
                    }
                </Card.Section>
                <Card.Section title={"Modify price"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("", changeRequired, this.feildsChange.bind(this, 'change_price', false), change_price, "Please select")
                        }
                        {change_price === 'change' &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Change value type", changeValuetype, this.feildsChange.bind(this, 'modify_price', 'change_type'), change_type, "Please select", changeTypeError)
                            }
                            {
                                select("Change value by", changeValueby, this.feildsChange.bind(this, 'modify_price', 'change_by'), change_by, "Please select", changeByError)
                            }
                            {
                                textField("Change value", change_value, this.feildsChange.bind(this, 'modify_price', 'change_value'), change_value, "", changeValueError, 'number', "", change_by === 'percentage' ? "%" : "")
                            }
                        </Stack>
                        }
                    </Stack>
                </Card.Section>
                <Card.Section title={"Sale price"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("Allow sale price", yesNoOptions, this.feildsChange.bind(this, 'allow_sale_price', false), allow_sale_price)
                        }
                        { allow_sale_price === 'yes' &&
                        choiceList("Sale price modifier type", priceModifieroptions, sale_price_modifier,this.feildsChange.bind(this, 'sale_price_modifier', false), false, false, false)
                        }
                        { allow_sale_price === 'yes' && sale_price_modifier && sale_price_modifier.indexOf("modifier") > -1  &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Change value type", changeValuetype, this.feildsChange.bind(this, 'modify_sale_price', 'change_type'), modify_sale_price.change_type, "Please select")
                            }
                            {
                                select("Change value by", changeValueby, this.feildsChange.bind(this, 'modify_sale_price', 'change_by'), modify_sale_price.change_by, "Please select")
                            }
                            {
                                textField("Change value",  modify_sale_price.change_value, this.feildsChange.bind(this, 'modify_sale_price', 'change_value'), modify_sale_price.change_value, "", false, 'number', "", modify_sale_price.change_by === 'percentage' ? "%" : "")
                            }
                        </Stack>
                        }
                        { allow_sale_price === 'yes' && sale_price_modifier &&  sale_price_modifier.indexOf("map") > -1 &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Map with shopify attribute or choose custom", Shopifyattributes, this.feildsChange.bind(this, 'sale_price', 'attribute'), attribute, 'Please select...', salePriceAttributeError)
                            }
                            { attribute === 'custom' &&
                            textField('Custom price', price, this.feildsChange.bind(this, 'sale_price', 'price'), "", "", salePricevalueError, "number")
                            }
                        </Stack>
                        }
                        {allow_sale_price === 'yes' &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            <Card>
                                <Card.Section title={"Start date"}>
                                    {
                                        textField("", start_date, this.feildsChange.bind(this, 'sale_price', "start_date"), "", "", false, "date")
                                    }
                                </Card.Section>
                            </Card>
                            <Card>
                                <Card.Section title={"End date"}>
                                    {
                                        textField("", end_date, this.feildsChange.bind(this, 'sale_price', "end_date"), "", "", false, "date")
                                    }
                                </Card.Section>
                            </Card>
                        </Stack>
                        }
                    </Stack>
                </Card.Section>
                <Card.Section title={"Business price"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("Allow business price", yesNoOptions, this.feildsChange.bind(this, 'allow_business_price', false), allow_business_price)
                        }
                        { allow_business_price === 'yes' &&
                        choiceList("Business price modifier type", priceModifieroptions, business_price_modifier,this.feildsChange.bind(this, 'business_price_modifier', false), false, false, false)
                        }
                        { allow_business_price === 'yes' && business_price_modifier && business_price_modifier.indexOf("modifier") > -1  &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Change value type", changeValuetype, this.feildsChange.bind(this, 'modify_business_price', 'change_type'), modify_business_price.change_type, "Please select")
                            }
                            {
                                select("Change value by", changeValueby, this.feildsChange.bind(this, 'modify_business_price', 'change_by'), modify_business_price.change_by, "Please select")
                            }
                            {
                                textField("Change value", modify_business_price.change_value, this.feildsChange.bind(this, 'modify_business_price', 'change_value'), modify_business_price.change_value, "", false, 'number', "",  modify_business_price.change_by === 'percentage' ? "%" : "")
                            }
                        </Stack>
                        }
                        { allow_business_price === 'yes' && business_price_modifier &&  business_price_modifier.indexOf("map") > -1 &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Map with shopify attribute or choose custom", Shopifyattributes, this.feildsChange.bind(this, 'business_price', 'attribute'), businessPriceattribute, 'Please select...', businessPriceAttributeError)
                            }
                            { businessPriceattribute === 'custom' &&
                            textField('Custom price', priceBusinessPrice, this.feildsChange.bind(this, 'business_price', 'price'), "", "",  businesspriceError, "number")
                            }
                        </Stack>
                        }
                    </Stack>
                </Card.Section>
                <Card.Section title={"Minimum price"}>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            select("Allow minimum price", yesNoOptions, this.feildsChange.bind(this, 'allow_minimum_price', false), allow_minimum_price)
                        }
                        { allow_minimum_price === 'yes' &&
                        choiceList("Minimum price modifier type", priceModifieroptions, minimum_price_modifier,this.feildsChange.bind(this, 'minimum_price_modifier', false), false, false, false)
                        }
                        { allow_minimum_price === 'yes' && minimum_price_modifier && minimum_price_modifier.indexOf("modifier") > -1  &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Change value type", changeValuetype, this.feildsChange.bind(this, 'modify_minimum_price', 'change_type'), modify_minimum_price.change_type, "Please select")
                            }
                            {
                                select("Change value by", changeValueby, this.feildsChange.bind(this, 'modify_minimum_price', 'change_by'), modify_minimum_price.change_by, "Please select")
                            }
                            {
                                textField("Change value", modify_minimum_price.change_value, this.feildsChange.bind(this, 'modify_minimum_price', 'change_value'), modify_minimum_price.change_value, "", false, 'number', "",  modify_minimum_price.change_by === 'percentage' ? "%" : "")
                            }
                        </Stack>
                        }
                        { allow_minimum_price === 'yes' && minimum_price_modifier &&  minimum_price_modifier.indexOf("map") > -1 &&
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Map with shopify attribute or choose custom", Shopifyattributes, this.feildsChange.bind(this, 'minimum_price', 'attribute'), minimum_price.attribute, 'Please select...', minimumPriceAttributeError)
                            }
                            { minimum_price.attribute === 'custom' &&
                            textField('Custom price', minimum_price.price, this.feildsChange.bind(this, 'minimum_price', 'price'), "", "",  minimumPricevalueError, "number")
                            }
                        </Stack>
                        }
                    </Stack>
                </Card.Section>
            </Card>
        );
    }
}

export default withRouter(PriceTemplate);