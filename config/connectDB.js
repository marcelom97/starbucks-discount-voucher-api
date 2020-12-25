const mongoose = require('mongoose');
const { cyan, bold, underline } = require('colors');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log(cyan(bold(underline(`MongoDB Connected -> host:${conn.connection.host} DB:${conn.connection.name}`))));
};

module.exports = connectDB;
