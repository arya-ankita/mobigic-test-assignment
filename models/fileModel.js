const mongoose = require('mongoose');

const fileUpload = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please tell us tour name!'],
  },
  fileName: {
    type: String,
  },
  userId: {
    type: String,
  },
  secretCode: {
    type: Number,
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
});

const files = mongoose.model('files', fileUpload);

module.exports = files;
