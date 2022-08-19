import React, {Component} from 'react';
import {Card, Page, Tabs} from "@shopify/polaris";
import {spinner} from "../../../../../PolarisComponents/InputGroups";
import {parseQueryString} from "../../../../../services/helperFunction";
import {fetchProductById} from "../../../../../Apirequest/ebayApirequest/productsApi";
import {
    extractVariantInfo,
    getProductViewTabsStructure,
    productViewtabs
} from "./ebayproducthelper";
import {thumbnail} from "../../../../../PolarisComponents/InfoGroups";
import {Formik} from "formik";
const Noimage = require("../../../../../assets/notfound.png");

class Ebayproductview extends Component {

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
                  collection : [],
                  vendor:'',
                  product_type : '',
                  image_array : [],
                  long_description : '',
                  variant_attributes :[],
                  variants :[]
              },
                ebay_product_json : false,
            },
            loaders:{
                initialLoad : true,
            }
        }
    }

    componentDidMount() {
        this.getProductByID();
    }

    getProductByID(){
        let { id } = parseQueryString(this.props.location.search);
        let { loaders } = this.state;
        loaders.initialLoad = true;
        this.setState( { loaders });
        if(id){
            this.setState({ id }, async () =>{
                let { success, data } = await fetchProductById({"filter[container_id][1]" : id, source_marketplace: 'ebay'});
                if(success) this.modifyandStoreData(data.rows);
            });
        }else this.redirect('/panel/ebay/products');
        loaders.initialLoad = false;
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
        let { brand: vendor, title, variant_attributes, product_type, tags, main_image,  ebay_product_data, description, additional_images, collection } = mainProduct;
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
        productData.ebay_product_json = { ...ebay_product_data};
        this.setState({ productData }, () => {
           return true;
       });
    }

    redirect(url){
        this.props.history.push(url);
    }

    handleTabSelect(tab){
        this.setState({ tabselected : tab});
    }

    changeProductViewDetails(field, subfield =false, index = false, value){
        if(subfield === 'long_description') console.log(value.editor.getData());
        else console.log(field, subfield, index, value);
    }

    render() {
        let { loaders, productData, tabs, tabselected } = this.state;
        let { initialLoad } = loaders;
        let { image_main, title } = productData.details;
        image_main = image_main ? image_main: Noimage;
        return (
            <Page
                fullWidth={true}
                breadcrumbs={[{content: 'Products', onAction:this.redirect.bind(this,'/panel/ebay/products')}]}
                thumbnail= {thumbnail(image_main, title)}
                title={ !initialLoad? title : spinner("small", "teal", "Loading....") }>
                <Card>
                    <Tabs tabs={tabs} fitted={true} selected={tabselected} onSelect={this.handleTabSelect.bind(this)}>
                        <Card.Section title={tabs[tabselected].content}>
                            {
                                getProductViewTabsStructure( tabselected, productData, this.changeProductViewDetails.bind(this))
                            }
                        </Card.Section>
                    </Tabs>
                </Card>
            </Page>
        );
    }
}

export default Ebayproductview;