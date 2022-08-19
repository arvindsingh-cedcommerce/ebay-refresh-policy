import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LineOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Stack, Button as PolarisButton, Icon, Card } from "@shopify/polaris";
import { MobileVerticalDotsMajorMonotone } from "@shopify/polaris-icons";
import {
  Button,
  Dropdown,
  Image,
  PageHeader,
  Popover,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { deletePolicy } from "../../../../../Apirequest/ebayApirequest/policiesApi";
import { getPolicies } from "../../../../../APIrequests/PoliciesAPI";
import { notify } from "../../../../../services/notify";
import { getPoliciesURL } from "../../../../../URLs/PoliciesURL";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { getCountryName, getSiteID } from "../../../Accounts/NewAccount";
import { getCountyrName } from "../Template/Components/TemplateGridComponent";
import { capitalizeFirstLetterofWords } from "../Template/Helper/TemplateHelper";
import {
  addPolicyOptions,
  getPolicyCountTabLabel,
} from "./Helper/PolicyHelper";

const { Text } = Typography;
const { Option } = Select;

const PolicyGridComponent = (props) => {
  const [policyGridColumns, setPolicyGridColumns] = useState([
    {
      title: "Name",
      dataIndex: "policyName",
      key: "policyName",
      sorter: (a, b) => {
        return a.policyName.props.children.localeCompare(
          b.policyName.props.children
        );
      },
    },
    {
      title: "Account",
      dataIndex: "templateConnectedAccount",
      key: "account",
    },
    {
      title: "Type",
      dataIndex: "policyType",
      key: "policyType",
    },
    // {
    //   title: "Accounts",
    //   dataIndex: "policyConnectedAccount",
    //   key: "policyConnectedAccount",
    // },
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
                  let { policyType, policyId, policySiteId, policyShopId } =
                    record;
                  props.history.push(
                    `/panel/ebay/policyUS/handler?type=${policyType}&id=${policyId}&site_id=${policySiteId}&shop_id=${policyShopId}`
                  );
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <DeleteOutlined
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  setGridLoader(true);
                  let { policySiteId, policyShopId, policyId, policyType } =
                    record;
                  let { success, message } = await deletePolicy({
                    site_id: policySiteId,
                    profile_ids: policyId,
                    shop_id: policyShopId,
                    type: `${policyType.toLowerCase()}_policy`,
                  });
                  if (success) {
                    notify.success(message);
                    // this.getPolicies();
                    getAllPolicies(false, policySiteId, policyShopId);
                  } else {
                    getAllConnectedAccounts();
                    // getAllPolicies();
                    getAllPolicies(false, policySiteId, policyShopId);
                    notify.error(message);
                  }
                  setGridLoader(false);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  const [siteID, setSiteID] = useState("");
  const [shopId, setShopId] = useState("");
  const [allPolicies, setAllPolicies] = useState([]);
  const [shippingPolicies, setShippingPolicies] = useState([]);
  const [paymentPolicies, setPaymentPolicies] = useState([]);
  const [returnPolicies, setReturnPolicies] = useState([]);
  const [addPolicyValue, setAddPolicyValue] = useState(null);
  const [gridLoader, setGridLoader] = useState(false);

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

  const getAllConnectedAccounts = async () => {
    let {
      success: accountConnectedSuccess,
      data: connectedAccountData,
      message,
    } = await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );

      let tempArr = ebayAccounts.map((account, key) => {
        let accountName = {
          label: (
            <Stack alignment="fill" spacing="tight">
              {/* // getCountryName(account["warehouses"][0]["site_id"]) */}
              <Image
                preview={false}
                width={18}
                src={
                  account["warehouses"][0]["site_id"] &&
                  require(`../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
                }
                style={{ borderRadius: "50%" }}
              />
              <>{account["warehouses"][0]["user_id"]}</>
            </Stack>
          ),
          value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            account["warehouses"][0]["user_id"]
          }`,
          siteID: account["warehouses"][0]["site_id"],
          shopId: account["id"],
        };
        return accountName;
      });

      setconnectedAccountsArray(tempArr);
      setSelectedAccount(tempArr[0]["value"]);
    } else {
      notify.error(message);
    }
  };

  useEffect(() => {
    let shippingPolicyTemp = [];
    let paymentPolicyTemp = [];
    let returnPolicyTemp = [];

    allPolicies.forEach((policy) => {
      switch (policy["policyType"]) {
        case "Shipping":
          shippingPolicyTemp.push(policy);
          break;
        case "Payment":
          paymentPolicyTemp.push(policy);
          break;
        case "Return":
          returnPolicyTemp.push(policy);
          break;
        default:
          break;
      }
    });
    setShippingPolicies(shippingPolicyTemp);
    setPaymentPolicies(paymentPolicyTemp);
    setReturnPolicies(returnPolicyTemp);
  }, [allPolicies]);

  const getAllPolicies = async (
    refresh = false,
    passedSiteId,
    passedShopId
  ) => {
    setGridLoader(true);
    let requestData = {
      multitype: ["shipping", "payment", "return"],
      site_id: siteID ? siteID : passedSiteId,
      shop_id: shopId ? shopId : passedShopId,
      grid: true,
    };
    // console.log("requestData", requestData);
    if (refresh) {
      requestData["refresh"] = refresh;
    }
    let {
      success,
      data: fetchedPoliciesArray,
      message,
    } = await getPolicies(getPoliciesURL, { ...requestData });

    if (success) {
      if (refresh) {
        notify.success(message);
      }
      // setTimeout(() => {
      const overAllFilteredPolicyData = fetchedPoliciesArray
        .reverse()
        .map((policy, index) => {
          let { data, type: policyType } = policy;
          let type = "";
          if (policyType) {
            type = "profileId";
          }
          // switch (policyType) {
          //   case 'payment':
          //     type = 'paymentPolicyId'
          //     break;
          //   case 'return':
          //     type = 'returnPolicyId'
          //     break;
          //   case 'shipping':
          //     type = 'fulfillmentPolicyId'
          //     break;
          //   default:
          //     break;
          // }
          if (data && data.hasOwnProperty(type)) {
            // console.log(data, type, data[type]);
            let { type: profileId } = data;
            const filteredPolicyData = {
              policyUniqueKey: index,
              // policyName: capitalizeFirstLetterofWords(policy["title"]),
              // policyId: profileId,
              policyId: data[type],
              policyName: (
                <Text
                  strong
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    props.history.push(
                      `/panel/ebay/policyUS/handler?type=${capitalizeFirstLetterofWords(
                        policy["type"]
                      )}&id=${data[type]}&site_id=${siteID}&shop_id=${
                        policy["shop_id"]
                      }`
                    );
                  }}
                >
                  {policy["title"]}
                </Text>
              ),
              policyType: capitalizeFirstLetterofWords(policy["type"]),
              policyConnectedAccount: getCountyrName(siteID),
              policySiteId: policy["site_id"],
              policyShopId: policy["shop_id"],
              // policyId: policy["_id"],
            };
            return filteredPolicyData;
          }
        })
        .filter((policy) => policy !== undefined);
      setAllPolicies(overAllFilteredPolicyData);
      // }, 1000);
    }
    setGridLoader(false);
  };
  useEffect(() => {
    // console.log("allPolicies", allPolicies);
  }, [allPolicies]);
  useEffect(() => {
    if (selectedAccount) {
      getAllPolicies();
    }
  }, [siteID]);

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  const getTabContent = () => {
    let content = {};
    let proilesTabObject = {
      // All: allPolicies,
      Shipping: shippingPolicies,
      Payment: paymentPolicies,
      Return: returnPolicies,
    };
    Object.keys(proilesTabObject).forEach((policyName) => {
      content[
        getPolicyCountTabLabel(proilesTabObject[policyName], policyName)
      ] = (
        <NestedTableComponent
          columns={
            policyName === "All"
              ? policyGridColumns
              : policyGridColumns.filter(
                  (column) => column["dataIndex"] !== "policyType"
                )
          }
          dataSource={proilesTabObject[policyName]}
          // scroll={{ x: 1000 }}
          scroll={{ x: 1000, y: "55vh" }}
          bordered={true}
          // loading={
          //   policyName === "All" &&
          //   proilesTabObject[policyName].length === 0
          //     ? true
          //     : false
          // }
          size={"small"}
          loading={gridLoader}
          pagination={false}
        />
      );
    });
    return content;
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="Policy"
      ghost={true}
      extra={[
        <PolarisButton
          icon={<SyncOutlined />}
          onClick={() => {
            getAllPolicies(true);
          }}
          primary
        >
          Refresh Policies
        </PolarisButton>,
        <Select
          key="addTemplates"
          value={addPolicyValue}
          placeholder={<Text strong>Add Policy</Text>}
          onChange={(selectedPolicyValue) => {
            props.history.push(
              `/panel/ebay/policyUS/handler?type=${selectedPolicyValue}&site_id=${siteID}&shop_id=${shopId}`
            );
          }}
        >
          {addPolicyOptions.map((option) => (
            <Option key={option["value"]} value={option["value"]}>
              {option["label"]}
            </Option>
          ))}
        </Select>,
        <Select
          style={{ width: 300 }}
          onChange={(accountValue) => {
            setSelectedAccount(accountValue);
          }}
          value={selectedAccount}
          options={connectedAccountsArray}
          placeholder="Select to add account"
          // loading={gridLoader}
        />,
      ]}
    >
      <Card sectioned>
        <TabsComponent totalTabs={5} tabContents={getTabContent()} />
      </Card>
    </PageHeader>
  );
};

export default PolicyGridComponent;
