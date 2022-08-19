import {
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Icon, Modal, Stack } from "@shopify/polaris";
import { MobileVerticalDotsMajorMonotone } from "@shopify/polaris-icons";
import { Button, Popover } from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { postActionOnProductById } from "../../../../../APIrequests/ProductsAPI";
import { uploadProductByIdURL } from "../../../../../URLs/ProductsURL";

const ActionPopover = (props) => {
  const { record } = props;
  const [actionPopoverVisible, setActionPopoverVisible] = useState(false);
  const [actionModal, setActionModal] = useState({
    title: "",
    active: false,
    value: "",
  });
  const getModalStructure = (title, active, value) => {
    setActionModal({ ...actionModal, title, active, value });
  };
  const getContent = (record) => (
    <Stack vertical spacing="extraTight">
      <Button type="text" onClick={(e) => {
          getModalStructure("Remove from app", true, "removeFromApp")
      }}>
        <Stack>
          <EditOutlined />
          <>Update Order</>
        </Stack>
      </Button>
      <Button type="text" onClick={async () => {}}>
        <Stack>
          <SyncOutlined />
          <>Sync Shipment</>
        </Stack>
      </Button>
      <Button
        type="text"
        onClick={async () => {
          const { source_product_id } = record;
          let postData = {
            product_id: source_product_id,
          };
          let data = await postActionOnProductById(
            uploadProductByIdURL,
            postData
          );
          //   if(data && Array.isArray(data) && data.length) {
          //     const uploadResultArray = data.map(uploadAccount => {
          //         if(uploadAccount?.message) {
          //             return
          //         }
          //     })
          //   }
          setActionPopoverVisible(false);
        }}
      >
        <Stack>
          <UploadOutlined />
          <>Upload</>
        </Stack>
      </Button>
      <Button type="text" danger onClick={() => {}}>
        <Stack>
          <DeleteOutlined />
          <>Remove from app</>
        </Stack>
      </Button>
    </Stack>
  );
  return (
    <center>
      <Popover
        content={getContent(record)}
        placement="right"
        trigger="click"
        visible={actionPopoverVisible}
        onVisibleChange={(e) => setActionPopoverVisible(e)}
      >
        <Button type="text">
          <Icon source={MobileVerticalDotsMajorMonotone} color="base" />
        </Button>
      </Popover>

      <Modal
        open={actionModal["active"]}
        onClose={() => setActionModal(false)}
        title={actionModal["title"]}
        primaryAction={{
          content: "OK",
          onAction: () => {
            switch (actionModal["value"]) {
              case "updateOrder":
                (async () => {
                  let {} = await massAction(updateOrderURL, {
                    order_ids: shopifyOrderID,
                    updateOrder,
                  });
                })();
                break;
            //   case "removeFromApp":
            //     (async () => {
            //       let {} = await massAction(removeOrdersURL, {
            //         order_ids: ebayOrderID,
            //       });
            //     })();
            //     break;
            //   case "syncShipment":
            //     (async () => {
            //       let {} = await massAction(syncShipmentURL, {
            //         order_ids: shopifyOrderID,
            //       });
            //     })();
            //     break;
            //   case "cancelOrder":
            //     (async () => {
            //       let {} = await massAction(cancelOrdersURl, {
            //         order_ids: ebayOrderID,
            //       });
            //     })();
            //     break;
            //   case "deleteOrder":
            //     (async () => {
            //       let {} = await massAction(deleteOrdersURL, {
            //         order_ids: shopifyOrderID,
            //       });
            //     })();
            //     break;
            //   default:
            //     break;
            }
            setActionModal(false);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setActionModal(false),
          },
        ]}
      >
        <Modal.Section>
          {actionModal.value === "updateOrder" ? (
            updateOrderActionStructure()
          ) : (
            <TextContainer>
              <p>Do you want to perfrom this action?</p>
            </TextContainer>
          )}
        </Modal.Section>
      </Modal>
    </center>
  );
};

export default withRouter(ActionPopover);
