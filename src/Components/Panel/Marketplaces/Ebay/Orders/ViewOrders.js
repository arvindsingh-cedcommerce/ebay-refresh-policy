import {
  Alert,
  Col,
  Divider,
  Input,
  PageHeader,
  Row,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { getOrder } from "../../../../../APIrequests/OrdersAPI";
import { parseQueryString } from "../../../../../services/helperFunction";
import { getOrderURL } from "../../../../../URLs/OrdersURL";
import NestedTableComponent from "../../../../AntDesignComponents/NestedTableComponent";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";

const { Paragraph } = Typography;

const ViewOrders = (props) => {
  const [shopifyOrderName, setShopifyOrderName] = useState(null);
  const [financialStatus, setFinancialStatus] = useState(null);
  const [shopifyOrderID, setShopifyOrderID] = useState(null);
  const [ebayOrderID, setEbayOrderID] = useState(null);
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

  const hitOrderAPI = async () => {
    let { id } = parseQueryString(props.location.search);
    let postData = { order_id: id };
    let { success, data } = await getOrder(getOrderURL, postData);
    if (success) {
      setShopifyOrderName(data["shopify_order_name"]);
      setFinancialStatus(data["financial_status"]);
      setShopifyOrderID(data["target_order_id"]);
      setEbayOrderID(data["source_order_id"]);
      setLineItems(data["line_items"]);
      setEbayRefrenceID(data["source_order_data"]["ExtendedOrderID"]);
      setEbayOrderData(data["source_order_data"]);

      setBuyerEmail(data["client_details"]["contact_email"]);
      setBuyerName(data["client_details"]["name"]);
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
        : "";
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
    }
  };

  useEffect(() => {
    hitOrderAPI();
  }, []);

  return (
    <PageHeader
      onBack={() => props.history.push("/panel/ebay/orders")}
      title={`Order ${shopifyOrderName}`}
      tags={<Tag color="blue">{financialStatus}</Tag>}
      style={{minHeight: '90vh'}}
    >
      <TabsComponent
        totalTabs={5}
        tabContents={{
          "Order Details": (
            <OrderDetailsComponent
              shopifyOrderID={shopifyOrderID}
              ebayOrderID={ebayOrderID}
              eBayRefrenceID={eBayRefrenceID}
              lineItems={lineItems}
            />
          ),
          "eBay Order Data": (
            <ReactJson
              style={{ maxHeight: 400, overflowY: "scroll" }}
              src={ebayOrderData}
            />
          ),
          "Buyer Details": (
            <BuyerDetailsComponent
              buyerAddress={buyerAddress}
              buyerName={buyerName}
              buyerEmail={buyerEmail}
            />
          ),
          "Payment Details": <PaymentDetails paymentDetails={paymentDetails} />,
          Shipping: <ShippingDetails shippingDetails={shippingDetails} />,
          Fulfillments: (
            <FulfillmentsDetails fulfillmentsDetails={fulfillmentsDetails} />
          ),
        }}
      />
    </PageHeader>
  );
};

export default ViewOrders;

export const OrderDetailsComponent = ({
  shopifyOrderID,
  ebayOrderID,
  lineItems,
  eBayRefrenceID,
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
      tempObject["title"] = <Paragraph>{title}</Paragraph>;
      tempObject["quantity"] = <Paragraph>{quantity}</Paragraph>;
      tempObject["sku"] = <Paragraph>{sku}</Paragraph>;
      tempObject["price"] = <Paragraph>{price}</Paragraph>;
      return tempObject;
    });
    setOrderData(tempProductData);
  };

  useEffect(() => {
    extractLineItems();
  }, [lineItems]);

  return (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input addonBefore="Shopify Order Id" value={shopifyOrderID} />
          </Col>
          <Col span={12}>
            <Input addonBefore="eBay Order Id" value={ebayOrderID} />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input addonBefore="Order Date" value={""} />
          </Col>
          <Col span={12}>
            <Input addonBefore="Total Items" value={""} />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={24}>
            <Input addonBefore="eBay refrence ID" value={eBayRefrenceID} />
          </Col>
        </Row>
        <Divider>Line items</Divider>
        <NestedTableComponent
          size={"small"}
          pagination={false}
          columns={orderColumns}
          dataSource={orderData}
        //   scroll={{ x: 1000, y: "55vh" }}
          bordered={true}
        />
      </Col>
    </Row>
  );
};

export const BuyerDetailsComponent = ({
  buyerAddress,
  buyerEmail,
  buyerName,
}) => {
  return (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input addonBefore="Name" value={buyerName} />
          </Col>
          <Col span={12}>
            <Input addonBefore="Email" value={buyerEmail} />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={6}>
            <Input addonBefore="Address" value={buyerAddress["address"]} />
          </Col>
          <Col span={6}>
            <Input addonBefore="Phone" value={buyerAddress["phone"]} />
          </Col>
          <Col span={6}>
            <Input addonBefore="City" value={buyerAddress["city"]} />
          </Col>
          <Col span={6}>
            <Input addonBefore="Country" value={buyerAddress["country"]} />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={8}>
            <Input addonBefore="Zip" value={buyerAddress["zip"]} />
          </Col>
          <Col span={8}>
            <Input
              addonBefore="Country Code"
              value={buyerAddress["countryCode"]}
            />
          </Col>
          <Col span={8}>
            <Input addonBefore="Province" value={buyerAddress["province"]} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export const PaymentDetails = ({ paymentDetails }) => {
  return (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input
              addonBefore="Payment Method"
              value={paymentDetails["paymentMethod"]}
            />
          </Col>
          <Col span={12}>
            <Input addonBefore="Price" value={paymentDetails["price"]} />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input
              addonBefore="Taxes Applied"
              value={paymentDetails["taxesApplied"]}
            />
          </Col>
          <Col span={12}>
            <Input
              addonBefore="Inclusive Tax"
              value={paymentDetails["inclusiveTax"]}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export const ShippingDetails = ({ shippingDetails }) => {
  return (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input addonBefore="Service" value={shippingDetails["service"]} />
          </Col>
          <Col span={12}>
            <Input addonBefore="Cost" value={shippingDetails["cost"]} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export const FulfillmentsDetails = ({ fulfillmentsDetails }) => {
  return fulfillmentsDetails ? (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input
              addonBefore="Tracking Company"
              value={fulfillmentsDetails["trackingCompany"]}
            />
          </Col>
          <Col span={12}>
            <Input
              addonBefore="Tracking Number"
              value={fulfillmentsDetails["trackingNumber"]}
            />
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginBottom: "10px" }}
        >
          <Col span={12}>
            <Input
              addonBefore="Created At"
              value={fulfillmentsDetails["createdAt"]}
            />
          </Col>
          <Col span={12}>
            <Input
              addonBefore="Updated At"
              value={fulfillmentsDetails["updatedAt"]}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  ) : (
    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
      <Col sm={24}>
        <Alert
          message="Order not yet fulfilled"
          type="warning"
          showIcon
        />
      </Col>
    </Row>
  );
};
