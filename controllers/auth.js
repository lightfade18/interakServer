import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            contact,
            birthdate,
            email,
            password,
            picturePath,
            friends,
            address,
            occupation
        } = req.body;
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            contact,
            birthdate,
            email,
            password: passwordHash,
            picturePath,
            friends,
            address,
            occupation,
            impressions: 0
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGGING IN
export const login = async(req, res) => {
    try {
        let isValid = false;
        const {email, password } = req.body;
        const user =  await User.findOne({ email: email });
        if(!user) return res.status(400).json({ message: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password.", isValid });
        };
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};