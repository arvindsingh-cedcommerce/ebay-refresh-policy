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
import {
  ActionList,
  Button,
  Modal,
  Popover,
  Select,
  Stack,
  Thumbnail,
} from "@shopify/polaris";
import { Dropdown, Image, Menu, Select as AntSelect } from "antd";
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
import { getCountyrName } from "../Template/Components/FinalTemplateGridComponent";

const ProductMassMenu = ({
  selectedRows,
  isOpen,
  setIsOpen,
  connectedAccountsArray,
  ...props
}) => {
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);
  // match from ebay
  const [matchFromEbayAccount, setMatchFromEbayAccount] = useState({
    modal: {
      active: false,
      content: "",
      actionName: "",
      actionPayload: {
        shop_id: "",
        product_id: [],
      },
      api: "",
    },
    btnLoader: false,
    account: "",
    siteID: "",
  });

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsOpen(false);
    });
  }, []);

  return (
    <>
      <Popover
        active={isOpen}
        activator={
          <Button
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
          </Button>
        }
        autofocusTarget="fourth-node"
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <ActionList
          actionRole="menuitem"
          sections={[
            {
              title: "eBay Actions",
              items: [
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
                    <div
                      key="Revise"
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
                          content: "Revise Products",
                          actionName: postActionOnProductById,
                          actionPayload: {
                            product_id: postData,
                            action: "revise",
                          },
                          api: uploadProductByIdURL,
                        });
                      }}
                    >
                      <RedoOutlined /> Revise Products
                    </div>
                  ),
                },

                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
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
                    </div>
                  ),
                },
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
                    <div
                      key="Match from eBay"
                      onClick={() => {
                        let postData = [];
                        selectedRows.forEach((selectedRow) => {
                          let { source_product_id, container_id } = selectedRow;
                          // postData.push(container_id);
                          postData.push(source_product_id);
                        });
                        let temp = { ...matchFromEbayAccount };
                        temp["modal"]["active"] = true;
                        temp["modal"]["content"] = "Match From eBay";
                        temp["modal"]["actionName"] = postActionOnProductById;
                        temp["modal"]["actionPayload"] = {
                          shop_id: "",
                          product_id: postData,
                        };
                        temp["modal"]["api"] = matchFromEbayURL;
                        setMatchFromEbayAccount(temp);
                      }}
                    >
                      <ShrinkOutlined /> Match from eBay
                    </div>
                  ),
                },
              ],
            },
            {
              title: "Shopify Actions",
              items: [
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
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
                    </div>
                  ),
                },
                {
                  content: (
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
                          content: "Import metafields of products",
                          actionName: postActionOnProductById,
                          actionPayload: {
                            product_id: postData,
                          },
                          api: importMetaFieldURL,
                        });
                      }}
                    >
                      <DownloadOutlined /> Import metafields of products
                    </div>
                  ),
                },
              ],
            },
            {
              title: "Other Actions",
              items: [
                {
                  content: (
                    <div
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
                    </div>
                  ),
                },
                {
                  content: (
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
                    </div>
                  ),
                },
              ],
            },
          ]}
        />
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
      <Modal
        open={matchFromEbayAccount.modal.active}
        onClose={() =>
          setMatchFromEbayAccount({
            modal: {
              active: false,
              content: "",
              actionName: "",
              actionPayload: {
                shop_id: "",
                product_id: [],
              },
              api: "",
            },
            btnLoader: false,
            account: "",
            siteID: "",
          })
        }
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="tight">
            <>
              Are you sure you want to initiate{" "}
              {matchFromEbayAccount.modal.content} bulk action ?
            </>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "10px" }}>
                {matchFromEbayAccount["siteID"] &&
                  getCountyrName(matchFromEbayAccount["siteID"])}
              </div>
              <div style={{ minWidth: "50%" }}>
                <Select
                  placeholder="Please Select..."
                  options={connectedAccountsArray}
                  value={
                    matchFromEbayAccount["modal"]["actionPayload"]["value"]
                  }
                  onChange={(e) => {
                    let temp = { ...matchFromEbayAccount };
                    temp["modal"]["actionPayload"]["value"] = e;
                    temp["modal"]["actionPayload"]["shop_id"] = e;
                    temp["siteID"] = connectedAccountsArray.filter(
                      (account) => account.value == e
                    )?.[0]?.siteID;
                    setMatchFromEbayAccount(temp);
                  }}
                />
              </div>
            </div>
            <Stack distribution="center" spacing="tight">
              <Button
                onClick={() =>
                  setMatchFromEbayAccount({
                    modal: {
                      active: false,
                      content: "",
                      actionName: "",
                      actionPayload: {
                        shop_id: "",
                        product_id: [],
                      },
                      api: "",
                    },
                    btnLoader: false,
                    account: "",
                    siteID: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                primary
                loading={matchFromEbayAccount["btnLoader"]}
                disabled={
                  !matchFromEbayAccount["modal"]["actionPayload"]["shop_id"]
                }
                onClick={async () => {
                  setMatchFromEbayAccount({
                    ...matchFromEbayAccount,
                    btnLoader: true,
                  });
                  let { success, message, data } =
                    await matchFromEbayAccount.modal.actionName(
                      matchFromEbayAccount.modal.api,
                      // matchFromEbayAccount.modal.actionPayload
                      {
                        shop_id:
                          matchFromEbayAccount.modal.actionPayload.shop_id,
                        product_id:
                          matchFromEbayAccount.modal.actionPayload.product_id,
                      }
                    );
                  if (success) {
                    notify.success(message ? message : data);
                    props.history.push("/panel/ebay/activity");
                  } else {
                    setMatchFromEbayAccount({
                      modal: {
                        active: false,
                        content: "",
                        actionName: "",
                        actionPayload: {
                          shop_id: "",
                          product_id: [],
                        },
                        api: "",
                      },
                      btnLoader: false,
                      account: "",
                      siteID: "",
                      btnLoader: false,
                    });
                    notify.error(message ? message : data);
                  }
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
