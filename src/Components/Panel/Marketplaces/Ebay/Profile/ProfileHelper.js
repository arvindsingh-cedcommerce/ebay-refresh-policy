import { Card, Icon, Stack, Tooltip } from "@shopify/polaris";
import React from "react";
import {
  button,
  choiceList,
  select,
  textField,
} from "../../../../../PolarisComponents/InputGroups";
import {
  DeleteMajorMonotone,
  EditMajorMonotone,
  MobileCancelMajorMonotone,
} from "@shopify/polaris-icons";
import { getSiteName } from "../../../Accounts/accountsHelper";
import { getMarketplaceCodefromId } from "../Template/TemplateBody/TemplateHelpers/categorytemplateHelper";
import { Card as AntCard, Divider, Col, Row, Button as AntButton } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export const ebaysettingsObj = {
  business_policy: { shipping: "", return: "", payment: "" },
  templates: { title: "", inventory: "", category: "", price: "" },
  shopify_warehouse: [],
};
export const ebayoptionsObj = {
  business_policy: { shipping: [], return: [], payment: [] },
  templates: { title: [], inventory: [], category: [], price: [] },
};

export function extractTemplatesType(templates = []) {
  let templatesObj = {};
  templates.forEach((template) => {
    let { type, _id, title } = template;
    if (templatesObj.hasOwnProperty(type))
      templatesObj[type] = [
        ...templatesObj[type],
        { label: title, value: _id.toString() },
      ];
    else
      templatesObj = {
        ...templatesObj,
        [type]: [{ label: title, value: _id.toString() }],
      };
  });
  return { ...templatesObj };
}

export function extractPoliciesType(policies = []) {
  let policiesObj = {};
  let uniqueProfileId = [];
  policies.forEach((policy) => {
    let { type, data } = policy;
    if (type && data) {
      if (
        data.profileId &&
        uniqueProfileId.indexOf(data.profileId.toString()) === -1
      ) {
        if (policiesObj.hasOwnProperty(type))
          policiesObj[type] = [
            ...policiesObj[type],
            {
              // label: data.profileName,
              label: data.name,
              value: data.profileId.toString(),
            },
          ];
        else
          policiesObj = {
            ...policiesObj,
            [type]: [
              // { label: data.profileName, value: data.profileId.toString() },
              { label: data.name, value: data.profileId.toString() },
            ],
          };
        uniqueProfileId = [...uniqueProfileId, data.profileId.toString()];
      }
    }
  });
  return { ...policiesObj };
}

export const filterConditionsforQuery = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Contains", value: "%LIKE%" },
  { label: "Does Not Contains", value: "!%LIKE%" },
  { label: "Greater Than", value: ">" },
  { label: "Less Than", value: "<" },
  { label: "Greater Than Equal To", value: ">=" },
  { label: "Less Than Equal To", value: "<=" },
];

export const filterConditions = [
  { label: "equals", value: "1" },
  { label: "not equals", value: "2" },
  { label: "contains", value: "3" },
  { label: "does not contains", value: "4" },
  { label: "starts with", value: "5" },
  { label: "ends with", value: "6" },
];

export const pageSizeOptionProfile = [25, 50, 75];

export const queryBuilderObj = { attribute: "", condition: "", value: "" };

export function gridPropColumns(incellElement = () => {}) {
  return [
    {
      headerName: "Actions",
      field: "actions",
      autoHeight: true,
      width: 100,
      pinned: "right",
      cellRendererFramework: actionRenderer.bind(
        this,
        incellElement.bind(this)
      ),
    },
    {
      headerName: "Name",
      field: "name",
      autoHeight: true,
      width: 200,
      pinned: "left",
      /*headerCheckboxSelection:true,
        checkboxSelection: true,*/
    },
    {
      headerName: "Accounts connected",
      field: "accounts",
      resizable: true,
      cellStyle: { "white-space": "normal" },
      autoHeight: true,
      sortable: true,
    },
    {
      headerName: "Query",
      field: "query",
      resizable: true,
      cellStyle: { "white-space": "normal" },
      autoHeight: true,
      sortable: true,
    },
  ];
}

function actionRenderer(func, params) {
  let { data } = params;
  return (
    <Stack vertical={false} alignment={"center"} distribution={"fill"}>
      <div
        onClick={(e) => {
          func("edit", data);
          e.preventDefault();
        }}
      >
        <Tooltip content={"Edit"}>
          <Icon source={EditMajorMonotone} />
        </Tooltip>
      </div>
      <div
        onClick={(e) => {
          func("delete", data);
          e.preventDefault();
        }}
      >
        <Tooltip content={"Delete"}>
          <Icon source={DeleteMajorMonotone} />
        </Tooltip>
      </div>
    </Stack>
  );
}

export const filterOptions = [
  {
    headerName: "Name",
    field: "name",
  },
];

