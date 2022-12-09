import React, {Component} from 'react';
import {Card, DisplayText, Page, Stack} from "@shopify/polaris";
import {
    checkStepCompleted,
    // getAccountsConnection,
    getPlans,
    getUserDetails,
    saveCompletedStep
} from "../../Apirequest/registrationApi";
import '../../styleSheets/registration.css';
import {
    renderProgressindicator, stepsaveApi,
    stepsData,
    validateFunction
} from "../../Subcomponents/Registration/stepCommonFunction";
import {getMobileCode} from "../../Subcomponents/Registration/UserDetailsAcceptTerms";
import {button} from "../../PolarisComponents/InputGroups";
import {json} from "../../globalConstant/static-json";
import {notify} from "../../services/notify";
import {checkfilteralreadyPresent, regapiDataModifier} from "./RegistrationHelper/registrationHelper";
import {
    marketplaceAttributeErrorMapSchema,
    marketplaceAttributeMapSchema
} from "../../Subcomponents/Registration/ImportsettingsBody";
import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

class Registration extends Component {

    constructor(props){
        super(props);
        this.state = {
            step_count: 5,
            active_step : 0,
            step_data : [
                {
                    heading: 'Tell us about yourself',
                    anchor: 'U-INFO',
                    data:{
                        email:'',
                        full_name:'',
                        mobile:'',
                        mobile_code:'+91',
                        country:'IN',
                        how_u_know_about_us:'Shopify App Store',
                        accept_terms: false,
                    },
                    errors:{
                        email: false,
                        accept_terms: false
                    }
                },
                {
                    heading : 'Get your account linked',
                    anchor : 'LINKED',
                    data: {
                        ebay:{
                            image: "https://ebay.sellernext.com/marketplace-logos/ebay.png",
                            form_data:{
                                account_type:'production',
                                country_image : "http://icons.iconarchive.com/icons/wikipedia/flags/256/US-United-States-Flag-icon.png",
                                site_id:'0',
                            },
                            formDataChange: this.FormDataChange.bind(this)
                        },
                        amazon:{
                            image: "https://ebay.sellernext.com/marketplace-logos/amazon.jpg",
                            form_data:{
                                regions_options: json.amazon_regions,
                                region_selected : '',
                                marketplace_options: [],
                                markeplaceselected:[],
                                auth_via_ced : false,
                                auth_id: '',
                                auth_token : '',
                                aws_access_key_id:'',
                                aws_auth_id: ''
                            },
                            formDataChange: this.FormDataChange.bind(this)
                        },
                        loader: false,
                        modal:{
                            open: false,
                            marketplace : '',
                            modalToggle : this.modalClose.bind(this),
                        },
                        onChangeData : this.onChangeData.bind(this)
                    },
                    errors:{
                        ebay:{

                        },
                        amazon:{
                            region_selected : false,
                            markeplaceselected :false,
                            auth_id: false,
                            auth_token: false,
                            aws_access_key_id: false,
                            aws_auth_id: false
                        }
                    }
                },
                {
                    heading : 'Choose a plan',
                    anchor : 'PLANS',
                    data:{
                        plans:[],
                        onPlanSelect : this.onPlanSelect.bind(this),
                        modal:{
                            open: false,
                            modalToggle : this.modalClose.bind(this),
                        },
                    },
                    errors: {}
                },
                {
                    heading : 'Product import settings',
                    anchor : 'IMPORT_SETTINGS',
                    data:{
                        accounts_connected : [],
                        handleMarketplaceFilters : this.handleMarketplaceFilters.bind(this),
                        filters:{
                            shopify : {
                                status : 'active',
                            },
                            ebay:[],
                            amazon : []
                        }
                    },
                    errors: {
                        shopify:{
                            product_status : false
                        },
                        ebay : [],
                        amazon : [],
                    }
                },
                {
                    heading : 'Set your business policies',
                    anchor : 'DEFAULT_POLICY',
                    data:{
                        accounts_connected : [],

                    },
                    errors: {
                    }
                },
                {
                    heading : 'Registration Completed',
                    anchor : 'COMPLETED',
                    data:{

                    },
                    errors: {}
                }
            ],
            loader : false
        };
    }

