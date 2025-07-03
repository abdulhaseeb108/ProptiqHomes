



import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// ✅ Create Listing
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    console.error("❌ Listing creation error:", error);
    next(errorHandler(500, "Failed to create listing"));
  }
};

// ✅ Get recent 6 listings (for Home page)
// export const getRecentListings = async (req, res) => {
//   try {
//     const listings = await Listing.find()
//       .sort({ createdAt: -1 })
//       .limit(6); // you can set 5, 6, or 7 as needed
//     res.status(200).json(listings);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch recent listings" });
//   }
// };

// ✅ Get All Listings (admin maybe)
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// ✅ Get listing by ID
export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(500, "Something went wrong"));
  }
};

// ✅ Get listings created by a user
export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listing!"));
  }
};

// ✅ Update listing
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (listing.userRef !== req.user.id)
      return next(errorHandler(403, "You can only update your own listings"));

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (err) {
    next(err);
  }
};

// ✅ Get recent 6 listings for home page
export const getRecentListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent listings' });
  }
};


// ✅ Delete listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (listing.userRef !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own listings"));
    }
    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    next(errorHandler(500, "Failed to delete listing"));
  }
};

// ✅ Search / Filter
export const getListingsWithFilters = async (req, res) => {
  try {
    const {
      searchTerm = '',
      type = 'all',
      parking = 'false',
      furnished = 'false',
      offer = 'false',
      sort = 'createdAt',
      order = 'desc',
      startIndex = 0,
    } = req.query;

    const query = {
      name: { $regex: searchTerm, $options: 'i' },
    };

    if (type !== 'all') query.type = type;
    if (parking === 'true') query.parking = true;
    if (furnished === 'true') query.furnished = true;
    if (offer === 'true') query.offer = true;

    const sortOption = {};
    sortOption[sort] = order === 'desc' ? -1 : 1;

    const listings = await Listing.find(query)
      .sort(sortOption)
      .skip(parseInt(startIndex))
      .limit(9);

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Something went wrong',
    });
  }
};