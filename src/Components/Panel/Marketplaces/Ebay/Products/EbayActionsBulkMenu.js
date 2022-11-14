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
  ActionList,
  Banner,
  Button,
  ChoiceList,
  FormLayout,
  Modal,
  Popover,
  Select,
  Stack,
  Tag,
  TextField,
} from "@shopify/polaris";
import { Checkbox, Col, Dropdown, Menu, Row, Select as AntSelect } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  editProductById,
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
import { getCountyrName } from "../Template/Components/FinalTemplateGridComponent";

const EbayActionsBulkMenu = (props) => {
  const { profileList, connectedAccountsArray } = props;
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

  // import by id validation
  const [importByIdError, setImportByIdError] = useState(false);

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

  const checkImportProductById = (id) => {
    let validID = true;
    if (id.length != 13) {
      console.log(id.length);
      validID = false;
      setImportByIdError("Please enter valid product id having 13 digits");
    } else {
      setImportByIdError(false);
    }
    return validID;
  };

  // const [scroll, setScroll] = useState(false)
  useEffect(() => {
    window.addEventListener("scroll", () => {
      props.setCallbackEbayActionFunction(false);
      // setScroll(window.scrollY >= 10)
    });
  }, []);

  return (
    <>
      <Popover
        active={props.isEbayActionBulkMenuOpen}
        activator={
          <Button
            onClick={() =>
              props.setCallbackEbayActionFunction(
                !props.isEbayActionBulkMenuOpen
              )
            }
          >
            <div>
              eBay Actions <DownOutlined />
            </div>
          </Button>
        }
        autofocusTarget="first-node"
        onClose={() => {
          props.setCallbackEbayActionFunction(false);
        }}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: (
                <div
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
                </div>
              ),
            },
            {
              content: (
                <div
                  key="Revise Products"
                  onClick={() => {
                    let temp = { ...uploadAndReviseOnEbay };
                    temp["modal"]["active"] = true;
                    temp["modal"]["actionName"] = postActionOnProductById;
                    temp["modal"]["actionPayloadByAll"] = {
                      action: "revise",
                    };
                    temp["modal"]["actionPayloadById"] = {};
                    temp["modal"]["apiByAll"] = uploadProductByIdURL;
                    temp["modal"]["apiById"] = uploadProductByProfileURL;
                    setUploadAndReviseOnEbay(temp);
                  }}
                >
                  <RedoOutlined /> Revise Products
                </div>
              ),
            },
            {
              content: (
                <div
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
                </div>
              ),
            },
            {
              content: (
                <div
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
                </div>
              ),
            },
            {
              content: (
                <div
                  key="Match from eBay"
                  onClick={() => {
                    let temp = { ...matchFromEbayAccount };
                    temp["modal"]["active"] = true;
                    temp["modal"]["content"] = "Match From eBay";
                    temp["modal"]["actionName"] = postActionOnProductById;
                    temp["modal"]["actionPayload"] = {
                      shop_id: "",
                    };
                    if (connectedAccountsArray.length == 1) {
                      temp["modal"]["actionPayload"]["shop_id"] =
                        "" + connectedAccountsArray[0]["shopId"] + "";
                    }
                    temp["modal"]["api"] = matchFromEbayURL;
                    setMatchFromEbayAccount(temp);
                  }}
                >
                  <ShrinkOutlined /> Match from eBay
                </div>
              ),
            },
          ]}
        />
      </Popover>

      {/* <Dropdown
          key="eBaybulkAction"
          overlayStyle={{
            maxHeight: "40rem",
            zIndex: 50,
            borderRadius: "10px !important",
            border: '1px solid #e2d8d8'
          }}
          visible={props.isEbayActionBulkMenuOpen}
          // arrow={true}
          overlay={
            <Menu
            //  className={scroll ? "bulk-dropdown-hide" : "bulk-dropdown-show"}
            >

<Menu.ItemGroup key="g3" title="">
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
                key="Revise Products"
                onClick={() => {
                  let temp = { ...uploadAndReviseOnEbay };
                  temp["modal"]["active"] = true;
                  temp["modal"]["actionName"] = postActionOnProductById;
                  temp["modal"]["actionPayloadByAll"] = {
                    action: "revise",
                  };
                  temp["modal"]["actionPayloadById"] = {};
                  temp["modal"]["apiByAll"] = uploadProductByIdURL;
                  temp["modal"]["apiById"] = uploadProductByProfileURL;
                  setUploadAndReviseOnEbay(temp);
                }}
              >
                <RedoOutlined /> Revise Products
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

            
            </Menu>
          }
          trigger={["click"]}
        >
          <Button onClick={() => props.setCallbackEbayActionFunction(!props.isEbayActionBulkMenuOpen)}>
            <div>
              eBay Actions <DownOutlined />
            </div>
          </Button>
        </Dropdown> */}
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
                      // setModal({ ...modal, active: false });
                      let temp = { ...uploadAndReviseOnEbay };
                      temp["modal"]["active"] = false;
                      setUploadAndReviseOnEbay(temp);
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
                      // setModal({ ...modal, active: false });
                      let temp = { ...uploadAndReviseOnEbay };
                      temp["modal"]["active"] = false;
                      setUploadAndReviseOnEbay(temp);
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
            <Stack wrap={true}>
              <Stack.Item fill>
                <TextField
                  placeholder="Enter shopify product id"
                  value={importProductById["id"]}
                  onChange={(e) => {
                    setImportProductById({ ...importProductById, id: e });
                  }}
                  type="number"
                  min={0}
                  error={importByIdError}
                  // maxLength={13}
                  // autoComplete="off"
                  showCharacterCount
                />
              </Stack.Item>
              <Stack.Item>
                <Button
                  primary
                  onClick={() => {
                    const validID = checkImportProductById(
                      importProductById["id"]
                    );
                    if (validID) {
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
            {connectedAccountsArray.length > 1 && (
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
            )}
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

export default withRouter(EbayActionsBulkMenu);
