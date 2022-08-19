import React, {Component} from 'react';
import {Card, FormLayout, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {checkbox, select, textArea, textField} from "../../../../../../PolarisComponents/InputGroups";
import {getBusinessPolicy, getEbayshopSettings} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import {notify} from "../../../../../../services/notify";
import {withRouter} from "react-router-dom";
import _ from "lodash";
import {extractDatafromPolicy} from "../ebaypolicyhelper";
import {Card as AntCard, Button as AntButton, Alert, Col, Row, Divider} from 'antd'

class ReturnPolicyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            form_data:{
                name:'',
                returns_accepted_option:true,
                return_accepted:['domestic'],
                return_accepted_options:[
                    {label:'Domestic returns accepted',value:'domestic'},
                ],
                return_option:'',
                domestic:{
                    return_paid_by:'',
                    return_within:'',
                    replacement_exchange_available:false,
                },
                international:{
                    return_paid_by:'',
                    return_within:'',
                    replacement_exchange_available:false
                },
                return_description:''
            },
            errors : {
                existing_id:false,
                name:false,
                domestic:{
                    return_within:false,
                    return_paid_by:false,
                }
            },
            options_recieved:{

            }
        }
    }

    componentDidMount() {
        let { id, site_id, shop_id } = this.props;
        this.setState({ _id: id, site_id, shop_id }, ()=>{
            if(id)  this.getPolicyData(id);
            this.getReturnPolicyDetails();
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

    formValidator() {
        let {errors, form_data } = this.state;
        let Errors = 0;
            if(form_data.name===''){
                errors.name=true;
                Errors+=1;
            }
            else errors.name=false;

            if(form_data.returns_accepted_option) {
                if (form_data.domestic.return_paid_by === '') {
                    errors.domestic.return_paid_by = true;
                    Errors += 1;
                }
                else errors.domestic.return_paid_by = false;

                if (form_data.domestic.return_within === '') {
                    errors.domestic.return_within = true;
                    Errors += 1;
                }
                else errors.domestic.return_within = false;
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
                return_policy : { ...form_data }
            };
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse) this.redirect('/panel/ebay/policiesUS');
        }else notify.error('Kindly fill all the required fields');
    }

    redirect(url){
        this.props.history.push(url);
    }

    async getReturnPolicyDetails(){
        let { options_recieved, site_id, shop_id } = this.state;
        let { success, data } = await getEbayshopSettings({ site_id, shop_id });
        if(success) {
            let { ReturnPolicyDetails } = data;
            options_recieved = { ...this.extractReturnPolicyServices(ReturnPolicyDetails)};
            this.setState({ options_recieved });
        }
    }

    extractReturnPolicyServices(data){
        let preparedObj={};
        Object.keys(data).map(key=>{
            if(typeof data[key]==='object') {
                let temparr = [];
                Object.keys(data[key]).map(Obj => {
                    temparr.push(
                        {label: data[key][Obj]['Description'], value: data[key][Obj][key + 'Option']}
                    );
                    return true;
                });
                preparedObj[key] = [...temparr];
            }
            return true;
        });
        return { ...preparedObj }
    }

    fieldsChange(key,tag = false,value){
        let { form_data } = this.state;
        if( tag ) form_data[key][tag]=value;
        else form_data[key] = value;
        this.setState( { form_data });
    }

    renderReturnPolicy(){
        let { form_data, errors, options_recieved } = this.state;
        return (
            <FormLayout key={'ReturnPolicyComponent'}>
                {
                    select('After receiving the item, your buyer should contact you within:',
                        options_recieved.hasOwnProperty('ReturnsWithin')? options_recieved.ReturnsWithin:[],
                        this.fieldsChange.bind(this,'domestic','return_within'),
                        form_data.domestic.return_within, "Select...", errors.domestic.return_within)
                }
                {
                    select('Return shipping will be paid by:',
                        options_recieved.hasOwnProperty('ShippingCostPaidBy')? options_recieved.ShippingCostPaidBy:[],
                        this.fieldsChange.bind(this,'domestic','return_paid_by'),
                        form_data.domestic.return_paid_by, "Select...", errors.domestic.return_paid_by)
                }
            </FormLayout>
        );
    }

    returnDescriptionReturn(){
        let temparr=[];
        let { site_id, form_data } = this.state;
        let countries=['DE','AT','FR','IT','ES'];
        if(countries.indexOf(site_id)>-1){
            temparr.push(
                textArea("Return description", form_data.return_description, this.fieldsChange.bind(this,"return_policy", "return_description" ), 5, )
            )
        }
        return temparr;
    }

    render() {

        let { errors, form_data, options_recieved } = this.state;

        return (
            // <Card title={"Return Policy"} primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
            <AntCard  title={"Return Policy"} actions={[<AntButton type='primary' onClick={this.saveFormdata.bind(this)} loading={this.props.loader}> Save</AntButton>]}>
                {/* <Card.Section> */}
                    <Stack spacing={"loose"} vertical={true}>
                        {/* {
                            bannerPolaris("",<p> <b>Return policy</b> helps you to assign features like whether you accept returns or not and if yes then you can provide refund options ,contact duration and who will pay for return shipping.</p>, "info")
                        } */}
                        <Alert type='info' showIcon description={<p> <b>Return policy</b> helps you to assign features like whether you accept returns or not and if yes then you can provide refund options ,contact duration and who will pay for return shipping.</p>} />
                        {
                            textField("Return Profile Name", form_data.name, this.fieldsChange.bind(this, 'name', false), "", '*required', errors.name)
                        }
                        {
                            checkbox("Returns accepted", form_data.returns_accepted_option, this.fieldsChange.bind(this, 'returns_accepted_option', false))
                        }
                        {
                            form_data.returns_accepted_option &&  options_recieved.hasOwnProperty('Refund') && options_recieved.Refund.length>0 &&
                                select('Refund Option', options_recieved.Refund, this.fieldsChange.bind(this, 'return_option', false ),  form_data.return_option)
                        }
                        {
                            form_data.returns_accepted_option &&
                            this.renderReturnPolicy()
                        }
                        {
                            this.returnDescriptionReturn()
                        }
                    </Stack>
                {/* </Card.Section> */}
            </AntCard>
            // {/* </Card> */}
        );
    }
}

export default withRouter(ReturnPolicyComponent);