    handleMarketplaceFilters(activeStep, action, marketplace, index, field, value) {
        let {step_data} = this.state;
        let {data, errors} = step_data[activeStep];
        if(field === "marketplace_attribute" && checkfilteralreadyPresent(data.filters[marketplace], 'marketplace_attribute', value)){
            notify.error("Attribute already present, Duplicate marketplace attribute can't be mapped");
            return true;
        }
        switch (action) {
            case 'update':
                data.filters[marketplace][index][field] = value;
                break;
            case 'add':
                data.filters[marketplace] = [...data.filters[marketplace], {...marketplaceAttributeMapSchema}];
                errors[marketplace] = [ ...errors[marketplace], {...marketplaceAttributeErrorMapSchema}];
                break;
            case 'delete':
                data.filters[marketplace] = [...(data.filters[marketplace]).filter((obj, pos) => pos !== index)];
                errors[marketplace] = [ ...(errors[marketplace]).filter((obj, pos) => pos !== index )];
                break;
            default:
                break;
        }
        step_data[activeStep]['data'] = {...data};
        step_data[activeStep]['errors'] = {...errors};
        this.setState({ step_data });
    }


    onPlanSelect(data){
        console.log(data);
    }

    FormDataChange(field,formData, marketplace , value){
        let { step_data } = this.state;
        let { data } = step_data[1];
        let { form_data } = data[marketplace];
        let obj = {};
        if(marketplace  === 'ebay' ) {
            if (field === 'account_type') obj = {...form_data, account_type: value};
            if (field === 'site_id') {
                let siteData = json.flag_country.filter(obj => obj.value === value);
                obj = {...form_data, site_id: value, country_image: siteData[0]['flag']}
            }
        }
        if(marketplace === 'amazon'){
            switch(field){
                case 'region_selected':
                    obj['marketplace_options'] = json.region_marketplace[value];
                    obj['markeplaceselected'] = [];
                    break;
                default:
                    break;
            }
            obj = { ...form_data, [field]: value, ...obj };
        }
        step_data[1]['data'][marketplace]['form_data'] = { ...obj};
        this.setState({step_data});
    }

    modalClose( step, field = 'modal'){
        let { step_data } = this.state;
        switch(step) {
            case 1:step_data[step]['data']['modal']['open'] = false;
                step_data[step]['data']['modal']['marketplace'] = '';
                break;
            case 2:
                break;
            default:break;
        }
        this.setState({step_data});

    }

    async getShopdetails () {
        let shopDetails = await getUserDetails();
        let { step_data, active_step } = this.state;
        if (shopDetails.success) {
            let {data} = shopDetails;
            step_data[active_step]['data'] = {...step_data[active_step]['data']
                ,...regapiDataModifier( 'user_details',  data)};
            this.setState({step_data});
        }
    }

    async getPlans(){
        let plans = await getPlans();
        if(plans.success){
            let  { data } = plans;
            let { step_data, active_step } = this.state;
            step_data[active_step]['data']['plans'] = [...data.data.rows];
            this.setState({step_data});
        }
    }

    // async checkAccountConnectivity(){
    //     let { active_step: step } = this.state;
    //     let accountsConnected = await getAccountsConnection();
    //     let { success, message, account_connected } = accountsConnected;
    //     if( success) {
    //         if(account_connected.indexOf("ebay") > -1){
    //             await saveCompletedStep( step );
    //             await this.getStepCompleted();
    //             notify.success(message);
    //         }
    //     }
    //     else notify.error(message);
    // }

    async stepDataPrepare(activeStep){
        switch(activeStep){
            case 0 :
                await this.getShopdetails();
                break;
            case 1:
                // await this.checkAccountConnectivity();
                break;
            case 2:
                await this.getPlans();
                break;
            case 3:
                // let {success, account_connected} = await getAccountsConnection();
                if(success){
                    this.onChangeData( 'accounts_connected', activeStep, [...account_connected] )
                }
                this.setState()
                break;
            default:
                break;
        }
    }

