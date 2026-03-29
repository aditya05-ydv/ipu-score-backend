const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type:      String,
      required:  true,
      unique:    true,
      uppercase: true,
      trim:      true,
    },
    codeNormalized: {
      type:      String,
      uppercase: true,
      trim:      true,
      index:     true,
    },
    credits: {
      type:     Number,
      required: true,
    },
    name: {
      type:    String,
      trim:    true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subject', subjectSchema);