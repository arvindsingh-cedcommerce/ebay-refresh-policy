import {
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Icon, Modal, Stack, Button as ShopifyButton } from "@shopify/polaris";
import { MobileVerticalDotsMajorMonotone } from "@shopify/polaris-icons";
import { Button, Popover } from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  disableItemURL,
  uploadProductByIdURL,
} from "../../../../../URLs/ProductsURL";

const ActionPopover = (props) => {
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

  const { record, actionContent } = props;
  const [actionPopoverVisible, setActionPopoverVisible] = useState(false);
  const getContent = (record) => {
    if (Array.isArray(actionContent) && actionContent.length) {
      return actionContent.map((action) => {
        return (
          <Button
            type="text"
            onClick={async () => {
              const { container_id, source_product_id } = record;
              let postData = [container_id];
              let { success, data, message } = await postActionOnProductById(
                disableItemURL,
                { product_id: postData, status: "Enable" }
              );
              if (success) {
                notify.success(data);
              } else {
                notify.error(message);
              }
            }}
          >
            <Stack>
              <UploadOutlined />
              <>{action}</>
            </Stack>
          </Button>
        );
      });
    }
    return (
      <Stack vertical spacing="extraTight">
        <Button
          type="text"
          onClick={(e) => {
            const { container_id, source_product_id } = record;
            return props.history.push(
              `/panel/ebay/viewproducts?id=${container_id}&source_product_id=${source_product_id}`
            );
          }}
        >
          <Stack>
            <EditOutlined />
            <>Edit</>
          </Stack>
        </Button>
        <Button
          type="text"
          onClick={() => {
            const { source_product_id } = record;
            let postData = {
              product_id: source_product_id,
            };
            setModal({
              ...modal,
              active: true,
              content: "Upload and Revise on eBay",
              actionName: postActionOnProductById,
              actionPayload: postData,
              api: uploadProductByIdURL,
            });
            setActionPopoverVisible(false);
          }}
        >
          <Stack>
            <UploadOutlined />
            <>Upload & Revise</>
          </Stack>
        </Button>
        <Button type="text" danger onClick={() => {}}>
          <Stack>
            <DeleteOutlined />
            <>End</>
          </Stack>
        </Button>
      </Stack>
    );
  };
  return (
    <center>
      <Popover
        content={getContent(record)}
        placement="right"
        // trigger="click"
        // destroyTooltipOnHide={true}
        // visible={actionPopoverVisible}
        // onVisibleChange={(e) => setActionPopoverVisible(e)}
      >
        <Button type="text">
          <Icon source={MobileVerticalDotsMajorMonotone} color="base" />
        </Button>
      </Popover>
      <Modal
        open={modal.active}
        onClose={() => setModal({ ...modal, active: false })}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>Are you sure you want to initiate {modal.content} action ?</p>
            <Stack distribution="center" spacing="tight">
              <ShopifyButton
                onClick={() => setModal({ ...modal, active: false })}
              >
                Cancel
              </ShopifyButton>
              <ShopifyButton
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
              </ShopifyButton>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
    </center>
  );
};

export default withRouter(ActionPopover);
