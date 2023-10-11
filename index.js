// IMPORTS
import express from "express"; // framework used for building web app
import bodyParser from "body-parser"; // used to parse request bodies in different formats
import mongoose from "mongoose";  // library used to interact with mongoDB
import cors from "cors"; // middleware used to enable Cross-Origin Resource Sharing
import dotenv from "dotenv"; // library used for loading env files
import multer from "multer"; // middleware used for handling file uploads
import helmet from "helmet"; // middleware used setting HTTP headers and enhance security
import morgan from "morgan"; // middleware used logging HTTP requests
import path from "path"; // node module used for working with file and directory paths
import { fileURLToPath } from "url"; // used to convert file URL to file path
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url); // function to get the current module's file path
const __dirname = path.dirname(__filename); // function to extract the directory name from the file path
dotenv.config(); // load env file
const app = express(); // parses incoming JSON data in request bodies
app.use(express.json()); // invoke express
app.use(helmet()); // invoke helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // invoke and sets Cross-Origin Resource Policy header
app.use(morgan("common")); // invoke morgan and sets various security-related HTTP headers
app.use(bodyParser.json({ limit: "30mb", extended: true })); // parses incoming JSON data in request bodies with size limit
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // parses URL-encoded data in request bodies with size limit
app.use(cors()); // invoke Cross-Origin Resource Sharing
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // set the directory to where to keep assets - use actual storage for real production like S3

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
      const originalName = file.originalname; // Get the original filename
      cb(null, originalName); // Use the original filename for storage
    }
}); // function that uses multer to where the files will be stored
const upload = multer({ storage }); // call to upload a file

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register); // contains a route, a middleware (that uploads a picture locally), and a controller (logic to register)
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  // // ADD DATA ONE TIME ONLY (SAMPLE INPUT DATA)
  // User.insertMany(users);
  // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`))