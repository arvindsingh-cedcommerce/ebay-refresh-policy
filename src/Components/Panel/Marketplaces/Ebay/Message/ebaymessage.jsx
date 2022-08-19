import React, {Component} from 'react';
import {Card, Page, Stack} from "@shopify/polaris";
import {modalPolaris} from "../../../../../PolarisComponents/ModalGroups";
import {getContentFilter, getMessageDataGrid, getMessageModifiedData, pageSizeOption} from "./ebaymessagehelper";
import {getMessages} from "../../../../../Apirequest/ebayApirequest/messageApi";
import {notify} from "../../../../../services/notify";
import {bannerPolaris} from "../../../../../PolarisComponents/InfoGroups";
import {spinner} from "../../../../../PolarisComponents/InputGroups";
import PaginationComponent from "../../../../../Subcomponents/Aggrid/paginationComponent";
import {getMarketplaceConnectedAccount} from "../Template/TemplateBody/TemplateHelpers/categorytemplateHelper";

class Ebaymessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows:[],
            all_data : [],
            shops : [],
            paginationProps:{
                pageSizeOptions:pageSizeOption,
                activePage:1,
                pageSize: pageSizeOption[0],
                pages: 0, totalrecords: 0
            },
            date_filter:{
                from:'',
                to:'',
            },
            shop_id : '',
            modal:{
                open : false,
                content:'',
                title : '',
            },
            filter_modal : false,
            loader : {
                button_loader : false,
            }
        };
    }

    componentDidMount() {
        this.getmarketplaceaccounts();
    }

    async getmarketplaceaccounts(){
        let connectedAccounts = await getMarketplaceConnectedAccount('ebay');
        this.setState({ shops: [...connectedAccounts] });
    }

    handleDataChange(field, subfield = false, value){
        switch(field){
            case 'date_filter':
                let { date_filter } = this.state;
                date_filter[subfield] = value;
                this.setState({ date_filter });
                break;
            case 'shop_id':
                let { shop_id } = this.state;
                shop_id = value;
                this.setState({ shop_id });
                break;
            case 'filter_modal':
                let { filter_modal } = this.state;
                filter_modal = value;
                if(!value) this.getMessages();
                this.setState({ filter_modal});
                break;
            case 'loader':
                let { loader } = this.state;
                loader[subfield] = value;
                this.setState({ loader });
                break;
            case 'message_modal':
                let { modal } = this.state;
                modal = { ...modal, ...value};
                this.setState({ modal });
                break;
            default: break;
        }
    }

    async getMessages(){
        this.handleDataChange("loader", "button_loader", true);
        let { date_filter, paginationProps, shop_id } = this.state;
        if(shop_id === ''){
            notify.error("Please select an account to proceed.");
            return true;
        }
        let { activePage : page, pageSize} = paginationProps;
        let requestObj = {  shop_id };
        if( date_filter.from !== '' && date_filter.to !== ''){
            requestObj = { ...requestObj, start_time : date_filter.from, end_time : date_filter.to };
        }
        let { success, data, message } = await getMessages( { page, pageSize, ...requestObj });
        if(success) this.setState({ rows : getMessageModifiedData(data.Message, this.handleDataChange.bind(this)), all_data: data.Message})
        else notify.error(message);
        this.handleDataChange("loader", "button_loader", false);
    }

    onPaginationChange(paginationProps){
        this.setState({ paginationProps },()=>{this.getProducts();});
    }

    render() {
        const { rows , paginationProps , modal, loader, filter_modal, date_filter, shop_id, shops } = this.state;
        const {  open , content , title } = modal;
        return (
            <Page title={"eBay messages"} fullWidth={true}
                  primaryAction={{content :'Get messages',onAction: this.handleDataChange.bind(this, 'filter_modal', false, true)}}
            >
                <Stack vertical={true} spacing={"loose"} distribution={"fill"}>
                    { rows.length > 0 &&
                    <Card>
                        <Card.Section title={'Messages'}>
                            {
                                getMessageDataGrid(rows)
                            }
                        </Card.Section>
                        <Card.Section>
                            <Stack vertical={false}>
                                <PaginationComponent paginationProps={paginationProps} paginationChanged={this.onPaginationChange.bind(this)}/>
                            </Stack>
                        </Card.Section>
                    </Card>
                    }
                    {
                        rows.length === 0 && bannerPolaris('To fetch the messages sent by eBay, kindly click on the “Get Messages” button.', "", "info")
                    }
                    {
                        loader.button_loader && <Stack vertical={true} alignment={"center"}>
                            {
                                spinner("large")
                            }
                        </Stack>
                    }
                </Stack>
                {
                    modalPolaris("Get messages", filter_modal, this.handleDataChange.bind(this,'filter_modal', false, false), false, getContentFilter( { date_filter, shop_id } , this.handleDataChange.bind(this), shops))
                }
                {
                    modalPolaris(title, open, this.handleDataChange.bind(this, 'message_modal', false, { open : false}), false, content)
                }
            </Page>
        );
    }
}

export default Ebaymessage;