export function extractValuesfromRequest(rows = [], marketplace = "ebay") {
  let modifiedRows = [];
  rows.forEach((row) => {
    let ebayAccountconnected = 0;
    let { name, query, profile_id, settings } = row;
    if (settings && settings.hasOwnProperty(marketplace))
      ebayAccountconnected = Object.keys(settings[marketplace]).length;
    modifiedRows = [
      ...modifiedRows,
      {
        name,
        query: query.query,
        id: profile_id,
        profile_id: profile_id,
        accounts: `Ebay (${ebayAccountconnected})`,
      },
    ];
  });
  console.log("modifiedRows", modifiedRows);
  return modifiedRows;
}

export function preparemultiaccountProfileStrucuture(
  settings,
  prepared_options,
  dropdownChange,
  deleteSiteProfileSettings,
  accounts,
  marketplace = "ebay",
  shopify_warehouses = []
) {
  let finalStructure = [];
  Object.keys(settings).map((shopId) => {
    let preparedStrucutre = [];
    let { business_policy, templates, shopify_warehouse } = settings[shopId];
    let selectedSite = accounts.filter((account) => account.value === shopId);
    if (selectedSite.length && selectedSite[0].hasOwnProperty("warehouses")) {
      let {
        site_id: ebaySiteId,
        region: amazonRegion,
        seller_id: amazonSId,
        marketplace_id: amazonMarketplaceId,
      } = selectedSite[0]["warehouses"][0];
      let siteId =
        marketplace === "ebay"
          ? ebaySiteId
          : `${amazonRegion}-${amazonSId}-${
              amazonMarketplaceId
                ? getMarketplaceCodefromId(amazonMarketplaceId[0])
                : ""
            }`;
      if (prepared_options.hasOwnProperty(shopId)) {
        let { business_policy: policyOptions, templates: templateOptions } =
          prepared_options[shopId];
        let policyStructure = [];
        if (business_policy) {
          Object.keys(business_policy).map((policy) => {
            policyStructure = [
              ...policyStructure,
              <React.Fragment key={`${shopId}-${policy}`}>
                {select(
                  `${policy.toUpperCase()}`,
                  policyOptions[policy],
                  dropdownChange.bind(this, shopId, "business_policy", policy),
                  business_policy[policy]
                )}
              </React.Fragment>,
            ];
            return true;
          });
          preparedStrucutre = [
            ...preparedStrucutre,
            // <Card.Section title={"Business policy"} key={`${shopId}-policy`}>
            <>
              <Divider orientation="left">Business policy</Divider>
              <Stack vertical={false} distribution={"fillEvenly"}>
                {[...policyStructure]}
              </Stack>
            </>,
            // {/* </Card.Section>, */}
          ];
        }

        let templatesStructure = [];
        if (templates) {
          Object.keys(templates).map((template) => {
            templatesStructure = [
              ...templatesStructure,
              <React.Fragment key={`${shopId}-${template}`}>
                {select(
                  `${template.toUpperCase()}`,
                  templateOptions[template],
                  dropdownChange.bind(this, shopId, "templates", template),
                  templates[template]
                )}
              </React.Fragment>,
            ];
            return true;
          });
          preparedStrucutre = [
            ...preparedStrucutre,
            // <Card.Section title={"Templates"} key={`${shopId}-templates`}>
            <>
              <Divider orientation="left">Templates</Divider>
              <Stack vertical={false} distribution={"fillEvenly"}>
                {[...templatesStructure]}
              </Stack>
            </>
            // </Card.Section>,
          ];
        }
        if (shopify_warehouses.length) {
          preparedStrucutre = [
            ...preparedStrucutre,
            // <Card.Section
            //   title={"Shopify warehouses"}
            //   key={`${shopId}-shopify-warehouse`}
            // >
            <>
              <Divider orientation="left">Shopify warehouses</Divider>
              {choiceList(
                "",
                shopify_warehouses,
                shopify_warehouse,
                dropdownChange.bind(this, shopId, "shopify_warehouse", false)
              )}
            </>
            // {/* </Card.Section>, */}
          ];
        }
      }
      let title = `${
        marketplace === "ebay"
          ? `${getSiteName(siteId)}-${
              selectedSite[0]["warehouses"][0]["user_id"]
            }`
          : siteId
      } profile settings`;
      finalStructure = [
        ...finalStructure,
        // <Card.Section
        //     title={`${marketplace === 'ebay' ? `${getSiteName(siteId)}-${selectedSite[0]["warehouses"][0]['user_id']}` : siteId} profile settings`}
        //     key={`${shopId}-settings`}
        //     actions={[{content: 'Delete', onAction: deleteSiteProfileSettings.bind(this, shopId)}]}
        // >
        <>
          <Divider>
            <b>{title}</b>
          </Divider>
          <Row justify="end">
            <Col>
            <AntButton onClick={deleteSiteProfileSettings.bind(this, shopId)} type="primary" danger>Delete</AntButton>
            </Col>
          </Row>
          {/* <Card> */}
          <AntCard>
              {preparedStrucutre}
              </AntCard>
          {/* </Card> */}
          {/* </Card.Section> */}
        </>,
      ];
      return true;
    }
  });
  return finalStructure;
}

