import {
  Button,
  Card,
  Checkbox,
  Layout,
  Select,
  Stack,
} from "@shopify/polaris";
import React from "react";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
import { notify } from "../../../../../../../services/notify";

const ShopifyToApp = ({
  optionsVar,
  setOptionsVar,
  shopifyToAppFieldsAll,
  setShopifyToAppFieldsAll,
}) => {
  const saveData = async () => {
    let temp = {
      shopify_to_app: {},
    };
    Object.keys(optionsVar).forEach((option) => {
      temp["shopify_to_app"][option] = {};
      for (const key in optionsVar[option]) {
        if (key === "enable") {
          temp["shopify_to_app"][option][key] = optionsVar[option][key];
        } else if (key === "attribute") {
          temp["shopify_to_app"][option][key] = {};
          for (const attribute in optionsVar[option][key]) {
            temp["shopify_to_app"][option][key][attribute] =
              optionsVar[option][key][attribute]["value"];
          }
        }
      }
    });
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      temp
    );
    if (success) {
      notify.success(message);
    }
  };
  return (
    <Card
      sectioned
      title="Shopify To App"
      actions={[
        {
          content: (
            <Button primary onClick={saveData}>
              Save
            </Button>
          ),
        },
      ]}
    >
      <Card.Section>
        <Stack>
          {Object.keys(optionsVar).map((option) => {
            return (
              <Select
                label={optionsVar[option]["label"]}
                options={optionsVar[option]["options"]}
                value={optionsVar[option]["enable"]}
                onChange={(e) => {
                  let temp = { ...optionsVar };
                  temp[option]["enable"] = e;
                  setOptionsVar(temp);
                }}
                placeholder="Please select..."
              />
            );
          })}
        </Stack>
      </Card.Section>
      {optionsVar["auto_product_sync"]["enable"] === "yes" && (
        <Layout>
          <Layout.Section>
            <Card title="Fields" sectioned>
              <Stack>
                {Object.keys(optionsVar["auto_product_sync"]["attribute"]).map(
                  (field) => {
                    if (field !== "all") {
                      return (
                        <Checkbox
                          label={
                            optionsVar["auto_product_sync"]["attribute"][field][
                              "label"
                            ]
                          }
                          checked={
                            optionsVar["auto_product_sync"]["attribute"][field][
                              "value"
                            ] === "yes"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            let parsedValue = e ? "yes" : "no";
                            let temp = { ...optionsVar };
                            temp["auto_product_sync"]["attribute"][field][
                              "value"
                            ] = parsedValue;
                            setOptionsVar(temp);
                          }}
                        />
                      );
                    }
                  }
                )}
              </Stack>
            </Card>
          </Layout.Section>
          {/* <Layout.Section secondary>
            <Card title="All Fields" sectioned>
              <Checkbox
                label="All"
                checked={shopifyToAppFieldsAll}
                onChange={(e) => {
                  setShopifyToAppFieldsAll(e);
                }}
              />
            </Card>
          </Layout.Section> */}
        </Layout>
      )}
    </Card>
  );
};

export default ShopifyToApp;
