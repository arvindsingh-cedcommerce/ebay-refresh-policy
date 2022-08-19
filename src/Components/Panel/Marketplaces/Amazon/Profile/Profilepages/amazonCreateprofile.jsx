import React, {Component} from 'react';
import {amazonsettingsObj, pageSizeOptionProfile} from "../amazonProfileHelper";
import { gridPropColumns } from './amazonprofilePageHelper';
import {
    getFilterAttributes,
    getProductsbyquery, getProfilebyId,
    saveProfile
} from "../../../../../../Apirequest/ebayApirequest/profileApi";
import _ from "lodash";
import {
    extractTemplatesType, preparemultiaccountProfileStrucuture, prepareQueryandSentence, prepareQueryConditions,
    queryBuilderObj
} from "../../../Ebay/Profile/ebayprofilehelper";
import {getTemplates} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {notify} from "../../../../../../services/notify";
import {getpaginationInfo, parseQueryString} from "../../../../../../services/helperFunction";
import {extractValuesfromRequest} from "../../../Ebay/Products/ebayproducthelper";
import {Card, Icon, Page, Spinner, Stack} from "@shopify/polaris";
import {button, choiceList, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {CircleTickOutlineMinor, MarketingMajorMonotone} from "@shopify/polaris-icons";
import Grid from "../../../../../../Subcomponents/Aggrid/grid";
import {getMarketplaceConnectedAccount} from "../../../Ebay/Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import {getConnectedAccounts} from "../../../../../../Apirequest/accountsApi";
import {prepareShopifywarehouseOptions} from "../../../Ebay/Profile/Profilepages/ebayprofilepageHelper";
import {modalPolaris} from "../../../../../../PolarisComponents/ModalGroups";


let gridApi = '';
class AmazonCreateprofile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id : '',
            name : '',
            accounts : [],
            columns: gridPropColumns(),
            shopify_warehouses : [],
            matching_profiles : [],
            selectedAccountOption : '',
            settings:{}, // { site_id : {business_policy :{ shipping : '', return : '', payment: '' } , templates: { title: '', inventory: '', category : '', price : ''  } } }
            prepared_options : {}, // { site_id : { business_policy: { shipping : [], return : [], payment: [] }, templates: { title: [], inventory: [], category : [], price : [] } } }
            prepareQuery : {
                query:'',
                querySentence:'',
                queryArray : []
            },
            productsFiltered : {
                productsCount: false,
                rows: [],
            },
            modal:{
                open: false,
                structure:[],
            },
            templates : {
                title: [], inventory: [], category : [], price : []
            },
            paginationProps:{
                pageSizeOptions:pageSizeOptionProfile,
                activePage:1,
                pageSize: pageSizeOptionProfile[0],
                pages: 0, totalrecords: 0
            },
            filterAttributes : [],
            errors:{
                name : false
            },
            loaders :{
                testQuery : false,
                renderProducts : false,
                saveProfile : false,
                fetchPolicy : false
            }
        }
    }

    componentDidMount() {
        this.getAllSites();
        this.getFilterAttributes();
        this.getTemplates();
        this.getParams();

    }

    modalHandler(open, data){
        let { modal, matching_profiles } = this.state;
        modal = { ...modal, open, data};
        if(!open) matching_profiles = [];
        this.setState({ modal, matching_profiles });
    }

    async getParams(){
        let { id } = parseQueryString(this.props.location.search);
        if(id){
            let { success, data } = await getProfilebyId(id);
            if(success){
                let { query, settings, name } = data;
                settings = settings.hasOwnProperty("amazon")? {...settings["amazon"]} : {};
                Object.keys(settings).map( (shop_id) => {
                    this.onAccountSelection('accounts', shop_id);
                    return true;
                });
                this.setState({id, prepareQuery : query, settings, name }, ()=>{
                    this.runQuery();
                });
            }
        }
    }

    async getFilterAttributes(){
        let { success, data } = await getFilterAttributes({ marketplace: 'shopify'});
        if(success) {
            let attributesArray = [];
            data.forEach( obj => {
                let { title: label, code: value, options } = obj;
                attributesArray = [ ...attributesArray, { label, value, choices: options? options: 'false'}]
            });
            this.setState( { filterAttributes : [...attributesArray]} );
        }
    }

    async getAllSites(){
        let { success: successAccountFetch, data : accountdata } = await getConnectedAccounts();
        let data = [];
        if(successAccountFetch){
            data = [...accountdata];
            let accounts = [...await getMarketplaceConnectedAccount('amazon', ['region'], data)];
            let shopify_warehouses = await getMarketplaceConnectedAccount('shopify', [], data);
            this.setState({ accounts, shopify_warehouses } );
        }
    }

    async getTemplates(){
        let { templates: templatesOption } = this.state;
        let templates = await getTemplates({multitype:['category','price','inventory','title'], marketplace : 'amazon'});
        let {success , data} = templates;
        if(success)  this.setState( { templates : _.merge(templatesOption, extractTemplatesType(data)) });
    }

    fieldsChange(field, value){
        this.setState( { [field]: value });
    }

    async onAccountSelection(field, value){
        this.toggleLoaders('fetchPolicy', true);
        let { settings } = this.state;
        if( value && Object.keys(settings).indexOf(value) === -1) {
            this.prepareAccountsProfileData(value);
        }else notify.warn("Account has already been selected");
        this.toggleLoaders('fetchPolicy', false);
    }

    prepareAccountsProfileData(shop_id =[]){
        let { settings, prepared_options, templates } = this.state;
        if(!settings.hasOwnProperty(shop_id)) {
            settings = { ...settings , [shop_id] : { templates : { ...amazonsettingsObj.templates }} };
        }
        prepared_options = { ...prepared_options, [shop_id] : {  templates  }}
        this.setState( { settings, prepared_options }, () => {
            return true
        });
    }

    dropdownChange(shopId, templateType, type, value){
        let { settings } = this.state;
        if(type) settings[shopId][templateType][type] = value;
        else settings[shopId][templateType] = value;
        this.setState({ settings });
    }

    deleteSiteProfileSettings(shopId){
        let { settings, prepared_options } = this.state;
        delete settings[shopId];
        delete prepared_options[shopId];
        this.setState({ settings, prepared_options });
    }

    redirect(url){
        this.props.history.push(url);
    }

    deleteQueryStructure(groupIndex, rowIndex = false){
        let { prepareQuery } = this.state;
        let { queryArray } = prepareQuery;
        if(rowIndex || rowIndex === 0) queryArray[groupIndex] = [...queryArray[groupIndex].filter((row, rowpos) => rowpos !== rowIndex)];
        else queryArray = [...queryArray.filter((group, grouppos) => grouppos !== groupIndex)];
        prepareQuery.queryArray = [ ...queryArray ];
        this.setState({ prepareQuery }, () =>{
            this.prepareSentenceandQuery();
        });
    }

    addCondition(conditionType, index = false){
        let { prepareQuery } = this.state;
        let { queryArray } = prepareQuery;
        if(conditionType === 'or') queryArray = [ ...queryArray, [{...queryBuilderObj}] ];
        else queryArray[index] = [...queryArray[index], {...queryBuilderObj}];
        prepareQuery.queryArray = [...queryArray];
        this.setState({ prepareQuery });
    }

    queryStructureSelectionChange( field, orIndex, andIndex, value){
        let { prepareQuery, filterAttributes } = this.state;
        let { queryArray } = prepareQuery;
        queryArray[orIndex][andIndex][field] = value;

        if(field === 'attribute'){
            let getattribute = filterAttributes.filter(attributeOption => attributeOption.value === value && attributeOption.choices !== 'false');
            if(getattribute.length) queryArray[orIndex][andIndex]['condition'] = "==";
            else queryArray[orIndex][andIndex]['condition'] = "";
        }
        prepareQuery.queryArray = [...queryArray];
        this.setState( { prepareQuery }, ()=>{
            this.prepareSentenceandQuery();
        });
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    prepareSentenceandQuery(){
        let { prepareQuery, filterAttributes } = this.state;
        this.setState( {  prepareQuery : {...prepareQueryandSentence(prepareQuery, filterAttributes)}  })
    }

    toggleLoaders( loader, toggleValue ){
        let { loaders } = this.state;
        loaders[loader] = toggleValue;
        this.setState({ loaders });
    }

    async runQuery(){
        this.toggleOverLay(true);
        this.toggleLoaders('testQuery', true);
        this.toggleLoaders('renderProducts', true);
        let { prepareQuery, productsFiltered, paginationProps } = this.state;
        let { query } = prepareQuery;
        let {  pageSize : count, activePage } = paginationProps;
        let { success, data, rows } = await getProductsbyquery({ query, marketplace : 'shopify', count, activePage});
        if(!data) notify.warn("No product(s) lie under the given conditions, Please try something different");
        if(success){
            if(data) productsFiltered.productsCount = data.toString();
            let paginationInformation = getpaginationInfo( data, count);
            let extractRowData = extractValuesfromRequest(rows);
            paginationProps = { ...paginationProps, ...paginationInformation};
            productsFiltered.rows = [...extractRowData];
        }
        this.setState({ productsFiltered, paginationProps });
        this.toggleOverLay(false);
        this.toggleLoaders('renderProducts', false);
        this.toggleLoaders('testQuery', false);
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.runQuery();});
    }

    getGridApi(api){
        gridApi = api;
    }

    async saveProfile(){
        let { name, prepareQuery, settings, id } = this.state;
        let profileData = {
            saveInTable : true,
            data : { name , prepareQuery, settings, marketplace:'amazon'}
        };
        if(id !== '') profileData.data['profile_id'] = id;
        this.toggleLoaders("saveProfile", true);
        let { success, message, code, matching_profiles  } = await saveProfile(profileData);
        if(success) notify.success(message);
        else {
            if(code && code === "duplicate_query"){
                this.setState({ matching_profiles },()=>{
                    this.modalHandler(true, []);
                });
            }else notify.error(message);
        }
        this.toggleLoaders("saveProfile", false);
    }

    getModalStructure(){
        let temparr = [];
        let {  matching_profiles } = this.state;
        matching_profiles.forEach(profile => {
            temparr = [ ...temparr, <p><b>{profile.name}</b></p>]
        });
        return <Stack vertical={true} distribution={"fillEvenly"} spacing={"loose"}>
            {
                bannerPolaris("", <p><b>The query used already exists in below listed profiles, Kindly add/modify the details in the profile listed below.</b></p>)
            }
            <Card>
                <Card.Section>
                    {
                        temparr
                    }
                </Card.Section>
            </Card>
        </Stack>;
    }



    render() {
        let {  id, name, errors, prepared_options, accounts, settings, selectedAccountOption, prepareQuery, productsFiltered, paginationProps, columns, loaders, filterAttributes, shopify_warehouses, modal } = this.state;
        shopify_warehouses = [...prepareShopifywarehouseOptions(shopify_warehouses)];
        let { open: modalOpen } = modal;
        let modalStructure = modalOpen? this.getModalStructure():[];
        let { testQuery, renderProducts, saveProfile, fetchPolicy } = loaders;
        let { rows } = productsFiltered;
        let { name: nameErrors } = errors;

        return (
            <Page fullWidth title={id === '' ? "Create profile":"View profile"}
                  breadcrumbs={[{content: 'Profiles', onAction:this.redirect.bind(this,'/panel/amazon/profiles')}]}
                  primaryAction={{content: 'Save', loading: saveProfile, onAction: this.saveProfile.bind(this)}}
            >
                <Card>
                    <Card.Section>
                        {
                            textField("Name", name, this.fieldsChange.bind(this, 'name'), "", "", nameErrors)
                        }
                    </Card.Section>
                    {Object.keys(settings).length === 0 &&
                    <Card.Section>
                        {
                            bannerPolaris("How to add accounts to profile",
                                <ul>
                                    <li>Select Account below ( you can add multiple accounts ) and add them for which you want to create the profile.</li>
                                    <li>Select settings ( Templates ) for the site.</li>
                                </ul>
                                , "info")
                        }
                    </Card.Section>
                    }
                    <Card.Section>
                        <Stack vertical={false}>
                            <Stack.Item fill>
                                {
                                    select("", accounts, this.fieldsChange.bind(this, 'selectedAccountOption'), selectedAccountOption, "Select to add account...")
                                }
                            </Stack.Item>
                            {
                                button("Add account", this.onAccountSelection.bind(this,'accounts', selectedAccountOption), false, fetchPolicy, true, 'medium', selectedAccountOption === '')
                            }
                        </Stack>
                    </Card.Section>
                    {fetchPolicy &&
                    <Card.Section>
                        <Stack vertical={false} distribution={"center"}>
                            <p style={{fontWeight: "bold", marginTop: 10}}>Fetching site settings...</p><Spinner/>
                        </Stack>
                    </Card.Section>
                    }
                    { Object.keys(prepared_options).length > 0 &&
                    preparemultiaccountProfileStrucuture(settings, prepared_options, this.dropdownChange.bind(this), this.deleteSiteProfileSettings.bind(this), accounts, 'amazon', shopify_warehouses)
                    }
                    <Card.Section>
                        {
                            bannerPolaris("How to filter products for profile",
                                <ul>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>First you need to add group of condition by clicking on button below.</p>{prepareQuery.queryArray.length !== 0 && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>Second you need to add conditions and form the query for filtering products.</p>{prepareQuery.querySentence !== '' && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>Then click on Test query for executing and fetching the filtered products.</p>{ productsFiltered.productsCount && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                </ul>
                                , "info", MarketingMajorMonotone, prepareQuery.queryArray.length === 0?{ content : 'Add group', onAction : this.addCondition.bind(this, 'or')}:false)
                        }
                    </Card.Section>
                    {
                        prepareQuery.querySentence !== '' &&
                        <Card.Section title={"Filter conditions"}>
                            {
                                bannerPolaris("", prepareQuery.querySentence, "info")
                            }
                        </Card.Section>
                    }
                    {prepareQuery.queryArray.length !== 0 &&
                    <Card.Section title={"Group products by applying conditions"} actions={[
                        {content: 'Add group', onAction: this.addCondition.bind(this, 'or')}
                    ]}>
                        <Stack vertical={true} spacing={"loose"}>
                            {
                                prepareQueryConditions( prepareQuery, this.addCondition.bind(this), this.deleteQueryStructure.bind(this), this.queryStructureSelectionChange.bind(this), filterAttributes )
                            }
                            {
                                prepareQuery.querySentence !== '' &&
                                button("Test query", this.runQuery.bind(this), false, testQuery)
                            }
                            {
                                productsFiltered.productsCount &&
                                bannerPolaris("", `Total ${productsFiltered.productsCount} product(s) are filtered under applied condition`)
                            }
                        </Stack>
                    </Card.Section>
                    }
                    { renderProducts &&
                    <Card.Section>
                        <Stack vertical={false} distribution={"center"}>
                            <p style={{fontWeight: "bold", marginTop: 10}}>Preparing recieved data...</p><Spinner/>
                        </Stack>
                    </Card.Section>
                    }
                    {(rows && rows.length!==0) &&
                    <Card.Section title={"Products"}>
                        <Grid
                            tag={'Product(s)'}
                            columns={columns}
                            rows={rows}
                            getGridApi={this.getGridApi.bind(this)}
                            paginationProps={paginationProps}
                            onpaginationChange={this.onPaginationChange.bind(this)}
                            suppressSizeToFit={true}
                            suppressMovableColumns={true}
                            suppressRowClickSelection={true}
                            enableCellTextSelection={true}
                        />
                    </Card.Section>
                    }
                </Card>
                {
                    modalPolaris("Duplicate query found", modalOpen, this.modalHandler.bind(this,false, []), false, modalStructure)
                }
            </Page>
        );
    }
}

export default AmazonCreateprofile;