import React, { Fragment, useState } from "react";
import axios from "axios";

const FileUploads = () => {

  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");

  const onChange = e => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const headers = {
      "Content-Type": "model/gltf-binary",
    };

    const formData = new FormData();
    formData.append("file", file);
    // formData.append("path", filename);
    try {
      const res = await axios.post(
        "https://fabrik-3d.herokuapp.com/api/",
        formData,
        {
          headers: headers,
        }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Fragment>
      <form onSubmit={onSubmit} encType="model/gltf-binary">
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
            accept=".glb"
            formEncType="model/gltf-binary"
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <input type="submit" className="btn btn-primary btn-block mt-4" />
      </form>
    </Fragment>
  );
};

export default FileUploads;
