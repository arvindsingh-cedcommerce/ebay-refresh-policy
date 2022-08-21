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
import { deleteProfile } from "../../../../../Apirequest/ebayApirequest/profileApi";
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { notify } from "../../../../../services/notify";
import {
  disableItemURL,
  uploadProductByIdURL,
} from "../../../../../URLs/ProductsURL";

const ActionPopoverProfileGrid = (props) => {
  const { record, actionContent, getAllProfiles } = props;
  const [actionPopoverVisible, setActionPopoverVisible] = useState(false);

  // modal
  const [modal, setModal] = useState({
    active: false,
    content: "",
    actionName: "",
    actionPayload: {},
    api: "",
  });
  const [btnLoader, setBtnLoader] = useState(false);

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
            const { id } = record;
            props.history.push(`/panel/ebay/profiles/edit?id=${id}`);
          }}
        >
          <Stack>
            <EditOutlined />
            <>Edit</>
          </Stack>
        </Button>
        <Button
          type="text"
          danger
          onClick={async () => {
            let { id } = record;
            setModal({
              ...modal,
              active: true,
              content: "delete this profile",
              actionName: deleteProfile,
              actionPayload: id,
              functionsAfterCall: getAllProfiles,
              // api: matchFromEbayURL,
            });
            // let { id } = record;
            // let { success, message } = await deleteProfile(id);
            // if (success) {
            //   notify.success(message);
            //   getAllProfiles();
            // } else notify.error(message);
          }}
        >
          <Stack>
            <DeleteOutlined style={{ cursor: "pointer" }} />
            <>Delete</>
          </Stack>
        </Button>
      </Stack>
    );
  };
  return (
    <center>
      <Popover content={getContent(record)} placement="left">
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
            <p>Are you sure you want to {modal.content} ?</p>
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
                    modal.actionPayload
                  );
                  if (success) {
                    notify.success(message ? message : data);
                    // props.history.push("activity");
                    modal.functionsAfterCall()
                    setModal({ ...modal, active: false });
                  } else {
                    notify.error(message ? message : data);
                    setModal({ ...modal, active: false });
                  }
                  setBtnLoader(false);
                }}
                disabled={record?.accountStatus === "inactive" ? true : false}
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

export default withRouter(ActionPopoverProfileGrid);
