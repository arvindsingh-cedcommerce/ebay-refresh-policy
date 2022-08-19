import {
  Col,
  Image,
  PageHeader,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteTemplateID,
  getTemplates,
} from "../../../../../../APIrequests/TemplatesAPI";
import { json } from "../../../../../../globalConstant/static-json";
import {
  deleteTempalteURL,
  getTemplatesURL,
} from "../../../../../../URLs/TemplateURLS";
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import TabsComponent from "../../../../../AntDesignComponents/TabsComponent";
import {
  getTemplatesCountTabLabel,
  capitalizeFirstLetterofWords,
  addTemplatesOptions,
} from "../Helper/TemplateHelper";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  LineOutlined,
} from "@ant-design/icons";
import { notify } from "../../../../../../services/notify";
import { Modal, Select as PolarisSelect, Stack } from "@shopify/polaris";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { getCountryName } from "../../../../Accounts/NewAccount";

const { Option } = Select;
const { Title, Text } = Typography;

export const getCountyrName = (siteId) => {
  let countryName = json.flag_country.filter((sites) => sites.value === siteId);
  if (countryName.length) {
    return (
      <Image
        preview={false}
        width={25}
        src={siteId && require(`../../../../../../assets/flags/${siteId}.png`)}
        style={{ borderRadius: "50%" }}
      />
    );
  }
  return "-";
};

