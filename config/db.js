const mongoose = require("mongoose");
const dbconect = async() => {
    try {
        const connec = await mongoose.connect(process.env.MONGO_DB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log(`Mongo db connected at ${connec.connection.host}`);
    } catch (err) {
        console.error(err);
    }
}
module.exports = dbconect;