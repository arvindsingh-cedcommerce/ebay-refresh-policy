import {
  Card as AntCard,
  Col,
  Image,
  PageHeader,
  Row,
  Select as AntSelect,
  Typography,
  Input,
} from "antd";
import React, { useEffect, useState } from "react";
import WhatsApp from "../../../../../assets/whatsapp.png";
import Skype from "../../../../../assets/skype.png";
import Mail from "../../../../../assets/mail.png";
import { preferredTime, timezone } from "../Products/SampleProductData";
import { getConnectedAccounts } from "../../../../../Apirequest/accountsApi";
import { json } from "../../../../../globalConstant/static-json";
import {
  Stack,
  Button,
  Select,
  TextField,
  Checkbox,
  Link,
} from "@shopify/polaris";
import { submitIssue } from "../../../../../APIrequests/ContactUSAPI";
import {
  demoScheduleURL,
  submitIssueURL,
} from "../../../../../URLs/ContactUsURL";
import { Card } from "@shopify/polaris";
import { notify } from "../../../../../services/notify";

const { Text } = Typography;
const { TextArea } = Input;

export const getCountryName = (site_id) => {
  let countryName = json.flag_country.filter(
    (country) => country["value"] === site_id
  );
  return countryName.length && countryName[0]["label"];
};

