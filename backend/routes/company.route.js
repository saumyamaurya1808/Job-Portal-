
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    registerCompany,
    getCompanyProfile,
    getCompanyProfileById,
    updateCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompanyProfile);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyProfileById);
export default router;






