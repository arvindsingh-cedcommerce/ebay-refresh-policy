import {
  Banner,
  Card,
  Layout,
  Stack,
  Icon,
  TextField,
  Button,
  Collapsible,
  Spinner,
  DataTable,
  Select,
} from "@shopify/polaris";
import {
  CircleTickOutlineMinor,
  MarketingMajorFilled,
  MobileCancelMajorMonotone,
} from "@shopify/polaris-icons";
import React from "react";

function textField(
  label,
  value,
  onChange,
  placeholder = "",
  helptext = "",
  error = false,
  type = "text",
  prefix = "",
  suffix = "",
  maxLength = false,
  disabled = false,
  showCharacterCount = false,
  min = "",
  readOnly = false,
  requiredIndicator = false
) {
  return (
    <TextField
      label={label}
      value={value ? value.toString() : ""}
      onChange={onChange}
      type={type}
      helpText={helptext}
      error={error}
      placeholder={placeholder}
      prefix={prefix}
      maxLength={maxLength ? maxLength : undefined}
      disabled={disabled}
      suffix={suffix}
      showCharacterCount={showCharacterCount}
      min={min}
      readOnly={readOnly}
      requiredIndicator={requiredIndicator}
    />
  );
}

function select(
  label = "",
  options = [],
  onChange,
  value,
  placeholder = "Please Select",
  error = false,
  labelInline = false,
  disabled = false,
  helpText = false,
  requiredIndicator = false
) {
  // console.log(label, options, onChange, value, placeholder = 'Please Select', error, labelInline , disabled , helpText, requiredIndicator)
  return (
    <Select
      label={label}
      options={[{ label: "Please Select", value: "" }, ...options]} //
      onChange={onChange}
      labelInline={labelInline}
      helpText={helpText}
      value={value}
      error={error}
      disabled={disabled}
      requiredIndicator={requiredIndicator}
    />
  );
}

function bannerPolaris(
  title = "",
  message = "",
  status = "warning",
  icon = MarketingMajorFilled,
  action = false,
  onDismiss
) {
  return (
    <Banner
      title={title}
      status={status}
      icon={icon}
      action={action}
      onDismiss={onDismiss}
    >
      {message}
    </Banner>
  );
}

function textFieldwithConnectedComponent(
  label,
  value,
  onChange,
  placeholder = "",
  prefix = "",
  connectedComponent,
  suffix = "",
  disabled = false,
  type = "text",
  helpText = "",
  connectedRight = false
) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      prefix={prefix}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      helpText={helpText}
      connectedLeft={connectedComponent}
      connectedRight={connectedRight}
    />
  );
}

function button(
  label,
  onClick,
  submit = false,
  loading = false,
  primary = true,
  size = "medium",
  disabled = false,
  destructive = false,
  icon = false,
  plain = false,
  outline = false,
  removeUnderline = false
) {
  return (
    <Button
      children={label}
      onClick={onClick}
      submit={submit}
      primary={primary}
      size={size}
      loading={loading}
      disabled={disabled}
      destructive={destructive}
      icon={icon}
      plain={plain}
      outline={outline}
      removeUnderline={removeUnderline}
    />
  );
}

function spinner(
  size = "small",
  color = "teal",
  accessibilityLabel = "Spinner example"
) {
  return (
    <span style={{ fontSize: 16 }}>
      {accessibilityLabel}
      <Spinner
        accessibilityLabel={accessibilityLabel}
        size={size}
        color={color}
      />
    </span>
  );
}

