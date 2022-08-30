import {
  DownloadOutlined,
  DownOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Modal, Stack } from "@shopify/polaris";
import { Dropdown, Menu } from "antd";
import React, { useState } from "react";
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

const OrderMassMenu = ({ selectedRows, ...props }) => {
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
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
                  setModal({
                    ...modal,
                    active: true,
                    content: "Remove from App",
                    actionName: massAction,
                    actionPayload: ebayOrdersIdsToPost,
                    api: removeOrdersURL,
                  });
                }}
              >
                <UploadOutlined /> Remove from App
              </Menu.Item>
              <Menu.Item
                key="Sync Shipment"
                onClick={() => {
                  let shopifyOrdersIdsToPost = selectedRows.map(
                    (selectedRow) => selectedRow["shopifyOrderId"]
                  );
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Shipment",
                    actionName: massAction,
                    actionPayload: shopifyOrdersIdsToPost,
                    api: syncShipmentURL,
                  });
                }}
              >
                <UploadOutlined /> Sync Shipment
              </Menu.Item>
              <Menu.Item
                key="Cancel eBay Order"
                onClick={() => {
                  let ebayOrdersIdsToPost = selectedRows.map((selectedRow) => {
                    return {
                      order_id: selectedRow["ebayOrderId1"],
                      shop_id: selectedRow["shopId"],
                    };
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Cancel eBay Order",
                    actionName: massAction,
                    actionPayload: ebayOrdersIdsToPost,
                    api: cancelOrdersURl,
                  });
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
                        order_id: selectedRow["ebayOrderId1"],
                        shop_id: selectedRow["shopId"],
                      };
                    });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Delete Shopify Order",
                    actionName: massAction,
                    actionPayload: shopifyOrdersIdsToPost,
                    api: deleteOrdersURL,
                  });
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
        <Button>
          <div>
            {selectedRows.length
              ? `${selectedRows.length} order(s) selected`
              : "Mass Actions"}{" "}
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
