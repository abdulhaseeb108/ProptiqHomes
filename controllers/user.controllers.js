import { User } from '../models/user.model.js'; // ✅ named import
import Listing from '../models/listing.model.js';

// ✅ Get current user info
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ✅ Create user (not really used in most cases because signup is handled in auth)
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created', user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'User creation failed' });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ success: false, message: 'User update failed' });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'User deletion failed' });
  }
};

// ✅ Get listings created by this user
// controllers/user.controller.js
import Listing from '../models/listing.model.js';

export const getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch user listings' });
  }
};

