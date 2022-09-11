import mongoose from "mongoose";

const Schema = mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
});

const ThreeDModel = mongoose.model("ThreeDModel", Schema);
export default ThreeDModel;
