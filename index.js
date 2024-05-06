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

// To get all users data with given date 
app.get('/date/', async (req, res) => {
    try {
        const { str } = req.params; // Retrieve date string from URL parameter
        const date = new Date(decodeURIComponent(str)); // Convert date string to Date object

        // Extract month, day, and year components
        const month = date.getMonth() // Add 1 to getMonth() result because it returns zero-based month index
        const day = date.getDate();
        const year = date.getFullYear();

        // Format the components into a desired date format
        const formattedDate = `${month}/${day}/${year}`;

        // Send the formatted date as a response
        res.send(formattedDate);
    } catch (error) {
        console.error('Error handling date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/date/:date(\\d{1,2}/\\d{1,2}/\\d{4})", async (req, res) => {
    const parts = req.params.date.split('/');
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const queryDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });


    // check for the date 
    try {
    const usersData = await User.find({ 'data.key': queryDate });
    const formattedUserData = usersData.map(user => ({
              name: user.name,
             mobile: user.mobile,
            location: user.data.find(entry => entry.key === queryDate)?.value // Extract location for the given date
           }));
         res.json(formattedUserData);
        } catch(e){
            console.error('Error fetching users data:', e);
            res.status(500).json({ error: 'Internal server error' }); 
        }

});




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
