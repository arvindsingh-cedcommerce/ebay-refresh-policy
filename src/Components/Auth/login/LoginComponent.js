import {
  Button,
  Card,
  DisplayText,
  Form,
  Page,
  Stack,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { login } from "../../../Apirequest/authApi";
import { textField } from "../../../PolarisComponents/InputGroups";
import { globalState } from "../../../services/globalstate";
import { notify } from "../../../services/notify";
import * as queryString from "query-string";
import { environment } from "../../../environment/environment";

const LoginComponent = (props) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);
  const [liveStatus, setLiveStatus] = useState(false);

  const submitHandler = async () => {
    setLoader(true);
    let getToken = await login(credentials);
    if (getToken.success) {
      globalState.setLocalStorage("user_authenticated", "true");
      globalState.setLocalStorage("auth_token", getToken.data.token);
      notify.success(getToken.message);
      props.history.push("/welcome");
    } else {
      notify.error(getToken.message);
    }
    setLoader(false);
  };

  const autoRedirect = () => {
    console.log("admin autoRedirect");
    globalState.setLocalStorage("admin_login", false);
    const queryParams = queryString.parse(props.location.search);
    // console.log('queryParams autoRedirect', queryParams, queryParams["user_token"]);
    if (queryParams["user_token"] != null) {
      globalState.setLocalStorage("user_authenticated", "true");
      globalState.setLocalStorage("auth_token", queryParams["user_token"]);
      globalState.setLocalStorage("shop", queryParams["shop"]);
      props.history.push("/welcome");
    } else if (queryParams["admin_user_token"]) {
      globalState.setLocalStorage("user_authenticated", "true");
      globalState.setLocalStorage(
        "auth_token",
        queryParams["admin_user_token"]
      );
      globalState.setLocalStorage("admin_login", "true");
      props.history.push("/welcome");
    }
  };

  const removeLocalStorage = async () => {
    globalState.removeLocalStorage("user_authenticated");
    globalState.removeLocalStorage("auth_token");
    if (globalState.getLocalStorage("shop")) {
      globalState.removeLocalStorage("shop");
    }
    autoRedirect();
  };

  const getLiveStatus = () => {
    console.log("live status getLiveStatus");
    setLiveStatus(environment.isLive);
  };

  useEffect(() => {
    removeLocalStorage();
    getLiveStatus();
  }, []);

  const structure = () => {
    let struct = "";
    struct = (
      <Page title={"Login"}>
        <Form>
          <Stack distribution={"fillEvenly"} vertical={true}>
            <TextField
              label="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e })}
            />
            <TextField
              label="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e })}
              type="password"
            />
            <Button primary onClick={() => submitHandler()} loading={loader}>
              Submit
            </Button>
          </Stack>
        </Form>
      </Page>
    );
    console.log(
      "liveStatus",
      liveStatus,
      "admin login storage",
      globalState.getLocalStorage("admin_login"),
      globalState.getLocalStorage("admin_login") == false,
      "shop storage",
      globalState.getLocalStorage("shop") === null
    );
    console.log(
      "check",
      liveStatus &&
        !(globalState.getLocalStorage("admin_login") == false) &&
        globalState.getLocalStorage("shop") === null
    );
    if (
      liveStatus &&
      !(globalState.getLocalStorage("admin_login") == false) &&
      globalState.getLocalStorage("shop") === null
    ) {
      struct = (
        <Card>
          <Card.Section>
            <div
              style={{
                textAlign: "center",
                minHeight: "35rem",
                marginTop: "10rem",
              }}
            >
              <Stack alignment={"center"} vertical={true}>
                {/* <img src={Cancel} style={{ height: "5rem", width: "5rem" }} /> */}
                <DisplayText size={"extraLarge"}>Oops !!</DisplayText>
                <DisplayText size="small">
                  <b>Unauthorized access attempt</b>
                </DisplayText>
                <DisplayText size="small">
                  Kindly revisit the app from your shopify store's apps section
                </DisplayText>
              </Stack>
            </div>
          </Card.Section>
        </Card>
      );
    }
    return struct;
  };

  return structure();
  //   return <>hijk</>;
};

export default withRouter(LoginComponent);
