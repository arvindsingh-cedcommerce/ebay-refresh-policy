import { Alert, Button, Card, Col, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { CloseCircleOutlined } from "@ant-design/icons";

const QueryComponent = () => {
  // query
  const [query, setQuery] = useState({});
  const [andQueryCount, setAndQueryCount] = useState(0);
  const [queryCount, setQueryCount] = useState({});

  useEffect(() => {
    if (andQueryCount) {
      setQueryCount({ ...queryCount, [andQueryCount]: 1 });
      // let temp = { ...query };
      // temp[`Group${andQueryCount}`] = [
      //   {
      //     attribute: "",
      //     condition: "",
      //     value: "",
      //   },
      // ];
      // setQuery(temp);
    }
  }, [andQueryCount]);

  useEffect(() => {
    console.log("queryCount", queryCount);
    Object.keys(queryCount).map(and_query => {
      let temp = { ...query };
      let test = 
      queryCount[and_query].map(e => {
        return {
          attribute: "",
          condition: "",
          value: "",
        }
      })
      temp[`Group${and_query}`] = {}
      setQuery(temp);
    })
    
  }, [queryCount]);

  useEffect(() => {
    console.log(query);
  }, [query]);

  return (
    <>
      <Alert
        showIcon
        message={
          <Row justify="space-between">
            <Col>
              <h1>How to filter products for profile</h1>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setAndQueryCount(andQueryCount + 1);
                  // setQueryCount()
                }}
              >
                Add Group
              </Button>
            </Col>
          </Row>
        }
        description={
          <>
            <ul>
              <li>
                First you need to add group of condition by clicking on button
                below.
              </li>
              <li>
                Second you need to add conditions and form the query for
                filtering products.
              </li>
              <li>
                Then click on Test query for executing and fetching the filtered
                products.
              </li>
            </ul>
          </>
        }
        type="info"
      />
      {Object.keys(query).map((eachQuery, index) => {
        return (
          <Card
            size="small"
            title={eachQuery}
            extra={
              <Row justify="space-between">
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      // console.log(query[eachQuery]);
                      let temp = { ...query };
                      // let tempInd = index + 1;
                      // console.log('tempInd',index, tempInd);
                      temp[eachQuery].push({
                        attribute: "",
                        condition: "",
                        value: "",
                      });
                      // console.log("temp", temp, temp[eachQuery]);
                      setQuery(temp);
                    }}
                  >
                    Add more
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    danger
                    onClick={(e) => {
                      const newQuery = Object.keys(query).reduce(
                        (accumulator, key) => {
                          if (key !== eachQuery) {
                            accumulator[key] = query[key];
                          }
                          return accumulator;
                        },
                        {}
                      );
                      setQuery(newQuery);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            }
            style={{ marginTop: "10px" }}
          >
            {query[eachQuery].map((singleOrQuery) => {
              // console.log(query[eachQuery], singleOrQuery);
              return (
                <Row
                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                  style={{ marginBottom: "10px" }}
                  justify="space-around"
                >
                  <Col span={6}>
                    <Select
                      options={[
                        { label: "Title", value: "title" },
                        { label: "Vendor", value: "vendor" },
                      ]}
                      style={{ width: "100%" }}
                      placeholder="Select Attribute"
                    />
                  </Col>
                  <Col span={6}>
                    <Select
                      options={[
                        { label: "Equals", value: "equals" },
                        { label: "Not equals", value: "not_equals" },
                      ]}
                      style={{ width: "100%" }}
                      placeholder="Select Condition"
                    />
                  </Col>
                  <Col span={6}>
                    <Input placeholder="Fill in value..." />
                  </Col>
                  <Col span={6}>
                    <Button
                      icon={<CloseCircleOutlined />}
                      type="primary"
                      danger
                      disabled={query[eachQuery].length < 2}
                      onClick={() => {}}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </Card>
        );
      })}
    </>
  );
};

export default QueryComponent;
