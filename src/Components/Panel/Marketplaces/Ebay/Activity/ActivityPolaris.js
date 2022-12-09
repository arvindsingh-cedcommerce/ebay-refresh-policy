import { Banner, Card, Button } from "@shopify/polaris";
import {
  Alert,
  //   Button,
  Col,
  notification,
  PageHeader,
  Progress,
  Row,
} from "antd";
import React, { useEffect, useState } from "react";
import { getAllNotifications } from "../../../../../APIrequests/ActivitiesAPI";
import { allNotificationsURL } from "../../../../../URLs/ActivitiesURL";
import {
  queuedActivities,
  recentActivities,
} from "../Products/SampleProductData";

const ActivityPolaris = () => {
  const [allNotifications, setAllNotifications] = useState([]);

  const hitGetNotifications = async () => {
    console.log("hitGetNotifications");
    let dataToPost = {
      count: 3,
      activePage: 1,
    };
    let { success, data } = await getAllNotifications(
      allNotificationsURL,
      dataToPost
    );
    if (success) {
      let { rows } = data;
      let temp = rows.map((row) => {
        console.log(row);
        let testObj = {};
        // testObj["message"] = row["message"] && row["message"];
        testObj["message"] = typeof row["message"] === 'object' ? row['message']['message'] : row['message'] ;
        testObj["createdAt"] = row["created_at"];
        testObj["severity"] = row["severity"];
        return testObj;
      });
      setAllNotifications(temp);
    }
  };

  useEffect(() => {
    hitGetNotifications();
  }, []);

  return (
    <PageHeader
      title={"Activity"}
      extra={[<Button type="primary">Refresh</Button>]}
    >
      <Card
        sectioned
        actions={[
          {
            content: <Button>Clear all activites</Button>,
          },
          { content: <Button primary>View all activities</Button> },
        ]}
        size="small"
        title="Recent Activities"
      >
        {allNotifications.map((notification) => {
          return (
            <Banner
              title={notification["message"]}
              status={notification["severity"]}
            >
              <>{notification["createdAt"]}</>
            </Banner>
          );
        })}
      </Card>
      <Card sectioned title="Currently Running Processes">
        {queuedActivities.length > 0 ? (
          <>
            <Banner
              title={
                "Processes will keep running in background. It may take some time. You can close the app and do any other thing in mean time."
              }
              status="info"
            />
            <br />
            {queuedActivities.map((activity) => {
              return (
                <Row justify="space-around">
                  <Col span={1}>
                    <Progress type="circle" percent={75} width={50} />
                  </Col>
                  <Col span={22}>
                    <Row>
                      <Col span={24}>{activity["message"]}</Col>
                      <Col span={24}>
                        <Progress percent={30} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </>
        ) : (
          <Alert
            message={"No processes running currently"}
            type="info"
            showIcon
            style={{ marginBottom: "10px" }}
          />
        )}
      </Card>
    </PageHeader>
  );
};

export default ActivityPolaris;
