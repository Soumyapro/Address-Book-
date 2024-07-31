import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Detail from '../models/userData.js';

export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log(req.body);
        if (!email || !password) {
            return res.status(400).json({ message: "Some field values are missing.." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists.." });
        }
        user = new User({ email, password: hashedPassword });
        await user.save();
        //console.log(user);
        return res.status(201).json({ message: "user has signed up..." });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not sign up..." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "User has logged in.", token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "An error occurred while logging in." });
    }
};

export const submitDetails = async (req, res) => {
    try {
        const { name, relation, phone, address } = req.body;
        const user = req.user.id;
        //console.log(user);
        if (!name || !relation || !phone || !address) {
            return res.status(400).json({ message: "some field values are missing..." });
        }
        const contactDetails = new Detail({ user, name, relation, phone, address });
        await contactDetails.save();
        return res.status(201).json({ message: "address details have been uploaded..." });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not upload details..." });
    }
};

export const getDetails = async (req, res) => {
    try {
        const user = req.user.id;
        const userDetail = await Detail.find({ user: user });
        if (!userDetail) {
            return res.status(401).json({ message: "user could not found.." });
        }
        return res.status(200).json({ message: "Details have been fetched...", data: userDetail });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not fetch the details..." });
    }
};

export const updateDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const detailsId = req.params.detailsId;
        console.log(userId);
        let site_user = await Detail.findOne({ _id: detailsId, user: userId });
        if (!site_user) {
            return res.status(404).json({ message: "user does not exist.." });
        }
        const { name, relation, phone, address } = req.body;
        site_user.name = name;
        site_user.relation = relation;
        site_user.phone = phone;
        site_user.address = address;
        await site_user.save();
        return res.status(200).json({ message: "details have been submited...", data: site_user });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not update details..." });
    }
};

export const deleteDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const detailsId = req.params.detailsId;
        const deletedDetails = await Detail.findOneAndDelete({ _id: detailsId, user: userId });
        if (!deletedDetails) {
            return res.status(404).json({ message: "could not find the detail" });
        }
        return res.status(200).json({ message: "details have been deleted", data: deletedDetails });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not delete details" });
    }
}