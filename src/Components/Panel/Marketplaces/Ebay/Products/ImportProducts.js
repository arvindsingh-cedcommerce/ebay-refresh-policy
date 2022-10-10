import {
  Banner,
  Button,
  Card,
  Label,
  List,
  Page,
  Spinner,
  TextStyle,
} from "@shopify/polaris";
import { ImportMinor } from "@shopify/polaris-icons";
import React, { useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import DropZoneimport from "./DropZoneimport";
import { isUndefined } from "util";
import { requests } from "../../../../../services/request";
import { notify } from "../../../../../services/notify";

const ImportProducts = (props) => {
  const [exportProductDataCsv, setExportProductDataCsv] = useState(false);
  const [file_handle, setfile_handle] = useState({
    isfileUploaded: false,
    isFileuploading: false,
    showDetails: false,
    fileuploaded_data: {},
  });
  const myRef = useRef();

  const triggerChildMethod = () => {
    myRef.current.removefiles();
  };

  const getBase64 = (file, rejectedFile) => {
    if (!isUndefined(file) && rejectedFile.length === 0) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve = false;
      });
    }
  };

  const getFile = (file, rejectedFiles) => {
    setfile_handle({ ...file_handle, isFileuploading: true });
    let filedata;
    if (!isUndefined(file) && file.length > 0) {
      if (file[0].size < 25000000) {
        getBase64(file[0], rejectedFiles).then((data) => {
          if (data) {
            let tempdata = { marketplace: "shopify", filedata: data };
            requests
              .postRequest("ebay/csv/importCSV", tempdata)
              .then((data) => {
                if (data.success) {
                  props.history.push("/panel/ebay/activity");
                  if (data.data.info !== "" && data.data.info !== false) {
                    setfile_handle({
                      isfileUploaded: true,
                      fileuploaded_data: data.data.info,
                      showDetails: true,
                      isFileuploading: false,
                    });
                  } else {
                    notify.error("Error is CSV data extraction");
                    setfile_handle({
                      ...file_handle,
                      isFileuploading: false,
                    });
                  }
                } else {
                  notify.warn(data.data);
                  setfile_handle({
                    ...file_handle,
                    isFileuploading: false,
                  });
                  triggerChildMethod();
                }
              });
          }
        });
      } else {
        triggerChildMethod();
        notify.info("CSV file of Size less than 25 Mb is only allowed");
      }
    } else {
      setfile_handle({
        ...file_handle,
        isFileuploading: false,
      });
    }
  };

  const renderCSVInfoBanner = () => {
    return (
      <div>
        <div>
          <div>
            <Banner status="success">
              <Label>
                The CSV selected Contains{" "}
                {file_handle.fileuploaded_data.handle_count} Main Products ,{" "}
                {file_handle.fileuploaded_data.sku_count} Variant SKU's and{" "}
                {file_handle.fileuploaded_data.image_count} Images
              </Label>
            </Banner>
          </div>
          <div>
            <Banner status="info">
              <Label>
                If you want to proceed with Bulk Update procedure Kindly choose
                feilds you want to Update using CSV from below Or if you want to
                Upload some other CSV kindly choose Cancel option from Below{" "}
              </Label>
            </Banner>
          </div>
          <div>
            <Button
              onClick={() => {
                this.importProductsformCsv("cancel");
                setfile_handle({
                  ...file_handle,
                  isfileUploaded: false,
                  showDetails: false,
                  fileuploaded_data: {},
                });
              }}
              primary
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Page
      fullWidth={true}
      title="Bulk Update"
      breadcrumbs={[
        {
          content: "Products",
          onAction: () => props.history.push("/panel/ebay/products"),
        },
      ]}
      secondaryActions={[
        {
          content: "Export CSV",
          icon: ImportMinor,
          onAction: () => setExportProductDataCsv(true),
        },
      ]}
    >
      <Banner
        title="Important points for Bulk Update procedure :"
        status="info"
      >
        <List type="number">
          <List.Item>
            First <TextStyle variation="strong">Export CSV</TextStyle> then{" "}
            <TextStyle variation="strong">update the fields</TextStyle>{" "}
            according to your need.
          </List.Item>
          <List.Item>
            For smooth functioning of bulk update{" "}
            <TextStyle variation="strong">
              kindly only upload the CSV exported from the app.
            </TextStyle>
          </List.Item>
          <List.Item>
            We take <TextStyle variation="strong">Handle</TextStyle> field as a
            unique so kindly{" "}
            <TextStyle variation="strong">
              do not make any changes to handle.
            </TextStyle>
          </List.Item>
        </List>
        <TextStyle variation="strong">
          CSV file with size upto 25 Mb are acceptable for bulk update.
        </TextStyle>
      </Banner>
      <Card title="Upload CSV file">
        <Card.Section>
          <div className="row">
            {file_handle.isFileuploading && (
              <div>
                Uploading file ...
                <Spinner size="small" color="teal" />
              </div>
            )}
            {!file_handle.isFileuploading && (
              <div className="col-12 col-md-12 pt-1 pb-1">
                {!file_handle.isfileUploaded && (
                  <DropZoneimport ref={myRef} getFile={getFile} />
                )}
              </div>
            )}
            {file_handle.showDetails && renderCSVInfoBanner()}
          </div>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default withRouter(ImportProducts);
