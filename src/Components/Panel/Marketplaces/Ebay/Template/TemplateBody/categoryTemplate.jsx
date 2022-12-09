import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Card, FormLayout, Icon, Spinner, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {isUndefined} from "util";
import {button, checkbox, choiceList, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {
    CategoryPath,
    formValidator,
    getMarketplaceConnectedAccount,
    getoptionsFromRecommendation,
    rendercustom,
    renderOptional,
    renderOptionalAttributeErrors,
    renderReqAttributeErrors,
    renderRequired
} from "./TemplateHelpers/categorytemplateHelper";
import {SearchMajorMonotone} from "@shopify/polaris-icons";
import {autoComplete, autoCompleteTextField} from "../../../../../../PolarisComponents/AutoCompleteGroups";
import {
    getAttributesByProductQuery,
    getattributesCategorywise,
    getCategoriesApi, getcategoryFeatures,
    getCategoryPredictions, getConfigurablesAttributes, getEbayUserDetails, getMetafieldsOptions,
    getParentCategories, getTemplatebyId
} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {prepareChoiceoption} from "../../../../../../Subcomponents/Aggrid/gridHelper";
import {prepareChoiceforArray} from "../../../../../../services/helperFunction";
import {getSkeleton} from "../../../../../../PolarisComponents/skeletonGroups";
import {notify} from "../../../../../../services/notify";
import _ from "lodash";

let attribute={ebayAttrib:'',shopifyAttrib:'',recommendation:'',defaultText:''};
let custom_attribute={customAttrib:'',shopifyAttrib:'',defaultText:''};

class CategoryTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            overlayloader:false,
            _id:'',
            sites:[],

            form_data: {
                level : "6",
                name: '',
                site_specific: '',
                shop_id: '',
                storefront_category:{
                    options:[],
                    selected:'',
                },
                menachemCategory:{
                    selected_id : '',
                },
                storefront_category_exists:false,
                bestofferenabled:false,
                variation_specific:false,
                variation_image_settings:{
                    options:[],
                    selected:[],
                },
                primaryCategory:{
                    category_mapping: {},
                    category_mapping_name: {},
                    category_mapping_options: {},
                    show_Attribute_mapping: false,
                    attribute_mapping: {
                        ebayAttrib: [],
                        shopifyAttrib: [],
                        customShopifyAttrib: [],
                        used_ebay_attrib:[],
                        ebayAttribInfo: {},
                        required_map: [],
                        optional_map: [],
                        custom_map:[],
                    },
                    attributes_minmax:{},
                    required_attribute_count:0,
                    optional_attribute_count:0,
                    category_feature:'',
                },
                enable_advance_options:false,
                bundle_listing : false,
                secondaryCategory:{
                    category_mapping: {},
                    category_mapping_name: {},
                    category_mapping_options: {},

                    show_Attribute_mapping: false,
                    attribute_mapping: {
                        ebayAttrib: [],
                        shopifyAttrib: [],
                        used_ebay_attrib:[],
                        ebayAttribInfo: {},
                        required_map: [],
                        optional_map: []
                    },
                    attributes_minmax:{},
                    required_attribute_count:0,
                    optional_attribute_count:0,
                },
                settings:[],
            },
            primaryCategory: {
                category_search: {search: '', selected: []},
            },
            secondaryCategory: {
                category_search: {search: '', selected: []},
            },
            errors:{
                name:false,
                primaryCategory:{
                    leafCategoryMissing:false,
                    noCategorySelected:false,
                    attributes:{
                        missingerrors:false
                    },
                    optional_attributes:{
                        missingerrors:false
                    },
                    category_feature:false
                },
                secondaryCategory:{
                    leafCategoryMissing:false,
                    noCategorySelected:false,
                    attributes:{
                        missingerrors:false
                    }
                }
            },
            optionsAutocomplete:[],
            primary_category_feature_options:[],
            barcode_options:[],
            site_id:'',
            user_id:'',
            menachem_options :[],
            attributePrimaryspinner:false,
            attributeSecondaryspinner:false
        }

    }

     componentDidMount() {
        let { id } = this.props;
         this.setState({ _id: id }, async ()=>{
             if(id) 
             {
                 await this.getTemplateData(id);
                 this.getAttribute("primaryCategory");
                 this.getAttribute("secondaryCategory");
             }else{
                 this.prepareCategoryandAttributes();
             }
             this.geteBaySiteConnected();
             this.getShopifyConfigurableAttributes();
             // this.getStorefrontcategory();
         });
    }

    prepareCategoryandAttributes(){
        this.getCategory('primaryCategory');
        this.getShopifyAttributes('primaryCategory');
        this.getCategory('secondaryCategory');
        this.getShopifyAttributes('secondaryCategory');
    }

    async geteBaySiteConnected(){
        this.setState({ sites : [...await getMarketplaceConnectedAccount('ebay')]} );
    }

    async getTemplateData(id){
        let { form_data } = this.state;
        let templatedata = {};
        if( id ){
            let { success, data } = await getTemplatebyId(id);
            if(success) templatedata = { ...data.data };
            this.setState({ form_data: {..._.merge(form_data, templatedata)}}, ()=>{
                return true;
            })
        }
    }

    async getShopifyConfigurableAttributes(){
        let { success, data } = await getConfigurablesAttributes();
        if(success) this.setVariantAttributes(data);
    }
    setVariantAttributes(data){
        let { form_data } = this.state;
        form_data.variation_image_settings.options=[...prepareChoiceforArray(data)];
        this.setState({ form_data });
    }

    async getShopifyAttributes(categoryType){
        let { success, data } = await getAttributesByProductQuery({marketplace:'shopify',query:'(price>-1)'});
        if(success) this.setShopifyAttribute(data,categoryType);
    }

    async setShopifyAttribute(data,categoryType){
        let { form_data } = this.state;
        let temparr=[];
        let customShopifyAttrib = [];
        let Metarray = [];
        let MetaInfo = [];
        // let MetaInfo = await getMetafieldsOptions();
        if(MetaInfo.hasOwnProperty('success') && MetaInfo.success) Metarray = [...prepareChoiceforArray( MetaInfo.data)];
        customShopifyAttrib.push({label: 'Set a custom', value: 'custom'});
        customShopifyAttrib.push({label: 'Tags', value: 'tags'});
        temparr.push({label:'Select eBay recommendations',value:'recommendation'});
        temparr = [ ...temparr, ...prepareChoiceoption(data, "title", "code")];
        customShopifyAttrib = [ ...customShopifyAttrib, ...prepareChoiceoption(data, "title", "code")]
        temparr = [...temparr, ...Metarray];
        customShopifyAttrib = [...customShopifyAttrib, ...Metarray];
        form_data[categoryType].attribute_mapping.shopifyAttrib=temparr;
        form_data[categoryType].attribute_mapping.customShopifyAttrib=customShopifyAttrib;
        this.setState({ form_data });
    }

    async getStorefrontcategory(){
        let { form_data } = this.state;
        let { site_specific, shop_id } = form_data;
        let { success, data } = await getEbayUserDetails({ site_id: site_specific, shop_id});
        if(success)  this.extractStoreFrontcategory(data);
        else {
            form_data.storefront_category_exists=false;
            this.setState({ form_data });
        }
    }

    extractStoreFrontcategory(data){
        let { form_data } = this.state;
        let temparr=[];
        if(!isUndefined(data.Store) && !isUndefined(data.Store.CustomCategories) && !isUndefined(data.Store.CustomCategories.CustomCategory)){
            data.Store.CustomCategories.CustomCategory.forEach((category)=>{
                let childCategoryList = [];
                if(category.hasOwnProperty('ChildCategory')){
                    childCategoryList.push(
                        {
                            label: category.Name+'(Root)', value: (category.CategoryID).toString(),
                        }
                    );
                    childCategoryList = [...childCategoryList, ...prepareChoiceoption(category.ChildCategory, "Name", "CategoryID")]
                }
                if(childCategoryList.length > 0) temparr.push({ title: category.Name, options: childCategoryList.slice(0)});
                else temparr.push({ label: category.Name, value: (category.CategoryID).toString() });
            });
            form_data.storefront_category.options= [...temparr];
            form_data.storefront_category_exists=true;
            this.setState({ form_data });
        }
    }

    async resetCategory(categoryType){
        let { form_data } = this.state;
        let { category_mapping_options }= form_data[categoryType];
        Object.keys( category_mapping_options).map(key=>{
            if(parseInt(key)>1) delete category_mapping_options[key];
            return true;
        });
        form_data[categoryType].category_mapping_options= { ...category_mapping_options };
        form_data[categoryType].category_mapping_name={};
        form_data[categoryType].category_mapping={};
        form_data.primaryCategory.category_feature='';
        let primary_category_feature_options=[];
        let barcode_options=[];
        await this.resetAttributeSetting(categoryType);
        this.setState({ form_data, primary_category_feature_options, barcode_options},() => {
            return true;
        });
    }

    resetAttributeSetting(categoryType){
        let { form_data } = this.state;
        let attribute_mapping={
            ebayAttrib: [],
            shopifyAttrib: [ ...form_data[categoryType].attribute_mapping.shopifyAttrib ],
            customShopifyAttrib:[...form_data[categoryType].attribute_mapping.customShopifyAttrib ],
            used_ebay_attrib:[],
            ebayAttribInfo: {},
            required_map: [],
            optional_map: [],
            custom_map:[]
        };
        form_data[categoryType].attributes_minmax={};
        form_data[categoryType].required_attribute_count=0;
        form_data[categoryType].optional_attribute_count=0;
        form_data[categoryType].show_Attribute_mapping=false;
        form_data[categoryType].attribute_mapping = { ...attribute_mapping };
        this.setState({ form_data }, ()=>{
            return true;
        });
    }

    async  updateAutoCompleteSelection(categoryType,key){
        await this.resetCategory(categoryType);
        let stateObj = Object.assign({}, this.state);
        let { optionsAutocomplete } = stateObj;
        let getKey='';
        key.forEach((value)=>{
            let getOptions = optionsAutocomplete.filter((matchedoption)=> matchedoption.value === value);
            if(getOptions.length) {
                let {label: optionSelectedlabel, value: optionSelectedValue} = getOptions[0];
                stateObj[categoryType].category_search.search = optionSelectedlabel;
                getKey = optionSelectedValue;
            }
        });
        this.setState(stateObj, async ()=>{
            if(getKey!=='') {
                let {success, data} = await getParentCategories({category_id :getKey, site_id : stateObj.form_data.site_specific, shop_id: stateObj.form_data.shop_id});
                if(success) this.ModifyandSetCategory(data,categoryType);
            }
        })
    };

    ModifyandSetCategory(data,categoryType){
        let { form_data } = this.state;
        let category_map={};
        let category_map_name={};
        let { category_mapping_options: category_map_list }= form_data[categoryType];
        if(data.length>0){
            data.forEach((CategoryInfo,index)=>{
                let { category } = CategoryInfo;
                category_map[index+1]= category.marketplace_id;
                category_map_name[index+1]=category.name;
                if(CategoryInfo.same_level_categories.length>0) {
                    category_map_list[index + 1] = [ ...prepareChoiceoption(CategoryInfo.same_level_categories, "name", "marketplace_id" )];
                }
            });
            form_data[categoryType].category_mapping={...category_map};
            form_data[categoryType].category_mapping_name={...category_map_name};
            form_data[categoryType].category_mapping_options={...category_map_list};
            this.setState({ form_data });
            this.getCategory(categoryType);
        }
    }

    async getAttribute(categoryType){
        let { form_data, attributePrimaryspinner,  attributeSecondaryspinner } =  this.state;
        let { site_specific, shop_id } = form_data;
        let { category_mapping } = form_data[categoryType];
        let category =Object.values(category_mapping);
        let last_category_id=category[category.length -1];
        if(categoryType === 'primaryCategory') attributePrimaryspinner = true
        else attributeSecondaryspinner=true;
        this.setState({ attributePrimaryspinner, attributeSecondaryspinner });
        if(last_category_id){
        let { success: successattribCategorywise, data:attributeCategorywise } = await getattributesCategorywise({category_id : last_category_id, site_id : site_specific, shop_id});
        if(successattribCategorywise) await this.ModifyAttributes(attributeCategorywise, categoryType);
        }

        if(categoryType==='primaryCategory') {
            let { success: successCategoryFeatures, data: dataCategoryFeatures } = await getcategoryFeatures({category_id :last_category_id, site_id: site_specific, shop_id});
                if (successCategoryFeatures && dataCategoryFeatures) this.extractBarcodeCategoryOptions(dataCategoryFeatures)
        }
        if(categoryType === 'primaryCategory') attributePrimaryspinner = false;
        else attributeSecondaryspinner=false;
        this.setState({ attributePrimaryspinner, attributeSecondaryspinner });
    }

    extractBarcodeCategoryOptions(dataRecieved){
        let barcode_options=[];
        let categoryFeature_options=[];
        if(!isUndefined(dataRecieved[0]) && dataRecieved.length>0){
            Object.keys(dataRecieved[0]).map(key => {
                switch(key){
                    case 'BestOfferEnabled':
                        if(dataRecieved[0][key]) {
                            barcode_options.push('BestOfferEnabled');
                        }
                        break;
                    case 'VariationsEnabled':
                        if(dataRecieved[0][key]) {
                            barcode_options.push('VariationsEnabled');
                        }
                        break;
                    case 'ISBNEnabled': barcode_options.push('ISBNEnabled');
                        break;
                    case 'UPCEnabled': barcode_options.push('UPCEnabled');
                        break;
                    case 'EANEnabled': barcode_options.push('EANEnabled');
                        break;
                    case 'ConditionEnabled':
                        if(dataRecieved[0][key]==='Required' || dataRecieved[0][key]==='Enabled'){
                            if(!isUndefined(dataRecieved[0]['ConditionValues']) && !isUndefined(dataRecieved[0]['ConditionValues']['Condition']))
                                categoryFeature_options =  [ ...prepareChoiceoption(dataRecieved[0]['ConditionValues']['Condition'], "DisplayName", "ID" )];
                        }
                        break;
                    default: break;
                }
                return true;
            })
        }
        this.setState({ barcode_options, primary_category_feature_options: [...categoryFeature_options]  });
    }

    async ModifyAttributes(data,categoryType) {
        let { form_data } = this.state;
        let EbayAttribInfo={};
        let Ebayoptions={required:[],optional:[]} ;
        let requiredMap=[];
        let tempObjMinMaxvalues={};
        if(Object.keys(data).length && !isUndefined(data)) {
            data.forEach((value) => {
                let { required, name, code, variation: enable_for_variation, values : ebayRecommendationValues } = value;
                // let { aspectConstraint  , aspectValues : ebayRecommendationValues } = value;
                // let { aspectRequired, itemToAspectCardinality } = aspectConstraint;
                // let minMaxValues = 2;
                tempObjMinMaxvalues[code] = 2;
                if (required) {
                    Ebayoptions.required.push(
                        {label: name, value: code, disabled: true, enableforvariation : enable_for_variation ? "enabled" : "disabled"}
                    );
                    let requiredAttrib = { ...attribute };
                    requiredAttrib.ebayAttrib = code;
                    //Set default values
                    if(!isUndefined(form_data[categoryType].attribute_mapping.shopifyAttrib) && form_data[categoryType].attribute_mapping.shopifyAttrib.length > 0){
                        switch(code){
                            case 'Brand':
                                requiredAttrib.shopifyAttrib = 'vendor';
                                break;
                            case 'MPN':
                                requiredAttrib.shopifyAttrib = 'sku';
                                break;
                            case 'Size':
                                requiredAttrib.shopifyAttrib = 'size';
                                break;
                            case 'Color':
                                requiredAttrib.shopifyAttrib = 'color';
                                break;
                            default: break;
                        }
                    }
                    requiredMap.push( requiredAttrib );
                } else Ebayoptions.optional.push( {label: name, value: code, disabled: false, enableforvariation : enable_for_variation ? "enabled" : "disabled"} )

                let recommendedOptions = [];
                recommendedOptions.push({
                    label: 'Set a custom', value: 'custom'
                });
                // if (ebayRecommendationValues) recommendedOptions = [ ...recommendedOptions, ...prepareChoiceoption(ebayRecommendationValues, "localizedValue", "localizedValue")]
                if (ebayRecommendationValues) recommendedOptions = [ ...recommendedOptions, ...getoptionsFromRecommendation(ebayRecommendationValues)];

                EbayAttribInfo[code] = {
                    recommendedoptions: [ ...recommendedOptions ],
                    required: required
                }
            });
        }
        form_data[categoryType].attributes_minmax= { ...tempObjMinMaxvalues };
        form_data[categoryType].attribute_mapping.ebayAttribInfo=EbayAttribInfo;
        let count_required=0;
        let count_optional=0;
        Ebayoptions.required.forEach((requiredCount)=>{
            count_required+=tempObjMinMaxvalues[requiredCount['label']];
        });
        Ebayoptions.optional.forEach((optionalCount)=>{
            count_optional+=tempObjMinMaxvalues[optionalCount['label']];
        });
        form_data[categoryType].required_attribute_count=count_required;
        form_data[categoryType].optional_attribute_count=count_optional;
        let finaltempoptions=[];
        Object.keys(Ebayoptions).map(key => {
            if(key==='required' && Ebayoptions[key].length!==0) finaltempoptions.push( {title:'Required',options:Ebayoptions[key]} );
            if(key==='optional' && Ebayoptions[key].length!==0) finaltempoptions.push( {title:'Optional',options:Ebayoptions[key]} );
            return true;
        });
        form_data[categoryType].attribute_mapping.required_map=requiredMap;
        form_data[categoryType].attribute_mapping.ebayAttrib=finaltempoptions;
        form_data[categoryType].show_Attribute_mapping=true;
        
        this.setState({ form_data }, () => {
            return true;
        });
    }

    async getCategory(categoryType){
        this.setState({overlayloader:true});
        let { form_data } = this.state;
        let {  site_specific: site_id, shop_id } = form_data;
        let { category_mapping_options, category_mapping } = form_data[categoryType];
        let requestObj = {};
        if(Object.keys(category_mapping_options).length===0) {
            requestObj['level'] = Object.keys(category_mapping_options).length + 1;
        }
        else{
            requestObj['parent_category_id'] = category_mapping[Object.keys(this.state.form_data[categoryType].category_mapping_name).length];
        }
        let { success, data } = await getCategoriesApi( { ...requestObj , site_id, shop_id } );

        if(success) {
            if(data && data.length > 0) this.setCategoryOptions(data,categoryType);
            if(requestObj.hasOwnProperty("parent_category_id")){
                if(data && data.length === 0)  this.getAttribute(categoryType);
            }
        }
        this.setState({overlayloader:false});
    }

    setCategoryOptions(data,categoryType){
        let {  form_data } = this.state;
        let  { category_mapping_options } = form_data[categoryType];
        let Currentoptionspresent=Object.keys(category_mapping_options).length+1;
        category_mapping_options[Currentoptionspresent]=[ ...prepareChoiceoption(data, "name", "marketplace_id" )];
        form_data[categoryType].category_mapping_options= {...category_mapping_options};
        this.setState({ form_data });
    }

    async handleCategorySearch(categoryType,search){
        let stateObj = Object.assign({} ,this.state);
        let { form_data } = stateObj;
        let {  site_specific: site_id, shop_id } = form_data;
        let autoCompleteOptions = [];
        if(search.length>3 && search.length!==0) {
            let {success, data} = await getCategoryPredictions({ category_name : search,  site_id, shop_id });
            if (success) {
                autoCompleteOptions = [ ...prepareChoiceoption(data, "name", "marketplace_id" )]
            }
        }
        stateObj[categoryType].category_search.search=search;
        stateObj.optionsAutocomplete = [...autoCompleteOptions];
        this.setState(stateObj );
    }

    renderAutoComplete(categoryType){
        let { optionsAutocomplete } = this.state;
        let { category_search } = this.state[categoryType];
        let autoCompleteOptions = category_search.search.length>3?optionsAutocomplete:[];
        return (
            <div style={{height: '50px'}} key={'autoComplete-'+categoryType}>
                {
                    autoComplete(
                        autoCompleteOptions,
                        category_search.selected,
                        this.updateAutoCompleteSelection.bind(this,categoryType),
                        autoCompleteTextField(
                            "Category search",
                            category_search.search,
                            this.handleCategorySearch.bind(this,categoryType),
                            <Icon source={SearchMajorMonotone} color="inkLighter" />
                        )
                    )
                }
            </div>
        )
    }

    feildsChange(tag,value){
        let { form_data, sites } = this.state;
        if(tag === "site_specific") {
            let selectedSite = sites.filter(site => site.value === value);
            if(selectedSite.length) {
                form_data['shop_id'] = value;
                value = selectedSite[0]['warehouses'][0]['site_id'];
            }
        }
        form_data[tag]= value;
        this.setState({ form_data }, () => { if(tag === "site_specific") this.prepareCategoryandAttributes()});
    }

    renderCategory(categoryType){
        let { form_data } = this.state;
        let temparr=[];
        Object.keys(form_data[categoryType].category_mapping_options).map(key=>{
            temparr.push(
                <React.Fragment key={`Category Level ${parseInt(key)}`}>
                    {
                        select(`Category Level ${parseInt(key)}`,
                            form_data[categoryType].category_mapping_options[key],
                            this.CategoryfeildsChange.bind(this, key, categoryType),
                            form_data[categoryType].category_mapping[key],
                            "Please select...")
                    }
                </React.Fragment>
            );
            return true;
        });
        return temparr;
    }

    CategoryfeildsChange(key,categoryType,value){
        let { form_data } = this.state;
        let tempObj= { ...form_data[categoryType].category_mapping };
        let tempObjCategoryNaming= { ...form_data[categoryType].category_mapping_name };
        let categoryOptions= {...form_data[categoryType].category_mapping_options };
        tempObj[key]=value;
        form_data[categoryType].category_mapping_options[key].forEach((objcategory ) => {
            if(objcategory['value']===value) tempObjCategoryNaming[key]=objcategory['label'];
        });
        Object.keys(form_data[categoryType].category_mapping_options).map(level => {
            if(key<level)
            {
                delete tempObjCategoryNaming[level];
                delete categoryOptions[level];
                delete tempObj[level];
                this.resetAttributeSetting(categoryType);
            }
            return true;
        });
        form_data[categoryType].category_mapping_name = tempObjCategoryNaming;
        form_data[categoryType].category_mapping_options = categoryOptions;
        form_data[categoryType].category_mapping = tempObj;
        this.setState({ form_data });
        this.getCategory(categoryType);
    }

    enableBestOffer(value){
        let { form_data } = this.state;
        form_data.bestofferenabled = value;
        this.setState({ form_data });
    }

    renderBarcodeOptions(){
        let  temparr =[];
        let { barcode_options, form_data } = this.state;
        temparr.push(
            <React.Fragment key={"Barcode options"}>
                <Stack key={'BestOfferEnabled'}>
                    { barcode_options.indexOf('BestOfferEnabled') > -1 &&
                        bannerPolaris("", <p>This category has <b>Best Offer Enabled</b>, To enable/disable Best Offer on this Category simply uncheck the box shown below</p>, "info")
                    }
                </Stack>
                <Stack vertical={false} key={'Barcode-options'}>
                    {
                        checkbox("Best offer enabled", form_data.bestofferenabled, this.enableBestOffer.bind(this), false, "", barcode_options.indexOf('BestOfferEnabled') === -1)
                    }
                    {
                        checkbox("Variations enabled", barcode_options.indexOf('VariationsEnabled')>-1, ()=>{}, false, "", true)
                    }
                    {
                        checkbox("ISBN enabled", barcode_options.indexOf('ISBNEnabled')>-1, ()=>{}, false, "", true)
                    }
                    {
                        checkbox("UPC enabled", barcode_options.indexOf('UPCEnabled')>-1, ()=>{}, false, "", true)
                    }
                    {
                        checkbox("EAN enabled", barcode_options.indexOf('EANEnabled')>-1, ()=>{}, false, "", true)
                    }
                </Stack>
            </React.Fragment>
        );
        return temparr;
    }

    async handleMappingChange(key,type,index,categoryType,value){
        let { form_data } = this.state;
        switch(type){
            case 'optional':
                form_data[categoryType].attribute_mapping.optional_map[index][key]=value;
                if(key==='ebayAttrib') {
                   await this.toggleOptionEbayAttribute(categoryType)
                }
                break;
            case 'required':
                form_data[categoryType].attribute_mapping.required_map[index][key]=value;
                break;
            case 'custom':
                form_data[categoryType].attribute_mapping.custom_map[index][key]=value;
                break;
            default: break;
        }
        this.setState({ form_data });
    }

    async toggleOptionEbayAttribute(categoryType){
        let { form_data } = this.state;
        let temparr=[];
        form_data[categoryType].attribute_mapping.optional_map.forEach((attrib)=>{
            temparr.push(attrib.ebayAttrib);
        });
        form_data[categoryType].attribute_mapping.used_ebay_attrib = [...temparr];
        form_data[categoryType].attribute_mapping.ebayAttrib.forEach((attriboptional,position)=>{
            if(attriboptional.title==='Optional'){
                attriboptional.options.forEach((optionOptional,postionoption)=>{
                    let count=0;
                    temparr.forEach((keyFound,keyPlace)=>{
                        if(keyFound===optionOptional.label){
                            count++;
                        }
                    });
                        form_data[categoryType].attribute_mapping.ebayAttrib[position].options[postionoption].disabled = count>= form_data[categoryType].attributes_minmax[optionOptional.label];
                });
            }
        });
        this.setState({ form_data }, ()=>{
            return true;
        });
    }

    handleAdd(type,categoryType){
        let { form_data } = this.state;
        switch(type){
            case 'optional':
                form_data[categoryType].attribute_mapping.optional_map=[...form_data[categoryType].attribute_mapping.optional_map, {...attribute}];
                break;
            case 'required':
                break;
            case 'custom':
                form_data[categoryType].attribute_mapping.custom_map=[...form_data[categoryType].attribute_mapping.custom_map, {...custom_attribute}];
                break;
            default: break;
        }
        this.setState({ form_data });
    }

    async handleDelete(index,type,categoryType){
        let { form_data } = this.state;
        switch(type){
            case 'optional':
                form_data[categoryType].attribute_mapping.optional_map=[...form_data[categoryType].attribute_mapping.optional_map.filter((obj, pos) => pos !== index)] ;
                break;
            case 'required':
                break;
            case 'custom':
                form_data[categoryType].attribute_mapping.custom_map= [...form_data[categoryType].attribute_mapping.custom_map.filter((obj, pos) => pos !== index )];
                break;
            default: break;
        }
        this.setState({form_data});
        await this.toggleOptionEbayAttribute(categoryType);
    }

    DropdownCategory(data){
        let { form_data } = this.state;
        form_data.primaryCategory.category_feature=data;
        this.setState({ form_data });
    }

    handletwoLevelDropdown(field,subhead,value){
        let { form_data } = this.state;
        form_data[field][subhead]=value;
        this.setState({ form_data });
    }

    redirect(url){
        this.props.history.push(url);
    }

    async saveFormdata(){
        let { form_data, errors, primary_category_feature_options } = this.state;
        let { errors:errorsRecieved , errorFree } = await formValidator( form_data, errors, primary_category_feature_options);
        if(errorFree){
            let { _id } = this.state;
            form_data.variation_specific=this.state.barcode_options.indexOf('VariationsEnabled')>-1;
            let tempObj={
                title: form_data.name,
                type:'category',
                data: form_data,
            };
            if(_id !== '') tempObj['_id'] = _id;
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse) this.redirect('/panel/ebay/templates');
        }else {
            this.setState({ errors : {...errorsRecieved} });
            notify.error('Kindly fill all the required fields');
        }
    }
    async refreshCategory(){
        let { form_data } = this.state;
        let { site_specific, level, shop_id } = form_data;
        if( site_specific !== '') {
            let { success , message } = await getCategoriesApi({ site_id : site_specific, level, refresh_category : true, shop_id });
            if(success) notify.success(message);
            else notify.error(message);
        }
    }

    render() {

        let { form_data, errors, attributePrimaryspinner, barcode_options, primary_category_feature_options, site_id, sites } =this.state;
        let { levels } = form_data;
        let { infoBanner, showSecondaryCategory } = this.props;
        return (
            <Card title={"Category template"} primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}} >
                <Card.Section>
                    {
                        bannerPolaris("", <p><b>Category template </b>is used for assigning a category to your product along with the <b>required and optional attributes</b> which you commonly use for listing on eBay.</p>, "info")
                    }
                </Card.Section>
                { infoBanner  &&
                <Card.Section>
                    {
                        bannerPolaris("", <p>Category template created below will be set as <b>default category template</b> for products but you can change your default settings from <b>Configuration</b> section of the app.</p> ,"info")
                    }
                </Card.Section>
                }
                <Card.Section >
                    <Stack vertical={false} distribution={"fillEvenly"}>
                    {
                        textField("Template name", form_data.name, this.feildsChange.bind(this,'name'), "", "*required", errors.name)
                    }
                        {
                            select("eBay site", sites, this.feildsChange.bind(this,"site_specific"), form_data.shop_id, "Please choose a site", false, false, false, "*This template will be specific to selected site only." )
                        }
                    </Stack>
                </Card.Section>
                {/*<Card.Section title={"Refresh category"}>*/}
                {/*    <Stack vertical={false} distribution={"fillEvenly"}>*/}
                {/*    {*/}
                {/*        select("Level",  levels, this.feildsChange.bind(this, "level"), form_data.level, "Please select", false, false, true)*/}
                {/*    }*/}
                {/*    <div style={{ marginTop : "2.3rem"}}>*/}
                {/*    {*/}
                {/*        button("Refresh", this.refreshCategory.bind(this))*/}
                {/*    }*/}
                {/*    </div>*/}
                {/*    </Stack>*/}
                {/*</Card.Section>*/}
                {form_data.site_specific !== "" &&
                    <Card.Section title={"Primary Category Mapping"}>
                        <Stack vertical={true} spacing={"loose"}>
                            <Stack.Item>
                                {
                                    errors.primaryCategory.noCategorySelected &&
                                    bannerPolaris("Error", <p>
                                        No category is selected, Categories from root till leaf are required
                                    </p>, "critical")
                                }
                                {
                                    errors.primaryCategory.leafCategoryMissing &&
                                    bannerPolaris("Error", <p>
                                        Leaf categories are missing, Categories from root till leaf are required
                                    </p>, "critical")
                                }
                                {
                                    bannerPolaris("Category path", <p>
                                        {
                                            CategoryPath('primaryCategory', form_data)
                                        }
                                    </p>, "info")
                                }
                            </Stack.Item>
                            <Stack.Item>
                                {
                                    this.renderAutoComplete('primaryCategory')
                                }
                            </Stack.Item>
                            <Stack.Item>
                                <Stack vertical={false} distribution={"fillEvenly"}>
                                    {
                                        this.renderCategory('primaryCategory')
                                    }
                                </Stack>
                            </Stack.Item>
                            {attributePrimaryspinner &&
                            <Stack.Item>
                                <Stack vertical={true} alignment={"center"} distribution={"center"}>
                                    <p className="font-weight-bold">Fetching attributes ...<Spinner size="small"
                                                                                                    color="teal"/></p>
                                </Stack>
                            </Stack.Item>
                            }
                        </Stack>
                    </Card.Section>
                }
                {!attributePrimaryspinner && barcode_options.length > 0 &&
                <Card.Section title={'Additional Information'}>
                    {
                        this.renderBarcodeOptions()
                    }
                </Card.Section>
                }
                { form_data.primaryCategory.show_Attribute_mapping &&
                <Card.Section title={"Attribute Mapping"}>
                    {(attributePrimaryspinner)? getSkeleton("categoryAttribute"):
                        <FormLayout>
                            { form_data.primaryCategory.attribute_mapping.required_map.length > 0 &&
                            <Card title={'Required Attribute'}>
                                <Card.Section>
                                    {
                                        errors.primaryCategory.attributes.missingerrors && renderReqAttributeErrors('primaryCategory', errors)
                                    }
                                    {
                                        renderRequired('primaryCategory', form_data, this.handleMappingChange.bind(this))
                                    }
                                </Card.Section>
                            </Card>
                            }
                            {form_data.primaryCategory.attribute_mapping.ebayAttrib.length > 0 &&
                            <Card title={'Optional Attribute'}
                                  actions={[{
                                      content: 'Add attribute',
                                      onAction: this.handleAdd.bind(this, 'optional', 'primaryCategory'),
                                      disabled: form_data.primaryCategory.attribute_mapping.used_ebay_attrib.length > 0 && form_data.primaryCategory.attribute_mapping.used_ebay_attrib.length >= form_data.primaryCategory.optional_attribute_count
                                  }]}>
                                <Card.Section>
                                    {
                                        errors.primaryCategory.optional_attributes.missingerrors && renderOptionalAttributeErrors('primaryCategory', errors)
                                    }
                                    {
                                        renderOptional('primaryCategory', form_data, this.handleDelete.bind(this), this.handleMappingChange.bind(this) )
                                    }
                                    {form_data.primaryCategory.attribute_mapping.optional_map.length === 0 &&
                                        bannerPolaris("", form_data.primaryCategory.optional_attribute_count>0?"Optional attributes can be added by clicking Add attribute above":"No optional attributes found", "info")
                                    }
                                </Card.Section>
                            </Card>
                            }
                            <Card title={'Custom Attribute'}
                                  actions={[{
                                      content: 'Add attribute',
                                      onAction: this.handleAdd.bind(this, 'custom', 'primaryCategory'),
                                  }]}>
                                <Card.Section>
                                    {
                                        rendercustom('primaryCategory', form_data, this.handleDelete.bind(this), this.handleMappingChange.bind(this))
                                    }
                                    {form_data.primaryCategory.attribute_mapping.custom_map.length === 0 &&
                                        bannerPolaris("", form_data.primaryCategory.optional_attribute_count>0?"Custom attributes can be added by clicking Add attribute above":"No optional attributes found", "info")
                                    }
                                </Card.Section>
                                <Card.Section>
                                    {
                                        checkbox("Enable bundle listing", form_data.bundle_listing, this.feildsChange.bind(this, 'bundle_listing'))
                                    }
                                </Card.Section>
                            </Card>
                        </FormLayout>
                    }
                </Card.Section>
                }
                {!attributePrimaryspinner && primary_category_feature_options.length > 0 &&
                <Card.Section title={'Product condition'}>
                    {
                        select("", primary_category_feature_options, this.DropdownCategory.bind(this), form_data.primaryCategory.category_feature, 'Select..', errors.primaryCategory.category_feature?'*required field':'')
                    }
                </Card.Section>
                }
                { form_data.storefront_category_exists &&
                <Card.Section title={'eBay store front category'}>
                    {
                        select("", form_data.storefront_category.options, this.handletwoLevelDropdown.bind(this, 'storefront_category', 'selected'), form_data.storefront_category.selected, 'Select..' )
                    }
                </Card.Section>
                }
                {!isUndefined(form_data.variation_image_settings.options) && form_data.variation_image_settings.options.length>0 &&
                <Card.Section title={"Variation Image Settings"}>
                    {
                        choiceList("", form_data.variation_image_settings.options, form_data.variation_image_settings.selected, this.handletwoLevelDropdown.bind(this, "variation_image_settings", "selected"), false, false)
                    }
                </Card.Section>
                }
                {
                    form_data.shop_id !== "" && showSecondaryCategory &&
                <Card.Section>
                    <Stack vertical={true}>
                        {
                            checkbox("Enable secondary category", form_data.enable_advance_options, this.feildsChange.bind(this, 'enable_advance_options'), false, "", site_id === 'MOTORS' )
                        }
                    </Stack>
                </Card.Section>
                }
                { form_data.enable_advance_options &&
                <Card.Section title={"Secondary Category Mapping"}>
                    <Stack vertical={true} spacing={"loose"}>
                        <Stack.Item>
                            { errors.secondaryCategory.noCategorySelected &&
                                bannerPolaris("Error",  <p>
                                    No category is selected, Categories from root till leaf are required
                                </p>, "critical")
                            }
                            { errors.secondaryCategory.leafCategoryMissing &&
                                bannerPolaris("Error",  <p>
                                    Leaf categories are missing, Categories from root till leaf are required
                                </p>, "critical")
                            }
                            {
                                bannerPolaris("Category path",  <p>
                                    {
                                        CategoryPath('secondaryCategory', form_data)
                                    }
                                </p>, "info")
                            }
                        </Stack.Item>
                        <Stack.Item>
                            {
                                this.renderAutoComplete('secondaryCategory')
                            }
                        </Stack.Item>
                        <Stack.Item>
                            <Stack vertical={false} distribution={"fillEvenly"}>
                                {
                                    this.renderCategory('secondaryCategory')
                                }
                            </Stack>
                        </Stack.Item>
                    </Stack>
                </Card.Section>
                }
            </Card>
        );
    }
}

export default withRouter(CategoryTemplate);