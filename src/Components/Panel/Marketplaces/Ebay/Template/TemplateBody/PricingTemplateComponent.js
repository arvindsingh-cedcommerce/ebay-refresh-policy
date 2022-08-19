import React, {Component} from 'react';
import {Badge, Card, FormLayout, Stack} from "@shopify/polaris";
import {bannerPolaris} from "../../../../../../PolarisComponents/InfoGroups";
import {checkbox, select, textField} from "../../../../../../PolarisComponents/InputGroups";
import {notify} from "../../../../../../services/notify";
import {getTemplatebyId} from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import _ from "lodash";
import {withRouter} from "react-router-dom";
import {Card as AntCard, Button as AntButton, Alert, Divider} from 'antd'

const sellingFormatOptions=[
    {label:'Fixed Price',value:'fixed_price'},
    {label:'Auction-style',value:'auction_style'}
];

let sellingListingDurations=[
    {
        label :'Days_1',
        value : 'Days_1',
        disabled:false,
    },
    {
        label : 'Days_3',
        value : 'Days_3',
        disabled:false,
    },
    {
        label : 'Days_5',
        value : 'Days_5',
        disabled:false,
    },
    {
        label : 'Days_7',
        value : 'Days_7',
        disabled:false,
    },
    {
        label : 'Days_10',
        value : 'Days_10',
        disabled:false,
    },
    {
        label : 'Days_21',
        value : 'Days_21',
        disabled:false,
    },
    {
        label : 'Days_30',
        value : 'Days_30',
        disabled:false,
    },
    {
        label : 'Days_60',
        value : 'Days_60',
        disabled:false,
    },
    {
        label : 'Days_90',
        value : 'Days_90',
        disabled:false,
    },
    {
        label : 'Days_120',
        value : 'Days_120',
        disabled:false,
    },
];

const sellingListingDurationFixed=[
    {label:'GTC',value:'GTC'},
];

const SettingsFixed=[
    {label:'Custom price',value:'customized_price'},
    {label:'Flat price',value:'flat_price'},
    {label:'Default',value:'default'},
];
const SettingsAuction=[
    {label:'Custom price',value:'customized_price'},
    /*{label:'Flat price',value:'flat_price'},*/
    {label:'Default',value:'default'},
];

const variateType=[
    {label:'Increase',value:'increase'},
    {label:'Decrease',value:'decrease'},
];
const variateBy=[
    {label:'Percentage',value:'percentage'},
    {label:'Value',value:'value'},
];

class PricingTemplateComponent extends Component {

    constructor(props) {
        super(props);
        this.state={
            _id:'',
            form_data:{

                selling_details:{
                    format:'fixed_price',
                    listing_duration:'GTC'
                },
                name:'',
                roundOff:{
                    all:false,
                },
                fixed_listing:{
                    selected:'default',
                    customized_price:{
                        variate_type: 'increase',
                        variate_by: 'value',
                        variate_value: 0,

                    },
                    flat_price:{
                        fixed_value:0
                    }
                },
                auctions_listing:{
                    start_price:{
                        selected:'default',
                        customized_price:{
                            variate_type: 'increase',
                            variate_by: 'value',
                            variate_value: 0,
                        },
                        flat_price:{
                            fixed_value:0
                        }
                    },
                    buyitnow_price:{
                        selected:'customized_price',
                        customized_price:{
                            variate_type: 'increase',
                            variate_by: 'percentage',
                            variate_value: 30,
                        },
                        flat_price:{
                            fixed_value:0
                        }
                    },
                    reserved_price:{
                        selected:'customized_price',
                        customized_price:{
                            variate_type: 'increase',
                            variate_by: 'value',
                            variate_value: 0,
                        },
                        flat_price:{
                            fixed_value:0
                        }
                    }
                }
            },
            site_id:'',
            errors:{
                name:false,
                auctions_listing:{
                    buyitnow_price:{
                        customized_price:{
                            variate_value:false,
                        },
                        flat_price:{
                            fixed_value:false
                        },
                        variate_value:false,
                    },
                    start_price:{
                        customized_price:{
                            variate_value:false,
                        },
                        flat_price:{
                            fixed_value:false
                        },
                    },
                    reserved_price:{
                        customized_price:{
                            variate_value:false,
                        },
                        flat_price:{
                            fixed_value:false
                        },
                    }
                },
                fixed_listing:{
                    customized_price:{
                        variate_value:false,
                    },
                    flat_price:{
                        fixed_value:false
                    },
                }
            }
        };
    }

