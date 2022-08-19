import {
  Alert,
  Button,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  PageHeader,
  Row,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import TabsComponent from "../../../../AntDesignComponents/TabsComponent";
import { productData } from "./EbaySingleProductData";
import VariantComponentData from "./VariantComponentData";
import CKEditor from "ckeditor4-react";
import { isUndefined } from "lodash";
import ReactJson from "react-json-view";

const { Title } = Typography;

const ProductViewStaticData = (props) => {
  const [mainProduct, setMainProduct] = useState({});
  const [variants, setVariants] = useState([]);

  // details component states

  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [productType, setProductType] = useState("");
  const [tags, setTags] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  const getModifiedData = (productData) => {
    let productDataClone = { ...productData };
    let sortedProductData = [];
    let mainProductData = {};
    let variantProductsData = [];
    if (productDataClone.hasOwnProperty("rows")) {
      sortedProductData = productDataClone["rows"].reduce((acc, element) => {
        if (!element.hasOwnProperty("sku")) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, []);
      if (sortedProductData.length === 1) {
        mainProductData = sortedProductData[0];
      } else if (sortedProductData.length > 1) {
        mainProductData = sortedProductData[0];
        variantProductsData = sortedProductData.slice(1);
      }
    }
    setMainProduct(mainProductData);
    setVariants(variantProductsData);
    setTitle(mainProductData["title"]);
    setVendor(mainProductData["vendor"]);
    setProductType(mainProductData["product_type"]);
    setTags(mainProductData["tags"]);
  };

  useEffect(() => {
    getModifiedData(productData);
  }, []);

  // console.log("mainProduct", mainProduct["status"]);

  return (
    <PageHeader
      className="site-page-header-responsive"
      title={mainProduct["title"]}
      ghost={true}
      onBack={() => props.history.push("/panel/ebay/products")}
      tags={
        <Tag
          color={mainProduct["status"]?.toLowerCase()}
        >{`${mainProduct["status"]}`}</Tag>
      }
      extra={[
        <Button key="3">Sync With Shopify</Button>,
        <Button
          key="2"
          onClick={() => {
            let postDataForSave = {
              title: title,
              vendor: vendor,
              productType: productType,
              tags: tags,
              dimensions: {
                length: dimensions["length"],
                width: dimensions["width"],
                height: dimensions["height"],
              },
            };
            console.log("postDataForSave", postDataForSave);
          }}
        >
          Save
        </Button>,
        <Button key="4">Save & Upload</Button>,
        <Button key="1">Discard</Button>,
      ]}
    >
      <TabsComponent
        tabContents={{
          Details: (
            <DetailsComponent
              data={mainProduct}
              title={title}
              vendor={vendor}
              productType={productType}
              setTitle={setTitle}
              setVendor={setVendor}
              setProductType={setProductType}
              tags={tags}
              setTags={setTags}
              dimensions={dimensions}
              setDimensions={setDimensions}
            />
          ),
          Variants: <VariantComponentData dataSource={variants} />,
          "Product Data": <ProductDataComponent data={mainProduct} />,
        }}
      />
    </PageHeader>
  );
};

export default ProductViewStaticData;

export const DetailsComponent = ({
  data,
  title,
  vendor,
  productType,
  setTitle,
  setVendor,
  setProductType,
  tags,
  setTags,
  dimensions,
  setDimensions,
}) => {
  const [form] = Form.useForm();

  const [pointedImage, setPointedImage] = useState(data["image_main"]);

  const loadProfile = () => {
    form.setFieldsValue({ title: data["title"] });
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      onValuesChange={(changedValue, allValues) => {
        // console.log(changedValue);
        let { title, vendor, productType, tags, length, width, height } =
          changedValue;
        // form.setFieldsValue({ title: title });
        if (title) {
          setTitle(title);
        } else if (vendor) {
          setVendor(vendor);
        } else if (productType) {
          setProductType(productType);
        } else if (tags) {
          setTags(tags);
        } else if (length) {
          setDimensions({ ...dimensions, length: length });
        } else if (width) {
          setDimensions({ ...dimensions, width: width });
        } else if (height) {
          setDimensions({ ...dimensions, height: height });
        }
      }}
    >
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} wrap={true}>
        <Col sm={12}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <Form.Item label="" name="title" initialValue={title}>
                <Input addonBefore="Title" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item label="" name="vendor" initialValue={vendor}>
                <Input addonBefore="Vendor" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="" name="productType" initialValue={productType}>
                <Input addonBefore="Product Type" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="" name="tags" initialValue={tags}>
                <Input addonBefore="Tags" />
              </Form.Item>
            </Col>
          </Row>
          <CKEditor data={"data"} readOnly={false} onChange={() => {}} />
        </Col>
        <Col sm={12}>
          <Row justify="center">
            <Col span={18}>
              <Image src={pointedImage} preview={false} />
            </Col>
          </Row>
          <Row justify="space-between" wrap={true}>
            {data["image_array"].map((image, index) => {
              return (
                <Col key={index}>
                  <Image
                    width={80}
                    src={image["src"]}
                    preview={false}
                    onPointerOver={(e) => {
                      setPointedImage(image["src"]);
                    }}
                    style={{
                      border: "1px solid #0000003b",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
              );
            })}
          </Row>
          <Row>
            <Col span={24}>
              <Title level={5}>Product Dimensions</Title>
              <Alert
                message={
                  <div>
                    Choose only if you have selected <b>Calculated Shipping</b>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 10 }}
              />
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={8}>
              <Form.Item
                label=""
                name="length"
                initialValue={dimensions["length"]}
              >
                <Input addonBefore="Length" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label=""
                name="width"
                initialValue={dimensions["width"]}
              >
                <Input addonBefore="Width" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label=""
                initialValue={dimensions["height"]}
              >
                <Input addonBefore="Height" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export const ProductDataComponent = ({ data, errors }) => {
  return (
    <Collapse onChange={() => {}}>
      {!isUndefined(data.ebay_product_data) && (
        <Collapse.Panel header="eBay Product Data" key="1">
          <ReactJson
            style={{ maxHeight: 200, overflowY: "scroll" }}
            src={!isUndefined(data.ebay_product_data) && data.ebay_product_data}
          />
        </Collapse.Panel>
      )}
      {/* {!isUndefined(data.report) && (
        <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
            {data.report.map((error) => {
              return (
                <Col span={24}>
                  <Alert
                    message={error["SeverityCode"]}
                    description={error["ShortMessage"]}
                    type={error["SeverityCode"].toLowerCase()}
                    showIcon
                  />
                </Col>
              );
            })}
          </Row>
        </Collapse.Panel>
      )} */}
      {!isUndefined(errors) && (
        <Collapse.Panel header="eBay Error(s) & Warnings" key="2">
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]}>
            {
              Object.keys(errors).map((error) => {
                return (
                  <Col span={24}>
                    <Alert
                      message={error}
                      description={errors[error]['Errors'].map(e => <p>{e}</p>)}
                      showIcon
                    />
                  </Col>
                );
              })
            }
            {/* {data.report.map((error) => {
              return (
                <Col span={24}>
                  <Alert
                    message={error["SeverityCode"]}
                    description={error["ShortMessage"]}
                    type={error["SeverityCode"].toLowerCase()}
                    showIcon
                  />
                </Col>
              );
            })} */}
          </Row>
        </Collapse.Panel>
      )}
      {!isUndefined(data.details) && (
        <Collapse.Panel header="Shopify Product Data" key="3">
          <ReactJson
            style={{ maxHeight: 200, overflowY: "scroll" }}
            src={!isUndefined(data.details) && data.details}
          />
        </Collapse.Panel>
      )}
    </Collapse>
  );
};
