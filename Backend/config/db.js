import mongoose, { mongo } from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        autoIndex: true,
    });
    console.log("MongoDB Connected");
};

export default connectDB;