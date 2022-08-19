import React, { Component } from 'react'
import {
  PageHeader,
  Card as AntCard,
  Divider,
  Col,
  Row,
  Button as AntButton,
  Alert,
  Image,
  Typography,
} from "antd";
import { Card, Icon, Page, Spinner, Stack } from "@shopify/polaris";
import {
  CircleTickOutlineMinor,
  MarketingMajorMonotone,
} from "@shopify/polaris-icons";
import NestedTableComponent from '../../../../../../../AntDesignComponents/NestedTableComponent';
import { gridPropColumns } from '../../ebayprofilepageHelper';
import { createProfileColumns, pageSizeOptionProfile, prepareQueryandSentence, prepareQueryConditions, queryBuilderObj } from '../../../ProfileHelper';
import { getpaginationInfo, parseQueryString } from '../../../../../../../../services/helperFunction';
import { getFilterAttributes, getProductsbyquery, getProfilebyId } from '../../../../../../../../Apirequest/ebayApirequest/profileApi';
import { notify } from '../../../../../../../../services/notify';
import { extractValuesfromRequest } from '../../../../Products/ebayproducthelper';
import { showingGridRange } from '../../../../../../../../Subcomponents/Aggrid/showgridrange';
import PaginationComponent from '../../../../../../../../Subcomponents/Aggrid/paginationComponent';
// const Noimage = require("/home/cedcoss/Desktop/phalcon-docker/app/amazon-ebay-multi/src/assets/notfound.png");
let gridApi = "";

