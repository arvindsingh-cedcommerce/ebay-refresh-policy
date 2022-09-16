import {
  DownloadOutlined,
  DownOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Banner, Button, Modal, Stack, TextContainer } from "@shopify/polaris";
import { Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { massAction } from "../../../../../APIrequests/OrdersAPI";
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  cancelOrdersURl,
  deleteOrdersURL,
  removeOrdersURL,
  syncShipmentURL,
} from "../../../../../URLs/OrdersURL";
import {
  deleteItemURL,
  disableItemURL,
  importMetaFieldURL,
  matchFromEbayURL,
  relistItemURL,
  syncInventoryPrice,
  syncProductDetails,
  uploadProductByIdURL,
} from "../../../../../URLs/ProductsURL";

const OrderMassMenu = ({
  selectedRows,
  setSelectedRows,
  setSelectedRowKeys,
  hitGetOrdersAPI,
  rowSelectionPassed,
  ...props
}) => {
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
    selectedRowsCount: 0,
  });
  const [btnLoader, setBtnLoader] = useState(false);

  return (
    <>
      <Dropdown
        key="massAction"
        overlay={
          <Menu>
            <Menu.ItemGroup key="g3" title="">
              <Menu.Item
                key="Remove from App"
                onClick={() => {
                  let ebayOrdersIdsToPost = selectedRows
                    .filter((selectedRow) => !selectedRow?.["shopifyOrderId1"])
                    .map((selectedRow) => {
                      return {
                        order_id: selectedRow["ebayOrderId1"],
                        shop_id: selectedRow["shopId"],
                      };
                    });
                  // console.log(ebayOrdersIdsToPost);
                  if (ebayOrdersIdsToPost.length) {
                    setModal({
                      ...modal,
                      active: true,
                      content: "Remove from App",
                      actionName: massAction,
                      actionPayload: ebayOrdersIdsToPost,
                      api: removeOrdersURL,
                      selectedRowsCount: selectedRows.length,
                    });
                  } else {
                    // setSelectedRows([]);
                    // setSelectedRowKeys([]);
                    notify.error(
                      "Please select orders which are not listed on Shopify!"
                    );
                  }
                }}
              >
                <UploadOutlined /> Remove from App
              </Menu.Item>
              <Menu.Item
                key="Sync Shipment"
                onClick={() => {
                  // console.log(selectedRows);
                  let parsedShopifyOrdersIds = selectedRows.filter(
                    (selectedRow) => selectedRow?.["shopifyOrderId1"]
                  );
                  // console.log(parsedShopifyOrdersIds);
                  let shopifyOrdersIdsToPost = parsedShopifyOrdersIds
                    .filter((selectedRow) =>
                      ["unfulfilled", "fulfilled"].includes(
                        selectedRow["orderStatus"]
                      )
                    )
                    .map((selectedRow) => {
                      return {
                        order_id: selectedRow["shopifyOrderId1"],
                        shop_id: selectedRow["shopId"],
                      };
                    });
                  // console.log(shopifyOrdersIdsToPost);
                  // let shopifyOrdersIdsToPost = selectedRows
                  //   .filter((selectedRow) => selectedRow?.["shopifyOrderId1"])
                  //   .map((selectedRow) => {
                  //     return {
                  //       order_id: selectedRow["shopifyOrderId1"],
                  //       shop_id: selectedRow["shopId"],
                  //     };
                  //   });
                  if (parsedShopifyOrdersIds.length) {
                    if (shopifyOrdersIdsToPost.length) {
                      setModal({
                        ...modal,
                        active: true,
                        content: "Sync Shipment",
                        actionName: massAction,
                        actionPayload: shopifyOrdersIdsToPost,
                        api: syncShipmentURL,
                        selectedRowsCount: selectedRows.length,
                      });
                    } else {
                      notify.error(
                        "You are not allowed to sync cancelled order(s)."
                      );
                    }
                  } else {
                    notify.error(
                      "Please select orders which are listed on Shopify!"
                    );
                  }
                }}
              >
                <UploadOutlined /> Sync Shipment
              </Menu.Item>
              <Menu.Item
                key="Cancel eBay Order"
                onClick={() => {
                  let parsedShopifyOrdersIds = selectedRows.filter(
                    (selectedRow) => selectedRow?.["shopifyOrderId1"]
                  );
                  let shopifyOrdersIdsToPost =
                    // selectedRows
                    //   .filter((selectedRow) => selectedRow?.["shopifyOrderId1"])
                    parsedShopifyOrdersIds
                      .filter((selectedRow) =>
                        ["unfulfilled"].includes(selectedRow["orderStatus"])
                      )
                      .map((selectedRow) => {
                        return {
                          order_id: selectedRow["shopifyOrderId1"],
                          shop_id: selectedRow["shopId"],
                        };
                      });

                  if (parsedShopifyOrdersIds.length) {
                    if (shopifyOrdersIdsToPost.length) {
                      setModal({
                        ...modal,
                        active: true,
                        content: "Cancel eBay Order",
                        actionName: massAction,
                        actionPayload: shopifyOrdersIdsToPost,
                        api: cancelOrdersURl,
                        selectedRowsCount: selectedRows.length,
                      });
                    } else {
                      notify.error(
                        "You are not allowed to cancel fulfilled/cancelled order(s)."
                      );
                    }
                  } else {
                    notify.error(
                      "Please select orders which are listed on Shopify!"
                    );
                  }
                }}
              >
                <UploadOutlined /> Cancel eBay Order
              </Menu.Item>
              <Menu.Item
                key="Delete Shopify Order"
                onClick={() => {
                  // let shopifyOrdersIdsToPost = selectedRows.map(
                  //   (selectedRow) => selectedRow["shopifyOrderId"]
                  // );
                  let shopifyOrdersIdsToPost = selectedRows
                    .filter((selectedRow) => selectedRow?.["shopifyOrderId1"])
                    .map((selectedRow) => {
                      return {
                        order_id: selectedRow["shopifyOrderId1"],
                        shop_id: selectedRow["shopId"],
                      };
                    });
                  // console.log("shopifyOrdersIdsToPost", shopifyOrdersIdsToPost);
                  if (shopifyOrdersIdsToPost.length) {
                    setModal({
                      ...modal,
                      active: true,
                      content: "Delete Shopify Order",
                      actionName: massAction,
                      actionPayload: shopifyOrdersIdsToPost,
                      api: deleteOrdersURL,
                      selectedRowsCount: selectedRows.length,
                    });
                  } else {
                    // setSelectedRows([]);
                    // setSelectedRowKeys([]);
                    notify.error(
                      "Please select orders which are listed on Shopify!"
                    );
                  }
                }}
              >
                <UploadOutlined /> Delete Shopify Order
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        }
        trigger={["click"]}
        disabled={selectedRows.length > 0 ? false : true}
      >
        <Button primary={selectedRows.length}>
          <div>
            {selectedRows.length
              ? `${selectedRows.length} order(s) selected`
              : "No order(s) selected"}{" "}
            <DownOutlined />
          </div>
        </Button>
      </Dropdown>
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>
              Are you sure you want to initiate {modal.content} for selected
              order(s) ?
            </p>
            {/* {console.log(modal)} */}
            {modal.content === "Remove from App" &&
              modal.selectedRowsCount > modal.actionPayload.length && (
                // <Banner status="info">
                <TextContainer>
                  Note: Only {modal.actionPayload.length} order(s) are eligible
                  for this action because there are not listed on shopify out of{" "}
                  {modal.selectedRowsCount} order(s).
                </TextContainer>
                // </Banner>
              )}
            {modal.content === "Sync Shipment" &&
              modal.selectedRowsCount > modal.actionPayload.length && (
                // <Banner status="info">
                <TextContainer>
                  Note: Only {modal.actionPayload.length} order(s) are eligible
                  for this action because there are fulfilled/unfulfilled out of{" "}
                  {modal.selectedRowsCount} order(s).
                  {/* and listed on shopify  */}
                </TextContainer>
                // </Banner>
              )}
            {modal.content === "Cancel eBay Order" &&
              modal.selectedRowsCount > modal.actionPayload.length && (
                // <Banner status="info">
                <TextContainer>
                  Note: Only {modal.actionPayload.length} order(s) are eligible
                  for this action because there are unfulfilled out of{" "}
                  {modal.selectedRowsCount} order(s).
                  {/* listed on shopify */}
                </TextContainer>
                // </Banner>
              )}
            {modal.content === "Delete Shopify Order" &&
              modal.selectedRowsCount > modal.actionPayload.length && (
                // <Banner status="info">
                <TextContainer>
                  Note: Only {modal.actionPayload.length} order(s) are eligible
                  for this action because there are listed on shopify out of{" "}
                  {modal.selectedRowsCount} order(s).
                </TextContainer>
                // {/* </Banner> */}
              )}
            <Stack distribution="center" spacing="tight">
              <Button onClick={() => setModal({ ...modal, active: false })}>
                Cancel
              </Button>
              <Button
                primary
                loading={btnLoader}
                onClick={async () => {
                  setBtnLoader(true);
                  let { success, message, data } = await modal.actionName(
                    modal.api,
                    modal.actionPayload
                  );
                  if (success) {
                    notify.success(message ? message : data);
                    props.history.push("/panel/ebay/activity");
                    // setModal({
                    //   active: false,
                    //   content: "",
                    //   actionName: "",
                    //   actionPayload: {},
                    //   api: "",
                    //   selectedRowsCount: 0,
                    // });
                    // setSelectedRows([]);
                    // setSelectedRowKeys([]);
                    // hitGetOrdersAPI();
                    // rowSelectionPassed();
                  } else {
                    notify.error(message ? message : data);
                    setModal({ ...modal, active: false });
                  }
                  setBtnLoader(false);
                }}
              >
                OK
              </Button>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
    </>
  );
};

export default withRouter(OrderMassMenu);
