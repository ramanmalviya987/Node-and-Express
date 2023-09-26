const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE;

mongoose.connect(db).then((con) => {
  console.log('db connection  is successfull');
});

// creating shchema

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A name must be required'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A Price must be required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const tourData = new Tour({
  name: 'A forest gum',
  price: 879
});

tourData
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error', err);
  });
const app = require('./app');

const port = process.env.PORT || 8000;

// console.log(process.env)
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
