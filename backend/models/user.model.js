import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true      
    },
    role:{
        type: String,
        enum: ['recruiter', 'student'],
        
        required: true
    },
    profile:{
        bio:{ type: String },
        skills: [{ type: String }],
        experience: [{ 
            company: { type: String },  
        }],
        resumeUrl: { type: String } ,//url to resume file stored in cloud (e.g., AWS S3)
        resumeOriginalName: { type: String }, //original name of the uploaded resume file
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        profilePhoto:{
            type: String, //url to profile photo stored in cloud
            default:""
        },
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;