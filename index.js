import express from "express";
const app = express();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import multer from "multer";
import methodOverride from "method-override";
import ThreeDModel from "./models/3Dmodel.js";
import fs from "fs";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import multerS3 from "multer-s3";

dotenv.config();

// Middlewarers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cors());

// Database
mongoose.connect(process.env.MONGOD_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .on("connected", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });

// app.use(express.static("uploads"));

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

var upload = multer({
  storage,
  // fileFilter: (req, file, callback) => {
  //   if (file.mimetype === "model/gltf-binary") {
  //     console.log(file);
  //     callback(null, true);
  //   } else {
  //     callback(null, false);
  //   }
  // },
});

app.get("/api/", async (req, res) => {
  const allData = await ThreeDModel.find();
  res.json(allData);
});

app.post("/api/", upload.single("file"), (req, res) => {
  console.log(req.file);
  const saveFile = new ThreeDModel({
    path: req.file.location,
  });

  saveFile.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    // console.log(req.file);
    res.send("File uploaded successfully");
  });
});

const port = 4000;
app.listen(process.env.PORT || port, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
