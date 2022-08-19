import React, {Component} from 'react';
import {getBusinessPolicy, getEbayshopSettings} from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import {prepareChoiceoption} from "../../../../../../Subcomponents/Aggrid/gridHelper";
import {
    countriestoInclude, extractDatafromPolicy,
    extractShippingDetails, getCollectionofTags, getCountryStructure,
    ShippingPolicyServicetype,
    tempObjShippingserviceDomestic,
    tempObjShippingserviceInternational, yesNoOptions
} from "../ebaypolicyhelper";
import {Badge, Button, Card, FormLayout, Icon, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {checkbox, select, textContainer, textField} from "../../../../../../PolarisComponents/InputGroups";
import {notify} from "../../../../../../services/notify";
import _ from "lodash";
import {withRouter} from "react-router-dom";
import {modalPolaris} from "../../../../../../PolarisComponents/ModalGroups";
import {BehaviorMajorMonotone} from "@shopify/polaris-icons";
import {Card as AntCard, Button as AntButton, Alert, Col, Row, Divider} from 'antd'

class ShippingPolicyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            site_id: '',
            shop_id : '',
            form_data: {
                name: '',
                service_type: 'Flat',
                global_shipping: false,
                shipping_package_type: '',
                domestic: {
                    buyer_responsible_for_shipping: false,
                    buyer_responsible_for_pickup: '',
                    shipping_surcharge: 0,
                    handling_time: "1",
                    handling_cost: 0,
                    PromotionalShippingDiscount: '',
                },
                international: {
                    buyer_responsible_for_shipping: false,
                    buyer_responsible_for_pickup: '',
                    shipping_surcharge: 0,
                    handling_cost: 0,
                    global_ship_to: [],
                    InternationalPromotionalShippingDiscount: ''
                },
                shipping_service_domestic: [
                    {service: '', charges: '', codfee: '', free_shipping: true, additional_charges: ''}
                ],
                shipping_service_international: [
                    {service: '', charges: '', additional_charges: '', codfee: '', ship_to: []}
                ],
                exclude_locations: false,
                excluded_shipping_location: []
            },
            errors: {
                existing_id: false,
                name: false,
                domestic: {
                    service_not_selected: false,
                    null_services: [],
                    handling_time: false,
                    buyer_responsible_for_pickup: false,
                    shipping_surcharge: false
                },
                international: {
                    service_not_selected: false,
                    null_services: [],
                    buyer_responsible_for_pickup: false,
                    shipping_surcharge: false
                },
                exclude_locations: false
            },
            options_recieved: {
                country: [],
                excluded_shipping_locations: [],
                handling_time: [],
                shipping_service: {
                    domestic: {},
                    international: {}
                },
                shipping_service_options: {
                    domestic: [],
                    international: []
                }
            },
            modal : {
                open: false,
                structure: [],
                title :'',
                type : '',
                index: false,
            }
        }
    }

    componentDidMount() {
        let { id, site_id, shop_id } = this.props;
        this.setState({ _id: id, site_id, shop_id }, ()=>{
            if(id)  this.getPolicyData(id);
            this.prepareOptions();
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

    async prepareOptions() {
        let {options_recieved, site_id, shop_id} = this.state;
        let {success, data} = await getEbayshopSettings({ site_id, shop_id });
        if (success) {
            let {CountryDetails, ExcludeShippingLocationDetails, DispatchTimeMaxDetails, ShippingServiceDetails} = data;
            options_recieved = {
                country: [...prepareChoiceoption(CountryDetails, "Description", "Country")],
                excluded_shipping_locations: [...prepareChoiceoption(ExcludeShippingLocationDetails, "Description", "Location")],
                handling_time: [...prepareChoiceoption(DispatchTimeMaxDetails, "Description", "DispatchTimeMax")],
                ...extractShippingDetails(ShippingServiceDetails)
            };

            this.setState({options_recieved});
        }
    }

    fieldsChange(key, tag = false, value) {
        let {form_data} = this.state;
        if (tag) form_data[key][tag] = value;
        else form_data[key] = value;
        this.setState({form_data});
    }

    redirect(url){
        this.props.history.push(url);
    }

    Addservices(type) {
        let {form_data} = this.state;
        let {shipping_service_domestic, shipping_service_international} = form_data;
        switch (type) {
            case 'domestic':
                form_data.shipping_service_domestic = [...shipping_service_domestic, {...tempObjShippingserviceDomestic}];
                break;
            case 'international':
                form_data.shipping_service_international = [...shipping_service_international, {...tempObjShippingserviceInternational}];
                break;
            default:
                break;
        }
        this.setState({form_data});
    }

    deleteService(type, index) {
        let {form_data} = this.state;
        switch (type) {
            case 'domestic':
                form_data.shipping_service_domestic = [...(form_data.shipping_service_domestic.filter((obj, pos) => pos !== index))];
                break;
            case 'international':
                form_data.shipping_service_international = [...(form_data.shipping_service_international.filter((obj, pos) => pos !== index))];
                break;
            default:
                break;
        }
        this.setState({form_data});
    }

    renderShippingPolicy(form_data, options_recieved, errors, site_id) {
        let temparr = [];
        temparr.push(
            <Stack vertical={true} key={'Shipping PolicyCard'}>
                <Stack vertical={false}>
                    <Stack.Item fill>
                        {
                            select("Service Type", ShippingPolicyServicetype, this.fieldsChange.bind(this, "service_type", false), form_data.service_type)
                        }
                    </Stack.Item>
                    {form_data.service_type !== 'FreightFlat' &&
                    <div style={{marginTop: "3rem"}}>
                        {
                            checkbox("Global Shipping", form_data.global_shipping, this.fieldsChange.bind(this, "global_shipping", false), false,
                                <Badge status={"attention"}><p onClick={(e) => {
                                    window.open('https://www.ebay.com/help/global-shipping-program/default/global-shipping-program?id=4646', '_blank');
                                    e.preventDefault();
                                }}>Learn more</p></Badge>
                            )
                        }
                    </div>
                    }
                </Stack>

                {form_data.service_type !== 'FreightFlat' &&
                // <Card title={"Domestic Shipping Services"} actions={[{
                //     content: 'Add services',
                //     onAction: this.Addservices.bind(this, 'domestic'),
                //     disabled: form_data.shipping_service_domestic.length > 3
                // }]}>
                <AntCard title={"Domestic Shipping Services"} extra={<AntButton type='primary' disabled={form_data.shipping_service_domestic.length > 3} onClick={this.Addservices.bind(this, 'domestic')}>Add services</AntButton>}>
                    {errors.domestic.service_not_selected &&
                    // <Card.Section>
                        // <Divider />
                        // {
                        //     bannerPolaris("", <p><b>Shipping services</b> is a required field,Kindly select a value
                        //         for {errors.domestic.null_services.join(',')} services below</p>, "critical")
                        // }
                        <Alert showIcon description={<p><b>Shipping services</b> is a required field,Kindly select a value for {errors.domestic.null_services.join(',')} services below</p>} type='error'/>
                    // {/* </Card.Section> */}
                    }
                    {/* <Card.Section> */}
                    <Row gutter={[0, 8]}>
                        {
                            this.getShippingPolicydomestic(form_data, options_recieved)
                        }
                    </Row>
                    {/* </Card.Section> */}
                    {/* <Card.Section> */}
                    <Divider />
                        <FormLayout>
                            <FormLayout.Group condensed>
                                {
                                    select('Handling Time', options_recieved.handling_time, this.fieldsChange.bind(this, 'domestic', 'handling_time'), form_data.domestic.handling_time, 'Please select...', errors.domestic.handling_time)
                                }
                                {form_data.service_type !== 'Flat' && form_data.service_type !== 'FlatDomesticCalculatedInternational' &&
                                textField("Handling Cost", form_data.domestic.handling_cost, this.fieldsChange.bind(this, 'domestic', 'handling_cost'), "", "", false, "number", "$")
                                }
                                <div style={{marginTop: '3rem'}}>
                                    {
                                        checkbox("Promotional shipping discount", form_data.domestic.PromotionalShippingDiscount, this.fieldsChange.bind(this, 'domestic', 'PromotionalShippingDiscount'))
                                    }
                                </div>
                            </FormLayout.Group>
                        </FormLayout>
                    {/* </Card.Section> */}
                    { site_id === 'MOTORS' &&
                    // <Card.Section>
                    <><Divider />
                        <FormLayout>
                            <FormLayout.Group condensed>
                                {
                                    select('Buyer responsible for pickup', yesNoOptions, this.fieldsChange.bind(this, 'domestic', 'buyer_responsible_for_pickup'), form_data.domestic.buyer_responsible_for_pickup, 'Please select ...', errors.domestic.buyer_responsible_for_pickup)
                                }
                                {
                                    textField("Shipping surcharge", form_data.domestic.shipping_surcharge, this.fieldsChange.bind(this, 'domestic', 'shipping_surcharge'), "", "", false, "number")
                                }
                                <div style={{marginTop: '3rem'}}>
                                    {
                                        checkbox("Buyer responsible for shipping", form_data.domestic.buyer_responsible_for_shipping, this.fieldsChange.bind(this, 'domestic', 'buyer_responsible_for_shipping'))
                                    }
                                </div>
                            </FormLayout.Group>
                        </FormLayout></>
                    // {/* </Card.Section> */}
                    }
                </AntCard>
                // {/* </Card> */}
                }
                {form_data.service_type !== 'FreightFlat' &&
                // <Card title={"International Shipping Services"}
                //       actions={[{
                //           content: 'Add services',
                //           onAction: this.Addservices.bind(this, 'international'),
                //           disabled: form_data.shipping_service_international.length > 4
                //       }]}>
                <AntCard title={"International Shipping Services"} extra={<AntButton disabled={form_data.shipping_service_international.length > 4} type='primary' onClick={this.Addservices.bind(this, 'international')}>Add services</AntButton>}>
                    { errors.international.service_not_selected &&
                    // <Card.Section>
                        // {
                        //     bannerPolaris("", <p><b>Shipping Services</b> is a required field,Kindly select a value
                        //         for {errors.international.null_services.join(',')} services
                        //         below</p>, "critical")
                        // }
                        <Alert type='error' description={ <p><b>Shipping Services</b> is a required field,Kindly select a value for {errors.international.null_services.join(',')} services below</p>} />
                    // {/* </Card.Section> */}
                    }
                    {/* <Card.Section> */}
                    <Row gutter={[0, 8]}>
                        {
                            this.getShippingPolicyInternational(form_data, options_recieved)
                        }
                    </Row>
                    {/* </Card.Section> */}
                    {/* <Card.Section> */}
                        <FormLayout>
                            <FormLayout.Group condensed>
                                {form_data.service_type !== 'Flat' && form_data.service_type !== 'CalculatedDomesticFlatInternational' &&
                                    textField("Handling Cost", form_data.international.handling_cost, this.fieldsChange.bind(this, 'international', 'handling_cost'), "", "", false, "number", "$")
                                }
                                <div >
                                    {
                                        checkbox("Promotional shipping discount", form_data.international.InternationalPromotionalShippingDiscount, this.fieldsChange.bind(this, 'international', 'InternationalPromotionalShippingDiscount'))
                                    }
                                </div>
                                <Stack vertical={true}>
                                    <div style={{ cursor:"pointer"}} onClick={(e)=>{
                                        this.settypeActivateModal('global_destination');
                                        e.preventDefault();
                                    }}>
                                    <Stack vertical={false}>
                                    <Icon source={BehaviorMajorMonotone} color={"blueDarker"}/><p style={{fontWeight:'bold', fontSize: 15}} >Choose global shipping destinations</p>
                                    </Stack>
                                    </div>
                                    {
                                    textContainer(<Stack
                                                spacing={"loose"}>{getCollectionofTags(form_data.international.global_ship_to, countriestoInclude)}</Stack>)
                                    }
                                </Stack>
                            </FormLayout.Group>
                        </FormLayout>
                    {/* </Card.Section> */}
                    { site_id === 'MOTORS' &&
                    // <Card.Section>
                        <FormLayout>
                            <FormLayout.Group condensed>
                                {
                                    select('Buyer responsible for pickup', yesNoOptions, this.fieldsChange.bind(this, 'international', 'buyer_responsible_for_pickup'), form_data.international.buyer_responsible_for_pickup, 'Please select ...', errors.international.buyer_responsible_for_pickup )
                                }
                                <div style={{marginTop: '3rem'}}>
                                    {
                                        checkbox("Buyer responsible for shipping", form_data.international.buyer_responsible_for_shipping, this.fieldsChange.bind(this, 'international', 'buyer_responsible_for_shipping'))
                                    }
                                </div>
                                {
                                    textField("Shipping surcharge", form_data.international.shipping_surcharge, this.fieldsChange.bind(this, 'international', 'shipping_surcharge'), "", "", false, "number")
                                }
                            </FormLayout.Group>
                        </FormLayout>
                    // {/* </Card.Section> */}
                    }
                    </AntCard>
                // {/* </Card> */}
                }
            </Stack>
        );
        return temparr;

    }

    handleShippingPolicyService(key, index, tag, value) {
        let {form_data, options_recieved} = this.state;
        form_data[key][index][tag] = value;
        options_recieved.selected_domestic_service = key === 'shipping_service_domestic' && tag === 'free_shipping' && value ? index.toString() : 'null';
        this.setState({form_data, options_recieved});
    }

    getShippingPolicydomestic(form_data, options_recieved) {
        let temparr = [];
           form_data.shipping_service_domestic.forEach((service, index) => {

               temparr.push(
                //    <Card title={`#${(index + 1)}`} key={`ShippingDomesticCard${index}`} actions={[{
                //        content: 'Delete service',
                //        onAction: this.deleteService.bind(this, 'domestic', index),
                //        disabled: form_data.shipping_service_domestic.length === 1
                //    }]}>
                <Col span={24}>
                <AntCard title={`#${(index + 1)}`}  key={`ShippingDomesticCard${index}`} extra={<AntButton type='primary' danger={true} disabled={form_data.shipping_service_domestic.length === 1} onClick={this.deleteService.bind(this, 'domestic', index)}>Delete service</AntButton>}>
                       <Card.Section>
                           <FormLayout>
                               <FormLayout.Group condensed>
                                   {console.log(options_recieved.shipping_service_options.domestic)}
                                   {
                                       select('Shipping Services', options_recieved.shipping_service_options.domestic, this.handleShippingPolicyService.bind(this, 'shipping_service_domestic', index, 'service'), form_data.shipping_service_domestic[index].service, 'Select...')
                                   }
                                   {form_data.service_type !== 'Calculated' && form_data.service_type !== 'CalculatedDomesticFlatInternational' &&
                                   textField("Charges", form_data.shipping_service_domestic[index].charges, this.handleShippingPolicyService.bind(this, 'shipping_service_domestic', index, 'charges'), "", "", false, "number", "", "", false, form_data.shipping_service_domestic[index].free_shipping)
                                   }
                                   {form_data.service_type !== 'Calculated' && form_data.service_type !== 'CalculatedDomesticFlatInternational' &&
                                   textField("Additional charges", form_data.shipping_service_domestic[index].additional_charges, this.handleShippingPolicyService.bind(this, 'shipping_service_domestic', index, 'additional_charges'), "", "", false, "number", "", "", false, form_data.shipping_service_domestic[index].free_shipping)
                                   }
                                   {/*{*/}
                                   {/*    textField("COD fee", form_data.shipping_service_domestic[index].codfee, this.handleShippingPolicyService.bind(this, 'shipping_service_domestic', index, 'codfee'), "", "", false, "number")*/}
                                   {/*}*/}
                                   <div style={{marginTop: '3rem'}}>
                                       {
                                           checkbox("Free shipping", form_data.shipping_service_domestic[index].free_shipping, this.handleShippingPolicyService.bind(this, 'shipping_service_domestic', index, 'free_shipping'), false, "", options_recieved.selected_domestic_service !== 'null' && index.toString() !== options_recieved.selected_domestic_service)
                                       }
                                   </div>
                               </FormLayout.Group>
                           </FormLayout>
                       </Card.Section>
                </AntCard>
                </Col>
                //    {/* </Card> */}
               );
           });

        return temparr;
    }

    getShippingPolicyInternational( form_data, options_recieved ) {
        let temparr = [];
        form_data.shipping_service_international.forEach((service, index) => {
            temparr.push(
                // <Card title={`#${(index + 1)}`} key={"ShippingPolicyinternationalCard" + index} actions={[{
                //     content: 'Delete service',
                //     onAction: this.deleteService.bind(this, 'international', index),
                //     disabled: form_data.shipping_service_international.length === 1
                // }]}>
                <AntCard title={`#${(index + 1)}`} key={"ShippingPolicyinternationalCard" + index} extra={<AntButton type='primary' danger={true} onClick={this.deleteService.bind(this, 'international', index)} disabled={form_data.shipping_service_international.length === 1}>Delete service</AntButton>}>
                    {/* <Card.Section> */}
                        <FormLayout>
                            <FormLayout.Group condensed>
                                <div style={{maxWidth: '26rem'}}>
                                    {
                                        select('Shipping Services', options_recieved.shipping_service_options.international, this.handleShippingPolicyService.bind(this, 'shipping_service_international', index, 'service'), form_data.shipping_service_international[index].service )
                                    }
                                </div>
                                { form_data.service_type !== 'Calculated' && form_data.service_type !== 'FlatDomesticCalculatedInternational' &&
                                 textField( "Charges", form_data.shipping_service_international[index].charges, this.handleShippingPolicyService.bind(this, 'shipping_service_international', index, 'charges'), "", "", false, "number")
                                }
                                {form_data.service_type !== 'Calculated' && form_data.service_type !== 'FlatDomesticCalculatedInternational' &&
                                    textField("Additional charges", form_data.shipping_service_international[index].additional_charges, this.handleShippingPolicyService.bind(this, 'shipping_service_international', index, 'additional_charges'), "", "", false, "number")
                                }
                                {/*{*/}
                                {/*    textField("COD fee", form_data.shipping_service_international[index].codfee, this.handleShippingPolicyService.bind(this, 'shipping_service_international', index, 'codfee'), "", "", false, "number")*/}
                                {/*}*/}
                                <Stack vertical={true}>
                                    <div style={{ cursor:"pointer"}} onClick={(e)=>{
                                        this.settypeActivateModal('shipping_service_international', index);
                                        e.preventDefault();
                                    }}>
                                        <Stack vertical={false}>
                                            <Icon source={BehaviorMajorMonotone} color={"blueDarker"}/><p style={{fontWeight:'bold', fontSize: 15}} >Choose Destination</p>
                                        </Stack>
                                    </div>
                                    {
                                        textContainer(<Stack
                                            spacing={"loose"}>{getCollectionofTags(form_data.shipping_service_international[index].ship_to, countriestoInclude)}</Stack>)
                                    }
                                </Stack>
                            </FormLayout.Group>
                        </FormLayout>
                    {/* </Card.Section> */}
                </AntCard>
                // {/* </Card> */}
            );
        });
        return temparr;
    }

    async saveFormdata(){
        let { errorFree, errors } = this.formValidator();
        this.setState({ errors });
        if(errorFree) {
            let { form_data , _id } = this.state;
            if(_id!=='') form_data['profileId'] = _id;

            let tempObj={
                shipping_policy : { ...form_data }
            };
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse) this.redirect('/panel/ebay/policiesUS');
        }else notify.error('Kindly fill all the required fields');
    }

    formValidator(){
        let { errors, form_data, site_id } = this.state;
        let Errors = 0;

            if(form_data.name===''){
                errors.name=true;
                Errors+=1;
            }
            else errors.name=false;

            if(form_data.domestic.handling_time===''){
                errors.domestic.handling_time=true;
                Errors+=1;
            }
            else errors.domestic.handling_time=false;

            if(site_id === 'MOTORS') {
                if (form_data.domestic.buyer_responsible_for_pickup === '') {
                    errors.domestic.buyer_responsible_for_pickup = true;
                    Errors += 1;
                }
                else errors.domestic.buyer_responsible_for_pickup = false;

                if (form_data.domestic.shipping_surcharge === '') {
                    errors.domestic.shipping_surcharge = true;
                    Errors += 1;
                }
                else errors.domestic.shipping_surcharge = false;
            }
            errors.domestic.null_services=[];
            form_data.shipping_service_domestic.forEach((value,index)=>{
                if(value.service==='') errors.domestic.null_services.push(index+1);
            });
            if(errors.domestic.null_services.length !==0)
            {
                errors.domestic.service_not_selected=true;
                Errors+=1;
            }
            else errors.domestic.service_not_selected=false;

            if(site_id === 'MOTORS') {
                if (form_data.international.buyer_responsible_for_pickup === '') {
                    errors.international.buyer_responsible_for_pickup = true;
                    Errors += 1;
                }
                else errors.international.buyer_responsible_for_pickup = false;

                if (form_data.international.shipping_surcharge === '') {
                    errors.international.shipping_surcharge = true;
                    Errors += 1;
                }
                else errors.international.shipping_surcharge = false;
            }
        return { errorFree : Errors === 0, errors: {...errors} }
    }


    render() {
        let {form_data, options_recieved, errors, site_id, modal} = this.state;
        let { open, structure, title } = modal;
        return (
            // <Card title={"Shipping policy"}  primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
            <AntCard title={"Shipping policy"} actions={[<AntButton type='primary' onClick={this.saveFormdata.bind(this)} loading={this.props.loader}> Save</AntButton>]}>
                <Row>
                    <Col span={24}>
                {/* <Card.Section> */}
                    {/* {
                        bannerPolaris("", <p><b>Shipping policy</b> helps you to assign shipping services, handling
                            time, charges and much more both for global and domestic shipping.</p>, "info")
                    } */}
                    <Alert showIcon description={<p><b>Shipping policy</b> helps you to assign shipping services, handling
                            time, charges and much more both for global and domestic shipping.</p>} />
                    </Col>                            
                {/* </Card.Section> */}
                {/* <Card.Section> */}
                <Divider />
                    <Col span={24}>                            
                    {
                        textField("Shipping Profile Name", form_data.name, this.fieldsChange.bind(this, "name", false), "", '*required', errors.name)
                    }
                    </Col>
                <Divider />
                {/* </Card.Section> */}
                <Col span={24}>                            
                {/* <Card.Section> */}
                    {
                        this.renderShippingPolicy(form_data, options_recieved, errors, site_id)
                    }
                {/* </Card.Section> */}
                </Col>
                {
                    modalPolaris(title, open, this.handleModal.bind(this), false, structure)
                }
                </Row>
            </AntCard>
            // </Card>
        );
    }

    settypeActivateModal(type, index = false){
        let { modal } = this.state;
        modal.type = type;
        modal.index = index;
        this.setState({ modal }, () =>{
            this.handleModal();
        });
    }

    onCountrySelect(type, country, index = false, value){
        let { form_data } = this.state;
        switch (type) {
            case 'global_destination':
                if(value){
                    form_data.international.global_ship_to = form_data.international.global_ship_to.indexOf(country) === -1 ? [
                        ...form_data.international.global_ship_to, country
                    ]: [...form_data.international.global_ship_to ];
                }else{
                    form_data.international.global_ship_to = form_data.international.global_ship_to.filter( val => val !== country);
                }
                break;
            case 'shipping_service_international':
                if(value){
                    form_data.shipping_service_international[index].ship_to = (form_data.shipping_service_international[index].ship_to).indexOf(country) === -1 ? [
                        ...form_data.shipping_service_international[index].ship_to, country
                    ]: [...form_data.shipping_service_international[index].ship_to ];
                }else{
                    form_data.shipping_service_international[index].ship_to = (form_data.shipping_service_international[index].ship_to).filter( val => val !== country);
                }

                break;
            default: break;
        }
       this.setState({ form_data }, () => {
           this.prepareStruture(type, index);
       });
    }

    prepareStruture( type, index = false ) {
        console.log('prepareStruture');
        let {modal, form_data} = this.state;
        let structure = [];
        let selectedOptions = [];
        switch (type) {
            case 'global_destination':
                selectedOptions = [...form_data.international.global_ship_to];
                structure = getCountryStructure(countriestoInclude, type, selectedOptions, this.onCountrySelect.bind(this));
                break;
            case 'shipping_service_international':
                selectedOptions = [...form_data.shipping_service_international[index].ship_to];
                console.log(selectedOptions);
                structure = getCountryStructure(countriestoInclude, type, selectedOptions,  this.onCountrySelect.bind(this), index);
                break;
            default:
                break;
        }
        modal = {...modal, structure};
        this.setState({modal});
    }


    handleModal(){
        let { modal, form_data } = this.state;
        let { open, structure, type, title, index } = modal;
        if(open) {
            open = false;
            structure = [];
            type= '';
                title="";
                index = false;
        }else{
            open = true;
            let selectedOptions = [];
           switch (type) {
               case 'global_destination':
                   title = "Choose global shipping destinations";
                   selectedOptions =  [...form_data.international.global_ship_to];
                   structure = getCountryStructure(countriestoInclude, type, selectedOptions,  this.onCountrySelect.bind(this));
                   break;
               case 'shipping_service_international':
                   title = 'Choose Destination';
                   selectedOptions = [...form_data.shipping_service_international[index].ship_to];
                   console.log('selectedOptions', selectedOptions);
                   structure = getCountryStructure(countriestoInclude, type, selectedOptions,  this.onCountrySelect.bind(this), index);
                   break;
               default: break;
           }
        }
        this.setState({ modal:{...modal, ...{ open, structure, type, title, index}}});
    }
}

export default withRouter(ShippingPolicyComponent);