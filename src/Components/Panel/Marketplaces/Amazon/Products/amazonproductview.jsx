import React, {Component} from 'react';
import {getProductViewTabsStructure, productViewtabs} from "./amazonproductshelper";
import {parseQueryString} from "../../../../../services/helperFunction";
import {fetchProductById} from "../../../../../Apirequest/ebayApirequest/productsApi";
import {extractVariantInfo} from "../../Ebay/Products/ebayproducthelper";
import {thumbnail} from "../../../../../PolarisComponents/InfoGroups";
import {spinner, textField} from "../../../../../PolarisComponents/InputGroups";
import {Card, Page, Stack, Tabs} from "@shopify/polaris";
import {saveadditionalDetailsProduct} from "../../../../../Apirequest/amazonApirequest/productsApi";
import { notify } from "../../../../../services/notify";
const Noimage = require("../../../../../assets/notfound.png");

class Amazonproductview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            tabs: productViewtabs,
            tabselected : 0,
            imageModal:{
                open: false,
                structure:[],
            },
            productData : {
                details:{
                    image_main:'',
                    tags: '',
                    title : '',
                    vendor:'',
                    product_type : '',
                    image_array : [],
                    long_description : '',
                    variant_attributes :[],
                    variants :[]
                },
                amazon_product_json : false,
            },
            additionalDetails :{
                parent_sku: '',
            },
            loaders:{
                initialLoad : true,
                save_additional_details : false,
            }
        }
    }

    componentDidMount() {
        this.getProductByID();
    }

    getProductByID(){
        let { id } = parseQueryString(this.props.location.search);
        this.loaderHandler("initialLoad", true);
        if(id){
            this.setState({ id }, async () =>{
                let { success, data } = await fetchProductById({"filter[container_id][1]" : id, source_marketplace: 'amazon'});
                if(success) this.modifyandStoreData(data.rows);
            });
        }else this.redirect('/panel/amazon/products');
        this.loaderHandler("initialLoad", false);
    }

    loaderHandler(loader, value){
        let { loaders } = this.state;
        loaders[loader] = value;
        this.setState({ loaders });
    }

    modifyandStoreData(data){
        let { productData } = this.state;
        let mainProduct = {};
        let variations = [];
        let additional_images_arr = [];

        if(data && data.length){
            mainProduct = {...data[0]};
            if(data.length === 1) variations = [{...data[0]}];
            else if(data.length > 1) {
                variations = [...data.filter((variant, index) => index !== 0 )]
            }
        }
        let { brand: vendor, title, variant_attributes, product_type, tags, main_image,  amazon_product_data, description, additional_images, collection } = mainProduct;
        additional_images_arr = additional_images ? [ ...additional_images]: [];
        variations.forEach( variant => {
            if(!tags && variant.hasOwnProperty('tags')) tags = variant.tags;
            additional_images_arr = [...additional_images_arr, ...variant['additional_images']];
        });

        productData.details = {
            image_main: main_image ? main_image : '',
            tags,
            title,
            vendor,
            product_type,
            collection: collection && collection.length ? collection : [],
            image_array : [...additional_images_arr],
            long_description: description,
            variant_attributes : [ ...Object.values(variant_attributes)],
            variants : [...extractVariantInfo(variations, Object.values(variant_attributes))]
        };
        productData.amazon_product_json = { ...amazon_product_data};
        this.setState({ productData }, () => {
            return true;
        });
    }

    changeProductViewDetails(field, subfield =false, index = false, value){
        if(subfield === 'long_description') console.log(value.editor.getData());
        else console.log(field, subfield, index, value);
    }

    changeExtraDetails(field, value){
        let  {  additionalDetails } = this.state;
        additionalDetails[field] = value;
        this.setState({ additionalDetails});
    }

    redirect(url){
        this.props.history.push(url);
    }

    handleTabSelect(tab){
        this.setState({ tabselected : tab});
    }

    async saveAdditionalDetails() {
        this.loaderHandler("save_additional_details", true);
        let {additionalDetails, id } = this.state;
        let { success, message } = await saveadditionalDetailsProduct({ source_product_id : id, ...additionalDetails});
        if(success) notify.success(message);
        else notify.error(message);
        this.loaderHandler("save_additional_details", false);
    }


    render() {
        let { loaders, productData, tabs, tabselected, additionalDetails } = this.state;
        let { initialLoad, save_additional_details } = loaders;
        let { parent_sku } = additionalDetails;
        let { details } = productData;
        let { image_main, title } = details;
        image_main = image_main ? image_main: Noimage;
        return (
            <Page
                fullWidth={true}
                breadcrumbs={[{content: 'Products', onAction:this.redirect.bind(this,'/panel/amazon/products')}]}
                thumbnail= {thumbnail(image_main, title)}
                title={ !initialLoad? title : spinner("small", "teal", "Loading....") }>
               <Stack vertical={true} spacing={"loose"}>
                <Card>
                    <Tabs tabs={tabs} fitted={true} selected={tabselected} onSelect={this.handleTabSelect.bind(this)}>
                        <Card.Section title={tabs[tabselected].content}>
                            {
                                getProductViewTabsStructure( tabselected, productData, this.changeProductViewDetails.bind(this))
                            }
                        </Card.Section>
                    </Tabs>
                </Card>
                <Card primaryFooterAction={{content:'Save', onAction: this.saveAdditionalDetails.bind(this), loading: save_additional_details}}>
                    <Card.Section title={"Parent SKU (Unique identifier)"}>
                        {
                            textField("", parent_sku, this.changeExtraDetails.bind(this, "parent_sku"))
                        }
                    </Card.Section>
                </Card>
               </Stack>
            </Page>
        );
    }
}

export default Amazonproductview;