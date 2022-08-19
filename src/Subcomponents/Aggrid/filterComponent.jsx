import React, {Component} from 'react';
import {Card, Collapsible, Stack, Tag, TextContainer} from "@shopify/polaris";

import _ from "lodash";

import {select, textField} from "../../PolarisComponents/InputGroups";
import {bannerPolaris} from "../../PolarisComponents/InfoGroups";
import {getFilterSentence} from "./gridHelper";
import { Button, Col, Row } from 'antd';

class FilterComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            filters:[],
            attributeSelected:'',
            conditionSelected:'',
            valueApplied:'',
            errors:{
                attributeSelected:false,
                conditionSelected:false,
                valueApplied:false,
                similiarFilter: false
            },
            filterHasError:false
        }
    }

    handleFilterChanges(field, value){
        this.setState({[field]:value},() => {
           this.setDefaultCondition();
        });
    }

    setDefaultCondition(){
        let { attributeSelected } = this.state;
        let { filtersProps } = this.props;
        let {attributeoptions, filterCondition } = filtersProps;
        let getAttribute = attributeoptions.filter(attrib => attrib.value === attributeSelected);
        let extractConditionValue = '';
        if(getAttribute.length) {
            let getDefaultCondition = getAttribute[0]['default_condition'];
            if(getDefaultCondition !== ''){
                let getConditionValue = filterCondition.filter(filter => filter.label === getDefaultCondition);
                if(getConditionValue.length) {
                    extractConditionValue = getConditionValue[0]['value'];
                    this.setState({conditionSelected: extractConditionValue });
                }
            }
        }
    }

    filterHasError(existingFilters, appliedFilter) {
        let {errors} = this.state;
        Object.keys(this.state).map(key => {
            if(key in errors) errors[key] = this.state[key] === '';
            return true;
        });
        let similiarFilterExists = existingFilters.filter(filterObj => _.isEqual(filterObj, appliedFilter));
        errors = { ...errors, similiarFilter: similiarFilterExists.length>0};
        this.setState({errors, filterHasError: Object.values(errors).indexOf(true)>-1});
        return Object.values(errors).indexOf(true)>-1;
    }

    removeTags(index){
        let { filters:componentFilters } = this.state;
        componentFilters = componentFilters.filter((filterExisting, pos) => pos !== index);
        this.setState({ filters :  componentFilters} );
    }

    renderTags(filters,attributeoptions, filterCondition, onRemoveShow = true){
        let Tags = [];
        filters.forEach((filter, index) =>{
            if( onRemoveShow ) {
                Tags.push(<Tag key={`Tag-${index}`}
                               onRemove={() => this.removeTags(index)}>{getFilterSentence(filter, attributeoptions, filterCondition)}</Tag>);
            }else{
                Tags.push(<Tag key={`Tag-${index}`}>{getFilterSentence(filter, attributeoptions, filterCondition)}</Tag>);
            }
        });
        return Tags;
    }

    mergepreExistingfilters(componentFilter, appliedFilters){
        let createUniqueFilters = [];
        let filterExists = componentFilter.filter(Obj => Obj.attribute === appliedFilters.attribute);
        if(filterExists.length){
            componentFilter.forEach(Obj =>{
                if(Obj.attribute === appliedFilters.attribute){
                    createUniqueFilters.push(appliedFilters);
                }else{
                    createUniqueFilters.push(Obj)
                }
            })
        }else{
            createUniqueFilters = [...componentFilter];
            createUniqueFilters.push(appliedFilters);
        }
        return [...createUniqueFilters];
    }

    valueFilter(attributeSelected, attributeoptions, valueApplied, valueError){
        let choicesExists = attributeoptions.filter(attribute => attribute.value === attributeSelected);
        if(choicesExists.length && choicesExists[0]['choices'].length){
            return select('Value', choicesExists[0]['choices'], this.handleFilterChanges.bind(this,'valueApplied'),valueApplied,"Choose...", valueError)
        }else {
            return textField('Value', valueApplied, this.handleFilterChanges.bind(this, 'valueApplied'), "Choose...", "", valueError, "text")
        }
    }



    conditionFilter(attributeSelected, attributeoptions, filterCondition, conditionSelected, conditionError){
        let disabled = false;
        let getAttribute = attributeoptions.filter(attrib => attrib.value === attributeSelected);
        if(getAttribute.length) {
            let getDefaultCondition = getAttribute[0]['default_condition'];
            if(getDefaultCondition !== ''){
                let getConditionValue = filterCondition.filter(filter => filter.label === getDefaultCondition);
                if(getConditionValue.length)  disabled = true;
            }
        }
        return select('Condition', filterCondition, this.handleFilterChanges.bind(this,'conditionSelected'),conditionSelected, "Choose...",conditionError, false, disabled)
    }

    render() {
        let {  attributeSelected, conditionSelected, valueApplied, errors, filterHasError, filters:componentFilters} = this.state;
        let { filtersProps, filterData, filterCollapsible} = this.props;
        let {attributeoptions, filters, filterCondition } = filtersProps;
        let {attributeSelected: attributeError, conditionSelected:conditionError,  valueApplied: valueError, similiarFilter } =  errors;

        return (
            <React.Fragment>
                <Stack vertical={true} spacing={"loose"}>
                    <Collapsible
                        open={filterCollapsible}
                        id="filter-collapsible"
                        transition={{duration: '150ms', timingFunction: 'ease'}}
                    >
                        <Card title={"Filters"} actions={[
                            {content:'Reset all',onAction:()=> {
                                    this.setState({filters:[]});
                                }}
                        ]}
                            //   primaryFooterAction={{content:'Add Filter', onAction: ()=>{
                            //           let appliedFilter = {attribute:attributeSelected, condition:conditionSelected, value:valueApplied};
                            //           if(!this.filterHasError(componentFilters, appliedFilter)) {
                            //               let filtersMerged = this.mergepreExistingfilters(componentFilters, appliedFilter);
                            //               this.setState({filters:[...filtersMerged]});
                            //           }
                            //       }}}
                            //   secondaryFooterActions={[{content:'Apply filters', onAction: filterData.bind(this,componentFilters ), disabled: componentFilters.length === 0, primary:true }]}
                        >
                            {filterHasError &&
                            <Card.Section>
                                {
                                    bannerPolaris('Error', 'Filter values have errors','critical')
                                }
                                {similiarFilter &&
                                bannerPolaris('Please note', 'The filter you are trying to add is already applied','attention')
                                }
                            </Card.Section>
                            }
                            { componentFilters.length > 0 &&
                            <Card.Section>
                                <Stack vertical={true} spacing={"loose"}>
                                    <TextContainer>
                                        <b>Please note these added filters need to be applied for filtering results. For doing so kindly use Apply filters action</b>
                                    </TextContainer>
                                    <Stack vertical={false} spacing={"loose"}>
                                        {
                                            this.renderTags(componentFilters, attributeoptions, filterCondition)
                                        }
                                    </Stack>
                                </Stack>
                            </Card.Section>
                            }
                            <Card.Section>
                                <Stack vertical={false} distribution={"fillEvenly"}>
                                    {
                                        select('Field', attributeoptions, this.handleFilterChanges.bind(this,'attributeSelected'),attributeSelected,"Choose...", attributeError)
                                    }
                                    {
                                        this.conditionFilter(attributeSelected, attributeoptions,filterCondition, conditionSelected, conditionError)
                                    }
                                    {/*{*/}
                                    {/*    select('Condition', filterCondition, this.handleFilterChanges.bind(this,'conditionSelected'),conditionSelected, "Choose...",conditionError)*/}
                                    {/*}*/}
                                    {
                                        this.valueFilter(attributeSelected,attributeoptions, valueApplied,valueError)
                                    }
                                </Stack>
                                <Row justify='end' style={{marginTop: '10px'}} gutter={[16, 0]}>
                                    <Col>
                                        <Button type='primary' disabled={ componentFilters.length === 0 } 
                                        onClick={filterData.bind(this,componentFilters)}>Apply Filters</Button>
                                    </Col>
                                    <Col>
                                        <Button type='primary' onClick={()=>{
                                                    let appliedFilter = {attribute:attributeSelected, condition:conditionSelected, value:valueApplied};
                                                    if(!this.filterHasError(componentFilters, appliedFilter)) {
                                                        let filtersMerged = this.mergepreExistingfilters(componentFilters, appliedFilter);
                                                        this.setState({filters:[...filtersMerged]});
                                                    }
                                        }}>Add Filters</Button>
                                    </Col>
                                </Row>
                            </Card.Section>
                        </Card>
                        <br/>
                    </Collapsible>
                    {filters.length > 0 &&
                    <Card>
                        <Card.Section title={"Applied Filters"} actions={[{content:'Reset applied filters',onAction:filterData.bind(this, [])}]}>
                            {
                                this.renderTags(filters, attributeoptions, filterCondition, false)
                            }
                        </Card.Section>
                    </Card>
                    }
                </Stack>

            </React.Fragment>
        );
    }
}

export default FilterComponent;