const ContactUs = () => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [connectedAccountsArray, setconnectedAccountsArray] = useState([]);
  const [issueSelected, setIssueSelected] = useState("");
  const [issueFormValidationErrors,setIssueFormValidationErrors]=useState({section:false,message:false});
  const [scheduleFormValidationErrors,setScheduleFormValidationErrors] =useState({email:false,preferredMeeting:false,timeZone:false,preferredTime:false,date:false});
  const [issueDescription, setIssueDescription] = useState("");
  const [demoDetails, setDemoDetails] = useState({
    preferredMeeting: "",
    email: "",
    preferredTime: "",
    additionalNote: "",
    timeZone: "",
    date: "",
  });
  const [btnLoaders, setBtnLoaders] = useState({
    issue: false,
    demo: false,
  });

  // skype, whatsapp, email
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    skype: "https://join.skype.com/GbdPBTuVsNgN",
    whatsApp: "https://chat.whatsapp.com/HPbJm00yENw6QhWfskNWLa",
    email: "mailto:ebay_support@cedcommerce.com",
  });

  const getAllConnectedAccounts = async () => {
    let { success: accountConnectedSuccess, data: connectedAccountData } =
      await getConnectedAccounts();
    if (accountConnectedSuccess) {
      let shopifyAccount = connectedAccountData.find(
        (account) => account.marketplace === "shopify"
      );
      if (shopifyAccount?.userCustomData?.userData) {
        const { skypeLink, whatsAppLink, email } =
          shopifyAccount?.userCustomData?.userData;
        setSocialMediaLinks({
          skype: skypeLink,
          whatsApp: whatsAppLink,
          email: email,
        });
      }
      let ebayAccounts = connectedAccountData.filter(
        (account) => account["marketplace"] === "ebay"
      );
      let tempArr = [];
      if (ebayAccounts.length > 1) {
        // tempArr.push({ label: "All", value: "all" });
      }
      tempArr = [
        ...tempArr,
        ...ebayAccounts.map((account, key) => {
          let accountName = {
            // label: `${getCountryName(account["warehouses"][0]["site_id"])}-${
            //   account["warehouses"][0]["user_id"]
            // }`,
            label: (
              <Stack alignment="fill" spacing="tight">
                <Image
                  preview={false}
                  width={18}
                  src={
                    account["warehouses"][0]["site_id"] &&
                    require(`../../../../../assets/flags/${account["warehouses"][0]["site_id"]}.png`)
                  }
                  style={{ borderRadius: "50%" }}
                />
                <>{account["warehouses"][0]["user_id"]}</>
              </Stack>
            ),
            value: `${getCountryName(account["warehouses"][0]["site_id"])}-${
              account["warehouses"][0]["user_id"]
            }`,
            siteID: account["warehouses"][0]["site_id"],
            mode:
              account["warehouses"][0]["sandbox"] == 1
                ? "sandbox"
                : "production",
            shopId: account["id"],
            marketplace: account["marketplace"],
            status: account["warehouses"][0]["status"],
            checked: true,
          };
          return accountName;
        }),
      ];
      setconnectedAccountsArray(tempArr);
      setSelectedAccount(tempArr[0]["label"]);
    }
  };

  useEffect(() => {
    document.title = "Contact Us | Integration for eBay";
    document.description = "Contact Us";
    getAllConnectedAccounts();
  }, []);

  return (
    <PageHeader title="Contact Us" ghost={true}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card sectioned>
            <Stack distribution="equalSpacing" alignment="center">
              <Text strong>Feel free to reach out to us</Text>
              <Stack>
                <Link url={socialMediaLinks.whatsApp} external>
                  <Image src={WhatsApp} width={50} preview={false} />
                </Link>
                <Link url={socialMediaLinks.whatsApp} external>
                  <Image src={Skype} width={50} preview={false} />
                </Link>
                <a
                  style={{ color: "black" }}
                  href={"mailto:ebay_support@cedcommerce.com"}
                >
                  <Image src={Mail} width={50} preview={false} />
                </a>
              </Stack>
            </Stack>
          </Card>
          <Card
            sectioned
            title="Have an issue?"
            primaryFooterAction={{
              content: "Submit",
              loading: btnLoaders["issue"],
              onAction: async () => {
                const validationObj={...issueFormValidationErrors};
                setBtnLoaders({ ...btnLoaders, issue: true });
                if(!issueSelected)
                  validationObj.section=true;
                if(!issueDescription)
                  validationObj.message=true;
                  if(issueSelected && issueDescription)
                  {
                    validationObj.section=false;
                    validationObj.message=false;
                  
                
                let postData = {
                  body: issueDescription,
                  subject: `We have Received Your Query Related to ${issueSelected}`,
                  account: connectedAccountsArray
                    .filter((connectedAccounts) => connectedAccounts["checked"])
                    .map((connectedAccounts) => {
                      return connectedAccounts["value"];
                    }),
                };
                let { success, message } = await submitIssue(
                  submitIssueURL,
                  postData
                );
                if (success) {
                  notify.success(message);
                } else {
                  notify.error(message);
                }
              }
              setIssueFormValidationErrors({...validationObj});
                setBtnLoaders({ ...btnLoaders, issue: false });
              },
            }}
          >
            <div>Accounts</div>
            <Stack distribution="fillEvenly" spacing="extraTight">
              {connectedAccountsArray.map((connectedAccount, index) => {
                return (
                  <Checkbox
                    label={connectedAccount.label}
                    checked={connectedAccount.checked}
                    onChange={() => {
                      let temp = [...connectedAccountsArray];
                      temp[index]["checked"] = !connectedAccount.checked;
                      setconnectedAccountsArray(temp);
                    }}
                  />
                );
              })}
            </Stack>
            {/* <Select
              onChange={(accountValue) => {
                let matchedAccount = connectedAccountsArray.find(
                  (connectedAccounts) =>
                    connectedAccounts.value === accountValue
                );
                setSelectedAccount(accountValue);
                setSelectedShopId(matchedAccount.shopId);
              }}
              value={selectedAccount}
              options={connectedAccountsArray}
              placeholder="Select to add account"
              label="Account"
            /> */}
            <Select
              value={issueSelected}
              onChange={(e) => {  
                if(e)
                {
                  const validationObj={...issueFormValidationErrors};
                  validationObj.section=false;
                  setIssueFormValidationErrors({...validationObj});
                  setIssueSelected(e)}}}
              placeholder="Select the section in which you are facing issue"
              options={[
                { label: "Products", value: "products" },
                { label: "Orders", value: "orders" },
                { label: "Profiles", value: "profiles" },
                { label: "Templates", value: "templates" },
                { label: "Business Policy", value: "businessPolicy" },
                { label: "Configuration", value: "configuration" },
                { label: "Others", value: "others" },
              ]}
              label="Section"
              error={issueFormValidationErrors.section?"Required Field":false}
            />
            <TextField
              placeholder="Describe the issue you are facing..."
              label="Issue"
              value={issueDescription}
              onChange={(e) => {
                if(e)
                {
                  const validationObj={...issueFormValidationErrors};
                  validationObj.message=false;
                  setIssueFormValidationErrors({...validationObj});
                setIssueDescription(e);}}}
              multiline={3}
              error={issueFormValidationErrors.message?"Required Field":false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Schedule Demo"
            sectioned
            primaryFooterAction={{

              content: "Submit",
              loading: btnLoaders["demo"],
              onAction: async () => {
                const scheduleValidationObj={...scheduleFormValidationErrors};
                let finalValidator=false;
                for(const scheduleProperty in scheduleValidationObj)
                {
                  if(!demoDetails[`${scheduleProperty}`])
                  {
                    scheduleValidationObj[`${scheduleProperty}`]=true;
                    finalValidator=true;
                  }
                  else
                  {
                    scheduleValidationObj[`${scheduleProperty}`]=false;
                  }
                }
                setScheduleFormValidationErrors({...scheduleValidationObj});
                if(!finalValidator)
                       {
                let { success, message } = await submitIssue(
                  demoScheduleURL,
                  demoDetails
                );
                if (success) {
                  notify.success(message);
                } else {
                  notify.error(message);
                }}
              },
            }}
          >
            <Stack vertical>
              <Stack distribution="fillEvenly">
                <TextField
                  placeholder="Please provide a valid email address"
                  type="email"
                  requiredIndicator
                  label="Email Address"
                  value={demoDetails.email}
                  onChange={(e) => { if(e) {
                    const scheduleValidationObj={...scheduleFormValidationErrors};
                    scheduleValidationObj.email=false;
                    setScheduleFormValidationErrors({...scheduleValidationObj});
                    setDemoDetails({ ...demoDetails, email: e })}}}
                  error={scheduleFormValidationErrors.email?"Required":false}
                />
                <Select
                  placeholder="Select Medium"
                  label="Medium"
                  requiredIndicator
                  value={demoDetails.preferredMeeting}
                  onChange={(e) =>{
                    if(e) {
                      const scheduleValidationObj={...scheduleFormValidationErrors};
                      scheduleValidationObj.preferredMeeting=false;
                      setScheduleFormValidationErrors({...scheduleValidationObj});
                    setDemoDetails({ ...demoDetails, preferredMeeting: e });
                    }
                  }
                  }
                  options={[
                    { label: "Skype", value: "skype" },
                    { label: "Google Meet", value: "googleMeet" },
                    { label: " Zoom Meet", value: "zoomMeet" },
                  ]}
                  error={scheduleFormValidationErrors.preferredMeeting?"Required":false}
                />
              </Stack>
              <Stack distribution="fillEvenly">
                <Select
                  label="Time Zone"
                  placeholder="Select Time Zone"
                  requiredIndicator
                  value={demoDetails.timeZone}
                  onChange={(e) =>{
                    if(e) {
                      const scheduleValidationObj={...scheduleFormValidationErrors};
                      scheduleValidationObj.timeZone=false;
                      setScheduleFormValidationErrors({...scheduleValidationObj});
                   
                    setDemoDetails({ ...demoDetails, timeZone: e })
                    }
                  }
                  }
                  options={timezone}
                  error={scheduleFormValidationErrors.timeZone?"Required":false}
                />
                <Select
                  label="Time"
                  placeholder="Select Time"
                  requiredIndicator
                  value={demoDetails.preferredTime}
                  onChange={(e) =>{
                    if(e) {
                      const scheduleValidationObj={...scheduleFormValidationErrors};
                      scheduleValidationObj.preferredTime=false;
                      setScheduleFormValidationErrors({...scheduleValidationObj});
                   
                    setDemoDetails({ ...demoDetails, preferredTime: e })
                    }}}
                  options={preferredTime}
                  error={scheduleFormValidationErrors.preferredTime?"Required":false}
                />
              </Stack>
              <TextField
                label="Preferred Date"
                placeholder="Please provide valid email address"
                requiredIndicator
                type={"date"}
                value={demoDetails.date}
                onChange={(e) => {
                  if(e) {
                    const scheduleValidationObj={...scheduleFormValidationErrors};
                    scheduleValidationObj.date=false;
                    setScheduleFormValidationErrors({...scheduleValidationObj});
                 
                  setDemoDetails({ ...demoDetails, date: e });}}}
                error={scheduleFormValidationErrors.date?"Required":false}
              />
              {/*  not a mandatory field */}
              <TextField
                placeholder="Any additional note..."
                label="Additional Note"
                multiline={
                  connectedAccountsArray.length < 4
                    ? 3
                    : connectedAccountsArray.length > 3 &&
                      connectedAccountsArray.length < 7
                    ? 4
                    : 5
                }
                value={demoDetails.additionalNote}
                onChange={(e) =>
                  setDemoDetails({ ...demoDetails, additionalNote: e })
                }
              />
            </Stack>
          </Card>
        </Col>
      </Row>
    </PageHeader>
  );
};

export default ContactUs;
