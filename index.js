import express from 'express';
import mongoose from 'mongoose';
import User from "./users.js";
import 'dotenv/config';
const uri = process.env.URIL;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.log("error while making connections", e);
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send({ status: "started" });
});

app.post('/register', async (req, res) => {
    const { name, mobile, password } = req.body;
    console.log("req.body", req.body);
    try {
        const oldUser = await User.findOne({ mobile: mobile });
        if (oldUser) {
            console.log("User already exists!");
            console.log(oldUser.name);
            return res.status(400).send({ "error": "User already exists!" });
        }

        await User.create({
            name: name,
            mobile: mobile,
            password: password
        });

        console.log("User created!");
        return res.send({ status: "user created!" });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});


// This endpoint will use for marking the attendance
// date3.toDateString()==date1.toDateString()
app.put('/update/:mobile', async (req, res) => {
    const { mobile } = req.params;
    const newData = req.body;

    try {
        const user = await User.findOne({ mobile: mobile });

        if (!user) {
            console.log("User not found!");
            return res.status(404).send({ "error": "User not found!" });
        }

        // here we have to find whether entry made for the day or not
        


        // Combine existing data with new data
        
        const combinedData = [...user.data];

        Object.entries(newData).forEach(([key, value]) => {
            combinedData.push({ key, value });
        });

        // Update the data field for the user
        user.data = combinedData;

        await user.save();

        console.log("User data updated!");
        return res.send({ status: "User data updated!" });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});


// Top get the user data
app.get('/:mobile', async (req, res) => {
    const { mobile } = req.params;
    const find = await User.findOne({ mobile: mobile });
    if (find) {
        res.send(find);
        console.log("name :", find?.name, "mobile: ", find?.mobile);
    }
    else {
        res.send({ "data": "user not found" });
    }
})

// for deleting 

app.delete('/:mobile', async (req, res) => {
    const { mobile } = req.params;

    try {
        const user = await User.findOne({ mobile: mobile });

        if (!user) {
            console.log("User not found!");
            return res.send({ "data": "User not found!" });
        }

        // await user.remove();
        await User.deleteOne({ mobile: mobile });

        console.log("User deleted successfully!");
        return res.send({ "data": "User deleted successfully!" });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
