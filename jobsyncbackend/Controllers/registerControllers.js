const Register = require('../Models/register');
const loginUser = require('./loginControllers.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {

    const isAdminExists = await Register.findOne({ userEmail: "admin@gmail.com" });

    if(!isAdminExists){
        const hashedPassword = await bcrypt.hash("admin", 10);

        const adminUser = new Register({
            userFirstName: "Admin",
            userLastName: "User",
            userEmail: "admin@gmail.com",
            userPassword: hashedPassword,
            role: "admin",
            userPhoneNumber: "7862056323"
        });

        await adminUser.save();
        await new loginUser({
            userEmail: "admin@gmail.com",
            userPassword: hashedPassword
        }).save();
        console.log("Admin user created successfully.");
    }
}
createAdmin().catch(err => console.error("Error creating admin user:", err));

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
            userFirstName: newUser.userFirstName,
            userLastName: newUser.userLastName, 
            userEmail: newUser.userEmail,
            userPhoneNumber: newUser.userPhoneNumber,
            role: newUser.role,
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
