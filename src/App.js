import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import FileUploads from "./components/FileUploads";
import ViewModel from "./components/ViewModel";

function App() {
  const [model, setModel] = useState([]);

  

  useEffect(() => {
    axios
      .get("https://fabrik-3d.herokuapp.com/api/")
      .then((res) => {
        // console.log(res.data.length);
        setModel(res.data[res.data.length - 1].path);
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);

  return (
    <>
      <div className="container">
        <h2 className="display-4 text-center mb-4">Upload 3D model</h2>
        <FileUploads />
        <ViewModel model={model}/>
      </div>
    </>
  );
}

export default App;
