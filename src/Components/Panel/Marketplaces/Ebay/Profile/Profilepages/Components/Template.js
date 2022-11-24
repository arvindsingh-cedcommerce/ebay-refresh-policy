import {
  FormLayout,
  Select,
  Stack,
  Layout,
  Link,
  Icon,
  Tooltip,
} from "@shopify/polaris";
import { ExternalMinor, ExternalSmallMinor } from "@shopify/polaris-icons";
import React from "react";
import { withRouter } from "react-router-dom";

const Template = ({
  templateOptions,
  connectedAccountsObject,
  account,
  setconnectedAccountsObject,
  ...props
}) => {
  const handleChange = (e, templateOption) => {
    let temp = { ...connectedAccountsObject };
    temp[account][templateOption] = e;
    setconnectedAccountsObject(temp);
  };
  const getOptions = (templateOption) => {
    if (templateOption === "category_template") {
      let templateOptions100 = templateOptions[templateOption].filter(
        (template) => template["account"] === account
      );
      templateOptions100.unshift({
        label: "Please Select",
        value: "",
      });
      return templateOptions100;
    }
  };
  return (
    <Stack distribution="fill">
      <FormLayout>
        {Object.keys(templateOptions).map((templateOption, index) => {
          return (
            <Layout>
              <Layout.AnnotatedSection
                title={
                  <Stack spacing="extraTight">
                    <div>
                      {templateOption?.split("_")?.join(" ")?.toUpperCase()}
                    </div>
                    {connectedAccountsObject[account][templateOption] && (
                      <Tooltip content="View Template">
                        <Link
                          // monochrome
                          removeUnderline
                          onClick={(e) => {
                            if (templateOption == "category_template") {
                              let value =
                                connectedAccountsObject[account][
                                  templateOption
                                ];
                              let filtered = templateOptions[
                                templateOption
                              ].filter((item) => item.value == value);
                              let { siteId, shopId } = filtered?.[0];
                              return props.history.push(
                                `/panel/ebay/templates/handler?type=category&id=${value}&siteID=${siteId}&shopID=${shopId}`
                              );
                            } else {
                              let typeTemplate = templateOption.split("_")[0];
                              let value =
                                connectedAccountsObject[account][
                                  templateOption
                                ];
                              return props.history.push(
                                `/panel/ebay/templates/handler?type=${typeTemplate}&id=${value}`
                              );
                            }
                          }}
                        >
                          {/* {templateOption?.split("_")?.join(" ")?.toUpperCase()} */}

                          <Icon color="primary" source={ExternalSmallMinor} />
                        </Link>
                      </Tooltip>
                    )}
                  </Stack>
                }
              >
                <Select
                  key={index}
                  options={
                    templateOption !== "category_template"
                      ? templateOptions[templateOption]
                      : getOptions(templateOption)
                  }
                  onChange={(e) => handleChange(e, templateOption)}
                  value={connectedAccountsObject[account][templateOption]}
                  error={
                    connectedAccountsObject[account]["errors"][templateOption]
                  }
                />
              </Layout.AnnotatedSection>
            </Layout>
          );
        })}
      </FormLayout>
    </Stack>
  );
};

export default withRouter(Template);
