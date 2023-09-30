const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE;

mongoose.connect(db).then((con) => {
  console.log('db connection  is successfull');
});

const app = require('./app');

const port = process.env.PORT || 8000;

// console.log(process.env)
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
