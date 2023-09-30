const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  checkBody,
  getTourStats,
  aliasTopTour,
  deleteTour,
  checkID,
} = require('./../controllers/toursController');

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTour, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