    formValidator(){
        let { form_data, errors:Errors, site_id } = this.state;
        let errors=0;
        Object.keys(form_data).map(key=>{
            switch(key){
                case 'name':
                    if(form_data[key]===''){
                        Errors.name=true;
                        errors+=1;
                    }
                    else{
                        Errors.name=false;
                    }
                    break;
                case 'selling_details':
                    if(form_data.selling_details.format==='auction_style'){
                        if(form_data.auctions_listing.buyitnow_price.customized_price.variate_by==='percentage'){
                            if(form_data.auctions_listing.buyitnow_price.customized_price.variate_type==='increase') {
                                if (form_data.auctions_listing.buyitnow_price.customized_price.variate_value<30){
                                    Errors.auctions_listing.buyitnow_price.variate_value=true;
                                    errors+=1;
                                }else{
                                    Errors.auctions_listing.buyitnow_price.variate_value=false;
                                }
                            }
                        }
                        if(form_data.auctions_listing.buyitnow_price.selected==='customized_price'){
                            if(form_data.auctions_listing.buyitnow_price.customized_price.variate_value===''){
                                Errors.auctions_listing.buyitnow_price.customized_price.variate_value=true;
                                errors+=1;
                            }else if(form_data.auctions_listing.buyitnow_price.customized_price.variate_value<0){
                                Errors.auctions_listing.buyitnow_price.customized_price.variate_value=true;
                                errors+=1;
                            }
                            else{
                                Errors.auctions_listing.buyitnow_price.customized_price.variate_value=false;
                            }
                        }
                        if(form_data.auctions_listing.buyitnow_price.selected==='flat_price'){
                            if(form_data.auctions_listing.buyitnow_price.flat_price.fixed_value===''){
                                Errors.auctions_listing.buyitnow_price.flat_price.fixed_value=true;
                                errors+=1
                            }else if(form_data.auctions_listing.buyitnow_price.flat_price.fixed_value<0){
                                Errors.auctions_listing.buyitnow_price.flat_price.fixed_value=true;
                                errors+=1
                            }
                            else{
                                Errors.auctions_listing.buyitnow_price.flat_price.fixed_value=false;
                            }
                        }

                        if(form_data.auctions_listing.start_price.selected==='customized_price'){
                            if(form_data.auctions_listing.start_price.customized_price.variate_value===''){
                                Errors.auctions_listing.start_price.customized_price.variate_value=true;
                                errors+=1;
                            }else if(form_data.auctions_listing.start_price.customized_price.variate_value<0){
                                Errors.auctions_listing.start_price.customized_price.variate_value=true;
                                errors+=1;
                            }
                            else{
                                Errors.auctions_listing.start_price.customized_price.variate_value=false;
                            }
                        }
                        if(form_data.auctions_listing.start_price.selected==='flat_price'){
                            if(form_data.auctions_listing.start_price.flat_price.fixed_value===''){
                                Errors.auctions_listing.start_price.flat_price.fixed_value=true;
                                errors+=1;
                            }else if(form_data.auctions_listing.start_price.flat_price.fixed_value<0){
                                Errors.auctions_listing.start_price.flat_price.fixed_value=true;
                                errors+=1;
                            }
                            else{
                                Errors.auctions_listing.start_price.flat_price.fixed_value=false;
                            }
                        }
                        if(site_id !== 'MOTORS'){
                            if(form_data.auctions_listing.reserved_price.selected==='customized_price'){
                                if(form_data.auctions_listing.reserved_price.customized_price.variate_value===''){
                                    Errors.auctions_listing.reserved_price.customized_price.variate_value=true;
                                    errors+=1;
                                }else if(form_data.auctions_listing.reserved_price.customized_price.variate_value<0){
                                    Errors.auctions_listing.reserved_price.customized_price.variate_value=true;
                                    errors+=1;
                                }
                                else{
                                    Errors.auctions_listing.reserved_price.customized_price.variate_value=false;
                                }
                            }
                            if(form_data.auctions_listing.reserved_price.selected==='flat_price'){
                                if(form_data.auctions_listing.reserved_price.flat_price.fixed_value===''){
                                    Errors.auctions_listing.reserved_price.flat_price.fixed_value=true;
                                    errors+=1;
                                }else if(form_data.auctions_listing.reserved_price.flat_price.fixed_value<0){
                                    Errors.auctions_listing.reserved_price.flat_price.fixed_value=true;
                                    errors+=1;
                                }
                                else{
                                    Errors.auctions_listing.reserved_price.flat_price.fixed_value=false;
                                }
                            }
                        }

                    }else if(form_data.selling_details.format==='fixed_price'){
                        if(form_data.fixed_listing.selected==='customized_price'){
                            if(form_data.fixed_listing.customized_price.variate_value===''){
                                Errors.fixed_listing.customized_price.variate_value=true;
                                errors+=1;
                            }else if(form_data.fixed_listing.customized_price.variate_value<0){
                                Errors.fixed_listing.customized_price.variate_value=true;
                                errors+=1;
                            }
                            else{
                                Errors.fixed_listing.customized_price.variate_value=false;
                            }
                        }
                        if(form_data.fixed_listing.selected==='flat_price'){
                            if(form_data.fixed_listing.flat_price.fixed_value===''){
                                Errors.fixed_listing.flat_price.fixed_value=true;
                                errors+=1;
                            }else if(form_data.fixed_listing.flat_price.fixed_value<0){
                                Errors.fixed_listing.flat_price.fixed_value=true;
                                errors+=1;
                            }
                            else{
                                Errors.fixed_listing.flat_price.fixed_value=false;
                            }
                        }
                    }
                    break;
                default: break;
            }
            return true;
        });

        this.setState({ form_data, errors: {...Errors}});
        return errors===0;
    }

