const Register = require('../Models/register.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const registerUser = async (req, res) => {
    try{
        const { userFirstName, userLastName, userEmail, userPassword, userPhoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await Register.findOne({ userEmail });

        if(existingUser){
            return res.status(400).json({status : "error" , message : "Email already exist..."});
        }

        const hashedPassword = await bcrypt.hash(userPassword,10);

        const newUser = new Register({
            userFirstName,
            userLastName,
            userEmail,
            userPassword: hashedPassword,
            userPhoneNumber,
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET,{expiresIn: '1h'});

        return res.status(201).json({
            status : "sucess",
            message : "User registered successfully",
            token,
        })
    }
    catch (error) {
        return res.status(500).json({
            status : "error",
            message : error.message,
        })
    }
}

// Controller for user registration

module.exports = registerUser;
