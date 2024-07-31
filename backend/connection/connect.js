import mongoose from 'mongoose';

export const connectDb = async (url, app) => {
    await mongoose.connect(url)
        .then((res) => {
            console.log("Database connected..");
            app.listen(process.env.PORT, () => {
                console.log(`Server is connected to ${process.env.PORT}`);
            })
        })
        .catch((error) => {
            console.log(error);
            console.log("!error");
        })
};