function renderQueryStructureRow(
  queryObj,
  orIndex,
  andIndex,
  queryStructureSelectionChange,
  deleteQueryStructure,
  filterAttributes,
  queryOr,
  errors
) {
  let { filter_products } = errors;
  let {
    productsFiltered: { productsCount },
    queryArray,
  } = filter_products;
  let {
    attribute: error_attribute,
    condition: error_condition,
    value: error_value,
  } = queryArray;

  let { attribute, condition, value } = queryObj;
  let hasOptions = [];
  let filterConditionsforQueryTemp = filterConditionsforQuery.map((data) => {
    let { disable_for } = data;
    if (disable_for && Array.isArray(disable_for) && disable_for.length) {
      return { ...data, disabled: disable_for.indexOf(attribute) > -1 };
    }
    return { ...data, disabled: false };
  });
  if (attribute !== "") {
    let getattribute = filterAttributes.filter(
      (attributeOption) =>
        attributeOption.value === attribute &&
        attributeOption.choices !== "false"
    );
    if (getattribute.length) hasOptions = [...getattribute[0]["choices"]];
  }
  return (
    <Stack
      key={`${orIndex}-${andIndex}`}
      vertical={false}
      distribution={"fillEvenly"}
    >
      {select(
        "",
        filterAttributes,
        queryStructureSelectionChange.bind(
          this,
          "attribute",
          orIndex,
          andIndex
        ),
        attribute,
        "Select attribute...",
        attribute === "",
        false,
        false,
        "*required"
      )}

      {select(
        "",
        filterConditionsforQueryTemp,
        queryStructureSelectionChange.bind(
          this,
          "condition",
          orIndex,
          andIndex
        ),
        condition,
        "Select condition...",
        condition === "",
        false,
        hasOptions.length,
        "*required"
      )}

      {attribute == "brand" && (
        <Select
          defaultValue={{ label: "Select value", value: "" }}
          onChange={queryStructureSelectionChange.bind(
            this,
            "value",
            orIndex,
            andIndex
          )}
          options={hasOptions}
          disabled={false}
          value={{ label: value, value: value }}
        ></Select>
      )}
      {attribute != "brand" &&
        hasOptions.length &&
        select(
          "",
          hasOptions,
          queryStructureSelectionChange.bind(this, "value", orIndex, andIndex),
          value,
          "Select value"
        )}
      {!hasOptions.length &&
        textField(
          "",
          value,
          queryStructureSelectionChange.bind(this, "value", orIndex, andIndex),
          "Fill in value...",
          "*required",
          value === ""
        )}
      {queryOr.length > 1 &&
        button(
          "Remove",
          deleteQueryStructure.bind(this, orIndex, andIndex),
          false,
          false,
          false,
          "medium",
          false,
          true,
          MobileCancelMajorMonotone
        )}
    </Stack>
  );
}

const filterConditionsforQuery = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Contains", value: "%LIKE%", disable_for: ["price", "quantity"] },
  {
    label: "Does Not Contains",
    value: "!%LIKE%",
    disable_for: ["price", "quantity"],
  },
  {
    label: "Greater Than",
    value: ">",
    disable_for: [
      "title",
      "tags",
      "short_description",
      "vendor",
      "product_type",
      "sku",
    ],
  },
  {
    label: "Less Than",
    value: "<",
    disable_for: [
      "title",
      "tags",
      "short_description",
      "vendor",
      "product_type",
      "sku",
    ],
  },
  {
    label: "Greater Than Equal To",
    value: ">=",
    disable_for: [
      "title",
      "tags",
      "short_description",
      "vendor",
      "product_type",
      "sku",
    ],
  },
  {
    label: "Less Than Equal To",
    value: "<=",
    disable_for: [
      "title",
      "tags",
      "short_description",
      "vendor",
      "product_type",
      "sku",
    ],
  },
];

const pageSizeOptionFeeds = [25, 50, 75];

const loaders = {
  save: false,
  edit_close_loader: false,
  loading_more_products: false,
  testQuery: false,
  connect_loader: false,
  primary_category: false,
  sub_category: false,
  browser_node_id: false,
  fetching_attributes: false,
  inventory_settings_loader: true,
  pricing_settings_loader: true,
  product_settings_loader: true,
};

const errors = {
  max_inventory_level: false,
  template_name: false,
  amazon_seller_id: false,
  category_settings: {
    primary_category: false,
    sub_category: false,
    browser_node_id: false,
    attributes_mapping: {
      required_attribute: [],
      optional_attribute: [],
    },
  },
  filter_products: {
    prepareQuery: {
      query: false,
    },
    queryArray: {
      attribute: false,
      condition: false,
      value: false,
    },
    productsFiltered: {
      productsCount: false,
    },
  },
  inventory_settings: {
    settings_enabled: false,
    settings_selected: {
      fixed_inventory: false,
      threshold_inventory: false,
      delete_out_of_stock: false,
      customize_inventory: false,
      inventory_fulfillment_latency: false,
      warehouses_settings: false,
    },
    fixed_inventory: false,
    threshold_inventory: false,
    customize_inventory: {
      attribute: "default",
      value: "",
    },
    warehouses_settings: false,
    inventory_fulfillment_latency: "",
  },
  pricing_settings: {
    settings_enabled: false,
    settings_selected: {
      sale_price: false,
      business_price: false,
      minimum_price: false,
    },
    standard_price: {
      attribute: "default",
      value: "",
    },
    sale_price: {
      attribute: "default",
      value: "",
      start_date: false,
      end_date: false,
    },
    business_price: {
      attribute: "default",
      value: "",
    },
    minimum_price: {
      attribute: "default",
      value: "",
    },
  },
  // product_settings: {
  //     settings_enabled: false,
  //     enable_syncing: false,
  //     selected_attributes: []
  // },
  // currency_settings: {
  //     settings_enabled: true,
  //     amazon_currency: '',
  // },
};

