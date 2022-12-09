import {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Layout,
  Select,
  Stack,
} from "@shopify/polaris";
import React, { useEffect } from "react";
import { Radio } from "antd";
import { configurationAPI } from "../../../../../../../APIrequests/ConfigurationAPI";
import { saveAppSettingsShopifyToAppURL } from "../../../../../../../URLs/ConfigurationURL";
import { notify } from "../../../../../../../services/notify";

const ShopifyToApp = ({ optionsVar, setOptionsVar }) => {
  const handleBtnPres = (e, option) => {
    let temp = { ...optionsVar };
    temp[option]["enable"] = temp[option]["enable"] === "yes" ? "no" : "yes";
    if (optionsVar["autoProductSync"]["enable"] === "no") {
      Object.keys(temp["autoProductSync"]["attribute"]).map((field) => {
        temp["autoProductSync"]["attribute"][field]["value"] = "no";
      });
    }
    setOptionsVar(temp);
  };

  const saveData = async () => {
    let temp = {
      shopify_to_app: {},
      setting_type: 'product_settings'
    }
    Object.keys(optionsVar).forEach(option => {
      temp['shopify_to_app'][option] = {}
      for (const key in optionsVar[option]) {
        if (key === 'enable') {
          temp["shopify_to_app"][option][key] = optionsVar[option][key];
        } else if (key === "attribute") {
          temp["shopify_to_app"][option][key] = {};
          for (const attribute in optionsVar[option][key]) {
            temp["shopify_to_app"][option][key][attribute] =
              optionsVar[option][key][attribute]["value"];
          }
        }
      }
    })
    console.log(temp);
    let { success, message } = await configurationAPI(
      saveAppSettingsShopifyToAppURL,
      temp
    );
    if (success) {
      notify.success(message);
    }
  }

  return (
    <Card
      sectioned
      title="Shopify To App"
      actions={[
        {
          content: (
            <Button primary onClick={() => saveData()}>
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
              <Stack vertical spacing="extraTight">
                <>{optionsVar[option]["label"]}</>
                <Radio.Group
                  defaultValue="a"
                  buttonStyle="solid"
                  onChange={(e) => handleBtnPres(e, option)}
                  value={optionsVar[option]["enable"]}
                >
                  <Radio.Button value="yes">Yes</Radio.Button>
                  <Radio.Button value="no">No</Radio.Button>
                </Radio.Group>
              </Stack>
            );
          })}
        </Stack>
      </Card.Section>
      {optionsVar["autoProductSync"]["enable"] === "yes" && (
        <Card title="Fields" sectioned>
          <Stack>
            {Object.keys(optionsVar["autoProductSync"]["attribute"]).map(
              (field) => {
                return (
                  <Checkbox
                    label={
                      optionsVar["autoProductSync"]["attribute"][field]["label"]
                    }
                    checked={
                      optionsVar["autoProductSync"]["attribute"][field][
                        "value"
                      ] === "yes"
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      let parsedValue = e ? "yes" : "no";
                      let temp = { ...optionsVar };
                      temp["autoProductSync"]["attribute"][field]["value"] =
                        parsedValue;
                      setOptionsVar(temp);
                    }}
                  />
                );
              }
            )}
          </Stack>
        </Card>
      )}
    </Card>
  );
};

export default ShopifyToApp;
