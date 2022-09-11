import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import FileUploads from "./components/FileUploads";
import ViewModel from "./components/ViewModel";

function App() {
  const [model, setModel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://fabrik-3d.herokuapp.com/api/")
      .then((res) => {
        // console.log(res.data);
        setModel(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="display-4 text-center mb-4">Upload 3D model</h2>
        <FileUploads />
        {loading ? (
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          model.map((item) => <ViewModel key={item._id} model={item.path} />)
        )}
      </div>
    </>
  );
}

export default App;
