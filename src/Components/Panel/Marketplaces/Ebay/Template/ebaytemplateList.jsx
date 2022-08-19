import React, {Component} from 'react';
import {
    extractValuesfromRequest,
    filterCondition, getTypeoftabs,
    gridPropColumns,
    pageSizeOptionTemplate,
    templatetabs
} from "./ebaytemplatlisthelper";
import {Page} from "@shopify/polaris";
import {AddMajorMonotone} from "@shopify/polaris-icons";
import {deleteTemplate, getTemplates} from "../../../../../Apirequest/ebayApirequest/templatesApi";
import Grid from "../../../../../Subcomponents/Aggrid/grid";
import {attachCountTabTitle} from "../Policies/ebaypolicyhelper";
import {notify} from "../../../../../services/notify";
import {prepareChoiceoption} from "../../../../../Subcomponents/Aggrid/gridHelper";
import {filterOptions} from "../Products/ebayproducthelper";

let gridApi = '';
class EbaytemplateList extends Component {
    constructor(props) {
        super(props);
        this.state={
            columns: gridPropColumns(this.incellElement.bind(this)),
            tabs: templatetabs,
            selectedTab:0,
            rows: [],
            all_rows:[],
            paginationProps:{
                pageSizeOptions:pageSizeOptionTemplate,
                activePage:1,
                pageSize: pageSizeOptionTemplate[0],
                pages: 0, totalrecords: 0
            },
            filtersProps :{ attributeoptions : [], filters:[] , filterCondition: filterCondition},
        }
    }

    componentDidMount() {
        this.getTemplates()
        this.prepareFilters();
    }

    prepareFilters(){
        let {  filtersProps } = this.state;
        filtersProps['attributeoptions'] = [...prepareChoiceoption(filterOptions, 'headerName', "field")];
        this.setState({filtersProps});
    }


    getGridApi(api){
        gridApi = api;
    }

    async incellElement(field, data){
        switch (field) {
            case 'edit':
                let { id, type } = data;
                this.redirect(`/panel/ebay/templates/handler?type=${type}&id=${id}`);
                break;
            case 'delete':
                let { id: templateid } = data;
                let { success, message } = await deleteTemplate( templateid );
                if(success) {
                    notify.success( message );
                    await this.getTemplates();
                }
                else notify.error( message );
                break;
            default:
                break;
        }
    }

    cellClickedEvent(colDef, data){
    }

    async getTemplates(){
        let { tabs, selectedTab } = this.state;
        this.toggleOverLay(true);
        let templates = await getTemplates({marketplace: 'ebay', multitype:['category','price','inventory','title']});
        let {success , data} = templates;
        if(success){
            let rows = await extractValuesfromRequest(data);
            tabs = [...attachCountTabTitle(tabs, 'all',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'category',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'title',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'price',  rows)];
            tabs = [...attachCountTabTitle(tabs, 'inventory',  rows)];
            this.setState({
                all_rows: rows,
                rows, selectedTab: selectedTab, tabs
            },() => {
                this.filterTabProducts();
                this.toggleOverLay(false);
            });
        }else {
            this.toggleOverLay(false);
        }
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

    tabSelected(tabs){
        this.setState({ selectedTab : tabs }, ()=>{
            this.filterTabProducts();
        });
    }

    toggleOverLay(showhide){
        if(gridApi!=='') {
            if (showhide) gridApi.showLoadingOverlay();
            else gridApi.hideOverlay();
        }
    }

    redirect(url){
        this.props.history.push(url);
    }

    render() {
        let { columns, rows, selectedTab, tabs } = this.state;
        return (
            <Page fullWidth title={'Templates'}
                  actionGroups={[
                      {
                          title: 'Add templates',
                          icon: AddMajorMonotone,
                          actions: [
                              {
                                  content: 'Category', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect('/panel/ebay/templates/handler?type=category')
                                  }
                              },
                              {
                                  content: 'Inventory', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect('/panel/ebay/templates/handler?type=inventory')
                                  }
                              },
                              {
                                  content: 'Pricing', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect('/panel/ebay/templates/handler?type=price')
                                  }
                              },
                              {
                                  content: 'Title', icon: AddMajorMonotone, onAction: ()=>{
                                      this.redirect('/panel/ebay/templates/handler?type=title')
                                  }
                              },
                          ],
                      }
                  ]}
            >
                <Grid
                    tag={'Template(s)'}
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
                    cellClickedEvent={this.cellClickedEvent.bind(this)}
                />
            </Page>
        );
    }
}

export default EbaytemplateList;