    async saveFormdata(){
        if(this.formValidator()){
            let { _id } = this.state;
            let tempObj={
                title:this.state.form_data.name,
                type:'price',
                data:this.state.form_data,
            };
            if(_id !== '') tempObj['_id'] = _id;
            let returnedResponse = await this.props.recieveFormdata(tempObj);
            if(returnedResponse){
                this.redirect('/panel/ebay/templatesUS');
            }
        }else{
            notify.error('Kindly fill all the required fields');
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
            this.setState({ form_data: _.merge(form_data, templatedata)});
        }
    }

    handleNameChange(value){
        let {form_data} = this.state;
        form_data.name=value;
        this.setState({ form_data });
    }

    handleCheckbox(key, subkey = false, value){
        let { form_data } = this.state;
        if(subkey) form_data[key][subkey] = value;
        else form_data[key] = value;
        this.setState({ form_data});
    }

    toggleListingDurations(){
        let tempArr= [ ...sellingListingDurations ]
        let { site_id } = this.state;
        tempArr.forEach((data,index)=>{
            let dayvalue =parseInt((data.value).substr((data.value).indexOf('_')+1));
            if(dayvalue<30){
                if(site_id ==='MOTORS') tempArr[index].disabled=false;
                else tempArr[index].disabled=false;
            }
        });
        sellingListingDurations = [...tempArr];
    }

    redirect(url){
        this.props.history.push(url);
    }

    feildsChange(key,tag,value){
        let { form_data, site_id } = this.state;

        form_data[key][tag]=value;
        if(key==='selling_details' && tag==='format' && value==='fixed_price'){
            form_data.selling_details.listing_duration='GTC';
        } else if(key==='selling_details' && tag==='format' && value!=='fixed_price'){
            this.toggleListingDurations()
            if( site_id !=='MOTORS' ) form_data.selling_details.listing_duration = 'Days_3';
            else form_data.selling_details.listing_duration = 'Days_30';
        }
        this.setState({ form_data } );
    }

