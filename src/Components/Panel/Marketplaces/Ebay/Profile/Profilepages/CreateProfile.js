import React, { Component } from "react";
import { Card, Icon, Page, Spinner, Stack } from "@shopify/polaris";
import {
  button,
  choiceList,
  select,
  textField,
} from "../../../../../../PolarisComponents/InputGroups";
import {
  getpaginationInfo,
  parseQueryString,
} from "../../../../../../services/helperFunction";
import { notify } from "../../../../../../services/notify";
import { getTemplates } from "../../../../../../Apirequest/ebayApirequest/templatesApi";
import {
  createProfileColumns,
  ebayoptionsObj,
  ebaysettingsObj,
  extractPoliciesType,
  extractTemplatesType,
  pageSizeOptionProfile,
  preparemultiaccountProfileStrucuture,
  prepareQueryandSentence,
  prepareQueryConditions,
  queryBuilderObj,
} from "../ProfileHelper";
import _ from "lodash";
import { getPolicies } from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import {
  getFilterAttributes,
  getProductsbyquery,
  getProfilebyId,
  saveProfile,
} from "../../../../../../Apirequest/ebayApirequest/profileApi";
import { bannerPolaris } from "../../../../../../PolarisComponents/InfoGroups";
import { extractValuesfromRequest } from "../../Products/ebayproducthelper";
import Grid from "../../../../../../Subcomponents/Aggrid/grid";
import {
  CircleTickOutlineMinor,
  MarketingMajorMonotone,
} from "@shopify/polaris-icons";
import {
  gridPropColumns,
  prepareShopifywarehouseOptions,
} from "./ebayprofilepageHelper";
import { getMarketplaceConnectedAccount } from "../../Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { modalPolaris } from "../../../../../../PolarisComponents/ModalGroups";
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
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../../../Subcomponents/Aggrid/paginationComponent";
import { showingGridRange } from "../../../../../../Subcomponents/Aggrid/showgridrange";
const Noimage = require("../../../../../../assets/notfound.png");

let gridApi = "";

