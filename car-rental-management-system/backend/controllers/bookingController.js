const Booking = require("../models/Booking");
const Car = require("../models/Car");

const ONE_DAY = 1000 * 60 * 60 * 24;

const createBooking = async (req, res, next) => {
  try {
    const { customerName, email, phone, carId, startDate, endDate } = req.body;

    if (!customerName || !email || !phone || !carId || !startDate || !endDate) {
      res.status(400);
      throw new Error("Please fill all fields");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      res.status(400);
      throw new Error("Pickup date cannot be in the past");
    }
    if (end <= start) {
      res.status(400);
      throw new Error("Return date must be after pickup date");
    }

    const car = await Car.findById(carId);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    if (!car.isAvailable) {
      res.status(400);
      throw new Error("This car is not available");
    }

    const clash = await Booking.findOne({
      carId,
      status: { $ne: "Cancelled" },
      startDate: { $lt: end },
      endDate: { $gt: start },
    });
    if (clash) {
      res.status(400);
      throw new Error("Car is already booked for these dates");
    }

    const days = Math.ceil((end - start) / ONE_DAY);
    const totalAmount = days * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      carId,
      customerName,
      email,
      phone,
      startDate: start,
      endDate: end,
      totalAmount,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("carId", "name brand image")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("carId", "name brand")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
