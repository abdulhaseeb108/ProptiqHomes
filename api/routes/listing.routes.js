import express from 'express';
import Listing from '../models/listing.model.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// ✅ GET listings with filters (e.g., ?offer=true&limit=4)
router.get('/get', async (req, res) => {
  try {
    const { offer, limit } = req.query;

    const query = {};
    if (offer === 'true') {
      query.offer = true;
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(parseInt(limit) || 10); // Default limit = 10

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ POST a new listing (requires auth)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      userRef: req.user.id,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error('Error creating listing:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create listing' });
  }
});

// ✅ DELETE a listing by ID (requires auth)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete listing' });
  }
});

export default router;
