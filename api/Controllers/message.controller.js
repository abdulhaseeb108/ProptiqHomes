import Message from '../models/message.model.js'; // assuming you have this model

// ✅ Controller to send a message
export const createMessage = async (req, res, next) => {
  try {
    console.log('✅ Incoming request body:', req.body);

    const { receiver, listingId, message } = req.body;

    if (!receiver || !listingId || !message) {
      return res.status(400).json({
        success: false,
        message: 'receiver, listingId, and message are required.',
      });
    }

    const newMsg = new Message({
      sender: req.user.id,
      receiver,
      listing: listingId,
      message,
    });

    await newMsg.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: newMsg,
    });

    console.log('✅ sender:', req.user.id);
    console.log('✅ full body:', req.body);
  } catch (err) {
    console.error('❌ Error in createMessage:', err.message);
    next(err);
  }
};

// ✅ Controller to get my messages
export const getMyMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'username email')
      .populate('receiver', 'username email')
      .populate('listing', 'name');

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};
