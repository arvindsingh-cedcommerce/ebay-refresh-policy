import {
  DollarOutlined,
  DownloadOutlined,
  DownOutlined,
  ExportOutlined,
  FileTextOutlined,
  ImportOutlined,
  RedoOutlined,
  ShrinkOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Banner,
  Button,
  FormLayout,
  Modal,
  Select,
  Stack,
  Tag,
  TextField,
} from "@shopify/polaris";
import { Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  fetchProductById,
  getrequest,
  postActionOnProductById,
} from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  exportProductItemURL,
  importByIdURL,
  importCollectionProductURL,
  importMetaFieldURL,
  importProductURL,
  matchFromEbayURL,
  syncInventoryPrice,
  syncProductDetails,
  uploadProductByIdURL,
  uploadProductByProfileURL,
} from "../../../../../URLs/ProductsURL";

const ProductBulkMenu = (props) => {
  const { profileList } = props;
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);
  const [importProductById, setImportProductById] = useState({
    id: "",
    modal: {
      active: false,
      content: "",
      actionName: "",
      actionPayload: {},
      api: "",
    },
    btnLoader: false,
    idArray: [],
  });
  const [uploadAndReviseOnEbay, setUploadAndReviseOnEbay] = useState({
    modal: {
      active: false,
      content: "",
      actionName: "",
      actionPayload: {},
      api: "",
    },
    btnLoader: false,
  });
  const [selectedProfle, setSelectedProfle] = useState("all");

  return (
    <>
      <Dropdown
        key="bulkAction"
        overlay={
          <Menu>
            <Menu.ItemGroup key="g3" title="eBay Actions">
              <Menu.Item
                key="Match from eBay"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Match From eBay",
                    actionName: getrequest,
                    actionPayload: {},
                    api: matchFromEbayURL,
                  })
                }
              >
                <ShrinkOutlined /> Match from eBay
              </Menu.Item>
              <Menu.Item
                key="Upload and Revise"
                onClick={() => {
                  let temp = { ...uploadAndReviseOnEbay };
                  temp["modal"]["active"] = true;
                  temp["modal"]["actionName"] = postActionOnProductById;
                  temp["modal"]["actionPayloadByAll"] = {
                    action: "upload_and_revise",
                  };
                  temp["modal"]["actionPayloadById"] = {};
                  temp["modal"]["apiByAll"] = uploadProductByIdURL;
                  temp["modal"]["apiById"] = uploadProductByProfileURL;
                  setUploadAndReviseOnEbay(temp);
                }}
              >
                <RedoOutlined /> Upload and Revise
              </Menu.Item>
              <Menu.Item
                key="Sync Inventory"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Inventory",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      sync: ["inventory"],
                      action: "app_to_marketplace",
                    },
                    api: syncInventoryPrice,
                  })
                }
              >
                <FileTextOutlined /> Sync Inventory
              </Menu.Item>
              <Menu.Item
                key="Sync Price"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Price",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      sync: ["price"],
                      action: "app_to_marketplace",
                    },
                    api: syncInventoryPrice,
                  })
                }
              >
                <DollarOutlined /> Sync Price
              </Menu.Item>
              <Menu.Item
                key="Upload Products"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Upload Products",
                    actionName: postActionOnProductById,
                    actionPayload: { action: "upload" },
                    api: uploadProductByIdURL,
                  })
                }
              >
                <UploadOutlined /> Upload Products
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g1" title="CSV Actions">
              <Menu.Item
                key="Export"
                onClick={() => {
                  setModal({
                    ...modal,
                    active: true,
                    content: "Export Products",
                    actionName: fetchProductById,
                    actionPayload: {},
                    api: exportProductItemURL,
                  });
                }}
              >
                <ExportOutlined /> Export Products
              </Menu.Item>
              <Menu.Item
                key="Import"
                onClick={() => {
                  props.history.push('/panel/ebay/products/bulkupdate')
                }}
              >
                <ImportOutlined /> Bulk Update
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.Divider />
            <Menu.ItemGroup key="g2" title="Shopify Actions">
              <Menu.Item
                key="Import Products"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Import Products",
                    actionName: getrequest,
                    actionPayload: {},
                    api: importProductURL,
                  })
                }
              >
                <DownloadOutlined /> Import Products
              </Menu.Item>
              <Menu.Item
                key="Sync Inventory Shopify"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Inventory",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      sync: ["inventory"],
                      action: "shopify_to_app",
                    },
                    api: syncInventoryPrice,
                  })
                }
              >
                <FileTextOutlined /> Sync Inventory
              </Menu.Item>
              <Menu.Item
                key="Sync Price Shopify"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Price",
                    actionName: postActionOnProductById,
                    actionPayload: {
                      sync: ["price"],
                      action: "shopify_to_app",
                    },
                    api: syncInventoryPrice,
                  })
                }
              >
                <DollarOutlined /> Sync Price
              </Menu.Item>
              <Menu.Item
                key="Sync Details"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Sync Details",
                    actionName: getrequest,
                    actionPayload: {},
                    api: syncProductDetails,
                  })
                }
              >
                <SyncOutlined /> Sync Details
              </Menu.Item>
              <Menu.Item
                key="Import Collection Products"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Import Collection Products",
                    actionName: getrequest,
                    actionPayload: {},
                    api: importCollectionProductURL,
                  })
                }
              >
                <DownloadOutlined /> Import Collection Products
              </Menu.Item>
              <Menu.Item
                key="Import metafileds of products"
                onClick={() =>
                  setModal({
                    ...modal,
                    active: true,
                    content: "Import metafileds of products",
                    actionName: getrequest,
                    actionPayload: {},
                    api: importMetaFieldURL,
                  })
                }
              >
                <DownloadOutlined /> Import metafileds of products
              </Menu.Item>
              <Menu.Item
                key="Import product by Id"
                onClick={
                  () => {
                    let temp = { ...importProductById };
                    temp["modal"]["active"] = true;
                    temp["modal"]["actionName"] = postActionOnProductById;
                    temp["modal"]["actionPayload"] = {
                      product_id: [],
                    };
                    temp["modal"]["api"] = importByIdURL;
                    setImportProductById(temp);
                  }
                  // setModal({
                  //   ...modal,
                  //   active: true,
                  //   content: (
                  //     <>
                  //       <TextField placeholder="" />
                  //     </>
                  //   ),
                  //   actionName: getrequest,
                  //   actionPayload: {},
                  //   api: importMetaFieldURL,
                  // })
                }
              >
                <DownloadOutlined /> Import product by Id
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.Divider />
          </Menu>
        }
        trigger={["click"]}
      >
        <Button>
          <div>
            Bulk Actions <DownOutlined />
          </div>
        </Button>
      </Dropdown>
      <Modal
        open={uploadAndReviseOnEbay.modal.active}
        onClose={() => {
          let temp = { ...uploadAndReviseOnEbay };
          temp["modal"]["active"] = false;
          setUploadAndReviseOnEbay(temp);
        }}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="tight">
            <Banner status="info">
              If you want to upload the product(s) with single profile kindly
              select one from below and click on Upload, or your all product(s)
              get uploaded with all profiles.
            </Banner>
            <Select
              options={profileList}
              label="Select profile"
              value={selectedProfle}
              onChange={(e) => {
                setSelectedProfle(e);
              }}
              placeholder="Please Select..."
            />
            <Stack distribution="center" spacing="tight">
              <Button
                onClick={() => {
                  let temp = { ...uploadAndReviseOnEbay };
                  temp["modal"]["active"] = false;
                  setUploadAndReviseOnEbay(temp);
                  setSelectedProfle("");
                }}
              >
                Cancel
              </Button>
              <Button
                primary
                loading={btnLoader}
                onClick={async () => {
                  setBtnLoader(true);
                  if (selectedProfle === "all") {
                    let { success, message, data } =
                      await uploadAndReviseOnEbay.modal.actionName(
                        uploadAndReviseOnEbay.modal.apiByAll,
                        uploadAndReviseOnEbay.modal.actionPayloadByAll
                      );
                    if (success) {
                      notify.success(message ? message : data);
                      props.history.push("/panel/ebay/activity");
                    } else {
                      notify.error(message ? message : data);
                      setModal({ ...modal, active: false });
                    }
                  } else if (selectedProfle !== "") {
                    let selectedProfleDetails = profileList.find(
                      (profile) => profile.value === selectedProfle
                    );
                    let { success, message, data } =
                      await uploadAndReviseOnEbay.modal.actionName(
                        uploadAndReviseOnEbay.modal.apiById,
                        { profile_id: selectedProfleDetails.profileId }
                      );
                    if (success) {
                      notify.success(message ? message : data);
                      props.history.push("/panel/ebay/activity");
                    } else {
                      notify.error(message ? message : data);
                      setModal({ ...modal, active: false });
                    }
                  }
                  setBtnLoader(false);
                }}
              >
                Upload
              </Button>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
      <Modal
        open={importProductById.modal.active}
        onClose={() => {
          // let temp = { ...importProductById };
          // temp["modal"]["active"] = false;
          // setImportProductById(temp);
          setImportProductById({
            id: "",
            modal: {
              active: false,
              content: "",
              actionName: "",
              actionPayload: {},
              api: "",
            },
            btnLoader: false,
            idArray: [],
          });
          // setModal({ ...modal, active: false });
        }}
        title="Permission required"
      >
        <Modal.Section>
          {/* <FormLayout> */}
          <Stack vertical spacing="tight">
            <Stack alignment="center">
              <Stack.Item fill>
                <TextField
                  placeholder="Enter shopify product id"
                  value={importProductById["id"]}
                  onChange={(e) => {
                    setImportProductById({ ...importProductById, id: e });
                  }}
                  type="number"
                  min={0}
                />
              </Stack.Item>
              <Stack.Item>
                <Button
                  primary
                  onClick={() => {
                    let temp = { ...importProductById };
                    if (
                      !importProductById["idArray"].includes(
                        importProductById["id"]
                      )
                    ) {
                      temp["idArray"].push(importProductById["id"]);
                      temp["id"] = "";
                      temp["modal"]["actionPayload"]["product_id"].push(
                        importProductById["id"]
                      );
                      setImportProductById(temp);
                    }
                  }}
                  disabled={importProductById["id"] === ""}
                >
                  Add
                </Button>
              </Stack.Item>
            </Stack>
            {importProductById["idArray"].length && (
              <Banner status="info">
                <>Selected product id(s) will get imported!</>
              </Banner>
            )}
            <Stack>
              {importProductById["idArray"].map((id, index) => (
                <Tag
                  onRemove={() => {
                    let temp = { ...importProductById };
                    temp["idArray"].splice(index, 1);
                    setImportProductById(temp);
                  }}
                >
                  {id}
                </Tag>
              ))}
            </Stack>
            <Stack distribution="center" spacing="tight">
              <Button
                onClick={() => {
                  // setModal({ ...modal, active: false });
                  let temp = { ...importProductById };
                  temp["modal"]["active"] = false;
                  setImportProductById(temp);
                }}
              >
                Cancel
              </Button>
              <Button
                primary
                loading={importProductById.btnLoader}
                disabled={!importProductById.idArray.length}
                onClick={async () => {
                  setImportProductById({
                    ...importProductById,
                    btnLoader: true,
                  });
                  let { success, message, data } =
                    await importProductById.modal.actionName(
                      importProductById.modal.api,
                      importProductById.modal.actionPayload
                    );
                  if (success) {
                    notify.success(message ? message : data);
                    props.history.push("/panel/ebay/activity");
                  } else {
                    notify.error(message ? message : data);
                    let temp = { ...importProductById };
                    temp["modal"]["active"] = false;
                    setImportProductById(temp);
                  }
                  setImportProductById({
                    ...importProductById,
                    btnLoader: false,
                  });
                }}
              >
                OK
              </Button>
            </Stack>
          </Stack>
          {/* </FormLayout> */}
        </Modal.Section>
      </Modal>
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>
              Are you sure you want to initiate {modal.content} bulk action ?
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

export default withRouter(ProductBulkMenu);
