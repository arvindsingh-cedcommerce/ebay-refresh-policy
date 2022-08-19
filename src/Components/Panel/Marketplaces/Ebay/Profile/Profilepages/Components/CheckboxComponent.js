import { Stack, Checkbox } from '@shopify/polaris';
import {  Image } from 'antd';
import React, { useEffect } from 'react'

const CheckboxComponent = ({
    connectedAccountsObject,
    setconnectedAccountsObject, panes, setPanes,setCheckboxError
}) => {
    return (
        <Stack>
            <>Account Selection-:</>

            {connectedAccountsObject &&
                Object.keys(connectedAccountsObject).map((account, index) => {
                    return (
                        <Stack alignment="fill" spacing="tight">
                        <Checkbox
                        label={connectedAccountsObject[account]["siteID"] ? (
                            <Stack alignment="fill" spacing="tight">
                              <Image
                                preview={false}
                                width={25}
                                src={
                                  connectedAccountsObject[account]["siteID"] &&
                                  require(`../../../../../../..//assets/flags/${connectedAccountsObject[account]["siteID"]}.png`)
                                }
                                style={{ borderRadius: "50%" }}
                              />
                              <>{account.split("-")[1]}</>
                            </Stack>
                          ) : (
                            <p>{account}</p>
                          )}
                            checked={connectedAccountsObject[account]["checked"]}
                            disabled={connectedAccountsObject[account]['status'] === 'inactive' ? true : false}
                            onChange={(e) => {
                                let temp = { ...connectedAccountsObject };
                                setCheckboxError(false)
                                temp[account]["checked"] = e;
                                if (temp[account]['checked']) {
                                    let test = [...panes]
                                    const found = test.some(e => e.key === account)
                                    if (!found) {
                                        test = [...test, { title: connectedAccountsObject[account]['value'], content: '', key: account, closable: false, siteID: connectedAccountsObject[account]['siteID']  }]
                                        setPanes(test)
                                    }
                                } else {
                                    const test = panes.filter(e => e.key !== account)
                                    setPanes(test)
                                }
                                setconnectedAccountsObject(temp);
                            }}
                        >
                            {/* {account} */}
                        </Checkbox>
                        {/* {connectedAccountsObject[account]["siteID"] ? (
                            <Stack alignment="fill" spacing="tight">
                              <Image
                                preview={false}
                                width={25}
                                src={
                                  connectedAccountsObject[account]["siteID"] &&
                                  require(`../../../../../../..//assets/flags/${connectedAccountsObject[account]["siteID"]}.png`)
                                }
                                style={{ borderRadius: "50%" }}
                              />
                              <>{account.split("-")[1]}</>
                            </Stack>
                          ) : (
                            <p>{account}</p>
                          )} */}
                        </Stack>
                    );
                })}
        </Stack>
    );
};

export default CheckboxComponent