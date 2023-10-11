import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            min: 3,
            max: 70
        },
        lastname: {
            type: String,
            required: true,
            min: 3,
            max: 70
        },
        contact:{
            type: String,
            required: true,
            max: 11
        },
        birthdate:{
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            require: true,
            min: 7
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        address: {
            type: String,
            required: true
        },
        occupation: String,
        followers: Number,
        impressions: Number,
    },
    {timestamps: true}   
);

const User = mongoose.model("User", UserSchema);
export default User;