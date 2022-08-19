import React, {Component} from 'react';
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {checkbox, choiceList, textArea, textField} from "../../../../../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {getBusinessPolicy, getEbayshopSettings} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import {prepareChoiceforArray} from "../../../../../../services/helperFunction";
import {notify} from "../../../../../../services/notify";
import {withRouter} from "react-router-dom";
import {extractDatafromPolicy} from "../ebaypolicyhelper";
import _ from "lodash";

class PaymentPolicy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            site_id:'',
            form_data : {
                immediate_pay:false,
                name:'',
                payment_methods:[],
                checkout_instruction:'',
                paypal_email:'',
                deposit_details:{
                    days_to_full_payment:'',
                    deposit_amount:'',
                    hours_to_deposit:''
                }
            },
            errors :{
                existing_id:false,
                name:false,
                selected:false,
                paypal_email:false,
                motors:{
                    paypal:false,
                    deposit_details:{
                        days_to_full_payment:false,
                        deposit_amount:false,
                        hours_to_deposit:false
                    }
                },
            },
            options_recieved:{
                payment_methods:[],
            }
        }
    }

    feildsChangePaymentLevelTwo(key,tag = false,value){
        let { form_data } = this.state;
        if( tag ) form_data[key][tag]=value;
        else {
            form_data[key] = value;
            if( key === 'immediate_pay' ){
                form_data.payment_methods = ['PayPal'];
            }
        }
        this.setState( { form_data });
    }

    componentDidMount() {
        let { id, site_id, shop_id } = this.props;
        this.setState({ _id: id, site_id, shop_id }, ()=>{
            if(id)  this.getPolicyData(id);
            this.getPaymentMethos();
        });
    }

    async getPolicyData(id){
          let {  form_data } = this.state;
          let { success, data } = await getBusinessPolicy(id);
          if(success){
              let { data: policyData, type } = data;
              this.setState({form_data : _.merge(form_data, extractDatafromPolicy(policyData, type)) });
          }
    }

    renderPaymentOption(){
        let { errors, form_data, site_id , options_recieved} = this.state;
        let temparr=[];
        temparr.push(
            <Stack vertical={true} distribution={"fillEvenly"} key={'paymentLayout'}>
                {
                    textField("Payment Profile Name", form_data.name, this.feildsChangePaymentLevelTwo.bind(this,'name', false), "", '*required', errors.name, "text")
                }
                {
                    checkbox("Immediate Pay", form_data.immediate_pay, this.feildsChangePaymentLevelTwo.bind(this,'immediate_pay', false))
                }
                { site_id === 'MOTORS' && errors.motors.paypal &&
                    bannerPolaris("",  <p>Paypal is a required payment method for your site</p>, "critical")
                }
                {
                    choiceList('Payment Options', form_data.immediate_pay?[{label:'PayPal',value:'PayPal',disabled :true}]: options_recieved.payment_methods,  form_data.payment_methods,  this.feildsChangePaymentLevelTwo.bind(this,'payment_methods', false), errors.selected?'*atleast one payment method is required':'', )
                }
                {
                    form_data.payment_methods.indexOf('PayPal')>-1 &&
                        textField("Paypal email", form_data.paypal_email, this.feildsChangePaymentLevelTwo.bind(this,'paypal_email', false), "", '*required', errors.paypal_email, "email" )
                }
                {
                    textArea("Additional checkout instruction", form_data.checkout_instruction, this.feildsChangePaymentLevelTwo.bind(this,'checkout_instruction', false), 3, "", 'This free-form string field allows the seller to give payment instructions to the buyer. These instructions will appear on eBay\'s view item and checkout pages.')
                }
            </Stack>
        );
        return temparr;

    }

    async getPaymentMethos(){
        let { options_recieved, site_id, shop_id } = this.state;
        let { success, data } = await getEbayshopSettings({ site_id, shop_id });
        if(success) {
            let { PaymentMethods } = data;
            options_recieved.payment_methods = [ ...prepareChoiceforArray(PaymentMethods) ];
            this.setState({ options_recieved });
        }
    }

    formValidator(){
        let { errors, form_data, site_id } = this.state;
        let Errors = 0;

            if(form_data.name===''){
                errors.name=true;
                Errors+=1;
            }
            else errors.name=false;

            if(site_id === 'MOTORS') {
                if(form_data.payment_methods.indexOf('PayPal')===-1){
                    errors.motors.paypal=true;
                    Errors+=1;
                }else errors.motors.paypal=false;

                if(form_data.deposit_details.hours_to_deposit === ''){
                    errors.motors.deposit_details.hours_to_deposit=true;
                    Errors += 1;
                }else errors.motors.deposit_details.hours_to_deposit=false;

                if( form_data.deposit_details.deposit_amount === ''){
                    errors.motors.deposit_details.deposit_amount=true;
                    Errors += 1;
                }else errors.motors.deposit_details.deposit_amount=false;

                if(form_data.deposit_details.days_to_full_payment === ''){
                    Errors+=1;
                    errors.motors.deposit_details.days_to_full_payment=true;
                }else errors.motors.deposit_details.days_to_full_payment=false;
            }

            if(form_data.payment_methods.length===0){
                errors.selected=true;
                Errors += 1;
            }
            else{
                errors.selected=false;
                if(form_data.payment_methods.indexOf('PayPal')>-1){

                    if(form_data.paypal_email ==='' && !(RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/).test(form_data.paypal_email))){
                        errors.paypal_email=true;
                        Errors += 1;
                    }
                    else errors.paypal_email=false;
                }
            }
            return { errorFree : Errors === 0, errors: {...errors} }
    }

    async saveFormdata(){
        let { errorFree, errors } = this.formValidator();
        this.setState({ errors });
        if(errorFree) {
            let { form_data , _id } = this.state;
            if(_id!=='') form_data['profileId'] = _id;

            let tempObj={
                payment_policy : { ...form_data }
            };
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse) this.redirect('/panel/ebay/policies');
        }else notify.error('Kindly fill all the required fields');
    }

    redirect(url){
        this.props.history.push(url);
    }

    render() {
        let { site_id, form_data, errors } = this.state;
        return (
            <Card title={"Payment policy"}  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
                        <Card.Section>
                            {
                                this.renderPaymentOption()
                            }
                        </Card.Section>
                        { site_id === 'MOTORS' &&
                        <Card.Section title={'Deposit details'}>
                            <FormLayout>
                                <FormLayout.Group>
                                    {
                                        textField("Days to full payment", form_data.deposit_details.days_to_full_payment, this.feildsChangePaymentLevelTwo.bind(this,'deposit_details','days_to_full_payment'), "", '*required', errors.motors.deposit_details.days_to_full_payment, "number")
                                    }
                                    {
                                        textField("Deposit Amount", form_data.deposit_details.deposit_amount, this.feildsChangePaymentLevelTwo.bind(this,'deposit_details','deposit_amount'), "", '*required', errors.motors.deposit_details.deposit_amount, "number")
                                    }
                                    {
                                        textField("Hour's to deposit", form_data.deposit_details.hours_to_deposit, this.feildsChangePaymentLevelTwo.bind(this,'deposit_details','hours_to_deposit'), "", '*required', errors.motors.deposit_details.hours_to_deposit, "number")
                                    }
                                </FormLayout.Group>
                            </FormLayout>
                        </Card.Section>
                        }
            </Card>
        );
    }
}

export default withRouter(PaymentPolicy);