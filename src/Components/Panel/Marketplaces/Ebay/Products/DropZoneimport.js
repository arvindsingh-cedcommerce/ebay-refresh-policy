import {
  DropZone,
  Stack,
  Banner,
  List,
  Thumbnail,
  Caption,
  Button,
} from "@shopify/polaris";
import React, { Component } from "react";

class DropZoneimport extends Component {
  constructor(props) {
    super(props);
    this.removefiles = this.removefiles.bind(this);
  }

  state = {
    files: [],
    hasError: false,
    rejectedFiles: [],
    acceptedFiles:[],
    uploadBtnStatus: false,
  };

  removefiles() {
    this.state.files = [];
    this.state.rejectedFiles = [];
    this.setState(this.state);
  }
   componentDidUpdate()
   {
    if(this.state.uploadBtnStatus)
    {
      this.props.getFile(this.state.acceptedFiles, this.state.rejectedFiles);
    }
   }
  render() {
    const { hasError, rejectedFiles } = this.state;
    const errorMessage = hasError && (
      <Banner
        title="The following File couldn’t be uploaded:"
        status="critical"
      >
        <List type="bullet">
          {rejectedFiles.map((file, index) => (
            <List.Item key={index}>
              {`"${file.name}" is not supported. File type must be .csv.`}
            </List.Item>
          ))}
        </List>
      </Banner>
    );

    const { files } = this.state;
    const validImageTypes = [];

    const fileUpload = !files.length && <DropZone.FileUpload actionTitle="Add file"/>;
    const uploadedFiles = files.length > 0 && (
      <Stack vertical>
        {files.map((file, index) => (
          <Stack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.indexOf(file.type) > 0
                  ? window.URL.createObjectURL(file)
                  : "https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304"
              }
            />
            <div>
              {file.name} <Caption>{file.size} bytes</Caption>
            </div>
          </Stack>
        ))}
      </Stack>
    );
    return (
      <Stack vertical>
        {errorMessage}
        <DropZone
          accept=""
          type="file"
          errorOverlayText="File type must be .csv"
          onDrop={(files, acceptedFiles, rejectedFiles) => {
            this.setState({
              files: [...this.state.files, ...acceptedFiles],
              acceptedFiles: acceptedFiles,
              rejectedFiles: rejectedFiles,
              hasError: rejectedFiles.length > 0,
            });
          }}
          allowMultiple={false}
          disabled={this.state.files.length > 1}
        >
          {uploadedFiles}
          {fileUpload}
        </DropZone>
        <div style={{display:"flex",justifyContent:"center"}}>
          <Button primary disabled={files.length===0 || files.length>1} onClick={()=>{
            this.setState({...this.state,uploadBtnStatus:true});
          }}>Upload</Button></div>
       
      </Stack>
    );
  }
}
export default DropZoneimport;
