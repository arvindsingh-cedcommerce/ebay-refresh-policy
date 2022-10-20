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
  
  const EbayActionsBulkMenu = (props) => {
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
  
    // import by id validation
    const [importByIdError, setImportByIdError] = useState(false);
  
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
        props.setCallbackCsvFunction(false);
        // setScroll(window.scrollY >= 10)
      });
    }, []);
  
    return (
      <>
        <Dropdown
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

            
            </Menu>
          }
          trigger={["click"]}
        >
          <Button onClick={() => props.setCallbackEbayActionFunction(!props.isEbayActionBulkMenuOpen)}>
            <div>
              eBay Bulk Actions <DownOutlined />
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
  
  export default withRouter(EbayActionsBulkMenu);