    async getStepCompleted(){
        let { step_count } = this.state;
        let activeStepData = await checkStepCompleted();
        if(activeStepData.success) {
            let {data: activeStep} = activeStepData;
            // activeStep = 3;
            activeStep = parseInt(activeStep);
            step_count = parseInt(step_count);
            activeStep = activeStep>step_count?step_count:activeStep;
            this.setState({active_step: activeStep},()=>{
                console.log('activeStep < step_count', activeStep, step_count)
                if( activeStep < step_count) {
                    this.stepDataPrepare(activeStep);
                }else{
                    setTimeout(()=>{
                        this.redirect('/panel')
                    },4000)
                }

            });
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    async componentDidMount() {
        await this.getStepCompleted();
    }

    onChangeData(field, step, value){
        let { step_data } = this.state;
        switch (step) {
            case 0:
                step_data[step]['data'][field] = value;
                if(field === 'country') step_data[step]['data']['mobile_code'] = getMobileCode(value);
                break;
            case 1:
                if(field === 'marketplace') {
                    step_data[step]['data']['modal'][field] = value;
                    step_data[step]['data']['modal']['open'] = true;
                }
                if(field === 'loader'){
                    step_data[step]['data'][field] = value;
                }
                break;
            case 2:
                console.log(field, step, value);
                break;
            case 3:
                if(field === 'product_status'){
                    step_data[step]['data']['filters']['shopify'][field] = value;
                }
                if(field === 'accounts_connected'){
                    step_data[step]['data'][field] = [...value];
                }
                break;
            default: break;
        }
        this.setState({step_data});
    }

    async changeStep(step, data, errors){
        this.setState({loader : true});
        let { isValid, errors: errorField  } = await validateFunction(step, data, errors);
        let { step_data } = this.state
        step_data[step]['errors'] = {...errorField};
        if(isValid) await stepsaveApi(step, data);
        this.setState({ step_data ,loader: false},()=>{
            this.getStepCompleted();
        });
    }

    disableBody = target => disableBodyScroll(target);
    enableBody = target => enableBodyScroll(target);

    render() {
        let { active_step, step_data, step_count, loader } = this.state;
        let {heading, anchor, data, errors} = step_data[active_step];
        const tourConfig = [
            {
                selector: '[data-tut="progress_indicator"]',
                content: `Ok, let's start with the name of the Tour that is about to begin.`
            }
        ];
        const accentColor = "#5cb7b7";
        return (
            <Page>
                <Card>
                    <Card.Section>
                        <Stack distribution={"center"}>
                            {
                                <DisplayText size={"large"}>
                                    { heading }
                                </DisplayText>
                            }
                        </Stack>
                        <br/>
                        <Stack distribution={"center"} >
                            {  anchor !== 'COMPLETED' &&
                            renderProgressindicator(active_step, step_count)
                            }
                        </Stack>
                    </Card.Section>
                    <div data-tut="progress_indicator">
                    {
                        stepsData(active_step, anchor, data, this.onChangeData.bind(this), errors, this.changeStep.bind(this,active_step, data, errors))
                    }
                    </div>
                    { (anchor !== 'LINKED' && anchor !== 'PLANS' && anchor !== 'COMPLETED') &&
                    <Card.Section>
                        <Stack distribution={"center"}>
                            {
                                button('Next', this.changeStep.bind(this, active_step, data, errors), false, loader)
                            }
                        </Stack>
                    </Card.Section>
                    }
                </Card>
                {/*<Tour*/}
                {/*    onRequestClose={()=>{}}*/}
                {/*    steps={tourConfig}*/}
                {/*    isOpen={true}*/}
                {/*    accentColor={accentColor}*/}
                {/*    rounded={5}*/}
                {/*    onAfterOpen={this.disableBody}*/}
                {/*    onBeforeClose={this.enableBody}*/}
                {/*/>*/}
            </Page>
        );
    }
}

export default Registration;