class Createprofile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      accounts: [],
      shopify_warehouses: [],
      matching_profiles: [],
      columns: gridPropColumns(),
      selectedAccountOption: "",
      settings: {}, // { site_id : {business_policy :{ shipping : '', return : '', payment: '' } , templates: { title: '', inventory: '', category : '', price : ''  }, shopify_warehouse : [] } }
      prepared_options: {}, // { site_id : { business_policy: { shipping : [], return : [], payment: [] }, templates: { title: [], inventory: [], category : [], price : [] } } }
      shopify_warehouses_selected: [],
      prepareQuery: {
        query: "",
        querySentence: "",
        queryArray: [],
      },
      productsFiltered: {
        productsCount: false,
        rows: [],
      },
      antRows: [],
      templates: {
        title: [],
        inventory: [],
        category: [],
        price: [],
      },
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

  modalHandler(open, data) {
    let { modal, matching_profiles } = this.state;
    modal = { ...modal, open, data };
    if (!open) matching_profiles = [];
    this.setState({ modal, matching_profiles });
  }

  componentDidMount() {
    this.getAllSites();
    this.getFilterAttributes();
    this.getTemplates();
    this.getParams();
  }

  async getParams() {
    let { id } = parseQueryString(this.props.location.search);
    if (id) {
      let { success, data } = await getProfilebyId(id);
      if (success) {
        let { prepareQuery, target, name } = data;
        target = target.hasOwnProperty("ebay")
          ? { ...target["ebay"] }
          : {};
        Object.keys(target).map((siteId) => {
          this.onAccountSelection("accounts", siteId);
          return true;
        });
        this.setState({ id, prepareQuery: prepareQuery, settings: target, name }, () => {
          this.runQuery();
        });
      }
    }
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

  async getAllSites() {
    let { success: successAccountFetch, data: accountdata } =
      await getConnectedAccounts();
    let data = [];
    if (successAccountFetch) {
      data = [...accountdata];
      let accounts = await getMarketplaceConnectedAccount(
        "ebay",
        ["user_id"],
        data
      );
      let shopify_warehouses = await getMarketplaceConnectedAccount(
        "shopify",
        [],
        data
      );
      this.setState({ accounts, shopify_warehouses });
    }
  }

  async getTemplates() {
    let { templates: templatesOption } = this.state;
    let templates = await getTemplates({
      multitype: ["category", "price", "inventory", "title"],
      marketplace: "ebay",
      site_id: '85',
      shop_id: '0',
    });
    let { success, data } = templates;
    if (success)
      this.setState({
        templates: _.merge(templatesOption, extractTemplatesType(data)),
      });
  }

  fieldsChange(field, value) {
    this.setState({ [field]: value });
  }

  async onAccountSelection(field, value) {
    this.toggleLoaders("fetchPolicy", true);
    let { settings, accounts } = this.state;
    let selectedSite = accounts.filter((account) => account.value === value);
    if (selectedSite.length) {
      let siteID = selectedSite[0]["warehouses"][0]["site_id"];
      if (value && Object.keys(settings).indexOf(value) === -1) {
        let policyRequest = await getPolicies({
          multitype: ["shipping", "payment", "return"],
          site_id: siteID,
          shop_id: value,
        });
        let { success, data } = policyRequest;
        if (success) {
          let policyOptions = extractPoliciesType(data);
          await this.prepareAccountsProfileData(value, policyOptions, siteID);
        }
      } else notify.warn("Account has already been selected");
      this.toggleLoaders("fetchPolicy", false);
    }
  }

  prepareAccountsProfileData(shop_id, policyOptions, siteID) {
    let { settings, prepared_options, templates } = this.state;
    if (!settings.hasOwnProperty(shop_id)) {
      settings = {
        ...settings,
        [shop_id]: {
          business_policy: { ...ebaysettingsObj.business_policy },
          templates: { ...ebaysettingsObj.templates },
          shopify_warehouse: [],
          site_id: siteID
        },
      };
    }
    prepared_options = {
      ...prepared_options,
      [shop_id]: {
        business_policy: {
          ...ebayoptionsObj.business_policy,
          ...policyOptions,
        },
        templates,
      },
    };
    this.setState({ settings, prepared_options }, () => {
      return true;
    });
  }

  dropdownChange(shop_id, templateType, type, value) {
    let { settings } = this.state;
    if (type) settings[shop_id][templateType][type] = value;
    else settings[shop_id][templateType] = value;
    this.setState({ settings });
  }

  deleteSiteProfileSettings(shop_id) {
    let { settings, prepared_options } = this.state;
    delete settings[shop_id];
    delete prepared_options[shop_id];
    this.setState({ settings, prepared_options });
  }

  redirect(url) {
    this.props.history.push(url);
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
    });
  }

  addCondition(conditionType, index = false) {
    let { prepareQuery } = this.state;
    let { queryArray } = prepareQuery;
    if (conditionType === "or")
      queryArray = [...queryArray, [{ ...queryBuilderObj }]];
    else queryArray[index] = [...queryArray[index], { ...queryBuilderObj }];
    prepareQuery.queryArray = [...queryArray];
    this.setState({ prepareQuery });
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
    });
  }

  toggleOverLay(showhide) {
    if (gridApi !== "") {
      if (showhide) gridApi.showLoadingOverlay();
      else gridApi.hideOverlay();
    }
  }

  prepareSentenceandQuery() {
    let { prepareQuery, filterAttributes } = this.state;
    this.setState({
      prepareQuery: {
        ...prepareQueryandSentence(prepareQuery, filterAttributes),
      },
    });
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
      productsFiltered.productsCount = data ? data.toString() : "0";
      let paginationInformation = getpaginationInfo(data, count);
      let extractRowData = extractValuesfromRequest(rows);
      console.log("extractRowData", extractRowData);
      if (extractRowData.length) {
        // let tempArr = [];
        extractRowData.forEach((rowData) => {
          let tempObj = {};
          tempObj["image"] = rowData["image"] ? (
            <Image preview={false} width={50} src={rowData["image"]} />
          ) : (
            <Image preview={false} width={50} src={Noimage} />
          );
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
    this.setState({ productsFiltered, paginationProps, antRows }, () => {
      console.log("first", this.state.antRows);
    });
    this.toggleOverLay(false);
    this.toggleLoaders("renderProducts", false);
    this.toggleLoaders("testQuery", false);
  }

  onPaginationChange(paginationProps) {
    this.setState({ paginationProps }, () => {
      this.runQuery();
    });
  }

  getGridApi(api) {
    gridApi = api;
  }

  async saveProfile() {
    let { name, prepareQuery, settings, id } = this.state;
    console.log(settings);
    let temp = {}
    for(const country in settings) {
      console.log(settings[country]);
      temp[country] = {'data': {}}
      if(settings[country].hasOwnProperty('business_policy')) {
        for(const key in settings[country]['business_policy']) {
          temp[country]['data'][`${key}_policy`] = settings[country]['business_policy'][key]
        }
      }
      if(settings[country].hasOwnProperty('templates')) {
        for(const key in settings[country]['templates']) {
          temp[country]['data'][`${key}_template`] = settings[country]['templates'][key]
        }
      }
      if(settings[country].hasOwnProperty('shopify_warehouse')) {
        temp[country]['data']['warehouse_setting'] = []
        settings[country]['shopify_warehouse'].forEach(warehouse => {
          temp[country]['data']['warehouse_setting'].push(warehouse)
        })
      }
      if(settings[country].hasOwnProperty('site_id')) {
        temp[country]['site_id'] = settings[country]['site_id']
      }
    }
    console.log(temp);
    let profileData = {
      saveInTable: true,
      // data: { name, prepareQuery, data: temp, marketplace: "ebay" },
      name, prepareQuery, data: temp
    };

    if (id !== "") profileData.data["profile_id"] = id;
    this.toggleLoaders("saveProfile", true);
    let { success, message, code, matching_profiles } = await saveProfile(
      profileData
    );
    if (success) {
      notify.success(message);
      // this.redirect.bind(this,'/panel/ebay/profiles')
      this.props.history.push('/panel/ebay/profilesUS');
    }
    else {
      if (code && code === "duplicate_query") {
        this.setState({ matching_profiles }, () => {
          this.modalHandler(true, []);
        });
      } else notify.error(message);
    }
    this.toggleLoaders("saveProfile", false);
  }

  getModalStructure() {
    let temparr = [];
    let { matching_profiles } = this.state;
    matching_profiles.forEach((profile) => {
      temparr = [
        ...temparr,
        <p>
          <b>{profile.name}</b>
        </p>,
      ];
    });
    return (
      <Stack vertical={true} distribution={"fillEvenly"} spacing={"loose"}>
        {/* {
                bannerPolaris("", <p><b>The query used already exists in below listed profiles, Kindly add/modify the details in the profile listed below.</b></p>)
            } */}
        <Alert
          message=""
          description={
            <p>
              <b>
                The query used already exists in below listed profiles, Kindly
                add/modify the details in the profile listed below.
              </b>
            </p>
          }
          type="info"
          showIcon
        />

        <Card>
          <Card.Section>{temparr}</Card.Section>
        </Card>
      </Stack>
    );
  }

  render() {
    let {
      id,
      name,
      errors,
      prepared_options,
      accounts,
      settings,
      selectedAccountOption,
      prepareQuery,
      productsFiltered,
      paginationProps,
      columns,
      loaders,
      filterAttributes,
      shopify_warehouses,
      modal,
    } = this.state;
    let { open: modalOpen } = modal;
    let modalStructure = modalOpen ? this.getModalStructure() : [];
    shopify_warehouses = [
      ...prepareShopifywarehouseOptions(shopify_warehouses),
    ];
    let { testQuery, renderProducts, saveProfile, fetchPolicy } = loaders;
    let { rows } = productsFiltered;
    let { name: nameErrors } = errors;
    return (
      // <Page fullWidth title={id === '' ? "Create profile":"View profile"}
      //       breadcrumbs={[{content: 'Profiles', onAction:this.redirect.bind(this,'/panel/ebay/profiles')}]}
      //       primaryAction={{content: 'Save', loading: saveProfile, onAction: this.saveProfile.bind(this)}}
      // >
      <PageHeader
        className="site-page-header-responsive"
        title={id === "" ? "Create profile" : "View profile"}
        ghost={true}
        onBack={() => this.props.history.push("/panel/ebay/profilesUS")}
        extra={[<AntButton type="primary" onClick={this.saveProfile.bind(this)} loading={saveProfile}>Save</AntButton>]}
      >
        <AntCard>
          {/* <Card.Section> */}
          {textField(
            "Name",
            name,
            this.fieldsChange.bind(this, "name"),
            "",
            "",
            nameErrors
          )}
          {/* </Card.Section> */}
          <Divider />
          {Object.keys(settings).length === 0 && (
            // <Card.Section>
            <>
              {/* {
                            bannerPolaris("How to add accounts to profile",
                                <ul>
                                    <li>Select Account below ( you can add multiple accounts ) and add them for which you want to create the profile.</li>
                                    <li>Select settings (Business policy & templates) for the site.</li>
                                </ul>
                                , "info")
                        } */}

              <Alert
                message="How to add accounts to profile"
                description={
                  <ul>
                    <li>
                      Select Account below ( you can add multiple accounts ) and
                      add them for which you want to create the profile.
                    </li>
                    <li>
                      Select settings (Business policy & templates) for the
                      site.
                    </li>
                  </ul>
                }
                type="info"
                showIcon
              />
              {/* </Card.Section> */}
              <Divider />
            </>
          )}
          {/* <Card.Section> */}
          <Stack vertical={false} alignment="center">
            <Stack.Item fill>
              {select(
                "",
                accounts,
                this.fieldsChange.bind(this, "selectedAccountOption"),
                selectedAccountOption,
                "Select to add account..."
              )}
            </Stack.Item>
            {/* {
                                button("Add account", this.onAccountSelection.bind(this,'accounts', selectedAccountOption), false, fetchPolicy, true, 'medium', selectedAccountOption === '')
                            } */}
            <AntButton
              type={"primary"}
              size="middle"
              disabled={selectedAccountOption === ""}
              onClick={this.onAccountSelection.bind(
                this,
                "accounts",
                selectedAccountOption
              )}
              loading={fetchPolicy}
            >
              Add account
            </AntButton>
          </Stack>
          {/* </Card.Section> */}
          <Divider />
          {
            fetchPolicy && (
              // <Card.Section>
              <>
                <Stack vertical={false} distribution={"center"}>
                  <p style={{ fontWeight: "bold", marginTop: 10 }}>
                    Fetching site settings...
                  </p>
                  <Spinner />
                </Stack>
                <Divider />
              </>
            )
            // {/* </Card.Section> */}
          }
          {Object.keys(prepared_options).length > 0 &&
            preparemultiaccountProfileStrucuture(
              settings,
              prepared_options,
              this.dropdownChange.bind(this),
              this.deleteSiteProfileSettings.bind(this),
              accounts,
              "ebay",
              shopify_warehouses
            )}
          {/* <Card.Section> */}
          <Divider />
          {/* {
                            bannerPolaris("How to filter products for profile",
                                <ul>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>First you need to add group of condition by clicking on button below.</p>{prepareQuery.queryArray.length !== 0 && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>Second you need to add conditions and form the query for filtering products.</p>{prepareQuery.querySentence !== '' && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                    <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>Then click on Test query for executing and fetching the filtered products.</p>{ productsFiltered.productsCount && <Icon source={CircleTickOutlineMinor}/>}</Stack></li>
                                </ul>
                                , "info", MarketingMajorMonotone, prepareQuery.queryArray.length === 0?{ content : 'Add group', onAction : this.addCondition.bind(this, 'or')}:false)
                        } */}
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
          {/* </Card.Section> */}
          {/* <Divider /> */}
          {prepareQuery.querySentence !== "" && (
            // <Card.Section title={"Filter conditions"}>
            <>
              <Divider orientation="left">Filter conditions</Divider>
              {/* {
                                bannerPolaris("", prepareQuery.querySentence, "info")
                            } */}
              <Alert
                message=""
                description={prepareQuery.querySentence}
                type="info"
                showIcon
              />
              {/* </Card.Section> */}
            </>
          )}
          {
            prepareQuery.queryArray.length !== 0 && (
              // <Card.Section title={"Group products by applying conditions"} actions={[
              //     {content: 'Add group', onAction: this.addCondition.bind(this, 'or')}
              // ]}>
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
                    // button("Test query", this.runQuery.bind(this), false, testQuery)
                    <AntButton
                      type="primary"
                      loading={testQuery}
                      onClick={this.runQuery.bind(this)}
                    >
                      Test Query
                    </AntButton>
                  )}
                  {productsFiltered.productsCount && (
                    // bannerPolaris("", `Total ${productsFiltered.productsCount} product(s) are filtered under applied condition`)
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
            // </Card.Section>
          }
          {
            renderProducts && (
              // <Card.Section>
              <Stack vertical={false} distribution={"center"}>
                <p style={{ fontWeight: "bold", marginTop: 10 }}>
                  Preparing recieved data...
                </p>
                <Spinner />
              </Stack>
            )
            // {/* </Card.Section> */}
          }
          {rows && rows.length !== 0 && (
            // <Card.Section title={"Products"}>
            <>
              <Divider>Products</Divider>
              {/* <Grid
                            tag={'Product(s)'}
                            columns={columns}
                            rows={rows}
                            getGridApi={this.getGridApi.bind(this)}
                            paginationProps={paginationProps}
                            onpaginationChange={this.onPaginationChange.bind(this)}
                            suppressSizeToFit={true}
                            suppressMovableColumns={true}
                            suppressRowClickSelection={true}
                            enableCellTextSelection={true}
                        /> */}
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
                // dataSource={templatestTabObject[templateName]}
                dataSource={this.state.antRows}
                scroll={{ x: 1000 }}
                bordered={true}
                pagination={false}
                // loading={
                // //   templateName === "All" &&
                // //   templatestTabObject[templateName].length === 0
                // //     ? true
                // //     : false
                // }
                size={"small"}
              />
              {/* </Card.Section> */}
            </>
          )}
        </AntCard>
        {modalPolaris(
          "Duplicate query found",
          modalOpen,
          this.modalHandler.bind(this, false, []),
          false,
          modalStructure
        )}
      </PageHeader>
      // </Page>
    );
  }
}

export default Createprofile;
