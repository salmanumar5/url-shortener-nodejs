const User = require("../models/user.model")
const {v4: uuid} = require('uuid')
const {setUser, getUser} = require("../util/auth")

const bcrypt = require('bcrypt');

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.redirect("/login");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).render("signup", { error: "Signup failed. Please try again." });
    }
}


async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }
        console.log("Test",email, password, user);
        

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("login", { error: "Invalid email or password" });
        }

        const token = setUser(user);
        res.cookie("uid", `Bearer ${token}`);
        
        return res.redirect("../");  // Or wherever you want to redirect after login
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).render("login", { error: "Login failed. Please try again." });
    }
}

module.exports = {
    handleUserSignUp,
    handleUserLogin
}