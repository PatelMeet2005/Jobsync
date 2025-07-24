const Register = require('../Models/register.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const loginUser = async (req, res) => {
    try{
        const {userEmail, userPassword} = req.body;

        const existingUser = await Register.findOne({userEmail});

        if(!existingUser){
            return res.status(400).json({
                status : "error",
                message : "Email not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(userPassword,existingUser.userPassword);

        if(!isPasswordMatch){
            return res.status(400).json({
                status : "error",
                message : "Invalid Password",
            });
        }

        const token = jwt.sign({id : existingUser._id},process.env.JWT_SECRET,{expiresIn: '1h'});


        return res.status(200).json({
            status : "success",
            message : "Login successful",
            token,
            userFirstName : existingUser.userFirstName,
            userLastName : existingUser.userLastName,
            userEmail : existingUser.userEmail,
            userPhoneNumber : existingUser.userPhoneNumber,
            role : existingUser.role,
        })
    }
    catch(error){
        return res.status(500).json({
            status : "error",
            message : error.message,
        })
    }
};

const logoutUser = async (req,res) => {
    try{
        // Invalidate the token on the client side by clearing it from sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userFirstName');
        sessionStorage.removeItem('userLastName');
        sessionStorage.removeItem('userPhoneNumber');

        return res.status(200).json({
            status: "success",
            message: "Logout successful"
    });
    }
    catch(error){
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }

};

module.exports = { loginUser, logoutUser };