    renderFixedListingSettingConfig(data){
        let { form_data, errors } = this.state;
        let temparr=[];
        switch(data){
            case 'customized_price':
                temparr.push(
                    <Card  key={data+'settings'}>
                        <Card.Section>
                            <FormLayout >
                                <FormLayout.Group condensed>
                                    {
                                        select("", variateType, this.feildsChangeFixed.bind(this,'fixed_listing','customized_price','variate_type'), form_data.fixed_listing.customized_price.variate_type)
                                    }
                                    {
                                        select("", variateBy, this.feildsChangeFixed.bind(this,'fixed_listing','customized_price','variate_by'),form_data.fixed_listing.customized_price.variate_by)
                                    }
                                    {
                                        textField("", form_data.fixed_listing.customized_price.variate_value, this.feildsChangeFixed.bind(this,'fixed_listing','customized_price','variate_value'), "", false, errors.fixed_listing.customized_price.variate_value, "number", )
                                    }
                                </FormLayout.Group>
                            </FormLayout>
                        </Card.Section>
                    </Card>
                );
                break;
            case 'flat_price':
                temparr.push(
                    <Card >
                        <Card.Section>
                            <FormLayout>
                                {
                                    textField("", form_data.fixed_listing.flat_price.fixed_value, this.feildsChangeFixed.bind(this,'fixed_listing','flat_price','fixed_value'), 'Please enter flat price...', "", errors.fixed_listing.flat_price.fixed_value, "number")
                                }
                            </FormLayout>
                        </Card.Section>
                    </Card>
                );
                break;
            default: break;

        }
        return temparr
    }

    feildsChangeSelect(key,tag,value) {
        let { form_data } = this.state;
        form_data[key][tag] = value;
        this.setState({form_data});
    }
    feildsChangeFixed(key,tag,subtag,value) {
        let { form_data } = this.state;
        form_data[key][tag][subtag] = value;
        this.setState({ form_data });
    }
    feildsChangeAuction(key,tag,subtag,subsubtag,value) {
        let { form_data } = this.state;
        form_data[key][tag][subtag][subsubtag] = value;
        this.setState({ form_data });
    }

