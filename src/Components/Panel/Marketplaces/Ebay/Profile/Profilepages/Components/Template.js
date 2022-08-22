import { FormLayout, Select, Stack, Layout } from "@shopify/polaris";
import React from "react";

const Template = ({
  templateOptions,
  connectedAccountsObject,
  account,
  setconnectedAccountsObject,
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
                title={templateOption?.split("_")?.join(" ")?.toUpperCase()}
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

export default Template;
