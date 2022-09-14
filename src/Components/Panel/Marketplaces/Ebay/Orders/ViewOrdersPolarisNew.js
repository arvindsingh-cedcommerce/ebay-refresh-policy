import {
  ActionList,
  Button,
  Card,
  Checkbox,
  Form,
  FormLayout,
  Heading,
  Layout,
  Modal,
  Popover,
  Stack,
  TextContainer,
  TextField,
  TextStyle,
  Page,
  Badge as ShopifyBadge,
  Banner,
  Tag,
} from "@shopify/polaris";
import { Avatar, Badge, PageHeader, Typography } from "antd";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { getOrder, massAction } from "../../../../../APIrequests/OrdersAPI";
import { parseQueryString } from "../../../../../services/helperFunction";
import { notify } from "../../../../../services/notify";
import {
  cancelOrdersURl,
  deleteOrdersURL,
  getOrderURL,
  removeOrdersURL,
  syncShipmentURL,
  updateOrderURL,
} from "../../../../../URLs/OrdersURL";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import OrderSkeleton from "../../../SkeletonComponents/OrderSkeleton";
import {
  autofillValidation,
  extractUpdateOrderData,
  parseDataForSave,
} from "./Helper/viewOrderHelper";

const { Text, Title } = Typography;

const ViewOrdersPolarisNew = (props) => {
  const [updateOrderSubmitBtnLoader, setUpdateOrderSubmitBtnLoader] =
    useState(false);
  const [targetStatus, setTargetStatus] = useState(null);
  const [sourceStatus, setSourceStatus] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [erroModal, setErroModal] = useState({
    show: "",
    msg: "",
    name: "",
  });
  const [shopId, setShopId] = useState("");
  const [flag, setFlag] = useState(false);
  const [shopifyOrderName, setShopifyOrderName] = useState(null);
  // const [financialStatus, setFinancialStatus] = useState(null);
  const [shopifyOrderID, setShopifyOrderID] = useState(null);
  const [ebayOrderID, setEbayOrderID] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [orderImportedDate, setOrderImportedDate] = useState("");
  const [totalItems, setTotalItems] = useState(null);
  const [eBayRefrenceID, setEbayRefrenceID] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [ebayOrderData, setEbayOrderData] = useState(null);
  const [shopifyOrderData, setShopifyOrderData] = useState(null);

  //   buyer details
  const [buyerName, setBuyerName] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState({
    address1: "",
    address2: "",
    phone: "",
    city: "",
    country: "",
    zip: "",
    country_code: "",
    province: "",
  });

  //   payment details
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "",
    price: "",
    taxesApplied: "",
    inclusiveTax: "",
  });

  //   shipping details
  const [shippingDetails, setShippingDetails] = useState({
    service: "",
    cost: "",
  });

  //   fulfillments details
  let [fulfillmentsDetails, setFulfillmentsDetails] = useState({
    trackingCompany: "",
    trackingNumber: "",
    createdAt: "",
    updatedAt: "",
  });

  //   action
  const [actionPopoverActive, setActionPopoverActive] = useState(false);
  const [actionModal, setActionModal] = useState({
    title: "",
    active: false,
    value: "",
  });
  const [updateOrder, setUpdateOrder] = useState({
    email: "",
    // phone_number: "",
    phone: "",
    shipping_address: {
      name: "",
      // last_name: "ebay-cedcoss",
      address1: "",
      address2: "",
      // phone_number: "",
      phone: "",
      company: "",
      city: "",
      province: "",
      zip: "",
      country: "",
      country_code: "",
    },
    customer: true,
    tags: "",
    note: "",
  });

  // recieved data from api
  const [recievedData, setRecievedData] = useState({});

  // update errors
  const [updateErrors, setUpdateErrors] = useState({
    email: false,
    phone: false,
  });

  const getModalStructure = (title, active, value) => {
    setActionModal({ ...actionModal, title, active, value });
  };
  const actionOptions = [
    {
      content: "Remove from app",
      onAction: () =>
        getModalStructure("Remove from app", true, "removeFromApp"),
    },
    {
      content: "Update Order",
      onAction: () => getModalStructure("Update Order", true, "updateOrder"),
    },
    {
      content: "Sync Shipment",
      onAction: () => getModalStructure("Sync Shipment", true, "syncShipment"),
    },
    {
      content: "Cancel Order",
      onAction: () => getModalStructure("Cancel Order", true, "cancelOrder"),
    },
    {
      content: "Delete Order",
      onAction: () => getModalStructure("Delete Order", true, "deleteOrder"),
    },
  ];

  const hitOrderAPI = async () => {
    setFlag(true);
    let { id } = parseQueryString(props.location.search);
    let postData = { order_id: id };
    let { success, data, message } = await getOrder(getOrderURL, postData);
    if (success) {
      setRecievedData(data);
      extractUpdateOrderData(data, updateOrder, setUpdateOrder);
      data["target_status"] &&
        setErroModal({
          ...erroModal,
          msg: data["target_error_message"],
          name: data["target_status"],
        });
      data["target_status"] && setTargetStatus(data["target_status"]);
      data["source_status"] && setSourceStatus(data["source_status"]);
      data["currency"] && setCurrency(data["currency"]);
      setShopId(data["shop_id"]);
      data["shopify_order_name"] &&
        setShopifyOrderName(data["shopify_order_name"]);
      // setFinancialStatus(data["financial_status"]);
      setShopifyOrderID(
        data["target_order_id"]
        //  ? data["target_order_id"] : "---"
      );
      setEbayOrderID(data["source_order_id"]);
      if (data["created_at"]) {
        let parsedCreatedDate = new Date(data["created_at"]).toGMTString();
        setOrderDate(parsedCreatedDate);
      }
      if (data["imported_at"]) {
        let parsedCreatedDate = new Date(data["imported_at"]).toGMTString();
        setOrderImportedDate(parsedCreatedDate);
      }
      setTotalItems(data["qty"]);
      setLineItems(data["line_items"]);
      setEbayRefrenceID(data["source_order_data"]["ExtendedOrderID"]);
      setEbayOrderData(data["source_order_data"]);
      setShopifyOrderData(data["target_order_data"]);

      setBuyerEmail(
        data["customer"]
          ? data["customer"]["email"]
          : data["client_details"]["email"]
      );
      setBuyerName(
        data["customer"]
          ? data["customer"]["first_name"]
          : data["client_details"]["first_name"]
      );
      let tempAddress = buyerAddress;
      tempAddress["address1"] = data["shipping_address"]["address1"];
      tempAddress["address2"] = data["shipping_address"]["address2"];
      // tempAddress["phone"] = data["shipping_address"]["phone_number"];
      tempAddress["phone"] = data["shipping_address"]["phone"];
      tempAddress["city"] = data["shipping_address"]["city"];
      tempAddress["country"] = data["shipping_address"]["country"];
      tempAddress["zip"] = data["shipping_address"]["zip"];
      tempAddress["country_code"] = data["shipping_address"]["country_code"];
      tempAddress["province"] = data["shipping_address"]["province"];
      setBuyerAddress(tempAddress);

      let { tax_lines } = data;
      let taxesArray = Object.keys(tax_lines).map(
        (taxObj) => tax_lines[taxObj].title
      );
      let tempPaymentDetails = paymentDetails;
      tempPaymentDetails["paymentMethod"] = data["payment_method"];
      tempPaymentDetails["price"] = data["total_price"];
      tempPaymentDetails["inclusiveTax"] = data["total_tax"];
      tempPaymentDetails["taxesApplied"] = taxesArray.length
        ? taxesArray.join(",")
        : "N/A";
      setPaymentDetails(tempPaymentDetails);

      let { shipping_cost_details } = data;
      shippingDetails["service"] = shipping_cost_details
        ? shipping_cost_details.title
        : "";
      shippingDetails["cost"] = shipping_cost_details
        ? shipping_cost_details.cost
        : "";
      setShippingDetails(shippingDetails);

      let { fulfillments } = data;
      if (fulfillments) {
        fulfillmentsDetails["trackingCompany"] =
          fulfillments["0"].tracking_company;
        fulfillmentsDetails["trackingNumber"] =
          fulfillments["0"].tracking_number;
        fulfillmentsDetails["createdAt"] = new Date(
          fulfillments["0"].created_at
        ).toGMTString();
        fulfillmentsDetails["updatedAt"] = new Date(
          fulfillments["0"].updated_at
        ).toGMTString();
      } else {
        fulfillmentsDetails = false;
      }
      setFulfillmentsDetails(fulfillmentsDetails);
    } else {
      notify.error(message);
      // redirect("/auth/login");
    }
    setFlag(false);
  };
  const redirect = (url) => {
    props.history.push(url);
  };

  useEffect(() => {
    hitOrderAPI();
  }, []);

  const updateOrderOnChange = (value, type, innerType) => {
    let temp = { ...updateOrder };
    switch (type) {
      case "email":
        temp["email"] = value;
        if (value) setUpdateErrors({ ...updateErrors, email: false });
        break;
      // case "phone_number":
      //   temp["phone_number"] = value;
      //   break;
      case "phone":
        temp["phone"] = value;
        if (value) setUpdateErrors({ ...updateErrors, phone: false });
        break;
      case "tags":
        temp["tags"] = value;
        break;
      case "note":
        temp["note"] = value;
        break;
      case "shipping_address":
        switch (innerType) {
          case "name":
            temp["shipping_address"]["name"] = value;
            break;
          case "address1":
            temp["shipping_address"]["address1"] = value;
            break;
          case "address2":
            temp["shipping_address"]["address2"] = value;
            break;
          // case "phone_number":
          //   temp["shipping_address"]["phone_number"] = value;
          //   break;
          case "phone":
            temp["shipping_address"]["phone"] = value;
            break;
          case "company":
            temp["shipping_address"]["company"] = value;
            break;
          case "city":
            temp["shipping_address"]["city"] = value;
            break;
          case "province":
            temp["shipping_address"]["province"] = value;
            break;
          case "zip":
            temp["shipping_address"]["zip"] = value;
            break;
          case "country":
            temp["shipping_address"]["country"] = value;
            break;
          case "country_code":
            temp["shipping_address"]["country_code"] = value;
            break;
          default:
            break;
        }
      default:
        break;
    }
    setUpdateOrder(temp);
  };
  const updateOrderActionStructure = () => {
    return (
      <Form
        onSubmit={async () => {
          setUpdateOrderSubmitBtnLoader(true);
          const { errorCount, errors } = autofillValidation(
            updateOrder,
            recievedData
          );
          console.log(errorCount, errors);
          if (errorCount == 0) {
            let parsedData = parseDataForSave(updateOrder);
            let { success, message } = await massAction(updateOrderURL, {
              id: shopifyOrderID,
              ...parsedData,
            });
            if (success) {
              notify.success(message);
              hitOrderAPI();
            } else {
              notify.error(message);
            }
            setUpdateOrderSubmitBtnLoader(false);
            setActionModal(false);
          } else {
            notify.error("Please fill required fields!");
            let tempErrors = { ...updateErrors };
            for (const key in errors) {
              tempErrors[key] = errors[key];
            }
            setUpdateErrors(tempErrors);
            // setUpdateOrderSubmitBtnLoader(false);
          }
          setUpdateOrderSubmitBtnLoader(false);
          // setActionModal(false);
        }}
      >
        <FormLayout>
          <div style={{ marginBottom: "20px" }}>Contact Information</div>
          <FormLayout>
            <TextField
              value={updateOrder.email}
              error={updateErrors.email}
              onChange={(e) => updateOrderOnChange(e, "email")}
              // placeholder="Email"
              placeholder={"Enter Email"}
              type="email"
              inputMode="email"
              autoComplete="email"
              // helpText={
              //   <span>
              //     We’ll use this email address to inform you on future changes to
              //     Polaris.
              //   </span>
              // }
            />
          </FormLayout>
          <TextField
            // value={updateOrder.phone_number}
            // onChange={(e) => updateOrderOnChange(e, "phone_number")}
            value={updateOrder.phone}
            error={updateErrors.phone}
            onChange={(e) => updateOrderOnChange(e, "phone")}
            placeholder={"Enter Phone Number with County Code"}
            // inputMode="tel"
            type="tel"
          />
          <>Shipping Address</>
          <FormLayout>
            <TextField
              placeholder={"Full Name"}
              value={updateOrder.shipping_address.name}
              onChange={(e) =>
                updateOrderOnChange(e, "shipping_address", "name")
              }
            />
            <FormLayout.Group>
              {/* <TextField
                placeholder={"Last Name"}
                value={updateOrder.shipping_address.last_name}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "last_name")
                }
              /> */}
              <TextField
                placeholder={"Country"}
                value={updateOrder.shipping_address.country}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "country")
                }
              />
              <TextField
                placeholder={"Country Code"}
                value={updateOrder.shipping_address.country_code}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "country_code")
                }
              />
              <TextField
                placeholder={"Phone"}
                // value={updateOrder.shipping_address.phone_number}
                // onChange={(e) =>
                //   updateOrderOnChange(e, "shipping_address", "phone_number")
                // }
                value={updateOrder.shipping_address.phone}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "phone")
                }
                // type="number"
                type="tel"
              />
              {/* <TextField
                placeholder={"Company"}
                value={updateOrder.shipping_address.company}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "company")
                }
              /> */}
              <TextField
                placeholder={"City"}
                value={updateOrder.shipping_address.city}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "city")
                }
              />
              <TextField
                placeholder={"Province"}
                value={updateOrder.shipping_address.province}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "province")
                }
              />
              <TextField
                placeholder={"ZIP"}
                value={updateOrder.shipping_address.zip}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "zip")
                }
              />
              <TextField
                placeholder={"Address Line1"}
                value={updateOrder.shipping_address.address1}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "address1")
                }
              />
              <TextField
                placeholder={"Address Line2"}
                value={updateOrder.shipping_address.address2}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "address2")
                }
              />
            </FormLayout.Group>
          </FormLayout>
          <Checkbox
            label="Customer"
            checked={updateOrder.customer}
            onChange={(e) =>
              setUpdateOrder({
                ...updateOrder,
                customer: e,
              })
            }
          />
          <TextField
            value={updateOrder.tags}
            onChange={(e) => updateOrderOnChange(e, "tags")}
            // placeholder="Tags"
            placeholder="multiple tags allow in ,(comma) separated form"
          />
          <TextField
            value={updateOrder.note}
            onChange={(e) => updateOrderOnChange(e, "note")}
            placeholder="Note"
          />
          <center>
            <Button submit primary loading={updateOrderSubmitBtnLoader}>
              Submit
            </Button>
          </center>
        </FormLayout>
      </Form>
    );
  };
  const getSourceStatusType = (status) => {
    let statusType = "";
    switch (status.toLowerCase()) {
      case "paid":
        statusType = "success";
        break;
      case "refunded":
        statusType = "";
        break;
    }
    return statusType;
  };
  const getTargetStatusType = (status) => {
    let statusType = "";
    switch (status.toLowerCase()) {
      case "fulfilled":
        statusType = "success";
        break;
      case "cancelled":
        statusType = "attention";
        break;
      case "unfulfilled":
        statusType = "warning";
        break;
    }
    return statusType;
  };
  return flag ? (
    <OrderSkeleton />
  ) : (
    <Page
      title={
        ebayOrderID ? (
          <Stack vertical spacing="extraTight">
            <Stack alignment="baseline" spacing="tight">
              <Title level={5} style={{ margin: "0px" }}>
                {/* eBay Id:  */}
                {ebayOrderID}
              </Title>
              {/* <Text
                type="secondary"
                style={{ fontSize: "1.5rem", fontWeight: "100" }}
              >
                Imported at {orderImportedDate}
              </Text> */}
              {sourceStatus && (
                <ShopifyBadge status={getSourceStatusType(sourceStatus)}>
                  {sourceStatus.slice(0, 1).toUpperCase() +
                    sourceStatus.slice(1)}
                </ShopifyBadge>
              )}
              {!erroModal.msg && targetStatus && (
                <ShopifyBadge status={getTargetStatusType(targetStatus)}>
                  {targetStatus.slice(0, 1).toUpperCase() +
                    targetStatus.slice(1)}
                </ShopifyBadge>
              )}
              {erroModal.msg && (
                <ShopifyBadge status="critical">
                  <div
                    style={{
                      cursor: "pointer",
                      borderBottom: "2px solid black",
                    }}
                    onClick={() => setErroModal({ ...erroModal, show: true })}
                  >
                    Failed
                  </div>
                </ShopifyBadge>
              )}
            </Stack>
            {/* {shopifyOrderID && ( */}
            {/* <Stack alignment="baseline" spacing="tight">
              <Title level={5} style={{ margin: "0px" }}>
                Shopify Id: {shopifyOrderID}
              </Title>
              <Text
                type="secondary"
                style={{ fontSize: "1.5rem", fontWeight: "100" }}
              >
                Created at {orderDate}
              </Text>
            </Stack> */}
            {/* // )} */}
          </Stack>
        ) : (
          <Stack alignment="center">
            <>Order</>
            {!erroModal.msg && (
              <ShopifyBadge status="attention">{targetStatus}</ShopifyBadge>
            )}
            {erroModal.msg && (
              <ShopifyBadge status="critical">
                <div
                  style={{ cursor: "pointer", borderBottom: "2px solid black" }}
                  onClick={() => setErroModal({ ...erroModal, show: true })}
                >
                  Failed
                </div>
              </ShopifyBadge>
            )}
          </Stack>
        )
      }
      actionGroups={[
        {
          title: "Actions",
          onClick: (openActions) => {
            alert("Copy action");
            openActions();
          },
          actions: !shopifyOrderID
            ? //  === "---"
              [
                {
                  content: "Remove from app",
                  onAction: () =>
                    getModalStructure("Remove from app", true, "removeFromApp"),
                },
              ]
            : [
                {
                  content: "Update Order",
                  onAction: () =>
                    getModalStructure("Update Order", true, "updateOrder"),
                },
                {
                  content: "Sync Shipment",
                  onAction: () =>
                    getModalStructure("Sync Shipment", true, "syncShipment"),
                },
                {
                  content: "Cancel eBay Order",
                  onAction: () =>
                    getModalStructure("Cancel eBay Order", true, "cancelOrder"),
                },
                {
                  content: "Delete Shopify Order",
                  onAction: () =>
                    getModalStructure(
                      "Delete Shopify Order",
                      true,
                      "deleteOrder"
                    ),
                },
              ],
        },
      ]}
      subtitle={
        `Imported on app at ${orderImportedDate}`
        // <Stack spacing="loose">
        //   {/* <>Created at {orderDate}</> */}
        //   <>Imported at {orderImportedDate}</>
        // </Stack>
      }
      breadcrumbs={[
        {
          content: "Orders",
          onAction: () => props.history.push("/panel/ebay/orders"),
        },
      ]}
    >
      <OrderDetailsComponent
        shopifyOrderID={shopifyOrderID}
        ebayOrderID={ebayOrderID}
        orderDate={orderDate}
        totalItems={totalItems}
        eBayRefrenceID={eBayRefrenceID}
        lineItems={lineItems}
        buyerAddress={buyerAddress}
        buyerName={buyerName}
        buyerEmail={buyerEmail}
        paymentDetails={paymentDetails}
        fulfillmentsDetails={fulfillmentsDetails}
        ebayOrderData={ebayOrderData}
        currency={currency}
        shopifyOrderData={shopifyOrderData}
        shopifyOrderName={shopifyOrderName}
        updateOrder={updateOrder}
      />
      {/* <TabsComponent
        totalTabs={2}
        tabContents={{
          "Order Details": (
            <>
              <OrderDetailsComponent
                shopifyOrderID={shopifyOrderID}
                ebayOrderID={ebayOrderID}
                orderDate={orderDate}
                totalItems={totalItems}
                eBayRefrenceID={eBayRefrenceID}
                lineItems={lineItems}
                buyerAddress={buyerAddress}
                buyerName={buyerName}
                buyerEmail={buyerEmail}
                paymentDetails={paymentDetails}
                fulfillmentsDetails={fulfillmentsDetails}
              />
            </>
          ),
          "eBay Order Data": (
            <ReactJson
              style={{ maxHeight: 400, overflowY: "scroll" }}
              src={ebayOrderData}
            />
          ),
        }}
      /> */}
      <Modal
        open={actionModal["active"]}
        onClose={() => setActionModal(false)}
        title={actionModal["title"]}
        // primaryAction={{
        //   content: "OK",
        //   onAction: () => {
        //     switch (actionModal["value"]) {
        //       case "updateOrder":
        //         (async () => {
        //           let { success, message, data } = await massAction(
        //             updateOrderURL,
        //             {
        //               id: shopifyOrderID,
        //               ...updateOrder,
        //             }
        //           );
        //           if (success) {
        //             notify.success(message ? message : data);
        //           } else {
        //             notify.error(message ? message : data);
        //           }
        //         })();
        //         break;
        //       case "removeFromApp":
        //         if (!shopifyOrderID) {
        //           (async () => {
        //             let { success, message, data } = await massAction(
        //               removeOrdersURL,
        //               [
        //                 {
        //                   order_id: ebayOrderID,
        //                   shop_id: shopId,
        //                 },
        //               ]
        //             );
        //             if (success) {
        //               notify.success(message ? message : data);
        //             } else {
        //               notify.error(message ? message : data);
        //             }
        //           })();
        //         } else {
        //           notify.error("Can't be removed");
        //         }
        //         break;
        //       case "syncShipment":
        //         (async () => {
        //           let { success, message, data } = await massAction(
        //             syncShipmentURL,
        //             [
        //               {
        //                 order_id: shopifyOrderID,
        //                 shop_id: shopId,
        //               },
        //             ]
        //           );
        //           if (success) {
        //             notify.success(message ? message : data);
        //           } else {
        //             notify.error(message ? message : data);
        //           }
        //         })();
        //         break;
        //       case "cancelOrder":
        //         (async () => {
        //           let { success, message, data } = await massAction(
        //             cancelOrdersURl,
        //             [
        //               {
        //                 order_id: ebayOrderID,
        //                 shop_id: shopId,
        //               },
        //             ]
        //           );
        //           if (success) {
        //             notify.success(message ? message : data);
        //           } else {
        //             notify.error(message ? message : data);
        //           }
        //         })();
        //         break;
        //       case "deleteOrder":
        //         console.log(shopifyOrderID, ebayOrderID);
        //         if (shopifyOrderID) {
        //           (async () => {
        //             let { success, message, data } = await massAction(
        //               deleteOrdersURL,
        //               [
        //                 {
        //                   order_id: shopifyOrderID,
        //                   shop_id: shopId,
        //                 },
        //               ]
        //             );
        //             if (success) {
        //               notify.success(message ? message : data);
        //             } else {
        //               notify.error(message ? message : data);
        //             }
        //           })();
        //         } else {
        //           notify.error(
        //             "Order does not exist on Shopify so can't be deleted"
        //           );
        //         }
        //         break;
        //       default:
        //         break;
        //     }
        //     setActionModal(false);
        //   },
        // }}
        // secondaryActions={[
        //   {
        //     content: "Cancel",
        //     onAction: () => setActionModal(false),
        //   },
        // ]}
      >
        <Modal.Section>
          {actionModal.value === "updateOrder" ? (
            updateOrderActionStructure()
          ) : (
            <TextContainer>
              <div>Do you want to perfrom this action?</div>
              <Stack distribution="center">
                <Button onClick={() => setActionModal(false)}>Cancel</Button>
                <Button
                  primary
                  onClick={() => {
                    setUpdateOrderSubmitBtnLoader(true);
                    switch (actionModal["value"]) {
                      case "updateOrder":
                        (async () => {
                          let { success, message, data } = await massAction(
                            updateOrderURL,
                            {
                              id: shopifyOrderID,
                              ...updateOrder,
                            }
                          );
                          if (success) {
                            notify.success(message ? message : data);
                          } else {
                            notify.error(message ? message : data);
                          }
                        })();
                        break;
                      case "removeFromApp":
                        // console.log('shopifyOrderID',shopifyOrderID, ebayOrderID);
                        if (!shopifyOrderID) {
                          (async () => {
                            let { success, message, data } = await massAction(
                              removeOrdersURL,
                              [
                                {
                                  order_id: ebayOrderID,
                                  shop_id: shopId,
                                },
                              ]
                            );
                            if (success) {
                              notify.success(message ? message : data);
                              props.history.push("/panel/ebay/orders");
                            } else {
                              notify.error(message ? message : data);
                            }
                          })();
                        } else {
                          notify.error(
                            "Can't be removed as it is not listed on Shopify"
                          );
                        }
                        break;
                      case "syncShipment":
                        (async () => {
                          setUpdateOrderSubmitBtnLoader(true);
                          let { success, message, data } = await massAction(
                            syncShipmentURL,
                            [
                              {
                                order_id: shopifyOrderID,
                                shop_id: shopId,
                              },
                            ]
                          );
                          if (success) {
                            notify.success(message ? message : data);
                            hitOrderAPI();
                          } else {
                            notify.error(message ? message : data);
                          }
                          setUpdateOrderSubmitBtnLoader(false);
                          setActionModal(false);
                        })();
                        break;
                      case "cancelOrder":
                        (async () => {
                          setUpdateOrderSubmitBtnLoader(true);
                          let { success, message, data } = await massAction(
                            cancelOrdersURl,
                            [
                              {
                                order_id: shopifyOrderID,
                                shop_id: shopId,
                              },
                            ]
                          );
                          if (success) {
                            notify.success(message ? message : data);
                          } else {
                            notify.error(message ? message : data);
                          }
                          setUpdateOrderSubmitBtnLoader(false);
                          setActionModal(false);
                        })();
                        break;
                      case "deleteOrder":
                        if (shopifyOrderID) {
                          (async () => {
                            setUpdateOrderSubmitBtnLoader(true);
                            let { success, message, data } = await massAction(
                              deleteOrdersURL,
                              [
                                {
                                  order_id: shopifyOrderID,
                                  shop_id: shopId,
                                },
                              ]
                            );
                            if (success) {
                              notify.success(message ? message : data);
                              props.history.push("/panel/ebay/orders");
                            } else {
                              notify.error(message ? message : data);
                            }
                          })();
                        } else {
                          notify.error(
                            "Order does not exist on Shopify so can't be deleted"
                          );
                        }
                        break;
                      default:
                        break;
                    }
                    // setUpdateOrderSubmitBtnLoader(false);
                    // setActionModal(false);
                  }}
                  loading={updateOrderSubmitBtnLoader}
                >
                  OK
                </Button>
              </Stack>
            </TextContainer>
          )}
        </Modal.Section>
      </Modal>
      <Modal
        open={erroModal.show}
        onClose={() => setErroModal({ ...erroModal, show: false })}
        title={<>Order ID: {ebayOrderID}</>}
      >
        <Modal.Section>
          <Banner status="critical">{erroModal.msg}</Banner>
        </Modal.Section>
      </Modal>
    </Page>
    // {/* </PageHeader> */}
  );
};

