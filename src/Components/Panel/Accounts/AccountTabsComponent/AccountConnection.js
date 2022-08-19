import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { updateactiveInactiveAccounts } from "../../../../Apirequest/accountsApi";
import { environment } from "../../../../environment/environment";
import { globalState } from "../../../../services/globalstate";
import ModalComponent from "../../../AntDesignComponents/ModalComponent";
import { getFlagImage } from "../NewAccount";

const { Title, Text } = Typography;

const AccountConnection = ({
  selectedAccount,
  siteID,
  mode,
  shopId,
  status,
  cbFunc,
  marketplaceAccountData,
}) => {
  const [reconnectModalStatus, setReconnectModalStatus] = useState(false);
  // console.log("status", status, selectedAccount);
  const [showMoreDetailsStatus, setShowMoreDetailsStatus] = useState(false);
  // const [activeInactiveValue, setActiveInactiveValue] = useState("active");

  const fetchRows = (field, marketplaceAccountData) => {
    return (
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <Text strong>{field}</Text>
        </Col>
        <Col span={12}>
          {marketplaceAccountData[field]
            ? marketplaceAccountData[field]
            : "Not available"}
        </Col>
      </Row>
    );
  };

  const showMoreDetailsSection = () => {
    let stopIndex = 12;
    let filteredData = Object.keys(marketplaceAccountData).map((field, index) =>
      !showMoreDetailsStatus
        ? index < stopIndex && fetchRows(field, marketplaceAccountData)
        : fetchRows(field, marketplaceAccountData)
    );
    return filteredData;
  };

  const toggleActiveInactiveAccountStatus = async (e) => {
    let { success, message } = await updateactiveInactiveAccounts({
      marketplace: "ebay",
      state: e.target.value,
      shop_id: Number(shopId),
    });
  };

  return (
    <React.Fragment>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} style={{ minHeight: "50vh" }}>
            <Row align="middle" gutter={[0, 0]} justify="center">
              <Col span={20}>
                <Image
                  preview={false}
                  width={"100%"}
                  src="https://ebay.sellernext.com/marketplace-logos/ebay.png"
                />
              </Col>
              <Col span={24}>
                <Row align="middle" justify="center">
                  <Col span={4}>
                    <Image
                      preview={false}
                      width={50}
                      src={`${getFlagImage(selectedAccount)}`}
                    />
                  </Col>
                  <Col span={18}>
                    <Text type="success">{selectedAccount}</Text>
                  </Col>
                </Row>
                <Row justify="space-between" gutter={[0, 16]}>
                  <Col span={8}>
                    <Button onClick={() => setReconnectModalStatus(true)}>
                      Reconnect
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Radio.Group
                      defaultValue="a"
                      buttonStyle="solid"
                      onChange={(e) => {
                        // console.log("check", check);
                        toggleActiveInactiveAccountStatus(e);
                        // setActiveInactiveValue(e.target.value);
                        cbFunc(e.target.value);
                      }}
                      value={status}
                    >
                      <Radio.Button value="active">Active</Radio.Button>
                      <Radio.Button value="inactive">Inactive</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16}>
          <Card bordered={false}>
            {marketplaceAccountData && showMoreDetailsSection()}
            <Text
              style={{ cursor: "pointer", color: "#096dd9" }}
              onClick={() => setShowMoreDetailsStatus(!showMoreDetailsStatus)}
            >
              {!showMoreDetailsStatus ? "More" : "Less"} Details
            </Text>
          </Card>
        </Col>
      </Row>
      <ModalComponent
        title={"Permission Required"}
        isModalVisible={reconnectModalStatus}
        modalContent={"Do you want to reconnect the eBay account"}
        handleOk={() => {
          window.open(
            `${
              environment.API_ENDPOINT
            }/connector/get/installationForm?code=ebay&site_id=${siteID}&mode=${mode}&bearer=${globalState.getLocalStorage(
              "auth_token"
            )}`,
            "_parent"
          );
        }}
        handleCancel={() => setReconnectModalStatus(false)}
      />
    </React.Fragment>
  );
};

export default AccountConnection;
