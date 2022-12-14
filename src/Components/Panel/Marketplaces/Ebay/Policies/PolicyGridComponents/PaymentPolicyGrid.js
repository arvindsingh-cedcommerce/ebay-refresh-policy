import {
  Button,
  Card,
  ChoiceList,
  Icon,
  Popover,
  Stack,
  Tag,
  TextField,
} from "@shopify/polaris";
import { FilterMajorMonotone } from "@shopify/polaris-icons";
import { Col, Image, Row } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { getConnectedAccounts } from "../../../../../../Apirequest/accountsApi";
import { deletePolicy } from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import { getPolicies } from "../../../../../../APIrequests/PoliciesAPI";
import { notify } from "../../../../../../services/notify";
import { getPoliciesURL } from "../../../../../../URLs/PoliciesURL";
import NestedTableComponent from "../../../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../../../AntDesignComponents/PaginationComponent";
import { getCountryName } from "../../../../Accounts/NewAccount";
import NewFilterComponentSimilarPolaris from "../../Products/NewFilterComponentSimilarPolaris";
import {
  numberOperatorOptions,
  stringOperatorOptions,
} from "../../Products/NewProductsNewFilters";
import { capitalizeFirstLetterofWords } from "../../Template/Helper/TemplateHelper";
import { debounce } from "../../Template/TemplateBody/CategoryTemplatePolarisNew";
import { getDomainName } from "../FinalPolicyGrid";
import ActionPopoverPolicy from "./ActionPopoverPolicy";

const filtersFields = [
  {
    label: "Account",
    value: "country",
    searchType: "dropdown",
    inputValue: "",
    operator: "1",
    dataType: "string",
  },
];

const getFitersInitially = () => {
  let tempObj = {};
  filtersFields.forEach((field) => {
    tempObj[field["value"]] = {
      operator: field["operator"],
      value: field["inputValue"],
      label: field["label"],
      dataType: field["dataType"],
    };
    if (field?.["searchType"] === "dropdown") {
      tempObj[field["value"]]["options"] = [];
    }
  });
  return tempObj;
};

