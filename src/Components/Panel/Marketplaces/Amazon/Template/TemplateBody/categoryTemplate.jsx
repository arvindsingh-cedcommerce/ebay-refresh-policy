import React, {Component} from 'react';
import {Card, Icon, Stack} from "@shopify/polaris";
import {notify} from "../../../../../../services/notify";
import {checkbox, select, spinner, textField} from "../../../../../../PolarisComponents/InputGroups";
import {getMarketplaceConnectedAccount} from "../../../Ebay/Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import {prepareChoiceforArray} from "../../../../../../services/helperFunction";
import {getallcategories, getAttributesForCategory} from "../../../../../../Apirequest/amazonApirequest/templatesApi";
import {
    attributesSeperator,
    getChosenCategorySearchOption,
    prepareAutocompleteoptions,
    prepareCategoryOptions
} from "./TemplateHelpers/AmazonTemplateHelper";
import {autoComplete, autoCompleteTextField} from "../../../../../../PolarisComponents/AutoCompleteGroups";
import {SearchMajorMonotone} from "@shopify/polaris-icons";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {getAttributesByProductQuery, getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {prepareChoiceoption} from "../../../../../../Subcomponents/Aggrid/gridHelper";
import {withRouter} from "react-router-dom";
import _ from "lodash";
let attribute={amazon_attribute:'',shopify_attribute:'',recommendation:'', custom_text:''};

class CategoryTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id : '',
            sites : [],
            region_options : [],
            categoryoptions : [],
            autocomplete_settings : {
                categoryfilteredoptions : [],
                category_search : '',
                category_selected : '',
            },

            attribute_mappings: {
                amazon_options : [],
                shopify_options: [],
                amazon_attribute_max_occurence : {},
                recommendation_mapping:{},
                required_attribute_present: false,
                optional_attribute_present: false,
            },
            form_data : {
                shop_id : '',
                region_selected : '',
                category_selected : '',
                parent_category_selected : '',
                barcode_exemption: false,
                attributes_mapping: {
                    required_attribute : [],
                    optional_attribute : [],
                },
            },
            errors:{
                name:false
            },
            loaders:{
                category_fetch : false,
                attributes_fetch : false,
            }
        }
    }

    componentDidMount() {
        let { id } = this.props;
        this.setState({ _id: id }, ()=>{
            this.getamazonSiteConnected(true);
            this.getShopifyAttributes();
        });
    }

    async getTemplateData(id){
        let { form_data } = this.state;
        let templatedata = {};
        if( id ){
            let { success, data } = await getTemplatebyId(id);
            if(success) templatedata = { ...data.data };
            this.setState({ form_data: {..._.merge(form_data, templatedata)}}, ()=>{
                this.feildsChange("region_selected", false, true, templatedata.shop_id );
                this.getCategories();
                this.fetchAttributes("template_fetched");
                return true;
            });
        }

    }

    async getamazonSiteConnected(fetchTemplate = false) {
        let { _id } = this.state;
        this.setState({sites: [...await getMarketplaceConnectedAccount('amazon')]}, () => {
            if(fetchTemplate)  if(_id && _id !== '')  this.getTemplateData(_id);
        });
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

    redirect(url){
        this.props.history.push(url);
    }

    async saveFormdata(){
        if(this.formValidator()) {
            let { form_data , _id } = this.state;
            let { name } =  form_data;
            let tempObj={
                title: name,
                type:'category',
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

    feildsChange(key,tag = false, templateFetched = false, value){
        let { form_data, sites, region_options, categoryoptions } = this.state;
        let { shop_id } = form_data;
        if(key === "category_selected"){
            let optionSelected = {...getChosenCategorySearchOption(value, categoryoptions)};
            form_data.category_selected = value;
            form_data.parent_category_selected = optionSelected.parent_id;
        }
        if(key === "region_selected") {
            let selectedSite = sites.filter(site => site.value === value);
            if(selectedSite.length) {
                shop_id = value;
                form_data.shop_id = shop_id;
                value = selectedSite[0]['warehouses'][0]['region'];
                region_options = [...prepareChoiceforArray(selectedSite[0]['warehouses'][0]['marketplace_id'])];
            }
        }
        if(tag) form_data[key][tag]= value;
        else form_data[key] = value;
        this.setState({ form_data, region_options },()=>{
            if(key === 'region_selected') this.getCategories();
            if(key === 'category_selected') this.resetAttributes();
        });
    }

    resetAttributes(){
        let { form_data } = this.state;
        form_data.attributes_mapping =  {
            required_attribute : [],
            optional_attribute : [],
        };
        this.setState({form_data}, () => {
            this.fetchAttributes();
        })
    };

    loaderHandler(key, value){
        let { loaders } = this.state;
        loaders = { ...loaders, [key]: value};
        this.setState({ loaders });
    }

    async getCategories(){
        this.loaderHandler('category_fetch', true);
        let { form_data} = this.state;
        let { shop_id } = form_data;
        let { region_selected } = form_data;
        let { success, data } = await getallcategories({ shop_id,  region: region_selected });
        if(success){
            this.setState({ categoryoptions : [...prepareCategoryOptions(data)]});
        }
        this.loaderHandler('category_fetch', false);
    }

    async getShopifyAttributes(){
        let { success, data } = await getAttributesByProductQuery({marketplace:'shopify',query:'(price>-1)'});
        if(success) this.setShopifyAttribute(data);
    }

    async setShopifyAttribute(data){
        let { attribute_mappings } = this.state;
        attribute_mappings.shopify_options = [ {label:'Select Amazon recommendations',value:'recommendation'}, ...prepareChoiceoption(data, "title", "code")];
        this.setState({ attribute_mappings });
    }

    autocompleteHandler(type, text){
        let { categoryoptions, autocomplete_settings } = this.state;
        switch(type){
            case 'search' :
                autocomplete_settings.category_search = text;
                autocomplete_settings.categoryfilteredoptions = [...prepareAutocompleteoptions( text, categoryoptions)];
                break;
            case 'select':
                let optionSelected = {...getChosenCategorySearchOption(text[0], categoryoptions)};
                autocomplete_settings.category_search = optionSelected.label;
                autocomplete_settings.category_selected = text[0];
                this.feildsChange('category_selected', false, false, text[0]);
                break;
        }
        this.setState({ categoryoptions, autocomplete_settings });
    }

    async fetchAttributes(action = ""){
        this.loaderHandler('attributes_fetch', true);
        let { form_data, attribute_mappings } = this.state;
        let {  shop_id, barcode_exemption, region_selected : region, category_selected: sub_category_id, parent_category_selected: category_id } = form_data;
        let  { success, data } = await getAttributesForCategory({ shop_id, sub_category_id, category_id, region, barcode_exemption });
        if(success)
        {
            let { amazon_options,  required_attribute_mapping, amazon_attribute_max_occurence, recommendation_mapping, required_attribute_present, optional_attribute_present } = attributesSeperator(data);
            if(action !== "template_fetched") {
                form_data.attributes_mapping.required_attribute = [...required_attribute_mapping];
            }
            attribute_mappings.amazon_options = [...amazon_options];
            attribute_mappings.amazon_attribute_max_occurence = {...amazon_attribute_max_occurence};
            attribute_mappings.recommendation_mapping = {...recommendation_mapping};
            attribute_mappings.required_attribute_present = required_attribute_present;
            attribute_mappings.optional_attribute_present = optional_attribute_present;
        }
        this.setState({ form_data, attribute_mappings }, () =>{
            if(action === "template_fetched") this.enableDisableMarketplaceAttributes();
        });
        this.loaderHandler('attributes_fetch', false);
    }

    rendercategorysearchAutocomplete(autocompleteSettings, originalcategoryOptions = [], autocompleteHandler = () => {}){
        let { categoryfilteredoptions, category_selected, category_search } = autocompleteSettings;
        return (
            <div style={{height: '50px'}} key={'autoComplete-amazon'}>
                {
                    autoComplete(
                        categoryfilteredoptions,
                        category_selected,
                        autocompleteHandler.bind(this,'select'),
                        autoCompleteTextField(
                            "Category search",
                            category_search,
                            autocompleteHandler.bind(this,'search'),
                            <Icon source={SearchMajorMonotone} color="inkLighter" />
                        )
                    )
                }
            </div>
        )
    }

    onChangeAttributes(type = "required_attribute", index, attribute, value){
        let { form_data } = this.state;
        if(attribute === "amazon_attribute"){
            form_data.attributes_mapping[type][index]["shopify_attribute"] = "";
            form_data.attributes_mapping[type][index]["recommendation"] = "";
            form_data.attributes_mapping[type][index]["custom_text"] = "";
            this.enableDisableMarketplaceAttributes();
        }
        form_data.attributes_mapping[type][index][attribute] = value;
        this.setState({ form_data }, ()=>{
            if(attribute === 'amazon_attribute') this.enableDisableMarketplaceAttributes();
        });
    }

    enableDisableMarketplaceAttributes(){
        let {form_data, attribute_mappings } = this.state;
        let amazon_options = [...attribute_mappings.amazon_options];
        let maxOccurence = {};
        (form_data.attributes_mapping.optional_attribute).forEach((obj) => {
            if(maxOccurence.hasOwnProperty(obj.amazon_attribute)) maxOccurence[obj.amazon_attribute] += 1;
            else maxOccurence[obj.amazon_attribute] = 1;
        });
        if(amazon_options && Array.isArray(amazon_options) && amazon_options.length){
            amazon_options[amazon_options.length - 1 ]['options'].forEach(( opt, index) => {
                let found = false;
                Object.keys(maxOccurence).map( key => {
                    if(opt.value === key){
                        found = true
                        amazon_options[amazon_options.length - 1 ]['options'][index]["disabled"] = maxOccurence[key] >= attribute_mappings.amazon_attribute_max_occurence[key];
                    }
                    return true;
                });
                if(!found) amazon_options[amazon_options.length - 1 ]['options'][index]["disabled"] = false;
            });
        }

        attribute_mappings.amazon_options = [...amazon_options];
        this.setState( { attribute_mappings });
    }

    handleRemove(index, type){
        let { form_data } = this.state;
        if(type === "optional") {
            form_data.attributes_mapping.optional_attribute = [...form_data.attributes_mapping.optional_attribute.filter((obj, pos) => pos!==index)];
        }
        this.setState({form_data}, ()=> {
            this.enableDisableMarketplaceAttributes();
        });
    }

    renderAttributesRows(type, attributes = [], marketplace_options, shopify_options, max_occurrence, recommedation_mapping, onChange){
        let required = type === "required";
        let structArr = [];
        attributes.forEach((obj, index) => {
            structArr = [...structArr,
                <Card.Section key={`${type}-${index}`} actions={!required?[{ content : "Delete", onAction : this.handleRemove.bind(this, index, type)}]:false}>
                    <Stack vertical={false} distribution={"fillEvenly"}>
                        {
                            select("Amazon attribute", marketplace_options,  onChange.bind(this, required? "required_attribute":"optional_attribute", index, "amazon_attribute"), obj.amazon_attribute, 'Please select', false, false, required)
                        }
                        {
                            select("Shopify attribute", shopify_options,  onChange.bind(this, required? "required_attribute":"optional_attribute", index, "shopify_attribute"), obj.shopify_attribute)
                        }
                        { obj.shopify_attribute === 'recommendation' &&
                        select("Recommendation", recommedation_mapping.hasOwnProperty(obj.amazon_attribute)?recommedation_mapping[obj.amazon_attribute]:[],  onChange.bind(this, required? "required_attribute":"optional_attribute", index, "recommendation"), obj.recommendation)
                        }
                        {obj.recommendation === 'custom' &&
                        textField("Custom value", obj.custom_text, onChange.bind(this, required? "required_attribute":"optional_attribute", index, "custom_text"))
                        }
                    </Stack>
                </Card.Section>
            ]
        });
        return structArr;
    }

    addAttribute(type){
        let { form_data } = this.state;
        form_data.attributes_mapping[type] = [...form_data.attributes_mapping[type], {...attribute}];
        this.setState({ form_data });
    }

    renderAttributes(){
        let { attribute_mappings, form_data } = this.state;
        let { amazon_options, shopify_options, amazon_attribute_max_occurence, recommendation_mapping, required_attribute_present, optional_attribute_present } = attribute_mappings;
        let {  attributes_mapping } = form_data;
        let { required_attribute, optional_attribute } = attributes_mapping;
        return <Stack vertical={true} distribution={"fillEvenly"}>
            <Card title={"Required attributes"}>
                { required_attribute.length > 0 &&
                this.renderAttributesRows("required", required_attribute, amazon_options, shopify_options, amazon_attribute_max_occurence, recommendation_mapping, this.onChangeAttributes.bind(this))
                }
                {
                    !required_attribute.length &&
                    <Card.Section>
                        {
                            bannerPolaris("", required_attribute_present ? "No required attributes mapped yet, Kindly add some attributes by using Add attributes": "No required attributes found", "info")
                        }
                    </Card.Section>
                }
            </Card>
            <Card title={"Optional attributes"} actions={[{content: 'Add attribute', onAction : this.addAttribute.bind(this, "optional_attribute"), disabled: !optional_attribute_present}]}>
                { optional_attribute.length > 0 &&
                this.renderAttributesRows("optional", optional_attribute, amazon_options, shopify_options, amazon_attribute_max_occurence, recommendation_mapping, this.onChangeAttributes.bind(this))
                }
                { !optional_attribute.length &&
                <Card.Section>
                    {
                        bannerPolaris("", optional_attribute_present ? "No optional attributes mapped yet, Kindly add some attributes by using Add attributes" : "No optional attributes found.", "info")
                    }
                </Card.Section>
                }

            </Card>
        </Stack>
    }

    render() {
        let { form_data, errors, sites, region_options, categoryoptions, loaders, autocomplete_settings, attribute_mappings } = this.state;
        let { name, category_selected, barcode_exemption, shop_id } =  form_data;
        let { category_fetch } = loaders;
        let { name: nameError } = errors;
        return (
            <Card title={"Category template"} key={'categoryTemplate'}
                  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}
            >
                <Card.Section>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            textField("Template name", name, this.feildsChange.bind(this,'name', false, false),"", "", nameError )
                        }
                        <Stack vertical={false} distribution={"fillEvenly"}>
                            {
                                select("Select region",sites, this.feildsChange.bind(this, 'region_selected', false, false), shop_id)
                            }
                        </Stack>
                    </Stack>
                </Card.Section>
                { shop_id !== '' && categoryoptions.length > 0 &&
                <Card.Section title={'Category'}>
                    { category_fetch &&
                    <Stack vertical={true} alignment={"center"}>
                        {
                            spinner("small", "teal", "Fetching categories...")
                        }
                    </Stack>
                    }
                    { !category_fetch &&
                    <Stack vertical={true} distribution={"fillEvenly"}>
                        {
                            this.rendercategorysearchAutocomplete(autocomplete_settings, categoryoptions, this.autocompleteHandler.bind(this))
                        }
                        {
                            select("Select Category", categoryoptions, this.feildsChange.bind(this, 'category_selected', false, false), category_selected)
                        }
                        {
                            checkbox("Barcode exemption", barcode_exemption, this.feildsChange.bind(this, 'barcode_exemption', false, false))
                        }
                    </Stack>
                    }
                </Card.Section>
                }
                { attribute_mappings.amazon_options.length > 0 &&
                <Card.Section title={"Attributes"}>
                    <Stack vertical={ true} spacing={"loose"}>
                        {
                            this.renderAttributes()
                        }
                    </Stack>
                </Card.Section>
                }
            </Card>
        );
    }
}

export default withRouter(CategoryTemplate);