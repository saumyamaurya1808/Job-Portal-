import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        // Registration logic here
        const body = req.body || {};
        const { name, email, password , phoneNumber, role } = body;
        const missing = [
            !name && 'name',
            !email && 'email',
            !password && 'password',
            !phoneNumber && 'phoneNumber',
            !role && 'role'
        ].filter(Boolean);
        if(missing.length){
            console.warn('Register request missing fields:', missing, 'content-type:', req.headers['content-type'], 'body:', body);
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}`, success: false });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(file.content); 

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" , success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword , phoneNumber, role, profile:{profilePhoto: cloudResponse.secure_url}  });
        return res.status(201).json({ message: "User registered successfully" , success: true });
    } catch (error) {
        res.status(500).json({ message: error.message , success: false });
    }
};

export const login = async (req, res) => {
    try {
        // Login logic here
        const { email, password , role} = req.body || {};
        if(!email || !password || !role){
            return res.status(400).json({ message: "All fields are required" , success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" , success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" , success: false });
        }

        // Generate JWT token or perform other authentication logic here
        // check role correct or not
        if(user.role !== role){
            return res.status(400).json({ message: "Invalid credentials" , success: false });
        }

        const tokenData = {
            userId: user._id,
            role: user.role
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
        
        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };
        return res.status(200).cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({ 
            message: `Logged in as ${user.name}` , 
            user,
            success: true 
        });

      
    } catch (error) {
        res.status(500).json({ message: error.message , success: false });
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({ message: "Logged out successfully" , success: true });
    } catch (error) {
        res.status(500).json({ message: error.message , success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const file = req.file; // Access the uploaded file (if any)
        
        const { name, phoneNumber, profilePhoto, bio, skills, experience } = req.body || {};
        
        // cloudinary upload logic will be handled in separate middleware, here we will just get the url from req.body and save it to database
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(file.content);


        let skillsArray = [];
        if(skills) {
            skillsArray = skills.split(',');
        }
        
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found", success: false });
        }
        // updating data
        if(name)  user.name = name;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(profilePhoto) user.profile.profilePhoto = profilePhoto;
        if(bio) user.profile.bio = bio;
        if(skillsArray.length > 0) user.profile.skills = skillsArray;
        if(experience) user.profile.experience = experience;

        // resume uploading will be handled in separate route
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;  //save cloudary url
            user.profile.resumeOriginalName = file.originalname;    
        }

        await user.save();
        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({ message: "Profile updated successfully", success: true, user });

    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