const TemplateGridComponent = (props) => {
  const [templateGridColumns, setTemplateGridColumns] = useState([
    {
      title: "Name",
      dataIndex: "templateName",
      key: "templateName",
      sorter: (a, b) => {
        return a.templateName.props.children.localeCompare(b.templateName.props.children)
      }
    },
    {
      title: "Type",
      dataIndex: "templateType",
      key: "type",
    },
    {
      title: "Account",
      dataIndex: "templateConnectedAccount",
      key: "account",
    },
    {
      title: "Actions",
      key: "action",
      dataIndex: "templateAction",
      render: (text, record) => {
        return (
          <Space size="middle">
            <Tooltip title="Edit">
              <EditOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  let { templateId, templateType, siteID, shopID } = record;
                  if (templateType === "Category") {
                    props.history.push(
                      `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}&siteID=${siteID}&shopID=${shopID}`
                    );
                  } else {
                    props.history.push(
                      `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}`
                    );
                  }
                }}
              />
            </Tooltip>
            {/* <Tooltip title="Duplicate">
              <CopyOutlined style={{ cursor: "pointer" }} />
            </Tooltip> */}
            <Tooltip title="Delete">
              <DeleteOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  deleteTemplate(record);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);
  const [alltemplates, setAllTemplates] = useState([]);
  const [priceTemplates, setPriceTemplates] = useState([]);
  const [categoryTemplates, setCategoryTemplates] = useState([]);
  const [inventoryTemplates, setInventoryTemplates] = useState([]);
  const [titleTemplates, setTitleTemplates] = useState([]);
  const [addTemplateValue, setAddTemplateValue] = useState(null);
  const [gridLoader, setGridLoader] = useState(false);
  const [accountSelectionModal, setaccountSelectionModal] = useState({
    active: false,
    siteID: "",
    accountName: "",
    options: [],
    shopID: "",
  });

  const deleteTemplate = async (record) => {
    let { templateId } = record;
    let { success, message } = await deleteTemplateID(deleteTempalteURL, {
      templateId,
    });
    if (success) {
      notify.success(message);
      // await getTemplatesList();
      hitRequiredFuncs()
    } else {
      notify.error(message);
      // await getTemplatesList();
      hitRequiredFuncs()
    }
  };

  const getUsername = (siteid, username) => {
    if(siteid) {
      let test =  username.find(user => user.siteID === siteid)
      return test.label
    }
  }
  const getTemplatesList = async (ebayAccountsObj) => {
    setGridLoader(true);
    const {
      success,
      data: fetchedTemplatesArray,
      message,
    } = await getTemplates(getTemplatesURL, {
      marketplace: "ebay",
      multitype: ["category", "price", "inventory", "title"],
    });
    if (success) {
      // setTimeout(() => {
      const overAllFilteredTemplateData = fetchedTemplatesArray.map(
        (template, index) => {
          const filteredTemplateData = {
            templateUniqueKey: index,
            templateType: capitalizeFirstLetterofWords(template["type"]),
            templateName: (
              <Text
                strong
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (template["type"] === "category") {
                    props.history.push(
                      `/panel/ebay/templatesUS/handler?type=${template["type"].toLowerCase()}&id=${template["_id"]}&siteID=${template["data"]?.site_id}&shopID=${template["data"]?.shop_id}`
                    );
                  } else {
                    props.history.push(
                      `/panel/ebay/templatesUS/handler?type=${capitalizeFirstLetterofWords(template["type"]).toLowerCase()}&id=${template["_id"]}`
                    );
                  }
                }}
              >
                {capitalizeFirstLetterofWords(template["title"])}
              </Text>
            ),
            siteID: template["data"]?.site_id,
            shopID: template['data']?.shop_id,
            templateConnectedAccount:
              Object.keys(template["data"]).length > 0 ? 
                <Stack alignment="center" spacing="tight"><>{getCountyrName(template["data"]["site_id"])}</><>{getUsername(template["data"]["site_id"], ebayAccountsObj)}</></Stack>
               : (
                <Text>
                  {" "}
                  <LineOutlined style={{ color: "#000" }} />
                </Text>
              ),
            templateId: template["_id"],
          };
          return filteredTemplateData;
        }
      );
      setAllTemplates(overAllFilteredTemplateData);
      // }, 1000);
    } else {
      notify.error(message);
      redirect('/auth/login')
    }
    setGridLoader(false);
  };

  const redirect = (url) => {
    props.history.push(url)
  }

  useEffect(() => {
    let categoryTemplatesTemp = [];
    let priceTemplatesTemp = [];
    let titleTemplatesTemp = [];
    let inventoryTemplatesTemp = [];

    alltemplates.forEach((template) => {
      switch (template["templateType"]) {
        case "Category":
          categoryTemplatesTemp.push(template);
          break;
        case "Price":
          priceTemplatesTemp.push(template);
          break;
        case "Title":
          titleTemplatesTemp.push(template);
          break;
        case "Inventory":
          inventoryTemplatesTemp.push(template);
          break;
        default:
          break;
      }
    });
    setCategoryTemplates(categoryTemplatesTemp);
    setPriceTemplates(priceTemplatesTemp);
    setTitleTemplates(titleTemplatesTemp);
    setInventoryTemplates(inventoryTemplatesTemp);
  }, [alltemplates]);

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    let ebayAccountsObj = [];
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      ebayAccounts.forEach((account, key) => {
        let temp = {};
        temp["value"] = `${getCountryName(
          account["warehouses"][0]["site_id"]
        )}-${account["warehouses"][0]["user_id"]}`;
        temp["label"] = account["warehouses"][0]["user_id"];
        temp["siteID"] = account["warehouses"][0]["site_id"];
        temp["shopID"] = account["id"];
        ebayAccountsObj.push(temp);
      });
      setaccountSelectionModal({
        ...accountSelectionModal,
        options: ebayAccountsObj,
        siteID: ebayAccountsObj[0]?.siteID,
        accountName: ebayAccountsObj[0]?.value,
        shopID: ebayAccountsObj[0]?.shopID,
      });
    } else {
      notify.error(message);
    }
    return ebayAccountsObj
  };

  const hitRequiredFuncs = async() => {
    let ebayAccountsObj = await getAllConnectedAccounts();
    await getTemplatesList(ebayAccountsObj);
  }
  
  useEffect(() => {
    hitRequiredFuncs()
  }, []);

  const getColumns = (templateName) => {
    let columns
    if(templateName === 'All') {
      columns = templateGridColumns
      return columns
    }
    else {
      columns = templateGridColumns.filter(
        (column) => column["dataIndex"] !== "templateType"
      )
      if(templateName !== 'Category') {
        columns = columns.filter(col => col['dataIndex'] !== 'templateConnectedAccount')
        return columns
      } else {
        return columns
      }
    }
  }
  const getTabContent = () => {
    let content = {};
    let templatestTabObject = {
      // All: alltemplates,
      Category: categoryTemplates,
      Inventory: inventoryTemplates,
      Price: priceTemplates,
      Title: titleTemplates,
    };
    Object.keys(templatestTabObject).forEach((templateName) => {
      content[
        getTemplatesCountTabLabel(
          templatestTabObject[templateName],
          templateName
        )
      ] = (
        <NestedTableComponent
          columns={
            getColumns(templateName)
          }
          dataSource={templatestTabObject[templateName]}
          // scroll={{ x: 1000 }}
          scroll={{ x: 1000
            // , y: "55vh"
           }}
          bordered={false}
          loading={
            // templateName === "All" &&
            // templatestTabObject[templateName].length === 0
            //   ? true
            //   : false
            gridLoader
          }
          size={"small"}
          pagination={false}
        />
      );
    });
    return content;
  };
  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Templates"
      ghost={false}
      extra={[
        <Select
          key="addTemplates"
          value={addTemplateValue}
          placeholder={<Text strong>Add Templates</Text>}
          onChange={(selectedTemplateValue) => {
            if (selectedTemplateValue === "category") {
              setaccountSelectionModal({
                ...accountSelectionModal,
                active: true,
              });
            } else {
              props.history.push(
                `/panel/ebay/templatesUS/handler?type=${selectedTemplateValue}`
              );
            }
          }}
        >
          {addTemplatesOptions.map((option) => (
            <Option key={option["value"]} value={option["value"]}>
              {option["label"]}
            </Option>
          ))}
        </Select>,
      ]}
    >
      <TabsComponent totalTabs={5} tabContents={getTabContent()} />
      <Modal
        open={accountSelectionModal.active}
        onClose={() =>
          setaccountSelectionModal({ ...accountSelectionModal, active: false })
        }
        title="Select account for category template"
        primaryAction={{
          content: "Add",
          onAction: () => {
            props.history.push(
              `/panel/ebay/templatesUS/handler?type=category&siteID=${accountSelectionModal.siteID}&shopID=${accountSelectionModal.shopID}`
            );
          },
        }}
      >
        <Modal.Section>
          <Stack distribution="center" alignment="center">
            <>
              {getCountyrName(accountSelectionModal.siteID) !== "-" &&
                getCountyrName(accountSelectionModal.siteID)}
            </>
            <PolarisSelect
              options={accountSelectionModal.options}
              value={accountSelectionModal.accountName}
              placeholder="Please Select..."
              onChange={(e) => {
                let temp = accountSelectionModal.options.filter(
                  (account) => account["value"] === e
                );
                setaccountSelectionModal({
                  ...accountSelectionModal,
                  accountName: temp[0]?.value,
                  siteID: temp[0]?.siteID,
                  shopID: temp[0]?.shopID,
                });
              }}
            />
          </Stack>
        </Modal.Section>
      </Modal>
    </PageHeader>
  );
};

export default TemplateGridComponent;
