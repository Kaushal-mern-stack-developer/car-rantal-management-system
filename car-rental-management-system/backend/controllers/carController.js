const Car = require("../models/Car");

const getCars = async (req, res, next) => {
  try {
    const { search, category, fuelType, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (fuelType) filter.fuelType = fuelType;
    if (maxPrice) filter.pricePerDay = { $lte: Number(maxPrice) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { carModel: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    next(error);
  }
};

const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    res.json(car);
  } catch (error) {
    next(error);
  }
};

const addCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    res.json(car);
  } catch (error) {
    if (res.statusCode === 200) res.status(400);
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      res.status(404);
      throw new Error("Car not found");
    }
    res.json({ message: "Car deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, getCarById, addCar, updateCar, deleteCar };
