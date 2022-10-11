import { Button, Card } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { uploadPic } from "../../../Apirequest/accountsApi";
import { notify } from "../../../services/notify";
import "./imageUpload.css";

const ImageUpload = ({ person, setPerson }) => {
  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    let imageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (imageTypes.includes(file.type)) {
      reader.onloadend = () => {
        setPerson({
          ...person,
          file: file,
          imagePreviewUrl: reader.result,
        });
      };
    } else notify.error("File is not in correct format");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let activeP = person.active === "edit" ? "profile" : "edit";
    setPerson({ ...person, active: activeP });
  };

  return (
    <div>
      {person.active === "edit" ? (
        <Edit onSubmit={handleSubmit} person={person}>
          <ImgUpload
            onChange={photoUpload}
            src={
              person.imagePreviewUrl
                ? person.imagePreviewUrl
                : "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
            }
          />
        </Edit>
      ) : (
        <Profile onSubmit={handleSubmit} src={person.imagePreviewUrl} />
      )}
    </div>
  );
};

export default ImageUpload;

const ImgUpload = ({ onChange, src }) => {
  return (
    <label
      htmlFor="photo-upload"
      className="custom-file-upload fas"
      style={{
        textTransform: "uppercase",
        fontWeight: "700",
        color: "#676767",
      }}
    >
      <div className="img-wrap img-upload">
        <img
          for="photo-upload"
          src={src}
          alt=""
          style={{
            width: "200px",
            height: "200px",
          }}
        />
      </div>
      <input
        id="photo-upload"
        type="file"
        onChange={onChange}
        width={100}
        style={{
          display: "none",
          borderRadius: "15px",
          border: "1px solid #b7b7b7",
          padding: "5px 5px 5px 10px",
          fontsize: "18px",
          transition: "0.2s",
        }}
      />
    </label>
  );
};
const Profile = ({ onSubmit, src }) => {
  return (
    <Card sectioned>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label
          className="custom-file-upload fas"
          style={{
            textTransform: "uppercase",
            fontWeight: "700",
            color: "#676767",
          }}
        >
          <div className="img-wrap">
            <img for="photo-upload" src={src} alt="" />
          </div>
        </label>
        {/* <button type="submit" className="edit">
        Edit Profile{" "}
      </button> */}
      </form>
    </Card>
  );
};

const Edit = ({ onSubmit, person, children }) => {
  const [saveImgLoader, setSaveImgLoader] = useState(false);

  return (
    <Card sectioned>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
        <Button
          primary
          onClick={async () => {
            setSaveImgLoader(true);
            let postData = { fileToUpload: { name: "" } };
            postData["fileToUpload"] = person.imagePreviewUrl;
            let { success, message } = await uploadPic(postData);
            if (success) {
              notify.success(message);
            } else {
              notify.error(message);
            }
            setSaveImgLoader(false);
          }}
          disabled={!person.imagePreviewUrl}
          loading={saveImgLoader}
        >
          Save
        </Button>
      </form>
    </Card>
  );
};
