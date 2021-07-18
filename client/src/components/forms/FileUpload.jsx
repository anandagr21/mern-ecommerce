import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setImageLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    // console.log(e.target.files);

    // resize
    let files = e.target.files;
    let allUploadedFiles = values.images;
    console.log("allUploadedFiles", allUploadedFiles);

    if (files) {
      setImageLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                { headers: { authtoken: user ? user.token : "" } }
              )
              .then((res) => {
                console.log("IMAGE UPLOAD RESPONSE DATA", res);
                setImageLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                setImageLoading(false);
                console.log("CLOUDINARY UPLOAD ERROR", err);
              });
          },
          "base64"
        );
      }
    }
    // send back to server to upload to cloudinary
    // set url to images[] in the parent component - ProductCreate
  };

  const handleImageRemove = (public_id) => {
    console.log("id", public_id);
    setImageLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        { headers: { authtoken: user ? user.token : "" } }
      )
      .then((res) => {
        setImageLoading(false);
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });

        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        setImageLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                className="ml-3"
                shape="square"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-secondary btn-raised">
          Choose File
          <input
            hidden
            type="file"
            multiple
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
