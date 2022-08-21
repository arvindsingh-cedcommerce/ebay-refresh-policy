import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Icon,
  Modal,
  Stack,
  Button as ShopifyButton,
  Link,
} from "@shopify/polaris";
import { MobileVerticalDotsMajorMonotone } from "@shopify/polaris-icons";
import { Popover, Button } from "antd";
import React, { useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import { deletePolicy } from "../../../../../../Apirequest/ebayApirequest/policiesApi";
import { notify } from "../../../../../../services/notify";

const ActionPopoverPolicy = ({
  record,
  hitRequiredFuncs,
  cbFunc,
  ...props
}) => {
  const [deletePolicyModalStatus, setDeletePolicyModalStatus] = useState(false);
  const [deletePolicyModalLoader, setDeletePolicyModalLoader] = useState(false);

  const getContent = (record) => {
    return (
      <Stack vertical spacing="extraTight">
        <Button
          type="text"
          onClick={() => {
            let { policyType, policyId, policySiteId, policyShopId } = record;
            props.history.push(
              `/panel/ebay/policy/handler?type=${policyType}&id=${policyId}&site_id=${policySiteId}&shop_id=${policyShopId}`
            );
          }}
        >
          <Stack>
            <EyeOutlined />
            <>View</>
          </Stack>
        </Button>
        <Button
          type="text"
          onClick={() => {
            let {
              policyType,
              policyId,
              policySiteId,
              policyShopId,
              policyDomainName,
            } = record;
            return window.open(
              `https://www.bizpolicy.ebay${policyDomainName}/businesspolicy/${policyType.toLowerCase()}?profileId=${policyId}`,
              "_blank"
            );
            // props.history.push(
            //   `/panel/ebay/policyUS/handler?type=${policyType}&id=${policyId}&site_id=${policySiteId}&shop_id=${policyShopId}`
            // );
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
          onClick={() => setDeletePolicyModalStatus(true)}
          // onClick={() => hitRequiredFuncs(record)}
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
    () => setDeletePolicyModalStatus(!deletePolicyModalStatus),
    [deletePolicyModalStatus]
  );
  const deletePolicyFunc = async (record) => {
    setDeletePolicyModalLoader(true);
    let { policySiteId, policyShopId, policyId, policyType } = record;
    let { success, message } = await deletePolicy({
      site_id: policySiteId,
      profile_ids: policyId,
      shop_id: policyShopId,
      type: `${policyType?.toLowerCase()}_policy`,
    });

    if (success) {
      notify.success(message);
      hitRequiredFuncs();
      cbFunc();
    } else {
      notify.error(message);
      hitRequiredFuncs();
    }

    setDeletePolicyModalLoader(false);
    setDeletePolicyModalStatus(false);
  };
  return (
    <center>
      <Popover content={getContent(record)} placement="right">
        <Button type="text">
          <Icon source={MobileVerticalDotsMajorMonotone} color="base" />
        </Button>
      </Popover>
      <Modal
        open={deletePolicyModalStatus}
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
                loading={deletePolicyModalLoader}
                onClick={() => deletePolicyFunc(record)}
                // onClick={
                //   // async () => {
                //   () => {
                //     deletePolicy(record);
                //     // setDeletePolicyModalLoader(true);
                //     // await hitRequiredFuncs(record);
                //     // setDeletePolicyModalLoader(false);
                //     // setDeletePolicyModalStatus(false);
                //   }
                // }
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

export default withRouter(ActionPopoverPolicy);