export class FilterProductsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: gridPropColumns(),
      selectedAccountOption: "",
      prepareQuery: this.props.prepareQuery,

      productsFiltered: {
        productsCount: false,
        rows: [],
      },
      antRows: [],
      modal: {
        open: false,
        structure: [],
      },
      paginationProps: {
        pageSizeOptions: pageSizeOptionProfile,
        activePage: 1,
        pageSize: pageSizeOptionProfile[0],
        pages: 0,
        totalrecords: 0,
      },
      filterAttributes: [],
      errors: {
        name: false,
      },
      loaders: {
        testQuery: false,
        renderProducts: false,
        saveProfile: false,
        fetchPolicy: false,
      },
    };
  }

  componentDidMount() {
    this.getFilterAttributes();
    this.getParams();
  }
  
  async getParams() {
    let { id } = parseQueryString(this.props.propsPassed.location.search);
    if (id) {
      let { success, data } = await getProfilebyId(id);
      if (success) {
        let { prepareQuery } = data;
        this.setState({ prepareQuery }, () => {
          this.props.setPrepareQuery(prepareQuery)
          this.runQuery();
        });
      }
    }
  }

  toggleOverLay(showhide) {
    if (gridApi !== "") {
      if (showhide) gridApi.showLoadingOverlay();
      else gridApi.hideOverlay();
    }
  }

  toggleLoaders(loader, toggleValue) {
    let { loaders } = this.state;
    loaders[loader] = toggleValue;
    this.setState({ loaders });
  }

  async runQuery() {
    this.toggleOverLay(true);
    this.toggleLoaders("testQuery", true);
    this.toggleLoaders("renderProducts", true);
    let { prepareQuery, productsFiltered, paginationProps, antRows } =
      this.state;
    let { query } = prepareQuery;
    let { pageSize: count, activePage } = paginationProps;
    let { success, data, rows } = await getProductsbyquery({
      query,
      marketplace: "shopify",
      count,
      activePage,
    });
    if (!data)
      notify.warn(
        "No product(s) lie under the given conditions, Please try something different"
      );
    if (success) {
      this.props.setMinProductFlag(true)
      productsFiltered.productsCount = data ? data.toString() : "0";
      let paginationInformation = getpaginationInfo(data, count);
      let extractRowData = extractValuesfromRequest(rows);
      if (extractRowData.length) {
        // let tempArr = [];
        extractRowData.forEach((rowData) => {
          let tempObj = {};
          tempObj["image"] = rowData["image"] && (
            <Image preview={false} width={50} src={rowData["image"]} />
          ) 
          // : (
          //   <Image preview={false} width={50} src={Noimage} />
          // );
          tempObj["productDetails"] = (
            <Row>
              <Col span={24}>Title - {rowData["title"]}</Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  Vendor - {rowData["vendor"]}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  Product Types - {rowData["product_type"]}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  Tags - {rowData["tags"]}
                </Typography.Text>
              </Col>
            </Row>
          );
          tempObj["otherDetails"] = (
            <Row>
              <Col span={24}>Price - {rowData["price"]}</Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  SKU - {rowData["sku"]}
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Typography.Text type="secondary">
                  Attributes - {rowData["variant_attribute"]}
                </Typography.Text>
              </Col>
            </Row>
          );
          antRows = [...antRows, tempObj];
        });
      }
      paginationProps = { ...paginationProps, ...paginationInformation };
      productsFiltered.rows = [...extractRowData];
    }
    this.setState({ productsFiltered, paginationProps, antRows });
    this.toggleOverLay(false);
    this.toggleLoaders("renderProducts", false);
    this.toggleLoaders("testQuery", false);
  }

  async getFilterAttributes() {
    let { success, data } = await getFilterAttributes({
      marketplace: "shopify",
    });
    if (success) {
      let attributesArray = [];
      data.forEach((obj) => {
        let { title: label, code: value, options } = obj;
        attributesArray = [
          ...attributesArray,
          { label, value, choices: options ? options : "false" },
        ];
      });
      this.setState({ filterAttributes: [...attributesArray] }, () => {
        // console.log(this.state.filterAttributes);
      });
    }
  }

  addCondition(conditionType, index = false) {
    let { prepareQuery } = this.state;
    let { queryArray } = prepareQuery;
    if (conditionType === "or")
      queryArray = [...queryArray, [{ ...queryBuilderObj }]];
    else queryArray[index] = [...queryArray[index], { ...queryBuilderObj }];
    prepareQuery.queryArray = [...queryArray];
    this.setState({ prepareQuery }, () => {
      this.props.setPrepareQuery(prepareQuery)
    });
  }

  deleteQueryStructure(groupIndex, rowIndex = false) {
    let { prepareQuery } = this.state;
    let { queryArray } = prepareQuery;
    if (rowIndex || rowIndex === 0)
      queryArray[groupIndex] = [
        ...queryArray[groupIndex].filter((row, rowpos) => rowpos !== rowIndex),
      ];
    else
      queryArray = [
        ...queryArray.filter((group, grouppos) => grouppos !== groupIndex),
      ];
    prepareQuery.queryArray = [...queryArray];
    this.setState({ prepareQuery }, () => {
      this.prepareSentenceandQuery();
      this.props.setPrepareQuery(prepareQuery)
    });
  }


  prepareSentenceandQuery() {
    let { prepareQuery, filterAttributes } = this.state;
    this.setState({
      prepareQuery: {
        ...prepareQueryandSentence(prepareQuery, filterAttributes),
      },
    });
  }

  queryStructureSelectionChange(field, orIndex, andIndex, value) {
    let { prepareQuery, filterAttributes } = this.state;
    let { queryArray } = prepareQuery;
    queryArray[orIndex][andIndex][field] = value;

    if (field === "attribute") {
      let getattribute = filterAttributes.filter(
        (attributeOption) =>
          attributeOption.value === value && attributeOption.choices !== "false"
      );
      if (getattribute.length)
        queryArray[orIndex][andIndex]["condition"] = "==";
      else queryArray[orIndex][andIndex]["condition"] = "";
    }
    prepareQuery.queryArray = [...queryArray];
    this.setState({ prepareQuery }, () => {
      this.prepareSentenceandQuery();
      this.props.setPrepareQuery(prepareQuery)
    });
  }

  onPaginationChange(paginationProps) {
    this.setState({ paginationProps }, () => {
      this.runQuery();
    });
  }

  render() {
    let {
      errors,
      prepareQuery,
      productsFiltered,
      paginationProps,
      loaders,
      filterAttributes,
    } = this.state;
    let { testQuery, renderProducts, saveProfile, fetchPolicy } = loaders;
    let { rows } = productsFiltered;
    let { name: nameErrors } = errors;

    return (
      <>
        <Alert
          message="How to filter products for profile"
          description={
            <>
              <ul>
                <li>
                  <Stack
                    alignment={"leading"}
                    spacing={"extraTight"}
                    vertical={false}
                  >
                    <p>
                      First you need to add group of condition by clicking on
                      button below.
                    </p>
                    {prepareQuery.queryArray.length !== 0 && (
                      <Icon source={CircleTickOutlineMinor} />
                    )}
                  </Stack>
                </li>
                <li>
                  <Stack
                    alignment={"leading"}
                    spacing={"extraTight"}
                    vertical={false}
                  >
                    <p>
                      Second you need to add conditions and form the query for
                      filtering products.
                    </p>
                    {prepareQuery.querySentence !== "" && (
                      <Icon source={CircleTickOutlineMinor} />
                    )}
                  </Stack>
                </li>
                <li>
                  <Stack
                    alignment={"leading"}
                    spacing={"extraTight"}
                    vertical={false}
                  >
                    <p>
                      Then click on Test query for executing and fetching the
                      filtered products.
                    </p>
                    {productsFiltered.productsCount && (
                      <Icon source={CircleTickOutlineMinor} />
                    )}
                  </Stack>
                </li>
              </ul>
              {prepareQuery.queryArray.length === 0 ? (
                <AntButton onClick={this.addCondition.bind(this, "or")}>
                  Add group
                </AntButton>
              ) : (
                false
              )}
            </>
          }
          type="info"
          showIcon
        />
        {
          prepareQuery.querySentence !== "" && (
            <>
              <Divider orientation="left">Filter conditions</Divider>
              <Alert
                message=""
                description={prepareQuery.querySentence}
                type="info"
                showIcon
              />
            </>
          )
        }
        {
          prepareQuery.queryArray.length !== 0 && (
            <>
              <Divider />
              <Row justify="space-between" align="middle">
                <Col>Group products by applying conditions</Col>
                <Col>
                  <AntButton
                    type="primary"
                    onClick={this.addCondition.bind(this, "or")}
                  >
                    Add group
                  </AntButton>
                </Col>
              </Row>
              <Stack vertical={true} spacing={"loose"}>
                {prepareQueryConditions(
                  prepareQuery,
                  this.addCondition.bind(this),
                  this.deleteQueryStructure.bind(this),
                  this.queryStructureSelectionChange.bind(this),
                  filterAttributes
                )}
                {prepareQuery.querySentence !== "" && (
                  <AntButton
                    type="primary"
                    loading={testQuery}
                    onClick={this.runQuery.bind(this)}
                  >
                    Test Query
                  </AntButton>
                )}
                {productsFiltered.productsCount && (
                  <Alert
                    message=""
                    description={`Total ${productsFiltered.productsCount} product(s) are filtered under applied condition`}
                    type="info"
                    showIcon
                  />
                )}
              </Stack>
            </>
          )
        }
        {
          renderProducts && (
            <Stack vertical={false} distribution={"center"}>
              <p style={{ fontWeight: "bold", marginTop: 10 }}>
                Preparing recieved data...
              </p>
              <Spinner />
            </Stack>
          )
        }
        {
          rows && rows.length !== 0 && (
            <>
              <Divider>Products</Divider>
              <Row justify="space-between">
                <Col>
                  <p style={{ paddingTop: 5, fontWeight: "bold" }}>
                    {showingGridRange(paginationProps, "Profile(s)")}
                  </p>
                </Col>
                <Col>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <PaginationComponent
                        paginationProps={paginationProps}
                        paginationChanged={this.onPaginationChange.bind(this)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <NestedTableComponent
                columns={createProfileColumns}
                dataSource={this.state.antRows}
                scroll={{ x: 1000 }}
                bordered={true}
                pagination={false}
                size={"small"}
              />
            </>
          )
        }
      </>
    )
  }
}

export default FilterProductsTab