export default ViewOrdersPolarisNew;

export const OrderDetailsComponent = ({
  shopifyOrderID,
  ebayOrderID,
  orderDate,
  totalItems,
  lineItems,
  eBayRefrenceID,
  buyerAddress,
  buyerName,
  buyerEmail,
  paymentDetails,
  fulfillmentsDetails,
  ebayOrderData,
  currency,
  shopifyOrderData,
  shopifyOrderName,
  updateOrder,
}) => {
  // line items
  let [orderColumns, setOrderColumns] = useState([
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Net quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "SKU Number",
      dataIndex: "sku",
      key: "SKUNumber",
    },
  ]);
  const [orderData, setOrderData] = useState([]);

  const extractLineItems = () => {
    let tempProductData = [];
    tempProductData = lineItems.map((row, index) => {
      let { title, quantity, sku, price, source_product_id } = row;
      let tempObject = {};
      tempObject["key"] = index;
      tempObject["title"] = title;
      tempObject["quantity"] = quantity;
      tempObject["sku"] = sku;
      tempObject["price"] = price;
      tempObject["lineItemId"] = source_product_id;
      return tempObject;
    });
    setOrderData(tempProductData);
  };

  useEffect(() => {
    extractLineItems();
  }, [lineItems]);

  return (
    <>
      <Layout>
        <Layout.Section>
          <Card title={"Line items"} sectioned>
            <Stack vertical spacing="extraTight">
              {orderData.map((order) => {
                return (
                  // <Stack wrap={false}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {/* <Badge count={order?.["quantity"]}>
                      <Avatar shape="square" size={70} />
                    </Badge> */}
                    <div style={{ width: "70%" }}>
                      {/* <Stack vertical spacing="extraTight"> */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* <Text strong> */}
                        {order?.["title"]}
                        {/* {` (${ebayOrderID})`} */}
                        {` (${order?.["lineItemId"]})`}
                        {/* </Text> */}
                        <Text type="secondary">SKU: {order?.["sku"]}</Text>
                        {/* <Text strong>Price: {order?.["price"]}</Text> */}
                      </div>
                      {/* </Stack> */}
                    </div>
                    <Text>
                      {order?.["price"]} x {order?.["quantity"]}
                    </Text>
                    <Text>
                      {order?.["price"] * order?.["quantity"]} {currency}
                    </Text>
                  </div>
                  // {/* </Stack> */}
                );
              })}
              <Stack distribution="equalSpacing">
                <Text strong>Total</Text>
                <Text strong>
                  {orderData.reduce((prev, curr) => {
                    return (
                      Number(prev) +
                      Number(curr?.["price"]) * curr?.["quantity"]
                    );
                  }, 0)}{" "}
                  {currency}
                </Text>
              </Stack>
            </Stack>
          </Card>
          {shopifyOrderID && (
            <Card sectioned>
              <Stack vertical={false} distribution="equalSpacing">
                <>Shopify Order Id</>
                <Heading>{shopifyOrderID ? shopifyOrderID : "---"}</Heading>
              </Stack>
              <Stack vertical={false} distribution="equalSpacing">
                <>Shopify Order Name</>
                <Heading>{shopifyOrderName ? shopifyOrderName : "---"}</Heading>
              </Stack>
              <Stack vertical={false} distribution="equalSpacing">
                <>Created At</>
                <Heading>{orderDate}</Heading>
              </Stack>
            </Card>
          )}
          <Card sectioned>
            <PaymentDetails
              paymentDetails={paymentDetails}
              currency={currency}
            />
          </Card>
          <Card sectioned title="eBay Order Data">
            <ReactJson
              style={{ maxHeight: 400, overflowY: "scroll" }}
              src={ebayOrderData}
              collapsed={true}
            />
          </Card>
          {shopifyOrderID && (
            <Card sectioned title="Shopify Order Data">
              <ReactJson
                style={{ maxHeight: 400, overflowY: "scroll" }}
                src={shopifyOrderData}
                collapsed={true}
              />
            </Card>
          )}
        </Layout.Section>
        <Layout.Section secondary>
          <Card>
            <Card.Section title="Notes">{updateOrder.note}</Card.Section>
            <Card.Section title="Tags">
              <Stack>
                {updateOrder.tags.split(",").map((tag) => (
                  <Tag>{tag}</Tag>
                ))}
              </Stack>
            </Card.Section>
          </Card>
          <Card>
            <Card.Section title="Customer">
              <div style={{ wordBreak: "break-word" }}>{buyerEmail}</div>
            </Card.Section>
            {/* {updateOrder.email ||
              (updateOrder.phone && ( */}
            <Card.Section title="Additional Contact Information">
              <div style={{ wordBreak: "break-word" }}>{updateOrder.email}</div>
              <div style={{ wordBreak: "break-word" }}>{updateOrder.phone}</div>
            </Card.Section>
            {/* ))} */}
            <Card.Section title="Shipping Address">
              <Stack vertical spacing="extraTight">
                <>{buyerAddress["address1"]}</>
                <>{buyerAddress["address2"]}</>
                <>{buyerAddress["city"]}</>
                <>
                  {buyerAddress["province"]}, {buyerAddress["country"]}{" "}
                  {buyerAddress["country_code"] &&
                    `(
                  ${buyerAddress["country_code"]})`}
                </>
                <>{buyerAddress["zip"]}</>
                <>{buyerAddress["phone"]}</>
              </Stack>
            </Card.Section>
            {/* <Card.Section title="Billing Address">
              <TextStyle variation="subdued">
                Same as shipping address
              </TextStyle>
            </Card.Section> */}
          </Card>
          {/* <Card title="Customer Information">
            <Card.Section title="Customer">
              <Stack vertical spacing="extraTight" wrap>
                <div style={{ wordBreak: "break-word" }}>{buyerName}</div>
                <div style={{ wordBreak: "break-word" }}>{buyerEmail}</div>
                <div style={{ wordBreak: "break-word" }}>
                  {buyerAddress["phone"]}
                </div>
              </Stack>
            </Card.Section>
            <Card.Section title="Shipping Address">
              <Stack vertical spacing="extraTight">
                <>{buyerAddress["address"]}</>
                <>{buyerAddress["city"]}</>
                <>
                  {buyerAddress["province"]}, {buyerAddress["country"]} (
                  {buyerAddress["countryCode"]})
                </>
                <>{buyerAddress["zip"]}</>
              </Stack>
            </Card.Section>
            <Card.Section title="Billing Address">
              <TextStyle variation="subdued">
                Same as shipping address
              </TextStyle>
            </Card.Section>
          </Card> */}
          <Card sectioned title="Fulfillments">
            <FulfillmentsDetails fulfillmentsDetails={fulfillmentsDetails} />
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export const BuyerDetailsComponent = ({
  buyerAddress,
  buyerEmail,
  buyerName,
}) => {
  return (
    <>
      <Layout>
        <Layout.Section secondary>
          <Card sectioned>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Name</Heading>
              <p>{buyerName}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Email</Heading>
              <p>{buyerEmail}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Phone</Heading>
              <p>{buyerAddress["phone"]}</p>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Address</Heading>
              <p>{buyerAddress["address"]}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>City</Heading>
              <p>{buyerAddress["city"]}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Country</Heading>
              <p>{buyerAddress["country"]}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>ZIP</Heading>
              <p>{buyerAddress["zip"]}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Country Code</Heading>
              <p>{buyerAddress["countryCode"]}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Province</Heading>
              <p>{buyerAddress["province"]}</p>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export const PaymentDetails = ({ paymentDetails, currency }) => {
  return (
    <>
      <Layout>
        <Layout.Section>
          <Stack vertical={false} distribution="equalSpacing">
            <>Payment Method</>
            <Heading>
              {paymentDetails &&
                paymentDetails["paymentMethod"] &&
                paymentDetails["paymentMethod"]}
            </Heading>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <>Price</>
            <Heading>
              {paymentDetails && paymentDetails["price"] && (
                <>
                  {paymentDetails["price"]} {currency}
                </>
              )}
            </Heading>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <>Taxes Applied</>
            <Heading>
              {paymentDetails &&
                paymentDetails["taxesApplied"] &&
                paymentDetails["taxesApplied"]}
            </Heading>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <>Inclusive Tax</>
            <Heading>
              {paymentDetails &&
                paymentDetails["inclusiveTax"] &&
                paymentDetails["inclusiveTax"]}
            </Heading>
          </Stack>
        </Layout.Section>
      </Layout>
    </>
  );
};

export const ShippingDetails = ({ shippingDetails }) => {
  return (
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Service</Heading>
            <p>{shippingDetails["service"]}</p>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Cost</Heading>
            <p>{shippingDetails["cost"]}</p>
          </Stack>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export const FulfillmentsDetails = ({ fulfillmentsDetails }) => {
  return fulfillmentsDetails ? (
    <Layout>
      <Layout.Section>
        <Stack
          vertical={false}
          distribution="equalSpacing"
          spacing="extraTight"
        >
          <Heading>Tracking Company</Heading>
          <p>{fulfillmentsDetails["trackingCompany"]}</p>
        </Stack>
        <Stack
          vertical={false}
          distribution="equalSpacing"
          spacing="extraTight"
        >
          <Heading>Tracking Number</Heading>
          <p>{fulfillmentsDetails["trackingNumber"]}</p>
        </Stack>
        <Stack
          vertical={false}
          distribution="equalSpacing"
          spacing="extraTight"
        >
          <Heading>Created At</Heading>
          <p>{fulfillmentsDetails["createdAt"]}</p>
        </Stack>
        <Stack
          vertical={false}
          distribution="equalSpacing"
          spacing="extraTight"
        >
          <Heading>Updated At</Heading>
          <p>{fulfillmentsDetails["updatedAt"]}</p>
        </Stack>
      </Layout.Section>
    </Layout>
  ) : (
    <>Order not yet fulfilled</>
  );
};
