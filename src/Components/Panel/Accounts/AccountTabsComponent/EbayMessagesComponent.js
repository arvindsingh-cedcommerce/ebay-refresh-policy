import {
  Modal,
  Stack,
  TextContainer,
  TextField,
  Button as ShopifyButton,
} from "@shopify/polaris";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { getAllMessages } from "../../../../APIrequests/AcountAPI";
import { getAllMessagesURL } from "../../../../URLs/AccountsURL";
import NestedTableComponent from "../../../AntDesignComponents/NestedTableComponent";
import PaginationComponent from "../../../AntDesignComponents/PaginationComponent";
import { ebayMessageGridHeadings } from "./SampleMessageData";

const getCurrentDate = () => {
  let today = new Date();

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  return today;
};

const getPrevioueDate = () => {
  let d = new Date();
  d.setDate(d.getDate() - 28);
  let prevdd = String(d.getDate()).padStart(2, "0");
  let prevmm = String(d.getMonth() + 1).padStart(2, "0"); //January is 0!
  let prevyyyy = d.getFullYear();
  let prev = prevyyyy + "-" + prevmm + "-" + prevdd;
  return prev;
};

const EbayMessagesComponent = () => {
  let [messageColumns, setMessageColumns] = useState(ebayMessageGridHeadings);
  const [msgData, setMsgData] = useState([]);
  // pagination
  const [activePage, setActivePage] = useState(1);
  const [pageSizeOptions, setPageSizeOptions] = useState([25, 50, 100]);
  const [pageSize, setPageSize] = useState(25);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [time, setTime] = useState({
    startTime: getPrevioueDate(),
    endTime: getCurrentDate(),
  });
  // get msg modal
  const [getMsgModalStatus, setGetMsgModalStatus] = useState(false);

  // loader
  const [loader, setLoader] = useState(false)

  const hitGetAllMessages = async () => {
    setLoader(true)
    let postData = {
      page: activePage,
      pageSize: pageSize,
      start_time: time["startTime"],
      end_time: time["endTime"],
    };
    let {} = await getAllMessages(getAllMessagesURL, postData);
    setLoader(false)
  };

  useEffect(() => {
    hitGetAllMessages();
  }, [activePage, pageSize]);

  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-between">
        <Col className="gutter-row" span={18}>
          <PaginationComponent
            // totalCount={totalProductsCount}
            pageSizeOptions={pageSizeOptions}
            activePage={activePage}
            setActivePage={setActivePage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            size={"default"}
            simple={false}
          />
        </Col>
        <Col className="gutter-row" span={5}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <ShopifyButton primary onClick={() => setGetMsgModalStatus(true)}>
              Get Messages
            </ShopifyButton>
          </div>
        </Col>
      </Row>
      <br />
      <NestedTableComponent
        columns={messageColumns}
        dataSource={msgData}
        scroll={{ x: 1000 }}
        bordered={true}
        loading={loader}
      />
      <Modal
        open={getMsgModalStatus}
        onClose={() => setGetMsgModalStatus(false)}
        title="Get messages"
      >
        <Modal.Section>
          <TextContainer>
            <Stack distribution="center">
              <TextField
                type="date"
                value={time["startTime"]}
                onChange={(e) => setTime({ ...time, startTime: e })}
              />
              <TextField
                type="date"
                value={time["endTime"]}
                onChange={(e) => setTime({ ...time, endTime: e })}
              />
            </Stack>
            <Stack distribution="center">
              <ShopifyButton
                primary
                onClick={(e) => {
                  hitGetAllMessages();
                }}
              >
                Get message
              </ShopifyButton>
            </Stack>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default EbayMessagesComponent;
