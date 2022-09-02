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
} from "@shopify/polaris";
import { Avatar, Badge, PageHeader, Tag, Typography } from "antd";
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
  extractUpdateOrderData,
  parseDataForSave,
} from "./Helper/viewOrderHelper";

const { Text } = Typography;

const ViewOrdersPolarisNew = (props) => {
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
  const [orderDate, setOrderDate] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [eBayRefrenceID, setEbayRefrenceID] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [ebayOrderData, setEbayOrderData] = useState(null);

  //   buyer details
  const [buyerName, setBuyerName] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState({
    address: "",
    phone: "",
    city: "",
    country: "",
    zip: "",
    countryCode: "",
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
    phone_number: "",
    shipping_address: {
      full_name: "",
      last_name: "ebay-cedcoss",
      address1: "",
      phone_number: "",
      company: "",
      city: "",
      province: "",
      zip: "",
      country: "",
    },
    customer: true,
    tags: "",
    note: "",
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
      extractUpdateOrderData(data, updateOrder, setUpdateOrder);
      data["target_status"] &&
        setErroModal({
          ...erroModal,
          msg: data["target_error_message"],
          name: data["target_status"],
        });
      setShopId(data["shop_id"]);
      setShopifyOrderName(data["shopify_order_name"]);
      // setFinancialStatus(data["financial_status"]);
      setShopifyOrderID(
        data["target_order_id"] ? data["target_order_id"] : "---"
      );
      setEbayOrderID(data["source_order_id"]);
      setOrderDate(data["created_at"]);
      setTotalItems(data["qty"]);
      setLineItems(data["line_items"]);
      setEbayRefrenceID(data["source_order_data"]["ExtendedOrderID"]);
      setEbayOrderData(data["source_order_data"]);

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
      tempAddress["address"] = data["shipping_address"]["address1"];
      tempAddress["phone"] = data["shipping_address"]["phone_number"];
      tempAddress["city"] = data["shipping_address"]["city"];
      tempAddress["country"] = data["shipping_address"]["country"];
      tempAddress["zip"] = data["shipping_address"]["zip"];
      tempAddress["countryCode"] = data["shipping_address"]["country_code"];
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
        fulfillmentsDetails["createdAt"] = fulfillments["0"].created_at;
        fulfillmentsDetails["updatedAt"] = fulfillments["0"].updated_at;
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
        break;
      case "phone_number":
        temp["phone_number"] = value;
        break;
      case "tags":
        temp["tags"] = value;
        break;
      case "note":
        temp["note"] = value;
        break;
      case "shipping_address":
        switch (innerType) {
          case "full_name":
            temp["shipping_address"]["full_name"] = value;
            break;
          case "address1":
            temp["shipping_address"]["address1"] = value;
            break;
          case "phone_number":
            temp["shipping_address"]["phone_number"] = value;
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
          let parsedData = parseDataForSave(updateOrder);
          let { success, message } = await massAction(updateOrderURL, {
            id: shopifyOrderID,
            ...parsedData,
          });
          if (success) {
            notify.success(message);
          } else {
            notify.error(message);
          }
          setActionModal(false);
        }}
      >
        <FormLayout>
          <TextField
            value={updateOrder.email}
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
          <TextField
            value={updateOrder.phone_number}
            onChange={(e) => updateOrderOnChange(e, "phone_number")}
            placeholder={"Enter Phone Number with County Code"}
            // inputMode="tel"
            type="tel"
          />
          <>Shipping Address</>
          <FormLayout>
            <TextField
              placeholder={"Full Name"}
              value={updateOrder.shipping_address.full_name}
              onChange={(e) =>
                updateOrderOnChange(e, "shipping_address", "full_name")
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
                placeholder={"Phone"}
                value={updateOrder.shipping_address.phone_number}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "phone_number")
                }
                // type="number"
                type="tel"
              />
              <TextField
                placeholder={"Company"}
                value={updateOrder.shipping_address.company}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "company")
                }
              />
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
                placeholder={"Address"}
                value={updateOrder.shipping_address.address1}
                onChange={(e) =>
                  updateOrderOnChange(e, "shipping_address", "address1")
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
            placeholder="Tags"
          />
          <TextField
            value={updateOrder.note}
            onChange={(e) => updateOrderOnChange(e, "note")}
            placeholder="Note"
          />
          <center>
            <Button submit primary>
              Submit
            </Button>
          </center>
        </FormLayout>
      </Form>
    );
  };
  return flag ? (
    <OrderSkeleton />
  ) : (
    <Page
      // <PageHeader
      // onBack={() => props.history.push("/panel/ebay/orders")}
      // title={shopifyOrderName ? `Order ${shopifyOrderName}` : "Order"}
      title={
        ebayOrderID ? (
          <Stack alignment="center" spacing="tight">
            <>{ebayOrderID}</>
            {/* <ShopifyBadge status="info">{financialStatus}</ShopifyBadge> */}
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
        ) : (
          <Stack alignment="center">
            <>Order</>
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
      // fullWidth
      // tags={<Tag color="blue">{financialStatus}</Tag>}
      // style={{ minHeight: "90vh" }}
      actionGroups={[
        {
          title: "Actions",
          onClick: (openActions) => {
            alert("Copy action");
            openActions();
          },
          actions: shopifyOrderID
            ? [
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
              ]
            : [
                {
                  content: "Remove from app",
                  onAction: () =>
                    getModalStructure("Remove from app", true, "removeFromApp"),
                },
                // {
                //   content: "Sync Shipment",
                //   onAction: () =>
                //     getModalStructure("Sync Shipment", true, "syncShipment"),
                // },
                // {
                //   content: "Cancel eBay Order",
                //   onAction: () =>
                //     getModalStructure("Cancel eBay Order", true, "cancelOrder"),
                // },
              ],
        },
      ]}
      breadcrumbs={[
        {
          content: "Orders",
          onAction: () => props.history.push("/panel/ebay/orders"),
        },
      ]}
      // extra={[
      //   <Popover
      //     active={actionPopoverActive}
      //     activator={
      //       <Button
      //         onClick={() => setActionPopoverActive(!actionPopoverActive)}
      //         disclosure
      //       >
      //         Actions
      //       </Button>
      //     }
      //     //   autofocusTarget="first-node"
      //     onClose={() => setActionPopoverActive(!actionPopoverActive)}
      //   >
      //     <ActionList actionRole="menuitem" items={actionOptions} />
      //   </Popover>,
      // ]}
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
                          notify.error("Can't be removed");
                        }
                        break;
                      case "syncShipment":
                        (async () => {
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
                          } else {
                            notify.error(message ? message : data);
                          }
                        })();
                        break;
                      case "cancelOrder":
                        (async () => {
                          let { success, message, data } = await massAction(
                            cancelOrdersURl,
                            [
                              {
                                order_id: ebayOrderID,
                                shop_id: shopId,
                              },
                            ]
                          );
                          if (success) {
                            notify.success(message ? message : data);
                          } else {
                            notify.error(message ? message : data);
                          }
                        })();
                        break;
                      case "deleteOrder":
                        console.log(shopifyOrderID, ebayOrderID);
                        if (shopifyOrderID) {
                          (async () => {
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
                    setActionModal(false);
                  }}
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
        title={<>Order ID: {shopifyOrderName}</>}
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
      let { title, quantity, sku, price } = row;
      let tempObject = {};
      tempObject["key"] = index;
      tempObject["title"] = title;
      tempObject["quantity"] = quantity;
      tempObject["sku"] = sku;
      tempObject["price"] = price;
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
                  <Stack wrap={false}>
                    <Badge count={order?.["quantity"]}>
                      <Avatar shape="square" size={70} />
                    </Badge>
                    <Stack vertical spacing="extraTight">
                      <Text strong>{order?.["title"]}</Text>
                      <Text type="secondary">SKU: {order?.["sku"]}</Text>
                      <Text strong>Price: {order?.["price"]}</Text>
                    </Stack>
                  </Stack>
                );
              })}
              <Stack distribution="equalSpacing">
                <Text strong>Total</Text>
                <Text strong>
                  {orderData.reduce((prev, curr) => {
                    return Number(prev) + Number(curr?.["price"]);
                  }, 0)}
                </Text>
              </Stack>
            </Stack>
          </Card>
          <Card sectioned>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Shopify Order Id</Heading>
              <p>{shopifyOrderID}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>eBay Order Id</Heading>
              <p>{ebayOrderID}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Order Date</Heading>
              <p>{orderDate}</p>
            </Stack>
            <Stack vertical={false} distribution="equalSpacing">
              <Heading>Total Items</Heading>
              <p>{totalItems}</p>
            </Stack>
          </Card>
          <Card sectioned>
            <PaymentDetails paymentDetails={paymentDetails} />
          </Card>
          <Card sectioned title="eBay Order Data">
            <ReactJson
              style={{ maxHeight: 400, overflowY: "scroll" }}
              src={ebayOrderData}
              collapsed={true}
            />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Customer Information">
            <Card.Section title="Customer">
              <Stack vertical spacing="extraTight">
                <>{buyerName}</>
                <>{buyerEmail}</>
                <>{buyerAddress["phone"]}</>
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
            <Card.Section title="Fulfillments">
              <FulfillmentsDetails fulfillmentsDetails={fulfillmentsDetails} />
            </Card.Section>
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

