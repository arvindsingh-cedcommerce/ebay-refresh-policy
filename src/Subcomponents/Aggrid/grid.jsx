import React, {Component} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import PaginationComponent from "./paginationComponent";
import {Button, Stack, Tabs, ThemeProvider, Tooltip} from "@shopify/polaris";
import _ from 'lodash';
import {showingGridRange} from "./showgridrange";
import Actionbar from "./actionbar";
import FilterComponent from "./filterComponent";
import {FilterMajorMonotone} from "@shopify/polaris-icons";

class Grid extends Component {

    constructor(props){
        super(props);
        this.state = {
            filterCollapsible: false
        }
    }

    markNodeSelected(event, selectedRows){
        if(event){
            event.api.forEachNode((node) => {
                selectedRows.forEach( data => {
                    if(_.isEqual(data, node.data)) {
                        node.setSelected(_.isEqual(data, node.data));
                    }
                })});
        }
    }

    sendSelectedRows(isSelected, data){
        let { rowSelected, selectedRows } = this.props;
        if(selectedRows) {
            selectedRows.slice(0);
            if (isSelected) {
                if ((selectedRows.filter(row => _.isEqual(row, data))).length === 0) selectedRows.push(data);
            } else selectedRows = (selectedRows.filter(row =>  !_.isEqual(row, data))).slice(0);
            if(rowSelected) rowSelected(selectedRows);
        }
    }

    getRowHeights( rowHeight = 100 ){
        return rowHeight;
    }

    render() {
        let { filterCollapsible } = this.state;
        let { columns, rows, tag, suppressRowClickSelection, selectedRows, selectedTab, suppressSizeToFit,suppressMovableColumns, enableCellTextSelection, rowSelection, paginationProps, getGridApi, onpaginationChange,  cellClickedEvent, rowClickedEvent, onSelectAction, selectedActions, showFilters,  filterData, filtersProps, tabs, tabSelected, showTabs, customRowHeight  } = this.props;
        if (!selectedRows) selectedRows =[];
        return (
            <div>
                {showTabs &&
                <React.Fragment>
                    <Tabs tabs={tabs} selected={selectedTab} onSelect={tabSelected.bind(this)}/>
                    <br/>
                </React.Fragment>
                }
                <Stack vertical={false} distribution={"equalSpacing"}>
                    {selectedActions && selectedActions.length>0 && selectedRows.length>0 &&
                        <Actionbar label={`Selected ${selectedRows.length} ${tag}`} onSelectAction={onSelectAction} selectedActions={selectedActions}/>
                    }
                    {paginationProps &&
                    <p style={{paddingTop: 5, fontWeight: 'bold'}}>{showingGridRange(paginationProps, tag)}</p>
                    }
                    <Stack.Item>
                        <Stack vertical={false}>
                    {paginationProps &&
                    <Stack vertical={false}>
                        <PaginationComponent paginationProps={paginationProps} paginationChanged={onpaginationChange}/>
                    </Stack>
                    }
                    {showFilters &&
                    <Tooltip content="Filters">
                        <Button
                            plain={true}
                            icon={FilterMajorMonotone}
                            disclosure={!filterCollapsible ? "down" : "up"}
                            onClick={() => {
                                this.setState({filterCollapsible: !filterCollapsible});
                            }}
                            ariaExpanded={filterCollapsible}
                            ariaControls="filter-collapsible"
                        />
                    </Tooltip>
                    }
                        </Stack>
                    </Stack.Item>
                </Stack>

                { showFilters &&
                <React.Fragment>
                    <FilterComponent filtersProps={filtersProps} filterData={filterData}
                                     filterCollapsible={filterCollapsible}/>
                </React.Fragment>
                }
                <ThemeProvider theme={{colorScheme:"light"}}>
                <div
                    className="ag-theme-alpine"
                    style={{height: '500px', overflowX: 'scroll'}}
                >
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rows}
                        getRowHeight={customRowHeight ? this.getRowHeights.bind(this, customRowHeight): false}
                        suppressRowClickSelection={suppressRowClickSelection}
                        suppressMovableColumns={suppressMovableColumns}
                        enableCellTextSelection ={enableCellTextSelection}
                        rowSelection={rowSelection}
                        onGridReady={ params =>
                        {
                            this.gridApi = params.api;
                            getGridApi(params.api);
                            if(suppressSizeToFit) {
                                this.gridApi.sizeColumnsToFit();
                            }
                        }}
                        onRowSelected={(event) =>{
                            this.sendSelectedRows(event.node.isSelected(), event.data);
                        }}
                        onRowClicked={(event) =>{
                            if(rowClickedEvent) rowClickedEvent(event.data);
                        }}
                        onCellClicked={(event => {
                            if(cellClickedEvent) cellClickedEvent( event.colDef ,event.data)
                        } )}
                        onRowDataChanged={(event) => {
                            this.markNodeSelected(event,selectedRows);
                        }}
                    >

                    </AgGridReact>
                </div>
                </ThemeProvider>


            </div>

        );
    }
}

export default Grid;