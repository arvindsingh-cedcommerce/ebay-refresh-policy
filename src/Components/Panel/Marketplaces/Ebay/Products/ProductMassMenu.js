import {
  DownloadOutlined,
  DownOutlined,
  SyncOutlined,
  UploadOutlined,
  RollbackOutlined,
  DeleteOutlined,
  ShrinkOutlined,
  FileTextOutlined,
  DollarOutlined,
  RedoOutlined,
  ExportOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { ActionList, Button, Modal, Popover, Stack } from "@shopify/polaris";
import { Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  deleteItemURL,
  disableItemURL,
  exportProductItemURL,
  importMetaFieldURL,
  matchFromEbayURL,
  relistItemURL,
  syncInventoryPrice,
  syncProductDetails,
  uploadProductByIdURL,
} from "../../../../../URLs/ProductsURL";

const ProductMassMenu = ({ selectedRows, isOpen, setIsOpen, ...props }) => {
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsOpen(false);
    });
  }, []);

  return (
    <>
<Popover active={isOpen} activator={   <Button
          primary={selectedRows.length}
          onClick={() => setIsOpen(!isOpen)}
        disabled={selectedRows.length > 0 ? false : true}
        >
          <div>
            {selectedRows.length
              ? `${selectedRows.length} product(s) selected`
              : "No product(s) selected"}{" "}
            <DownOutlined />
          </div>
        </Button>} autofocusTarget="fourth-node"
          onClose={()=>{
            setIsOpen(false);
          }}>
 <ActionList
          actionRole="menuitem"
          sections={[
            {title:'eBay Actions',
          items: [
            {content:    <div
              key="Upload and Revise (All Products)"
              onClick={() => {
                let postData = [];
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id, container_id } = selectedRow;
                  postData.push(source_product_id);
                  // postData.push(container_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Upload and Revise on eBay",
                  actionName: postActionOnProductById,
                  actionPayload: {
                    product_id: postData,
                    action: "upload_and_revise",
                  },
                  api: uploadProductByIdURL,
                });
              }}
            >
              <RedoOutlined /> Upload and Revise on eBay
            </div>},
            {content:    <div
              key="Relist Item"
              onClick={() => {
                let postData = [];
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id } = selectedRow;
                  postData.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Relist Item",
                  actionName: postActionOnProductById,
                  actionPayload: {
                    product_id: postData,
                  },
                  api: relistItemURL,
                });
              }}
            >
              <RollbackOutlined /> Relist Item
            </div>},
            {content: <div
              key="End from eBay"
              onClick={() => {
                let postData = [];
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id } = selectedRow;
                  postData.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "End from eBay",
                  actionName: postActionOnProductById,
                  actionPayload: {
                    product_id: postData,
                  },
                  api: deleteItemURL,
                });
              }}
            >
              <DeleteOutlined /> End from eBay
            </div>},
            {content:  <div
              key="Match from eBay"
              onClick={() => {
                let postData = [];
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id, container_id } = selectedRow;
                  // postData.push(container_id);
                  postData.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Match from eBay",
                  actionName: postActionOnProductById,
                  actionPayload: {
                    product_id: postData,
                  },
                  api: matchFromEbayURL,
                });
              }}
            >
              <ShrinkOutlined /> Match from eBay
            </div>},
            {content:  <div
              key="Sync Inventory eBay"
              onClick={() => {
                let postData = {
                  product_id: [],
                  sync: ["inventory"],
                  action: "app_to_marketplace",
                };
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id } = selectedRow;
                  postData.product_id.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Sync Inventory",
                  actionName: postActionOnProductById,
                  actionPayload: postData,
                  api: syncInventoryPrice,
                });
              }}
            >
              <FileTextOutlined /> Sync Inventory
            </div>},
            {content:
            <div
              key="Sync Price eBay"
              onClick={() => {
                let postData = {
                  product_id: [],
                  sync: ["price"],
                  action: "app_to_marketplace",
                };
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id } = selectedRow;
                  postData.product_id.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Sync Price",
                  actionName: postActionOnProductById,
                  actionPayload: postData,
                  api: syncInventoryPrice,
                });
              }}
            >
              <DollarOutlined /> Sync Price
            </div>},
            {content:  <div
              key="Upload Products"
              onClick={() => {
                let postData = [];
                selectedRows.forEach((selectedRow) => {
                  let { source_product_id } = selectedRow;
                  postData.push(source_product_id);
                });
                setModal({
                  ...modal,
                  active: true,
                  content: "Upload Products",
                  actionName: postActionOnProductById,
                  actionPayload: {
                    product_id: postData,
                    action: "upload",
                  },
                  api: uploadProductByIdURL,
                });
              }}
            >
              <UploadOutlined /> Upload Products
            </div>}
          ]},
          {
            title: "Shopify Actions",
            items: [
              {content:   <div
                key="Sync Details"
                onClick={() => {
                  let postData = [];
                  selectedRows.forEach((selectedRow) => {
                    let { container_id } = selectedRow;
                    postData.push(container_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Details",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      product_id: postData,
                    },
                    api: syncProductDetails,
                  });
                }}
              >
                <SyncOutlined /> Sync Details
              </div>},
              {content:   <div
                key="Sync Inventory eBay"
                onClick={() => {
                  let postData = {
                    product_id: [],
                    sync: ["inventory"],
                    action: "shopify_to_app",
                  };
                  selectedRows.forEach((selectedRow) => {
                    // let { source_product_id } = selectedRow;
                    // postData.product_id.push(source_product_id);
                    let { container_id } = selectedRow;
                    postData.product_id.push(container_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Inventory",
                    actionName: postActionOnProductById,
                    actionPayload: postData,
                    api: syncInventoryPrice,
                  });
                }}
              >
                <FileTextOutlined /> Sync Inventory
              </div>},{content:
              <div
                key="Sync Price eBay"
                onClick={() => {
                  let postData = {
                    product_id: [],
                    sync: ["price"],
                    action: "shopify_to_app",
                  };
                  selectedRows.forEach((selectedRow) => {
                    // let { source_product_id } = selectedRow;
                    // postData.product_id.push(source_product_id);
                    let { container_id } = selectedRow;
                    postData.product_id.push(container_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Price",
                    actionName: postActionOnProductById,
                    actionPayload: postData,
                    api: syncInventoryPrice,
                  });
                }}
              >
                <DollarOutlined /> Sync Price
              </div>},
              {content:
              <div
                key="Import metafileds of products"
                onClick={() => {
                  let postData = [];
                  selectedRows.forEach((selectedRow) => {
                    let { container_id } = selectedRow;
                    postData.push(container_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Import metafileds of products",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      product_id: postData,
                    },
                    api: importMetaFieldURL,
                  });
                }}
              >
                <DownloadOutlined /> Import metafileds of products
              </div>}
            ]
          },
          {
            title: "Other Actions",
            items:[
              {content:  <div
                key="Export"
                onClick={() => {
                  let postData = [];
                  selectedRows.forEach((selectedRow) => {
                    let { source_product_id } = selectedRow;
                    postData.push(source_product_id);
                  });
                  setModal({
                    ...modal,
                    active: true,
                    content: "Export Product",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      product_id: postData,
                    },
                    api: exportProductItemURL,
                  });
                }}
              >
                <ExportOutlined /> Export Products
              </div>},{ content:
              <div
                key="Disable"
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
                <EyeInvisibleOutlined /> Disable Products
              </div>}
            ]
          }
          ]}/>
</Popover>
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
                  // if (modal.content === "Disable Product") {
                  //   props.history.push("disabledproducts");
                  // } else props.history.push("activity");
                  let { success, message, data } = await modal.actionName(
                    modal.api,
                    modal.actionPayload
                  );
                  if (success) {
                    notify.success(message ? message : data);
                    if (modal.content === "Disable Product") {
                      props.history.push("/panel/ebay/disabledproducts");
                    } else props.history.push("/panel/ebay/activity");
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

export default withRouter(ProductMassMenu);