export const PaymentDetails = ({ paymentDetails }) => {
  return (
    <>
      <Layout>
        <Layout.Section>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Payment Method</Heading>
            <p>
              {paymentDetails &&
                paymentDetails["paymentMethod"] &&
                paymentDetails["paymentMethod"]}
            </p>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Price</Heading>
            <p>
              {paymentDetails &&
                paymentDetails["price"] &&
                paymentDetails["price"]}
            </p>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Taxes Applied</Heading>
            <p>
              {paymentDetails &&
                paymentDetails["taxesApplied"] &&
                paymentDetails["taxesApplied"]}
            </p>
          </Stack>
          <Stack vertical={false} distribution="equalSpacing">
            <Heading>Inclusive Tax</Heading>
            <p>
              {paymentDetails &&
                paymentDetails["inclusiveTax"] &&
                paymentDetails["inclusiveTax"]}
            </p>
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
        <Stack vertical={false} distribution="equalSpacing">
          <Heading>Tracking Company</Heading>
          <p>{fulfillmentsDetails["trackingCompany"]}</p>
        </Stack>
        <Stack vertical={false} distribution="equalSpacing">
          <Heading>Tracking Number</Heading>
          <p>{fulfillmentsDetails["trackingNumber"]}</p>
        </Stack>
        <Stack vertical={false} distribution="equalSpacing">
          <Heading>Created At</Heading>
          <p>{fulfillmentsDetails["createdAt"]}</p>
        </Stack>
        <Stack vertical={false} distribution="equalSpacing">
          <Heading>Updated At</Heading>
          <p>{fulfillmentsDetails["updatedAt"]}</p>
        </Stack>
      </Layout.Section>
    </Layout>
  ) : (
    <>Order not yet fulfilled</>
  );
};
