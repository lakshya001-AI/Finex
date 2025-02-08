const mongoose = require("mongoose");

// const userSchema = mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   emailAddress: { type: String, required: true },
//   password: { type: String, required: true },
//   loanStatus: [{
//     result: String,
//     probabilities: {
//       Rejected: Number,
//       Approved: Number
//     },
//     reasons: [[String, String]],  // Example: [["Income", "Sufficient"], ["Credit History", "Good"]]
//     lime_explanation: [String]  // Explanation from LIME
//   }],
// });

// const userModel = mongoose.model("userModel", userSchema);
// module.exports = userModel;

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  loanStatus: [
    {
      result: String,
      probabilities: {
        Rejected: Number,
        Approved: Number,
      },
      reasons: [[String, String]], // This is fine, remains the same
      lime_explanation: [[String, Number]], // Modify this line to allow an array of arrays
    },
  ],
});

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
