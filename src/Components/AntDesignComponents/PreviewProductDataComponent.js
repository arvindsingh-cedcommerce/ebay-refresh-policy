import { Card, Col, Row, Space } from "antd";
import Text from "antd/lib/typography/Text";
import React from "react";

const PreviewProductDataComponent = ({ dataToDisplay }) => {
  // console.log("dataToDisplay", dataToDisplay);
  //   const { Row, Col, Divider } = antd;
  return (
    <Card>
      {Object.keys(dataToDisplay).map((data) => {
        return (
          //   <Row between="xs">
          //     <Col>
          //       <Text type="secondary">{data}</Text>
          //     </Col>
          //     <Col>{dataToDisplay[data]}</Col>
          //   </Row>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {`${data}:`}
            {dataToDisplay[data]}
          </div>
        );
      })}
    </Card>
  );
};

export default PreviewProductDataComponent;
