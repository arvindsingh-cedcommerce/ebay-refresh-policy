import React, {Component} from 'react';
import {Page} from "@shopify/polaris";
import {
    attachCountTabTitle,
    extractValuesfromRequest,
    filterCondition, getTypeoftabs,
    gridPropColumns,
    pageSizeOptionProducts,
    policiestabs,
    selectedPolciesActions
} from "./ebaypolicyhelper";
import { notify} from "../../../../../services/notify";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {deletePolicy, getPolicies} from "../../../../../Apirequest/ebayApirequest/policiesApi";
import {AddMajorMonotone, RefreshMajorMonotone} from "@shopify/polaris-icons";
import {getSiteName} from "../../../Accounts/accountsHelper";
import {getBadgePolaris} from "../../../../../PolarisComponents/InfoGroups";
import {select} from "../../../../../PolarisComponents/InputGroups";
import {getMarketplaceConnectedAccount} from "../Template/TemplateBody/TemplateHelpers/categorytemplateHelper";


let gridApi = '';
class Ebaypolicieslist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: gridPropColumns(this.incellElement.bind(this)),
            tabs: policiestabs,
            selectedTab:0,
            site_id: '',
            shop_id : '',
            connected_sites:[],
            rows: [],
            all_rows:[],
            selectedRows: [],
            selectedActions: selectedPolciesActions,
            actionSelected: '',
            paginationProps:{
                pageSizeOptions:pageSizeOptionProducts,
                activePage:1,
                pageSize: pageSizeOptionProducts[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterCondition},
        }
    }

    componentDidMount() {
        this.getmarketplaceaccounts();
    }

    async getmarketplaceaccounts(){
        let { site_id } = this.state;
        let connectedAccounts = await getMarketplaceConnectedAccount('ebay');
        this.dataChange('connected_sites', [...connectedAccounts]);
        if(connectedAccounts.length && site_id === '') {
            this.dataChange('site_id', connectedAccounts[0]['warehouses'][0]['site_id']);
            this.dataChange('shop_id', connectedAccounts[0]['value']);
        }
    }


    async incellElement(field, data){
        let { id, type, site_id, shop_id } =data;
        switch (field) {
            case 'edit':
                this.redirect(`/panel/ebay/policy/handler?type=${type}&id=${id}&site_id=${site_id}&shop_id=${shop_id}`)
                break;
            case 'delete' :
                let { success, message} = await deletePolicy( {site_id, profile_ids: id, shop_id} );
                if(success){
                    notify.success(message);
                    this.getPolicies();
                }else{
                    notify.error(message);
                }
                break;
            default:break;
        }
    }

    getGridApi(api){
        gridApi = api;
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    async getPolicies(refresh=false){
        let { tabs, site_id, shop_id } = this.state;
        this.toggleOverLay(true);
        let requestData = { multitype:['shipping', 'payment', 'return'], site_id, shop_id};
        if(refresh) requestData['refresh'] = true;
        let policyRequest = await getPolicies({...requestData});
        let { success, data } = policyRequest;
        if(success) {
            let extractRowData = extractValuesfromRequest(data, site_id, shop_id);
            tabs = [...attachCountTabTitle(tabs, 'all',  extractRowData)];
            tabs = [...attachCountTabTitle(tabs, 'shipping',  extractRowData)];
            tabs = [...attachCountTabTitle(tabs, 'payment',  extractRowData)];
            tabs = [...attachCountTabTitle(tabs, 'return',  extractRowData)];
            this.setState({ all_rows: [...extractRowData], rows: [...extractRowData], tabs, selectedTab:0});
        }
        this.toggleOverLay(false);
    }

    cellClickedEvent(colDef, data){
        let { field } = colDef;
        console.log('Cell Clicked', field);
        console.log('Cell Clicked', data);
    }

    tabSelected(tabs){
        this.setState({ selectedTab : tabs}, ()=>{
            this.filterTabProducts();
        });
    }

    filterTabProducts(){
        let { selectedTab, all_rows } = this.state;
        let getType = getTypeoftabs(selectedTab);
        let rows;
        if(getType !== 'all') {
            rows = all_rows.filter(data => data.type === getType);
        }else{
            rows = all_rows.slice(0);
        }
        this.setState({rows});
    }

    filterData(componentFilters){
        // console.log(componentFilters);
        let { filtersProps } = this.state;
        filtersProps['filters'] = [...componentFilters];
        // this.props.filterUpdated([...componentFilters]);
        this.setState({filtersProps},()=>{
        this.getPolicies();
        });
    }

    redirect(url){
        this.props.history.push(url);
    }

    changeSite(field, value){
        let { connected_sites } = this.state;
        if(field === "shop_id"){
            let selectedSite = connected_sites.filter(site => site.value === value);
            if(selectedSite.length) {
                this.dataChange('site_id', selectedSite[0]['warehouses'][0]['site_id']);
                this.dataChange('shop_id', selectedSite[0]['value']);
            }
        }
    }

    dataChange(field, value){
        this.setState({ [field] : value}, () => {
            if(field === 'shop_id') {
                this.getPolicies();
            }});
    }

    render() {
        let { columns, rows, selectedRows, selectedTab, tabs, site_id, connected_sites, shop_id } = this.state;
        let siteName = getSiteName(site_id);
        return (
            <Page titleMetadata={siteName===''? getBadgePolaris('Please choose a site', "attention"):getBadgePolaris(siteName, "success")} title={'Policies'} fullWidth={true}
                  primaryAction={{content:select("", connected_sites, this.changeSite.bind(this, 'shop_id'), shop_id, "Choose site"), plain: true}}
                  secondaryActions={[
                      {
                          content: 'Refresh policies',
                          accessibilityLabel: 'Refresh eBay policies',
                          icon : RefreshMajorMonotone,
                          onAction: this.getPolicies.bind(this, true),
                      }
                  ]}
                  actionGroups={[
                      {
                          title: 'Add policies',
                          icon: AddMajorMonotone,
                          actions: [
                              {
                                  content: 'Payment', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect(`/panel/ebay/policy/handler?type=payment&site_id=${site_id}`)
                                  }
                              },
                              {
                                  content: 'Return', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect(`/panel/ebay/policy/handler?type=return&site_id=${site_id}`)
                                  }
                              },
                              {
                                  content: 'Shipping', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect(`/panel/ebay/policy/handler?type=shipping&site_id=${site_id}`)
                                  }
                              }
                          ],
                      }
                  ]}
            >
                <Grid
                    tag={'Policy(s)'}
                    columns={columns}
                    rows={rows}
                    showTabs={true}
                    tabs={tabs}
                    selectedTab={selectedTab}
                    tabSelected={this.tabSelected.bind(this)}
                    getGridApi={this.getGridApi.bind(this)}
                    suppressSizeToFit={true}
                    suppressMovableColumns={true}
                    suppressRowClickSelection={true}
                    enableCellTextSelection={true}
                    rowSelection={"multiple"}
                    selectedRows={selectedRows}
                    cellClickedEvent={this.cellClickedEvent.bind(this)}
                />
            </Page>
        );
    }
}

export default Ebaypolicieslist;