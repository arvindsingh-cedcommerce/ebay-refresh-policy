import React, { Component } from "react";
import { activityRemoveAll } from "../../../../../store/reducers/activity/modifyactivityslice";
import { connect } from "react-redux";
import { Alert, Button, Card, Col, PageHeader, Progress, Row } from "antd";
import {
  queuedActivities,
  recentActivities,
} from "../Products/SampleProductData";

class Ebayactivity extends Component {
  render() {
    return (
      <PageHeader
        title={"Activity"}
        extra={[<Button type="primary">Refresh</Button>]}
      >
        <Row gutter={[16, { xs: 8, sm: 16, md: 24 }]}>
          <Col span={24}>
            <Card
              size="small"
              title="Recent Activities"
              extra={
                <Row justify="space-between">
                  <Col>
                    <Button style={{ marginRight: "10px" }}>
                      Clear all activites
                    </Button>
                  </Col>
                  <Col>
                    <Button type="primary">View all activities</Button>
                  </Col>
                </Row>
              }
            >
              {recentActivities.map((activity) => {
                return (
                  <Alert
                    message={activity["message"]}
                    description={activity["created_at"]}
                    type={"success"}
                    showIcon
                    style={{ marginBottom: "15px" }}
                  />
                );
              })}
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" title="Currently Running Processes">
              {queuedActivities.length > 0 ? (
                <>
                  <Alert
                    message={
                      "Processes will keep running in background. It may take some time. You can close the app and do any other thing in mean time."
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: "10px" }}
                  />
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
          </Col>
        </Row>
      </PageHeader>
    );
  }

  componentDidMount() {
    this.props.activityRemoveAll();
  }
}

const mapStateToProps = (state) => {};

const mapDispatchToProps = (dispatch) => {
  return {
    activityRemoveAll: () => dispatch(activityRemoveAll()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Ebayactivity);
