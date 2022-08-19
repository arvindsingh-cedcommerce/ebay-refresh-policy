import { Alert, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../../../Apirequest/accountsApi";
import {
  getAttributesCategoryWise,
  getCategoriesAPI,
} from "../../../../../../../APIrequests/TemplatesAPI";
import { json } from "../../../../../../../globalConstant/static-json";
import {
  getAttributesURL,
  getCategoriesURL,
} from "../../../../../../../URLs/TemplateURLS";
import { getSiteID } from "../../../../../Accounts/NewAccount";
import { prepareChoiceoption } from "../../Helper/TemplateHelper";

const { Text, Title } = Typography;
const { Option } = Select;

export const getCountryName = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["label"];
};

export const getCountryAbbreviation = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["abbreviation"];
};

const CategoryTemplateComponent = () => {
  const [form] = Form.useForm();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  const [siteID, setSiteID] = useState("");
  const [shopId, setShopId] = useState("");
  const [categoryMappingOptions, setCategoryMappingOptions] = useState({});
  const [categoryMappingValues, setCategoryMappingValues] = useState({});

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempArr = ebayAccounts.map((account, key) => {
        let accountName = {
          label: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          shopId: account["id"],
        };
        return accountName;
      });

      setconnectedAccountsArray(tempArr);
    }
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  useEffect(() => {
    if (Object.keys(categoryMappingOptions).length) {
      // console.log("categoryMappingOptions", categoryMappingOptions);
    }
  }, [categoryMappingOptions]);

  const getAttribute = async (dataToPost) => {
    let {data, success} = await getAttributesCategoryWise(getAttributesURL, dataToPost);
    if(success) {
      console.log('data', data);
    }
  };

  const getCategory = async (dataToPost) => {
    let { success, data } = await getCategoriesAPI(
      getCategoriesURL,
      dataToPost
    );
    if (success) {
      if (data) {
        if (data.length) {
          let temp = categoryMappingOptions;
          temp[Object.keys(categoryMappingOptions).length + 1] = [
            ...prepareChoiceoption(data, "name", "marketplace_id"),
          ];
          setCategoryMappingOptions({ ...temp });
        } else if (data.length === 0) {
          let tempObj = {
            category_id: dataToPost['parent_category_id'],
            site_id: dataToPost["site_id"],
            shop_id: dataToPost["shop_id"],
          };
          getAttribute(tempObj);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      let { siteID, shopId } = getSiteID(
        selectedAccount,
        connectedAccountsArray
      );
      setSiteID(siteID);
      setShopId(shopId);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (siteID) {
      let dataToPost = {};
      dataToPost["level"] = 1;
      dataToPost["shop_id"] = shopId;
      dataToPost["site_id"] = siteID;
      getCategory(dataToPost);
    }
  }, [siteID]);

  useEffect(() => {
    if (Object.keys(categoryMappingValues).length) {
      Object.keys(categoryMappingOptions).map((categoryLevel) => {
        if (categoryMappingValues[categoryLevel]) {
          let dataToPost = {};
          dataToPost["parent_category_id"] =
            categoryMappingValues[categoryLevel];
          dataToPost["shop_id"] = shopId;
          dataToPost["site_id"] = siteID;
          getCategory(dataToPost);
        }
      });
    }
  }, [categoryMappingValues]);

  return (
    <Row>
      <Col span={24}>
        <Card title="Category Template" extra={<a href="#">More</a>}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Alert
                message={
                  <>
                    <Text strong>Category template</Text>
                    is used for assigning a category to your product along with
                    the <Text strong>
                      required and optional attributes
                    </Text>{" "}
                    which you commonly use for listing on eBay.
                  </>
                }
                type="info"
                showIcon
              />
            </Col>
            <Col span={24}>
              <Form
                name="basic"
                autoComplete="off"
                form={form}
                onValuesChange={(changedValue, allValues) => {}}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={12}>
                    <Form.Item
                      label="Template Name"
                      name="templateName"
                      initialValue={""}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="eBay Site"
                      name="ebaySite"
                      initialValue={""}
                    >
                      <Select
                        onChange={(accountValue) => {
                          setSelectedAccount(accountValue);
                        }}
                        value={selectedAccount}
                        options={connectedAccountsArray}
                        placeholder="Please choose a site"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {siteID !== "" && (
                  <Row gutter={[16, 8]} wrap={true}>
                    <Col span={24}>
                      <Title level={5}>Primary Category Mapping</Title>
                    </Col>
                    <Col span={24}>
                      <Alert
                        message={<Text strong>Category path</Text>}
                        description="Please select a category"
                        type="info"
                        showIcon
                      />
                    </Col>
                    {Object.keys(categoryMappingOptions).map(
                      (categoryLevel) => {
                        return (
                          categoryMappingOptions[categoryLevel].length && (
                            <Col
                              span={12}
                              // span={
                              //   24 / Object.keys(categoryMappingOptions).length
                              // }
                            >
                              <Form.Item
                                label={`Category Level ${categoryLevel}`}
                                name={`Category Level ${categoryLevel}`}
                                initialValue={""}
                              >
                                <Select
                                  onChange={(value) => {
                                    let temp = {};
                                    temp[categoryLevel] = value;
                                    setCategoryMappingValues(temp);
                                  }}
                                  value={categoryMappingValues[categoryLevel]}
                                  options={
                                    categoryMappingOptions[categoryLevel]
                                  }
                                  placeholder="Please Select..."
                                />
                              </Form.Item>
                            </Col>
                          )
                        );
                      }
                    )}
                  </Row>
                )}
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default CategoryTemplateComponent;
