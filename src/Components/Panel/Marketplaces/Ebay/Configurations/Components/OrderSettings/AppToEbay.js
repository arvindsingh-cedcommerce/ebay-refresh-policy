import { Card, FormLayout, Select, Stack, TextField } from "@shopify/polaris";
import { Radio, Switch } from "antd";
import React from "react";

const AppToEbay = ({
  account,
  connectedAccountsObject,
  setconnectedAccountsObject,
}) => {
  console.log(connectedAccountsObject);

  const clickHandler = (e, account, fieldType, whichField, ...fieldLevels) => {
    console.log(e, account, fieldType, whichField, fieldLevels);
    let temp = { ...connectedAccountsObject };
    if (fieldType === "boolean" || fieldType === "mapping") {
      switch (whichField) {
        case "fieldLevel1":
          temp[account]["fields"][fieldLevels[0]]["enable"] = e;
          break;
        case "fieldLevel2":
          temp[account]["fields"][fieldLevels[0]]["fields"][fieldLevels[1]][
            "enable"
          ] = e ? "yes" : "no";
        default:
          break;
      }
    } else if (fieldType === "textfield") {
      switch (whichField) {
        case "fieldLevel1":
          temp[account]["fields"][fieldLevels[0]]["enable"] = e;
          break;
        case "fieldLevel2":
          temp[account]["fields"][fieldLevels[0]]["fields"][fieldLevels[1]][
            "value"
          ] = e;
        case "fieldLevel3":
          temp[account]["fields"][fieldLevels[0]]["fields"][fieldLevels[1]][
            "fields"
          ][fieldLevels[2]]["value"] = e;
        default:
          break;
      }
    } else if (fieldType === "formBoolean") {
      switch (whichField) {
        case "fieldLevel1":
          temp[account]["fields"][fieldLevels[0]]["enable"] = e;
          break;
        case "fieldLevel2":
          temp[account]["fields"][fieldLevels[0]]["fields"][fieldLevels[1]][
            "enable"
          ] = e ? "yes" : "no";
        default:
          break;
      }
    } else if (fieldType === "dropdown") {
      switch (whichField) {
        case "fieldLevel2":
          temp[account]["fields"][fieldLevels[0]]["fields"][fieldLevels[1]][
            "value"
          ] = e;
          break;
      }
    }
    setconnectedAccountsObject(temp);
  };

  const getStruct = (account, fieldLevel1, fieldLevel2) => {
    let key =
      connectedAccountsObject[account]["fields"][fieldLevel1]["fields"][
        fieldLevel2
      ]["type"];
    let struct;
    switch (key) {
      case "boolean":
        struct = (
          <Stack spacing="extraTight">
            <>
              {
                connectedAccountsObject[account]["fields"][fieldLevel1][
                  "fields"
                ][fieldLevel2]["label"]
              }
            </>
            <Switch
              checked={
                connectedAccountsObject[account]["fields"][fieldLevel1][
                  "fields"
                ][fieldLevel2]["enable"] === "yes"
                  ? true
                  : false
              }
              onChange={(e) =>
                clickHandler(
                  e,
                  account,
                  key,
                  "fieldLevel2",
                  fieldLevel1,
                  fieldLevel2
                )
              }
            />
          </Stack>
        );
        break;
      case "textfield":
        struct = (
          <TextField
            label={
              connectedAccountsObject[account]["fields"][fieldLevel1]["fields"][
                fieldLevel2
              ]["label"]
            }
            value={
              connectedAccountsObject[account]["fields"][fieldLevel1]["fields"][
                fieldLevel2
              ]["value"]
            }
            onChange={(e) =>
              clickHandler(
                e,
                account,
                key,
                "fieldLevel2",
                fieldLevel1,
                fieldLevel2
              )
            }
          />
        );
        break;
      case "formBoolean":
        struct = (
          <Stack vertical>
            <Stack spacing="extraTight" alignment="baseline">
              <>
                {
                  connectedAccountsObject[account]["fields"][fieldLevel1][
                    "fields"
                  ][fieldLevel2]["label"]
                }
              </>
              <Switch
                checked={
                  connectedAccountsObject[account]["fields"][fieldLevel1][
                    "fields"
                  ][fieldLevel2]["enable"] === "yes"
                    ? true
                    : false
                }
                onChange={(e) =>
                  clickHandler(
                    e,
                    account,
                    key,
                    "fieldLevel2",
                    fieldLevel1,
                    fieldLevel2
                  )
                }
              />
            </Stack>
            {connectedAccountsObject[account]["fields"][fieldLevel1]["fields"][
              fieldLevel2
            ]["enable"] === "yes" && (
              <Card sectioned>
                <FormLayout>
                  <FormLayout.Group>
                    {Object.keys(
                      connectedAccountsObject[account]["fields"][fieldLevel1][
                        "fields"
                      ][fieldLevel2]["fields"]
                    ).map((field) => {
                      return (
                        <TextField
                          label={
                            connectedAccountsObject[account]["fields"][
                              fieldLevel1
                            ]["fields"][fieldLevel2]["fields"][field]["label"]
                          }
                          onChange={(e) =>
                            clickHandler(
                              e,
                              account,
                              "textfield",
                              "fieldLevel3",
                              fieldLevel1,
                              fieldLevel2,
                              field
                            )
                          }
                          value={
                            connectedAccountsObject[account]["fields"][
                              fieldLevel1
                            ]["fields"][fieldLevel2]["fields"][field]["value"]
                          }
                          type={field === "email" ? "email" : "text"}
                        />
                      );
                    })}
                  </FormLayout.Group>
                </FormLayout>
              </Card>
            )}
          </Stack>
        );
        break;
      case "mapping":
        struct = (
          <Stack spacing="extraTight">
            <>
              {
                connectedAccountsObject[account]["fields"][fieldLevel1][
                  "fields"
                ][fieldLevel2]["label"]
              }
            </>
            <Switch
              checked={
                connectedAccountsObject[account]["fields"][fieldLevel1][
                  "fields"
                ][fieldLevel2]["enable"] === "yes"
                  ? true
                  : false
              }
              onChange={(e) =>
                clickHandler(
                  e,
                  account,
                  key,
                  "fieldLevel2",
                  fieldLevel1,
                  fieldLevel2
                )
              }
            />
          </Stack>
        );
      default:
        break;
    }
    return <Card.Section>{struct}</Card.Section>;
  };
  return (
    <Card.Section title={`${account}`}>
      {Object.keys(connectedAccountsObject[account]["fields"]).map(
        (fieldLevel1) => {
          return (
            <Card
              sectioned
              title={
                connectedAccountsObject[account]["fields"][fieldLevel1]["label"]
              }
              actions={[
                {
                  content: (
                    <Radio.Group
                      buttonStyle="solid"
                      onChange={(e) =>
                        clickHandler(
                          e.target.value,
                          account,
                          "boolean",
                          "fieldLevel1",
                          fieldLevel1
                        )
                      }
                      value={
                        connectedAccountsObject[account]["fields"][fieldLevel1][
                          "enable"
                        ]
                      }
                    >
                      <Radio.Button value="yes">Yes</Radio.Button>
                      <Radio.Button value="no">No</Radio.Button>
                    </Radio.Group>
                  ),
                },
              ]}
            >
              {connectedAccountsObject[account]["fields"][fieldLevel1][
                "enable"
              ] === "yes" &&
                fieldLevel1 !== "orderCancelation" && (
                  <Stack spacing="extraLoose">
                    {Object.keys(
                      connectedAccountsObject[account]["fields"][fieldLevel1][
                        "fields"
                      ]
                    ).map((fieldLevel2) => {
                      return getStruct(account, fieldLevel1, fieldLevel2);
                    })}
                  </Stack>
                )}
              {fieldLevel1 === "orderCancelation" &&
                connectedAccountsObject[account]["fields"][fieldLevel1][
                  "enable"
                ] === "yes" && (
                  <Stack>
                    {Object.keys(
                      connectedAccountsObject[account]["fields"][fieldLevel1][
                        "fields"
                      ]
                    ).map((fieldLevel2) => {
                      return (
                        <Select
                          label={
                            connectedAccountsObject[account]["fields"][
                              fieldLevel1
                            ]["fields"][fieldLevel2]["label"]
                          }
                          options={
                            connectedAccountsObject[account]["fields"][
                              fieldLevel1
                            ]["fields"][fieldLevel2]["options"]
                          }
                          placeholder="Please Select..."
                          value={
                            connectedAccountsObject[account]["fields"][
                              fieldLevel1
                            ]["fields"][fieldLevel2]["value"]
                          }
                          onChange={(e) =>
                            clickHandler(
                              e,
                              account,
                              "dropdown",
                              "fieldLevel2",
                              fieldLevel1,
                              fieldLevel2
                            )
                          }
                        />
                      );
                    })}
                  </Stack>
                )}
            </Card>
          );
        }
      )}
    </Card.Section>
  );
};

export default AppToEbay;
