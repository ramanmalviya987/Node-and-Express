const Tour = require('../models/toursModel');
const APIFeature = require('../utils/apiFeatures');

// middleware
exports.aliasTopTour = (req, res, next) => {
  (req.query.limit = '5'),
    (req.query.sort = '-ratingsAverage,price'),
    (req.query.fields = 'name,price,ratingsAverage,summary,difficulty');
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log('mongoose query', req.query);

    // Build the Query
    // 1A. Filtering
    // const queryObje = { ...req.query };
    // const extendedValue = ['sort', 'limit', 'page', 'fields'];
    // extendedValue.forEach((el) => delete queryObje[el]);

    // // 1B. Advanced Filtering

    // let queryString = JSON.stringify(queryObje);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );
    // // { difficulty: 'easy', duration: { $gte: '5' } }
    // // { difficulty: 'easy', duration: { gte: '5' } }
    // let query = Tour.find(JSON.parse(queryString));

    // // 2. Sorting

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3. limiting field

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // // 4. Paginations

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const newTour = await Tour.countDocuments();
    //   if (skip >= newTour) throw new Error('This page does not exit');
    // }
    // Execute Query
    const feature = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate();

    const tours = await feature.query;

    // Response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Aggregations pipeline function

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTour: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'easy' } } },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