export function renderQueryStructureRow(
  queryObj,
  orIndex,
  andIndex,
  queryStructureSelectionChange,
  deleteQueryStructure,
  filterAttributes
) {
  let { attribute, condition, value } = queryObj;
  let hasOptions = [];
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
        "Select attribute..."
      )}
      {select(
        "",
        filterConditionsforQuery,
        queryStructureSelectionChange.bind(
          this,
          "condition",
          orIndex,
          andIndex
        ),
        condition,
        "Select condition...",
        false,
        false,
        hasOptions.length
      )}
      {hasOptions.length &&
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
          "Fill in value..."
        )}
      {/* {button(
        "Remove",
        deleteQueryStructure.bind(this, orIndex, andIndex),
        false,
        false,
        false,
        "medium",
        false,
        true,
        MobileCancelMajorMonotone
      )} */}
      <AntButton onClick={deleteQueryStructure.bind(this, orIndex, andIndex)} danger={true} icon={<CloseOutlined />} type="primary">Remove</AntButton>
    </Stack>
  );
}

export function prepareQueryConditions(
  prepareQuery,
  addCondition,
  deleteQueryStructure,
  queryStructureSelectionChange,
  filterAttributes
) {
  let { queryArray } = prepareQuery;
  let queryStructure = [];
  queryArray.forEach((queryOr, orIndex) => {
    let andConditions = [];
    queryOr.forEach((queryAnd, andIndex) => {
      andConditions = [
        ...andConditions,
        // <Card.Section key={`${andIndex}-or-condition`}>
        <React.Fragment key={`${andIndex}-or-condition`}>
          {renderQueryStructureRow(
            queryAnd,
            orIndex,
            andIndex,
            queryStructureSelectionChange,
            deleteQueryStructure,
            filterAttributes
          )}
          <Divider />
        </React.Fragment>
        // {/* </Card.Section>, */}
      ];
    });
    queryStructure = [
      ...queryStructure,
      <AntCard size="small" key={`Orcondition-${orIndex}`}  
      extra={
      <Row justify="end" gutter={8}>
        <Col>
          <AntButton type="primary" onClick={ addCondition.bind(this, "and", orIndex)}>Add more</AntButton>
        </Col>
        <Col>
          <AntButton danger={true} type="primary" onClick={deleteQueryStructure.bind(this, orIndex, false)}>Remove</AntButton>
        </Col>
      </Row>
      } >
      {/* <Card
        key={`Orcondition-${orIndex}`}
        actions={[
          {
            content: "Add more",
            onAction: addCondition.bind(this, "and", orIndex),
          },
          {
            content: "Remove",
            onAction: deleteQueryStructure.bind(this, orIndex, false),
            destructive: true,
          },
        ]}
      > */}
        {andConditions}
        {/* </Card>, */}
      </AntCard>,
    ];
  });
  return queryStructure;
}

export function prepareQueryandSentence(prepareQuery, filterAttributes) {
  let { queryArray } = prepareQuery;
  let query = "";
  let querySentence = "";
  let andConditions = [];
  let andConditionsSentence = [];
  queryArray.forEach((queryArr) => {
    let orConditions = [];
    let orConditionsSentence = [];
    queryArr.forEach((queryObj) => {
      let { attribute, condition, value } = queryObj;
      if (Object.values(queryObj).indexOf("") === -1) {
        let conditionSelected = filterConditionsforQuery.filter(
          (filterConditionObj) => filterConditionObj.value === condition
        );
        let attributeSelected = filterAttributes.filter(
          (filterattributeObj) => filterattributeObj.value === attribute
        );
        orConditions = [...orConditions, `${attribute} ${condition} ${value}`];
        orConditionsSentence = [
          ...orConditionsSentence,
          `${attributeSelected.length ? attributeSelected[0]["label"] : ""} ${
            conditionSelected.length ? conditionSelected[0]["label"] : ""
          } ${value}`,
        ];
      }
    });
    if (orConditions.length) {
      andConditions = [...andConditions, `(${orConditions.join(" && ")})`];
      andConditionsSentence = [
        ...andConditionsSentence,
        `(${orConditionsSentence.join(" AND ")})`,
      ];
    }
  });
  if (andConditions.length) {
    query = andConditions.join(" || ");
    querySentence = andConditionsSentence.join(" OR ");
  }
  prepareQuery.query = query;
  prepareQuery.querySentence = querySentence;
  return { ...prepareQuery };
}

export const createProfileColumns = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "Product Details",
    dataIndex: "productDetails",
    key: "productDetails",
  },
  {
    title: "Other Details",
    dataIndex: "otherDetails",
    key: "otherDetails",
  },
];