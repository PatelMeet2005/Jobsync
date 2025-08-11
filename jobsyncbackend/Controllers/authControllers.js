const Register = require('../Models/register');
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
};

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

//get all user data

const getAllUsers = async (req, res) => {
    try {
        const users = await Register.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

//Delete user

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Register.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getAllUsers, deleteUser };