const PaymentPolicyGrid = (props) => {
  const reduxState = useSelector(
    (state) => state.paymentPolicyGridFilterReducer.reduxFilters
  );
  const dispatch = useDispatch();
  const countryTypeValue= reduxState[props.checkValueHandler(reduxState,"country")];
 
  const {
    refreshPolicyBtnClicked,
    cbFuncCategory,
    refreshSuccessStatus,
    setRefreshSuccessStatus,
  } = props;

  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  // grid
  const [gridLoader, setGridLoader] = useState(false);
  const [policyGridColumns, setPolicyGridColumns] = useState([
    {
      title: <center>Name</center>,
      dataIndex: "policyName",
      key: "policyName",
    },
    {
      title: <center>Account</center>,
      dataIndex: "policyConnectedAccount",
      key: "account",
    },
    {
      title: <center>Actions</center>,
      key: "action",
      dataIndex: "templateAction",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <center>
            <ActionPopoverPolicy
              record={record}
              hitRequiredFuncs={hitRequiredFuncs}
              cbFunc={cbFuncCategory}
            />
          </center>
        );
      },
    },
  ]);
  const [shippingPolicies, setShippingPolicies] = useState([]);

  // filters
  const [filtersDrawerVisible, setFiltersDrawerVisible] = useState(false);
  const [filters, setFilters] = useState(getFitersInitially());
  const [filtersToPass, setFiltersToPass] = useState("");

  const [filterShippingPolicyName, setFilterShippingPolicyName] = useState("");
  const [selected, setSelected] = useState({
    country: [],
  });

  // pagination
  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [pageSize, setPageSize] = useState(25);
  const [totalShippingPolicyCount, setTotalShippingPolicyCount] = useState(0);

  // country filters
  const [popOverStatus, setPopOverStatus] = useState({
    country: false,
  });
  const [prevPage,setPrevPage]=useState(1);
 
  const hitRequiredFuncs = () => {
    getAllPolicies();
    getAllConnectedAccounts();
  };

  const getAllConnectedAccounts = async (props) => {
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
              <Image
                preview={false}
                width={18}
                src={
                  account["warehouses"][0]["site_id"] &&
                  require(`../../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
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
          status: account["warehouses"][0]["status"],
          shopId: account["id"],
        };
        return accountName;
      });
      let temp = { ...filters };
      temp["country"]["options"] = [...tempArr];
      setFilters(temp);
      setconnectedAccountsArray(tempArr);
    } else {
      notify.error(message);
    }
  };

  const getUsername = (siteid, username) => {
    if (siteid && username.length) {
      let test = username.find((user) => user.siteID === siteid);
      return test.label;
    }
  };

  const getAllPolicies = async (activePageNumber, activePageSize,refresh = false) => {
    setRefreshSuccessStatus(false);
    setGridLoader(true);
    let filterPostData = {};
    for (const key in filtersToPass) {
      if (key === "filter[country][1]") {
        let matchedAccoount = connectedAccountsArray.find(
          (connectedAccount) =>
            connectedAccount["value"] === filtersToPass["filter[country][1]"]
        );
        filterPostData["filter[shop_id][1]"] = matchedAccoount?.["shopId"];
      } else {
        filterPostData[key] = filtersToPass[key];
      }
    }

    let requestData = {
      count: activePageSize,
      activePage: activePageNumber,
      "filter[type][1]": "payment",
      ...filterPostData,
    };
    if (refresh) {
      requestData["refresh"] = refresh;
    }
    // if (Object.keys(filterPostData).length) {
    //   requestData["activePage"] = 1;
    // }
    let {
      success,
      data: fetchedPoliciesArray,
      message,
      count,
    } = await getPolicies(getPoliciesURL, { ...requestData });
    if (count && count[0]) {
      let { count: totalShippingPolicyCountData } = count[0];
      setTotalShippingPolicyCount(totalShippingPolicyCountData);
    }

    if (success) {
      if (refresh) {
        notify.success(message);
      }
      if (fetchedPoliciesArray) {
        const overAllFilteredPolicyData = fetchedPoliciesArray
          // .reverse()
          .map((policy, index) => {
            let { data, type: policyType } = policy;
            let type = "";
            if (policyType) {
              type = "profileId";
            }
            if (data && data.hasOwnProperty(type)) {
              let { type: profileId } = data;
              const filteredPolicyData = {
                policyUniqueKey: index,
                policyId: data[type],
                accountStatus: connectedAccountsArray.find(
                  (account) => account.shopId == policy["shop_id"]
                )?.["status"],
                policyName: (
                  <center>
                    <Text
                      strong
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        props.history.push(
                          `/panel/ebay/policy/handler?type=${policyType}&id=${data[type]}&site_id=${policy["site_id"]}&shop_id=${policy["shop_id"]}`
                        );
                      }}
                    >
                      {policy["title"]}
                    </Text>
                  </center>
                ),
                policyType: capitalizeFirstLetterofWords(policy["type"]),
                policySiteId: policy["site_id"],
                policyShopId: policy["shop_id"],
                policyDomainName: getDomainName(policy["site_id"]),
                policyConnectedAccount: (
                  <center>
                    <Stack
                      distribution="center"
                      alignment="center"
                      spacing="tight"
                    >
                      <>
                        {getUsername(policy["site_id"], connectedAccountsArray)}
                      </>
                    </Stack>
                  </center>
                ),
                // )
              };
              return filteredPolicyData;
            }
          })
          .filter((policy) => policy !== undefined);
        setShippingPolicies(overAllFilteredPolicyData);
      }
      if (fetchedPoliciesArray === null && count === null) {
        getAllPolicies(true);
      }
    }
    setGridLoader(false);
  };

  useEffect(() => {
    getAllConnectedAccounts();
  }, []);

  useEffect(() => {
    if (filtersToPass && (activePage>1 && activePage!==prevPage)) {
      getAllPolicies(1, pageSize);
      setActivePage(1);
    }
    else if(filtersToPass)
    {
      getAllPolicies(activePage,pageSize);
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (connectedAccountsArray.length) {
      getAllPolicies(activePage, pageSize);
    }
  }, [ connectedAccountsArray]);

  useEffect(() => {
    if (refreshSuccessStatus) {
      getAllPolicies();
      cbFuncCategory();
    }
  }, [refreshSuccessStatus]);

  const renderShippingPolicySearch = () => {
    return (
      <TextField
        value={filterShippingPolicyName}
        onChange={(e) => {
          setFilterShippingPolicyName(e);
        }}
        placeholder={"Search with payment policy name"}
      />
    );
  };

  const popOverHandler = (type) => {
    let temp = { ...popOverStatus };
    temp[type] = !popOverStatus[type];
    setPopOverStatus(temp);
  };
  const handleChange = (value, selectedType) => {
    let type = `filter[${selectedType}][1]`;
    let filterObj = {};
    filterObj[type] = value[0];
    setFiltersToPass({ ...filtersToPass, ...filterObj });
    setSelected({ ...selected, [selectedType]: value });
  };
  const countryActivator = (
    <Button fullWidth disclosure onClick={() => popOverHandler("country")}>
      Account
    </Button>
  );

  const renderOtherFilters = () => {
    const initialCountryObj=connectedAccountsArray?.filter((connectedAccount,index)=> connectedAccount.value===countryTypeValue);
   
    return (
      <Popover
        active={popOverStatus["country"]}
        activator={countryActivator}
        onClose={() => popOverHandler("country")}
      >
        <div style={{ margin: "10px", width: "200px" }}>
          <ChoiceList
            choices={connectedAccountsArray}
            selected={initialCountryObj[0]?[initialCountryObj[0].value]:selected["country"]}
            onChange={(value) => handleChange(value, "country")}
          />
        </div>
      </Popover>
      // <Stack wrap>
      //   <Button
      //     icon={<Icon source={FilterMajorMonotone} color="base" />}
      //     onClick={() => {
      //       setFiltersDrawerVisible(true);
      //     }}
      //   >
      //     More Filters
      //   </Button>
      // </Stack>
    );
  };

  const gatherAllFilters = () => {
    let temp = {};
    Object.keys(filters).forEach((filter) => {
      if (filters[filter]["value"]) {
        temp[`filter[${filter}][${filters[filter]["operator"]}]`] =
          filters[filter]["value"];
      }
    });
    let filtersToPassTemp = { ...filtersToPass };
    if (Object.keys(filtersToPassTemp).length) {
      for (const key in filtersToPassTemp) {
        for (const key1 in temp) {
          if (key.split("[")[1] === key1.split("[")[1]) {
            delete filtersToPassTemp[key];
          }
        }
      }
    }
    if (Object.keys(temp).length > 0) {
      setFiltersToPass({ ...filtersToPassTemp, ...temp });
    } else {
      //notify.warn("No filters applied");
      setFiltersToPass({filtersPresent:false});
    }
  };

  const verify = useCallback(
    debounce((value) => {
      let type = "";
      type = "filter[title][3]";
      let titleFilterObj = {};
      titleFilterObj[type] = value;
      if (titleFilterObj[type] !== "") {
        setFiltersToPass({ ...filtersToPass, ...titleFilterObj,filtersPresent:true });
      } else if (filtersToPass.hasOwnProperty("filter[title][3]")) {
        let temp = { ...filtersToPass,filtersPresent:true };
        delete temp["filter[title][3]"];
        setFiltersToPass(temp);
      }
    }, 200),
    [filtersToPass]
  );

  useEffect(() => {
    // if (filterShippingPolicyName !== "") {
    verify(filterShippingPolicyName);
    // }
  }, [filterShippingPolicyName]);

  const getFieldValue = (field) => {
    switch (field) {
      case "title":
        return "Name";
      case "country":
        return "Country";
    }
  };

  const getOperatorLabel = (operator) => {
    let findValue = stringOperatorOptions.find(
      (option) => option["value"] === operator
    );
    let value = "";
    if (findValue) {
      value = findValue["label"];
    } else {
      findValue = numberOperatorOptions.find(
        (option) => option["value"] === operator
      );
      value = findValue["label"];
    }
    return value;
  };

  const tagMarkup = () => {
    return Object.keys(filtersToPass).map((filter, index) => {
      if (
        !filter.includes("filtersPresent") ||
        (filter.includes("filtersPresent") && filter["filtersPresent"])
      ) {
      let indexOfFirstOpeningBracket = filter.indexOf("[");
      let indexOfFirstClosingBracket = filter.indexOf("]");
      let indexOfSecondOpeningBracket = filter.indexOf(
        "[",
        indexOfFirstOpeningBracket + 1
      );
      let indexOfSecondClosingBracket = filter.indexOf(
        "]",
        indexOfFirstClosingBracket + 1
      );
      let fieldValue = filter.substring(
        indexOfFirstOpeningBracket + 1,
        indexOfFirstClosingBracket
      );
      let operatorValue = filter.substring(
        indexOfSecondOpeningBracket + 1,
        indexOfSecondClosingBracket
      );
      return (
        <Tag
          key={index}
          onRemove={() => {
            const temp = Object.keys(filtersToPass).reduce((object, key) => {
              if (key !== filter) {
                object[key] = filtersToPass[key];
              }
              return object;
            }, {});
            let tempObj = { ...filters };
            Object.keys(tempObj).forEach((object) => {
              if (object === fieldValue) {
                tempObj[object]["value"] = "";
              }
            });
            fieldValue === "title" && setFilterShippingPolicyName("");
            setFilters(tempObj);
            setFiltersToPass(temp);
            setSelected({ ...selected, [fieldValue]: [] });
          }}
        >
          {getFieldValue(fieldValue)} {getOperatorLabel(operatorValue)}{" "}
          {filtersToPass[filter]}
        </Tag>
      );
   } });
  };

  useEffect(() => {
    if (filtersToPass) {
      dispatch({ type: "paymentPolicyGridFilter", payload: filtersToPass });
    }
  }, [filtersToPass]);
  useEffect(() => {
    if (reduxState) setFiltersToPass(reduxState);
  }, []);
  return (
    <Card.Section>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Stack wrap>
            <Stack.Item fill>{renderShippingPolicySearch()}</Stack.Item>
            <Stack.Item>
              {/* <div style={{ width: 200 }}> */}
                {renderOtherFilters()}
                {/* </div> */}
            </Stack.Item>
          </Stack>
          <Stack spacing="tight">
            {Object.keys(filtersToPass).length > 0 && tagMarkup()}
          </Stack>
        </div>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          justify="space-between"
          style={{ marginBottom: 10 }}
        >
          <Col className="gutter-row" span={18}>
            <PaginationComponent
              totalCount={totalShippingPolicyCount}
              hitGetProductsAPI={getAllPolicies}
              pageSizeOptions={pageSizeOptions}
              activePage={activePage}
              setActivePage={setActivePage}
              setPrevPage={setPrevPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              size={"default"}
              simple={false}
            />
          </Col>
        </Row>
      </div>
      <NestedTableComponent
        columns={policyGridColumns}
        dataSource={shippingPolicies}
        scroll={{ x: 1000, y: "55vh" }}
        bordered={true}
        size={"small"}
        loading={gridLoader}
        pagination={false}
      />
      <NewFilterComponentSimilarPolaris
        setFiltersDrawerVisible={setFiltersDrawerVisible}
        filtersDrawerVisible={filtersDrawerVisible}
        filters={filters}
        stringOperatorOptions={stringOperatorOptions}
        numberOperatorOptions={numberOperatorOptions}
        setFilters={setFilters}
        gatherAllFilters={gatherAllFilters}
        setFiltersToPass={setFiltersToPass}
        setFilterTitleORsku={setFilterShippingPolicyName}
        setSelected={setSelected}
      />
    </Card.Section>
  );
};

export default withRouter(PaymentPolicyGrid);
