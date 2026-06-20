import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";

dotenv.config({});

const app = express();


// app.get("/", (req, res)=>{
//     return res.status(200).json({message: "I am coming from backend", success: true});
// });
// middleware

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
  
}

app.use(cors(corsOptions)); 

const PORT = process.env.PORT || 3000;

// api
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes)
app.use("/api/v1/application", applicationRoutes )

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Server startup aborted:', error);
    });