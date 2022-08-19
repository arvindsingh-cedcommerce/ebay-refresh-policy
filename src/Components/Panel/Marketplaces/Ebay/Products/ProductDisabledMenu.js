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
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
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

const ProductDisabledMenu = ({ selectedRows, ...props }) => {
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
      {/* <Dropdown
        key="massAction"
        overlay={
          <Menu>
            <Menu.ItemGroup key="g2" title="Shopify Actions">
              <Menu.Item
                key="Disable Product"
                onClick={() => {
                  let postData = [];
                  selectedRows.forEach((selectedRow) => {
                    let { container_id } = selectedRow;
                    postData.push(container_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Disable Product",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      product_id: postData,
                      status: "Disable",
                    },
                    api: disableItemURL,
                  });
                }}
              >
                <SyncOutlined /> Disable Product
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        }
        trigger={["click"]}
        disabled={selectedRows.length > 0 ? false : true}
      > */}
      <Button
        onClick={() => {
          let postData = [];
          selectedRows.forEach((selectedRow) => {
            let { container_id } = selectedRow;
            postData.push(container_id);
          });
          setModal({
            ...modal,
            active: true,
            content: "Disable Product",
            actionName: postActionOnProductById,
            actionPayload: {
              product_id: postData,
              status: "Disable",
            },
            api: disableItemURL,
          });
        }}
      >
        <div>
          {selectedRows.length
            ? `${selectedRows.length} product(s) selected for disable action`
            : "Disable Actions"}{" "}
          {/* <DownOutlined /> */}
        </div>
      </Button>
      {/* </Dropdown> */}
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>
              Are you sure you want to initiate {modal.content} for selected
              product(s) ?
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
                    if (modal.content === "Disable Product") {
                      props.history.push("disabledproducts");
                    } else props.history.push("activity");
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

export default withRouter(ProductDisabledMenu);
