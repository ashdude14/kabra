import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name: String,
    mobile: { type: Number, unique: true },
    password: String,
    data: {
        type: [{
            key: String,
            value: Object
        }],
        default: []
    }
});

const User = mongoose.model('User', usersSchema);
export default User;
