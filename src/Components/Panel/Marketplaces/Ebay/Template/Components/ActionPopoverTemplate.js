import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Icon, Modal, Stack, Button as ShopifyButton } from "@shopify/polaris";
import { MobileVerticalDotsMajorMonotone } from "@shopify/polaris-icons";
import { Popover, Button } from "antd";
import React, { useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import { deleteTemplateID } from "../../../../../../APIrequests/TemplatesAPI";
import { notify } from "../../../../../../services/notify";
import { deleteTempalteURL } from "../../../../../../URLs/TemplateURLS";

const ActionPopoverTemplate = ({
  record,
  hitRequiredFuncs,
  cbFunc,
  ...props
}) => {
  const [deleteTemplateModalStatus, setDeleteTemplateModalStatus] =
    useState(false);
  const [deleteTemplateModalLoader, setDeleteTemplateModalLoader] =
    useState(false);

  const deleteTemplate = async (record) => {
    setDeleteTemplateModalLoader(true);
    let { templateId } = record;
    let { success, message } = await deleteTemplateID(deleteTempalteURL, {
      templateId,
    });
    if (success) {
      notify.success(message);
      hitRequiredFuncs();
      cbFunc();
    } else {
      notify.error(message);
      hitRequiredFuncs();
    }
    setDeleteTemplateModalLoader(false);
    setDeleteTemplateModalStatus(false);
  };

  const getContent = (record) => {
    return (
      <Stack vertical spacing="extraTight">
        <Button
          type="text"
          onClick={(e) => {
            let { templateId, templateType, siteID, shopID } = record;
            if (templateType === "Category") {
              props.history.push(
                `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}&siteID=${siteID}&shopID=${shopID}`
              );
            } else {
              props.history.push(
                `/panel/ebay/templatesUS/handler?type=${templateType.toLowerCase()}&id=${templateId}`
              );
            }
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
          onClick={() => setDeleteTemplateModalStatus(true)}
        >
          <Stack>
            <DeleteOutlined />
            <>Delete</>
          </Stack>
        </Button>
      </Stack>
    );
  };
  const handleChange = useCallback(
    () => setDeleteTemplateModalStatus(!deleteTemplateModalStatus),
    [deleteTemplateModalStatus]
  );
  return (
    <center>
      <Popover content={getContent(record)} placement="right">
        <Button type="text">
          <Icon source={MobileVerticalDotsMajorMonotone} color="base" />
        </Button>
      </Popover>
      <Modal
        open={deleteTemplateModalStatus}
        onClose={handleChange}
        title="Permission required"
      >
        <Modal.Section>
          <Stack vertical spacing="extraTight">
            <p>Are you sure, you want to delete this template?</p>
            <Stack distribution="center" spacing="tight">
              <ShopifyButton onClick={handleChange}>Cancel</ShopifyButton>
              <ShopifyButton
                primary
                loading={deleteTemplateModalLoader}
                onClick={() => deleteTemplate(record)}
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

export default withRouter(ActionPopoverTemplate);
