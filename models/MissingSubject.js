const mongoose = require('mongoose');

const missingSubjectSchema = new mongoose.Schema(
  {
    code: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      uppercase: true,
    },
    name: {
      type:    String,
      trim:    true,
      default: '',
    },
    count: {
      type:    Number,
      default: 1,
    },
    lastSearched: {
      type:    Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MissingSubject', missingSubjectSchema);