    renderAuctionSettingBody(tag)
    {
        let { form_data, errors } = this.state;
        let temparr=[];
        switch(tag){
            case 'start_price':
                switch(form_data.auctions_listing.start_price.selected){
                    case 'customized_price':
                        temparr.push(
                            // <Card  key={'AuctionCalculatedPrice'}>
                            //     <Card.Section>
                            <AntCard>
                                    <FormLayout condensed>
                                        <FormLayout.Group>
                                            {
                                                select("", variateType, this.feildsChangeAuction.bind(this,'auctions_listing','start_price','customized_price','variate_type'), form_data.auctions_listing.start_price.customized_price.variate_type)
                                            }
                                            {
                                                select("", variateBy, this.feildsChangeAuction.bind(this,'auctions_listing','start_price','customized_price','variate_by'), form_data.auctions_listing.start_price.customized_price.variate_by)
                                            }
                                            {
                                                textField("", form_data.auctions_listing.start_price.customized_price.variate_value, this.feildsChangeAuction.bind(this,'auctions_listing','start_price','customized_price','variate_value'), "", "", errors.auctions_listing.start_price.customized_price.variate_value, 'number')
                                            }
                                        </FormLayout.Group>
                                    </FormLayout>
                            </AntCard>
                            //     </Card.Section>
                            // </Card>
                        );

                        break;
                    case 'flat_price':
                        temparr.push(
                            <Card  key={'AuctionFixedpricing'}>
                                <Card.Section>
                                    <FormLayout>
                                        {
                                            textField("", form_data.auctions_listing.start_price.flat_price.fixed_value,this.feildsChangeAuction.bind(this,'auctions_listing','start_price','flat_price','fixed_value'), 'Please enter flat price...', "", errors.auctions_listing.start_price.flat_price.fixed_value, "number" )
                                        }
                                    </FormLayout>
                                </Card.Section>
                            </Card>
                        )
                        break;
                    default: break;
                }

                break;
            case 'buyitnow_price':

                switch(this.state.form_data.auctions_listing.buyitnow_price.selected){
                    case 'customized_price':
                        temparr.push(
                            // <Card key={'AuctionCalculatedPricebuyitnow_price'} title={"Custom price"}>
                            //     <Card.Section>
                            <AntCard title={"Custom price"}>
                                    <FormLayout condensed>
                                        <FormLayout.Group>
                                            {
                                                select("", variateType, this.feildsChangeAuction.bind(this,'auctions_listing','buyitnow_price','customized_price','variate_type'),form_data.auctions_listing.buyitnow_price.customized_price.variate_type, "", false, false, true)
                                            }
                                            {
                                                select("", variateBy, this.feildsChangeAuction.bind(this,'auctions_listing','buyitnow_price','customized_price','variate_by'), form_data.auctions_listing.buyitnow_price.customized_price.variate_by)
                                            }
                                            {
                                                textField("", form_data.auctions_listing.buyitnow_price.customized_price.variate_value, this.feildsChangeAuction.bind(this,'auctions_listing','buyitnow_price','customized_price','variate_value'), '', "", errors.auctions_listing.buyitnow_price.customized_price.variate_value?'*invalid value':errors.auctions_listing.buyitnow_price.variate_value?'*value needs to be atleast 30% higher than start/current price':'', "number" )
                                            }
                                        </FormLayout.Group>
                                    </FormLayout>
                                </AntCard>
                            //     </Card.Section>
                            // </Card>
                        );

                        break;
                    case 'flat_price':
                        temparr.push(
                            // <Card key={'AuctionCalculatedPricefixed_pricing'}>
                                // <Card.Section>
                                    <AntCard>
                                    <FormLayout>
                                        {
                                            textField("", form_data.auctions_listing.buyitnow_price.flat_price.fixed_value, this.feildsChangeAuction.bind(this,'auctions_listing','buyitnow_price','flat_price','fixed_value'), 'Please enter flat price...', "", form_data.auctions_listing.buyitnow_price.flat_price.fixed_value, "number" )
                                        }
                                    </FormLayout>
                                    </AntCard>
                            //     {/* </Card.Section>
                            // </Card> */}
                        )
                        break;
                    default: break;
                }


                break;
            case 'reserved_price':

                switch(this.state.form_data.auctions_listing.reserved_price.selected){
                    case 'customized_price':
                        temparr.push(
                            // <Card key={'reservedCalculatedPrice'} title={"Custom price"}>
                            //     <Card.Section>
                            <AntCard title={"Custom price"}>
                                    <FormLayout condensed>
                                        <FormLayout.Group>
                                            {
                                                select("", variateType, this.feildsChangeAuction.bind(this,'auctions_listing','reserved_price','customized_price','variate_type'),form_data.auctions_listing.reserved_price.customized_price.variate_type, "", false, false, true)
                                            }
                                            {
                                                select("", variateBy, this.feildsChangeAuction.bind(this,'auctions_listing','reserved_price','customized_price','variate_by'),form_data.auctions_listing.reserved_price.customized_price.variate_by)
                                            }
                                            {
                                                textField("", form_data.auctions_listing.reserved_price.customized_price.variate_value, this.feildsChangeAuction.bind(this,'auctions_listing','reserved_price','customized_price','variate_value'), '', "", errors.auctions_listing.reserved_price.customized_price.variate_value, "number" )
                                            }
                                        </FormLayout.Group>
                                    </FormLayout>
                            </AntCard>
                            //     </Card.Section>
                            // </Card>
                        );

                        break;
                    case 'flat_price':
                        temparr.push(
                            // <Card  key={'reservedFixedPrice'}>
                            //     <Card.Section>
                            <AntCard>
                                    <FormLayout>
                                        {
                                            textField("", form_data.auctions_listing.reserved_price.flat_price.fixed_value, this.feildsChangeAuction.bind(this,'auctions_listing','reserved_price','flat_price','fixed_value'), 'Please enter flat price...', "", errors.auctions_listing.reserved_price.flat_price.fixed_value, "number" )
                                        }
                                    </FormLayout>
                            </AntCard>
                            //     </Card.Section>
                            // </Card>
                        )
                        break;
                    default : break;
                }

                break;
            default: break;
        }

        return temparr;
    }

