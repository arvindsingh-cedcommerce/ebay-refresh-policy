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
  FormLayout,
  Modal,
  Popover,
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

const CsvBulkMenu = (props) => {
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
      <Popover
        active={props.isCsvBulkMenuOpen}
        activator={
          <Button
            onClick={() =>
              props.setCallbackCsvFunction(!props.isCsvBulkMenuOpen)
            }
          >
            <div>
              CSV Actions <DownOutlined />
            </div>
          </Button>
        }
        autofocusTarget="first-node"
        onClose={() => {
          props.setCallbackCsvFunction(false);
        }}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: (
                <div
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
                </div>
              ),
            },
            {
              content: (
                <div
                  key="Import"
                  onClick={() => {
                    props.history.push("/panel/ebay/products/bulkupdate");
                  }}
                >
                  <ImportOutlined /> Bulk Update
                </div>
              ),
            },
          ]}
        />
      </Popover>

      {/* <Dropdown
          key="csvbulkAction"
          overlayStyle={{
            maxHeight: "40rem",
            zIndex: 50,
            borderRadius: "10px !important",
            border: '1px solid #e2d8d8'
          }}
          visible={props.isCsvBulkMenuOpen}
          // arrow={true}
          overlay={
            <Menu
            //  className={scroll ? "bulk-dropdown-hide" : "bulk-dropdown-show"}
            >

              <Menu.ItemGroup key="g12" title="">
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
                    props.history.push("/panel/ebay/products/bulkupdate");
                  }}
                >
                  <ImportOutlined /> Bulk Update
                </Menu.Item>
              </Menu.ItemGroup>
            
            </Menu>
          }
          trigger={["click"]}
        >
          <Button onClick={() => props.setCallbackCsvFunction(!props.isCsvBulkMenuOpen)}>
            <div>
              CSV Actions <DownOutlined />
            </div>
          </Button>
        </Dropdown> */}

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

export default withRouter(CsvBulkMenu);
