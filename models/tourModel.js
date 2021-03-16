const mongoose = require("mongoose");

//Optional - modifies strings differently
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name!"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must be less 40 chars."],
      minlength: [10, "A tour name must be more than 10 chars."],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, "Must have a duration"],
      min: [1, "Rating must be above 1.0"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Must have a size"],
    },
    difficulty: {
      type: String,
      required: [true, "Should have difficulty"],
      enum: {
        message: "Incorrect difficulty",
        values: ["easy", "medium", "difficult"],
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //Will only work with NEW documents (not update etc);
          return value < this.price;
        },
        message: "Discount price should be below regulat price {VALUE}",
      },
    },

    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Tour must have a description"],
    },
    imageCover: {
      type: String,
      required: [true, "Tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// Middleware before save
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// Middleware after save
tourSchema.post("save", function (doc, next) {
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("tour", tourSchema);

module.exports = Tour;