    render() {
        let { form_data, errors } = this.state;
        let  { name, roundOff } = form_data;
        let { name: nameError } = errors;
        return (
            // <Card title={"Pricing template"} primaryFooterAction={{content: 'Save', loading:this.props.loader, onAction: this.saveFormdata.bind(this)}}>
            <AntCard title={"Pricing template"} actions={[<AntButton type='primary' loading={this.props.loader} onClick={this.saveFormdata.bind(this)}>Save</AntButton>]}>
                {/* <Card.Section>
                    {
                        bannerPolaris("",<p><b>Pricing template </b>helps you to assign custom pricing while creating or updating a listing on eBay.</p>, "info")
                    }
                    {
                        bannerPolaris("",<i>To sell an item at a fixed price, your feedback score must be 0 or higher, and the item you're listing must be priced at $0.99 or higher.</i>, "info")
                    }
                </Card.Section> */}
                <Alert type='info' showIcon description={<p><b>Pricing template </b>helps you to assign custom pricing while creating or updating a listing on eBay.</p>} />
                <br />
                <Alert type='info' showIcon description={<i>To sell an item at a fixed price, your feedback score must be 0 or higher, and the item you're listing must be priced at $0.99 or higher.</i>} />
                {/* <Card.Section title={"Template name"}> */}
                <>
                    <Divider orientation='left'>Template name</Divider>
                    <Stack vertical={true} spacing={"loose"}>
                        {
                            textField("", name,  this.handleNameChange.bind(this), "", '*required', nameError)
                        }
                        {
                            checkbox('Round off price', roundOff.all, this.handleCheckbox.bind(this, 'roundOff','all'), false, 'By selecting this option you can round off all the prices to it\'s ceil value. Eg. 4.6 -> 5')
                        }
                    </Stack>
                </>
                {/* </Card.Section> */}
                {/* <Card.Section title={"Configuration"}> */}
                <>
                    <Divider orientation='left'>Configuration</Divider>
                    <Stack distribution={"fillEvenly"} vertical={false}>
                        {/* {
                            bannerPolaris("", <p><i><b>Fixed price listings</b> are set to <b>Good 'Til Cancelled (GTC)</b> duration by default. This means your item will be listed on eBay until it sells or you end it.</i></p>, "info")
                        } */}
                        <Alert type='info' showIcon description={<p><i><b>Fixed price listings</b> are set to <b>Good 'Til Cancelled (GTC)</b> duration by default. This means your item will be listed on eBay until it sells or you end it.</i></p>}/>
                        {
                            select(<React.Fragment><p className='font-weight-bold'>Format (Listing type)
                                <Badge status={"attention"}><span className='font-weight-bold' style={{cursor:'pointer'}} onClick={(e)=>{
                                    window.open('https://www.ebay.in/pages/help/sell/formats.html','_blank');
                                    e.preventDefault();
                                }}>Learn more</span></Badge></p></React.Fragment>, sellingFormatOptions, this.feildsChange.bind(this,'selling_details','format'), form_data.selling_details.format, "", false, false, false,"*Select how you want to sell the items you're listing" )
                        }
                        {
                            select('Listing Duration', form_data.selling_details.format==='fixed_price'?sellingListingDurationFixed:sellingListingDurations,this.feildsChange.bind(this,'selling_details','listing_duration'), form_data.selling_details.listing_duration, "", false, false, form_data.selling_details.format==='fixed_price', '*Duration for which your listing will run. If your item doesn\'t sell, you can choose to relist it.' )
                        }
                    </Stack>
                </>
                {/* </Card.Section> */}
                {form_data.selling_details.format === 'fixed_price' &&
                // <Card.Section title={"Fixed price listing format"}>
                <>
                    <Divider orientation='left'>Fixed price listing format</Divider>
                    {/* {
                        bannerPolaris("", <p>
                            <i>A buyer knows the exact price they need to pay for your item, and can complete their
                                purchase immediately. There is <b>no bidding on flat price listings</b>.</i>
                        </p>, "info")
                    } */}
                    <Alert type='info' showIcon description={<p>
                            <i>A buyer knows the exact price they need to pay for your item, and can complete their
                                purchase immediately. There is <b>no bidding on flat price listings</b>.</i>
                        </p>} />
                </>
                // {/* </Card.Section> */}
                }
                {form_data.selling_details.format === 'fixed_price' &&
                // <Card.Section title={"Final Price"}>
                <>
                    <Divider orientation='left'>Final Price</Divider>
                    <FormLayout>
                        {
                            select("Settings", SettingsFixed, this.feildsChangeSelect.bind(this, 'fixed_listing', 'selected'), form_data.fixed_listing.selected)
                        }
                        {
                            this.renderFixedListingSettingConfig(this.state.form_data.fixed_listing.selected)
                        }
                    </FormLayout>
                </>
                // {/* </Card.Section> */}
                }
                {this.state.form_data.selling_details.format === 'auction_style' &&
                // <Card.Section title={"Auction listing format"} key={"Auction"}>
                <>
                    <Divider orientation='left'>Auction listing format</Divider>
                    {/* {
                        bannerPolaris("",  <p>
                            <i><b>Start price</b> must be lower than <b>reserved price</b></i>
                        </p>, "info")
                    } */}
                    <Alert type='info' showIcon description={<p>
                            <i><b>Start price</b> must be lower than <b>reserved price</b></i>
                        </p>} />
                </>
                // {/* </Card.Section> */}
                }
                {this.state.form_data.selling_details.format === 'auction_style' &&
                // <Card.Section title={"Start price"} key={"AuctionStart"}>
                <>
                    <Divider orientation='left'>Start price</Divider>
                    <FormLayout>
                        {
                            select("", SettingsAuction, this.feildsChangeFixed.bind(this, 'auctions_listing', 'start_price', 'selected'), form_data.auctions_listing.start_price.selected)
                        }
                        {
                            this.renderAuctionSettingBody('start_price')
                        }
                    </FormLayout>
                </>
                // {/* </Card.Section> */}
                }
                {this.state.form_data.selling_details.format === 'auction_style' &&
                // <Card.Section title={"Buy it now price"} key={"AuctionBuy"}>
                <>
                    <Divider orientation='left'>Buy it now price</Divider>
                    <FormLayout>
                        {/* {
                            bannerPolaris("",  <p>
                                <i>Buyers can either purchase your item right away at the Buy It Now price, or place a bid. In most categories,<b> The Buy It Now price has to be at least 30% higher than the Start/Current price</b>.</i>
                            </p>, "info")
                        } */}
                        <Alert type='info' showIcon description={<p>
                                <i>Buyers can either purchase your item right away at the Buy It Now price, or place a bid. In most categories,<b> The Buy It Now price has to be at least 30% higher than the Start/Current price</b>.</i>
                            </p>} />
                        {
                            this.renderAuctionSettingBody('buyitnow_price')
                        }
                    </FormLayout>
                </>
                // </Card.Section>
                }
                {this.state.form_data.selling_details.format === 'auction_style' &&
                // <Card.Section title={"Reserved price"} key={"AuctionReserved"}>
                <>
                    <Divider orientation='left'>Reserved price</Divider>
                    <FormLayout>
                        {/* {
                            bannerPolaris("", <p>
                                <i><b>Fee May Apply</b> You can set a hidden minimum selling price for your item
                                    - the lowest price you're willing to accept for your item. If the listing
                                    ends without any bids that reach this price, you don't have to sell the
                                    item.</i>
                            </p>, "info")
                        } */}
                        <Alert type='info' showIcon description={<p>
                                <i><b>Fee May Apply</b> You can set a hidden minimum selling price for your item
                                    - the lowest price you're willing to accept for your item. If the listing
                                    ends without any bids that reach this price, you don't have to sell the
                                    item.</i>
                            </p>} />
                        {
                            this.renderAuctionSettingBody('reserved_price')
                        }
                    </FormLayout>
                </>
                // </Card.Section>
                }
            </AntCard>
            // </Card>
        );
    }
}

export default withRouter(PricingTemplateComponent);