const AmazonFilterProductsTab = () => {
  const filter_products = {
    prepareQuery: {
      query: "",
      querySentence: "",
      // queryArray: [],
      queryArray: [[{ attribute: "", condition: "", value: "" }]],
    },
    productsFiltered: {
      productsCount: false,
      rows: [],
      already_profiled_count: false,
      override_template: false,
      totalcount: 0,
    },
    query_saved: "",
    query_edited: false,
    view_queried_product: false,
  };
  const helper_options = {
    grid_helper: {
      rows: [],
      columnTypes: ["text", "text", "text", "text"],
      columns: ["Image", "Title", "Brand", "Product type"],
      // columns : gridPropColumns(()=>{}),
    //   onPaginationChange: this.onPaginationChange.bind(this),
    },
    paginationProps: {
      pageSizeOptions: pageSizeOptionFeeds,
      activePage: 1,
      pageSize: pageSizeOptionFeeds[0],
      pages: 0,
      totalrecords: 0,
    },
    category_settings: {
      functionsUsed: {
        // onChangeAttributes: this.onChangeAttributes.bind(this),
        // handleRemove: this.handleRemove.bind(this),
        // addAttribute: this.addAttribute.bind(this),
        // onResetCategory: this.resetCategory.bind(this),
        // autocompleteHandler: this.autocompleteHandler.bind(this),
      },
      primary_categories: [],
      sub_categories: [],
      browser_node_ids: [],
      amazon_options: [],
      shopify_options: [],
      amazon_attribute_max_occurence: {},
      recommendation_mapping: {},
      required_attribute_present: false,
      optional_attribute_present: false,
    },
    shopify_warehouses: [
      {
        label: "Warehouse 1",
        value: "warehouse_1",
        helpText:
          "3/460, Opp to Nehru Enclave, Vishwas Khand, Lucknow, Uttar Pradesh 226010",
      },
      {
        label: "Warehouse 2",
        value: "warehouse_2",
        helpText:
          "77/178, King Road Near Tedi Pulia, Lucknow, Uttar Pradesh 226010",
      },
    ],
    amazon_seller_ids: [],
    filterAttributes: [],
    filter_product_functions: {
    //   addCondition: this.addCondition.bind(this),
    //   runQuery: this.runQuery.bind(this),
      queryStructureSelectionChange:
        this.queryStructureSelectionChange.bind(this),
      deleteQueryStructure: this.deleteQueryStructure.bind(this),
      removeTestQueryErrorBannner: this.removeTestQueryErrorBannner.bind(this),
      filterAtleastOneProductBanner:
        this.filterAtleastOneProductBanner.bind(this),
    },
  };
  function filterProductsStructure(
    filter_products = {},
    helper_options = {},
    loaders,
    errors,
    default_template_flag,
    show_products_assigned_banner = false,
    onChange,
    newTemplateFlag = false,
    template_clone = false
  ) {
    let { productsFiltered, prepareQuery } = filter_products;
    let { testQuery, edit_close_loader, loading_more_products } = loaders;
    let {
      filterAttributes,
      filter_product_functions,
      grid_helper,
      paginationProps,
    } = helper_options;
    let { rows, columnTypes, columns, onPaginationChange } = grid_helper;
    let {
      deleteQueryStructure,
      queryStructureSelectionChange,
      addCondition,
      runQuery,
      removeTestQueryErrorBannner,
      filterAtleastOneProductBanner,
    } = filter_product_functions;

    // productsFiltered.productsCount = 0;

    function prepareQueryConditions(
      prepareQuery,
      addCondition,
      deleteQueryStructure,
      queryStructureSelectionChange,
      filterAttributes,
      errors
    ) {
      let { queryArray } = prepareQuery;
      let queryStructure = [];
      queryArray.forEach((queryOr, orIndex) => {
        let andConditions = [];
        queryOr.forEach((queryAnd, andIndex) => {
          andConditions = [
            ...andConditions,
            <Card.Section key={`${andIndex}-or-condition`}>
              {renderQueryStructureRow(
                queryAnd,
                orIndex,
                andIndex,
                queryStructureSelectionChange,
                deleteQueryStructure,
                filterAttributes,
                queryOr,
                errors
              )}
            </Card.Section>,
          ];
        });
        queryStructure = [
          ...queryStructure,
          <Card
            key={`Orcondition-${orIndex}`}
            actions={[
              {
                content: "Add More",
                onAction: addCondition.bind(this, "and", orIndex),
              },
              {
                content: "Remove",
                onAction: deleteQueryStructure.bind(this, orIndex, false),
                destructive: true,
              },
            ]}
          >
            {andConditions}
          </Card>,
        ];
      });
      return queryStructure;
    }

    return (
      <>
        <Layout.AnnotatedSection
          title={
            <>
              Filter Products <span style={{ color: "red" }}>*</span>
            </>
          }
          description={
            "Create rules to filter, group and assign Shopify Products to this newly created Template."
          }
        >
          <Card>
            <Card.Section>
              <Stack distribution={"fill"}>
                {bannerPolaris(
                  "How to filter products for product template",
                  <ul>
                    {/* <li><Stack alignment={"leading"} spacing={"extraTight"} vertical={false}><p>First you need to add a group of conditions by clicking on the button below.</p>{prepareQuery.queryArray.length !== 0 && <Icon source={CircleTickOutlineMinor} />}</Stack></li> */}
                    <li>
                      <Stack
                        alignment={"leading"}
                        spacing={"extraTight"}
                        vertical={false}
                      >
                        <p>
                          Add filters and form the query for filtering products.
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
                          Then click on Test query for executing and fetching
                          the filtered products.
                        </p>
                        {productsFiltered.productsCount && (
                          <Icon source={CircleTickOutlineMinor} />
                        )}
                      </Stack>
                    </li>
                  </ul>,
                  "info",
                  MarketingMajorFilled,
                  false
                  // prepareQuery.queryArray.length === 0?{ content : 'Add group', onAction : addCondition.bind(this, 'or')}:false
                )}

                {bannerPolaris(
                  "Add Group",
                  "Add Group corresponds to || (OR) condition . i.e. If any one group condition is true then results will be shown based on applied filters",
                  "info",
                  ""
                )}
                {bannerPolaris(
                  "Add More",
                  "Add More corresponds to && (AND) condition. i.e. If all the conditions within that one group are true then results will be shown based on applied filters",
                  "info",
                  ""
                )}
                {!newTemplateFlag &&
                  !template_clone &&
                  productsFiltered.productsCount !== false &&
                  productsFiltered.productsCount !== 0 &&
                  !filter_products.query_edited &&
                  bannerPolaris(
                    "",
                    show_products_assigned_banner
                      ? `Total ${productsFiltered.productsCount} product(s) are assigned under this template`
                      : `Total ${productsFiltered.productsCount} product(s) are filtered under applied condition`,
                    "warning",
                    MarketingMajorFilled,
                    false
                  )}
                {!newTemplateFlag &&
                  !template_clone &&
                  textFieldwithConnectedComponent(
                    "",
                    filter_products.prepareQuery.querySentence,
                    () => {},
                    "",
                    false,
                    false,
                    true,
                    true,
                    "text",
                    "",
                    button(
                      "Edit",
                      () => {
                        onChange(
                          "filter_products",
                          "query_edited",
                          false,
                          !filter_products.query_edited
                        );
                        onChange(
                          "filter_products",
                          "query_saved",
                          false,
                          filter_products.prepareQuery.querySentence
                        );
                      },
                      false,
                      edit_close_loader,
                      !filter_products.query_edited,
                      "medium",
                      filter_products.prepareQuery.querySentence !==
                        filter_products.query_saved,
                      false,
                      false,
                      true
                    )
                  )}
              </Stack>
            </Card.Section>
            {(newTemplateFlag || template_clone) && (
              <React.Fragment>
                {errors.filter_products.prepareQuery.query && (
                  <Card.Section>
                    {bannerPolaris(
                      "",
                      default_template_flag
                        ? "Some required fields are empty, please fill them before proceeding."
                        : "Please generate a valid query.",
                      "critical",
                      MarketingMajorFilled,
                      false,
                      removeTestQueryErrorBannner.bind(this)
                    )}
                  </Card.Section>
                )}

                {prepareQuery.querySentence !== "" && (
                  <Card.Section title={"Filter Query"}>
                    {bannerPolaris("", prepareQuery.querySentence, "info")}
                  </Card.Section>
                )}
                {
                  // prepareQuery.queryArray.length !== 0 &&
                  <Card.Section
                    title={"Group products by applying filters"}
                    actions={[
                      {
                        content: "Add Group",
                        onAction: addCondition.bind(this, "or"),
                      },
                    ]}
                  >
                    <Stack vertical={true} spacing={"loose"}>
                      {prepareQueryConditions(
                        prepareQuery,
                        addCondition.bind(this),
                        deleteQueryStructure.bind(this),
                        queryStructureSelectionChange.bind(this),
                        filterAttributes,
                        errors
                      )}
                      <Stack vertical={false}>
                        {prepareQuery.querySentence !== "" &&
                          // button("Test query", runQuery.bind(this, true), false, testQuery)
                          button(
                            "Test Query",
                            runQuery.bind(this, false, true),
                            false,
                            testQuery
                          )}
                        {/* {rows.length > 0 &&
                              button(
                                "View Products",
                                onChange.bind(
                                  this,
                                  "filter_products",
                                  "view_queried_product",
                                  false,
                                  !filter_products.view_queried_product
                                )
                              )} */}
                      </Stack>
                      {productsFiltered.productsCount &&
                        bannerPolaris(
                          "",
                          show_products_assigned_banner
                            ? `Total ${
                                productsFiltered.override_template
                                  ? productsFiltered.productsCount
                                  : productsFiltered.productsCount -
                                    (productsFiltered.already_profiled_count ??
                                      0)
                              } product(s) are assigned under this template`
                            : `Total ${
                                productsFiltered.override_template
                                  ? productsFiltered.productsCount
                                  : productsFiltered.productsCount -
                                    (productsFiltered.already_profiled_count ??
                                      0)
                              } product(s) are filtered under applied condition`,
                          "warning",
                          MarketingMajorFilled,
                          false
                        )}

                      {/* {console.log(
                            errors.filter_products.productsFiltered.productsCount,
                            prepareQuery.queryArray,
                            productsFiltered.productsCount
                          )} */}
                      {errors.filter_products.productsFiltered.productsCount &&
                        prepareQuery.queryArray.length !== 0 &&
                        productsFiltered.productsCount == 0 &&
                        bannerPolaris(
                          "",
                          "The query must filter atleast one product(s).",
                          "critical",
                          MarketingMajorFilled,
                          false
                          // filterAtleastOneProductBanner.bind(this)
                        )}
                    </Stack>
                  </Card.Section>
                }
                {prepareQuery.queryArray.length === 0 && (
                  <Card.Section>
                    {bannerPolaris(
                      "",
                      "Please apply at least one condition by adding group",
                      "critical",
                      MarketingMajorFilled,
                      false
                    )}
                  </Card.Section>
                )}
              </React.Fragment>
            )}
            {!newTemplateFlag && !template_clone && (
              <Collapsible
                open={filter_products.query_edited}
                id="basic-collapsible-abc"
                transition={{
                  duration: "500ms",
                  timingFunction: "ease-in-out",
                }}
                expandOnPrint
              >
                {errors.filter_products.prepareQuery.query && (
                  <Card.Section>
                    {bannerPolaris(
                      "",
                      default_template_flag
                        ? "Some required fields are empty, please fill them before proceeding."
                        : "Please generate a valid query.",
                      "critical",
                      MarketingMajorFilled,
                      false,
                      removeTestQueryErrorBannner.bind(this)
                    )}
                  </Card.Section>
                )}

                {prepareQuery.querySentence !== "" && (
                  <Card.Section title={"Filter Query"}>
                    {bannerPolaris("", prepareQuery.querySentence, "info")}
                  </Card.Section>
                )}
                {
                  // prepareQuery.queryArray.length !== 0 &&
                  <Card.Section
                    title={"Group products by applying filters"}
                    actions={[
                      {
                        content: "Add Group",
                        onAction: addCondition.bind(this, "or"),
                      },
                    ]}
                  >
                    <Stack vertical={true} spacing={"loose"}>
                      {prepareQueryConditions(
                        prepareQuery,
                        addCondition.bind(this),
                        deleteQueryStructure.bind(this),
                        queryStructureSelectionChange.bind(this),
                        filterAttributes,
                        errors
                      )}
                      <Stack vertical={false}>
                        {prepareQuery.querySentence !== "" &&
                          // button("Test query", runQuery.bind(this, true), false, testQuery)
                          button(
                            "Test Query",
                            runQuery.bind(this, false),
                            false,
                            testQuery
                          )}
                        {/* {rows.length > 0 &&
                              button(
                                "View Products",
                                onChange.bind(
                                  this,
                                  "filter_products",
                                  "view_queried_product",
                                  false,
                                  !filter_products.view_queried_product
                                )
                              )} */}
                      </Stack>
                      {productsFiltered.productsCount &&
                        bannerPolaris(
                          "",
                          show_products_assigned_banner
                            ? `Total ${
                                productsFiltered.override_template
                                  ? productsFiltered.productsCount
                                  : productsFiltered.productsCount -
                                    (productsFiltered.already_profiled_count ??
                                      0)
                              } product(s) are assigned under this template`
                            : `Total ${
                                productsFiltered.override_template
                                  ? productsFiltered.productsCount
                                  : productsFiltered.productsCount -
                                    (productsFiltered.already_profiled_count ??
                                      0)
                              } product(s) are filtered under applied condition`,
                          "warning",
                          MarketingMajorFilled,
                          false
                        )}
                      {/* {console.log(
                            errors.filter_products.productsFiltered.productsCount,
                            prepareQuery.queryArray,
                            productsFiltered.productsCount
                          )} */}
                      {errors.filter_products.productsFiltered.productsCount &&
                        prepareQuery.queryArray.length !== 0 &&
                        productsFiltered.productsCount == 0 &&
                        bannerPolaris(
                          "",
                          "The query must filter atleast one product(s).",
                          "critical",
                          MarketingMajorFilled,
                          false
                          // filterAtleastOneProductBanner.bind(this)
                        )}
                    </Stack>
                  </Card.Section>
                }
                {prepareQuery.queryArray.length === 0 && (
                  <Card.Section>
                    {bannerPolaris(
                      "",
                      "Please apply at least one condition by adding group",
                      "critical",
                      MarketingMajorFilled,
                      false
                    )}
                  </Card.Section>
                )}
              </Collapsible>
            )}
          </Card>
        </Layout.AnnotatedSection>
        <Layout.Section>
          <Collapsible
            open={filter_products.view_queried_product}
            id="basic-collapsible-abc-filtered-products"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <Card title={"Products"}>
              <Card.Header>
                {loading_more_products &&
                  spinner("small", "teal", "Loading products...")}
                {/* <PaginationComponent
                  hidePageSize={true}
                  paginationProps={paginationProps}
                  paginationChanged={onPaginationChange}
                /> */}
              </Card.Header>
              <DataTable
                columnContentTypes={columnTypes}
                headings={columns}
                rows={rows}
              />
            </Card>
          </Collapsible>
        </Layout.Section>
      </>
    );
  }
  const onDatachange = async (
    type,
    field,
    subfield = false,
    submasterfield = false,
    value
  ) => {
    // if (typeof value == 'object' && Object.keys(value).length == 2 && Object.keys(value).includes('label') && Object.keys(value).includes('value')) {
    //   value = value.value
    //   //////console.log("object", value)
    // }

    // if()

    let { data, autocomplete_settings, errors } = this.state;

    if (
      type === "settings" &&
      field === "inventory_settings" &&
      submasterfield === "max_inventory_level"
    ) {
      errors.max_inventory_level = false;
    }

    if (subfield === "query_edited" && !value) {
      // this.loaderHandler("edit_close_loader", true);
      // let products_enclosed_query = await this.runQuery();
      // this.loaderHandler("edit_close_loader", false);
      // if (products_enclosed_query === 0) return true;
    }
    // //////console.log(type, field, subfield, submasterfield, value)
    // //////console.log(data,"data")
    if (field === "inventory_settings") {
      // //////console.log('reached');
      errors.inventory_settings.fixed_inventory = false;
    }

    if (subfield === "primary_category" && value == "") {
      let data = this.state.errors;
      errors.category_settings.primary_category = true;
      this.setState({ errors: data });
    }

    if (subfield === "primary_category" && value != "") {
      let data = this.state.errors;
      errors.category_settings.primary_category = false;
      this.setState({ errors: data });
    }

    if (subfield === "sub_category" && value == "") {
      let data = this.state.errors;
      errors.category_settings.sub_category = true;
      this.setState({ errors: data });
    }

    if (subfield === "sub_category" && value != "") {
      let data = this.state.errors;
      errors.category_settings.sub_category = false;
      this.setState({ errors: data });
    }

    if (subfield === "browser_node_id" && value == "") {
      let data = this.state.errors;
      errors.category_settings.browser_node_id = true;
      this.setState({ errors: data });
    }

    if (subfield === "browser_node_id" && value != "") {
      let data = this.state.errors;
      errors.category_settings.browser_node_id = false;
      this.setState({ errors: data });
    }

    if (subfield === "customize_inventory") {
      value = value
        .toString()
        .replace(/[\sa-zA-Z-!$%^&*()@_+|~=`\\#{}\[\]:";'<>?,.\/]/gi, "");
      errors.inventory_settings.customize_inventory.value = false;
    }
    if (submasterfield === "fixed_inventory")
      errors.inventory_settings.fixed_inventory = false;

    if (subfield === "standard_price") {
      //
      errors.pricing_settings.standard_price.value = false;
      errors.pricing_settings.standard_price.attribute = false; //
    }

    if (subfield === "sale_price") {
      errors.pricing_settings.sale_price.value = false;
      errors.pricing_settings.sale_price.attribute = false; //
    }
    if (field === "template_name") errors.template_name = false;

    if (subfield === "business_price") {
      errors.pricing_settings.business_price.value = false;
      errors.pricing_settings.business_price.attribute = false; //
    }
    if (subfield === "minimum_price") {
      errors.pricing_settings.minimum_price.value = false;
      errors.pricing_settings.minimum_price.attribute = false; //
    }
    if (
      subfield === "inventory_fulfillment_latency" ||
      subfield === "customize_inventory"
    ) {
      value = value
        .toString()
        .replace(/[\sa-zA-Z-!$%^&*()@_+|~=`\\#{}\[\]:";'<>?,.\/]/gi, "");
    }
    if (
      (!subfield && submasterfield == "fixed_inventory") ||
      subfield === "threshold_inventory"
    ) {
      value = value
        .toString()
        .replace(/[\sa-zA-Z-!$%^&*()@_+|~=`\\#{}\[\]:";'<>?,.\/]/gi, "");
    }
    if (subfield === "browser_node_id") {
      // autocomplete_settings.category_search = autocomplete_settings.categoryfilteredoptions.length === 0 && '';
      // autocomplete_settings.category_selected = '';
      // autocomplete_settings.category_search = '';
    }
    if (submasterfield === "start_date") {
      data[type][field][subfield]["end_date"] = "";
    }
    if (!submasterfield) {
      if (subfield) {
        if (subfield === "warehouses_settings") {
          if (value.length === 1) {
            data["settings"]["helper_options"]["shopify_warehouses"].forEach(
              (warehouse) => {
                if (warehouse.value === value[0]) {
                  warehouse.disabled = true;
                }
              }
            );
          } else if (value.length > 1) {
            data["settings"]["helper_options"]["shopify_warehouses"].forEach(
              (warehouse) => {
                warehouse.disabled = false;
              }
            );
          }
        }
        data[type][field][subfield] = value;
      } else data[type][field] = value;
    } else {
      if (subfield) {
        data[type][field][subfield][submasterfield] = value;
        if (submasterfield === "attribute") {
          data[type][field][subfield]["value"] = value;
        }
      } else data[type][field][submasterfield] = value;
    }
    this.setState({ data, errors }, () => {
      let field_to_send = "";
      if (field === "amazon_seller_id" && !subfield) {
        field_to_send = "primary_category";
      } else if (
        field === "category_settings" &&
        subfield === "primary_category"
      ) {
        field_to_send = "sub_category";
      } else if (field === "category_settings" && subfield === "sub_category") {
        field_to_send = "browser_node_id";
      } else if (
        field === "category_settings" &&
        subfield === "browser_node_id"
      ) {
        field_to_send = "attributes";
      }
      if (field_to_send !== "" && value !== "") {
        this.resetCategory(field_to_send);
        this.hitApiondataSelection(field_to_send);
      }
    });
  };
  return filterProductsStructure(
    filter_products,
    helper_options,
    loaders,
    errors,
    false,
    false,
    onDatachange,
    false,
    false
  );
};

export default AmazonFilterProductsTab;
