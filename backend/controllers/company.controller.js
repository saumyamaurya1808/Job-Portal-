import Company from "../models/company.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body || {};
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required", success: false });
        }
        const existingCompany = await Company.findOne({ name: companyName, userId: req.id });
        if (existingCompany) {
            return res.status(200).json({ message: "Company already registered", success: true, company: existingCompany });
        }
        const company = await Company.create({
            name: companyName,
            userId: req.id // Associate company with the authenticated user
        });
        return res.status(201).json({ message: "Company registered successfully", success: true, company });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
        
};

export const getCompanyProfile = async (req, res) => {
    try {
        const userId = req.id;
        const company = await Company.findOne({ userId });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found", success: false });
        }
        return res.status(200).json({ message: "Company profile found", success: true, company });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// get company profile by id
export const getCompanyProfileById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company profile not found", success: false });
        }
        return res.status(200).json({ message: "Company profile found", success: true, company });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// update company 
export const updateCompany = async (req, res) => {
    try {
        // const companyId = req.params.id;
        const {name, description, website, location } = req.body;
        const file = req.file;

        // cloudinary upload logic here
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo =  cloudResponse.secure_url;


        const updateData = {name, description, website, location, logo};
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData ,
            { new: true }
        );
        if (!company) {
            return res.status(404).json({ message: "Company profile not found", success: false });
        }
        return res.status(200).json({ message: "Company profile updated successfully", success: true, company });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
