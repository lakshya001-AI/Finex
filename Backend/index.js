const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectMongoDB = require("./Database/connectDB");
const userModel = require("./Database/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import jwt
const biasRoute = require("./routes/biasroute");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

dotenv.config();
connectMongoDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey12345!@";

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, this is the Backend");
});

// Create Account Route
app.post("/createAccount", async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Check if user already exists
    const userExists = await userModel.findOne({ emailAddress });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });

    console.log(newUser);
    res.status(201).send({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Login Route with JWT Token Generation
app.post("/loginUser", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ emailAddress });
    if (!user) {
      return res.status(401).send({ message: "User not found!" });
    }

    // Verify password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.emailAddress },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token validity
      }
    );

    res.status(200).send({
      message: "Logged in successfully!",
      token, // Send the token to the client
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({ message: "An error occurred" });
  }
});

// Middleware to Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store decoded data in request object
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token!" });
  }
};

// Example of a Protected Route
app.get("/protectedRoute", verifyToken, (req, res) => {
  res.status(200).send({
    message: "Access granted to protected route!",
    user: req.user, // Return user data from token
  });
});

// Bias Detection Route
app.use("/api/bias", biasRoute);

// loan approval route

// Loan Approval Route
// app.post("/loanApproval", async (req, res) => {
//   const formData = req.body;  // Data from the frontend (user input)

//   try {
//     console.log("Received Data:", formData);

//     // Convert formData to JSON string for passing into the Python script
//     const jsonData = JSON.stringify(formData);

//     // Run the Python script
//     const pythonScriptPath = '../loanApproval/predict.py';
//     exec(`python ${pythonScriptPath}`, { input: jsonData }, async (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error executing Python script: ${error}`);
//         return res.status(500).json({ error: "Failed to process prediction" });
//       }

//       // Parse the result from the Python script
//       const predictionResult = JSON.parse(stdout);
//       console.log("Prediction Result from Python:", predictionResult);

//       // Save the result in the database (assuming formData contains user email)
//       const userEmail = formData.emailAddress;
//       const user = await userModel.findOne({ emailAddress: userEmail });

//       if (user) {
//         // Save the prediction result in the user's record (e.g., in the loanStatus array)
//         user.loanStatus.push(predictionResult);
//         await user.save();
//       } else {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Send the prediction result back to the frontend
//       res.status(200).json(predictionResult);
//     });

//   } catch (error) {
//     console.error("Error processing loan approval:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

app.post("/loanApproval", async (req, res) => {
  const formData = req.body; // Data from the frontend (user input)

  try {
    // console.log("Received Data:", formData);

    // Send data to the Python Flask service
    const response = await axios.post(
      "http://localhost:3000/loanApproval",
      formData
    );

    // Log and send the prediction result back to the frontend
    // console.log("Prediction Result from Python:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error processing loan approval:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// app.post("/savePrediction", async (req, res) => {
//   const { predictionResult, userEmailAddress } = req.body;

//   try {
//     // Find the user by email address
//     const user = await userModel.findOne({ emailAddress: userEmailAddress });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Prepare the loan status to be saved
//     const loanStatus = {
//       result: predictionResult.result,
//       probabilities: predictionResult.probabilities,
//       reasons: predictionResult.reasons,
//       lime_explanation: predictionResult.lime_explanation,
//     };

//     // Save the loan status to the user's document
//     user.loanStatus.push(loanStatus);

//     // Save the user document with the updated loan status
//     await user.save();

//     res.status(200).json({ message: "Prediction saved successfully!" });
//   } catch (error) {
//     console.error("Error saving prediction:", error);
//     res.status(500).json({ error: "An error occurred while saving the result." });
//   }
// });

// Start the Server

app.post("/savePrediction", async (req, res) => {
  const { predictionResult, userEmailAddress } = req.body;

  try {
    // Find the user by email address
    const user = await userModel.findOne({ emailAddress: userEmailAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare the loan status to be saved
    const loanStatus = {
      result: predictionResult.result,
      probabilities: predictionResult.probabilities,
      reasons: predictionResult.reasons,
      lime_explanation: predictionResult.lime_explanation.map((item) => [
        item[0],
        item[1],
      ]), // Ensure correct format
    };

    // Save the loan status to the user's document
    user.loanStatus.push(loanStatus);

    // Save the user document with the updated loan status
    await user.save();

    res.status(200).json({ message: "Prediction saved successfully!" });
  } catch (error) {
    console.error("Error saving prediction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the result." });
  }
});

// app.post("/api/financial-advice", async (req, res) => {
//   const { salary, expenses, savings } = req.body;

//   if (!salary || !expenses || !savings) {
//     return res.status(400).json({ error: "Please provide all financial details." });
//   }

//   const userInput = `My salary is ${salary}. My monthly expenses are ${expenses}, and I have ${savings} in savings. Provide me with financial advice.`;

//   const genAI = new GoogleGenerativeAI("AIzaSyAuVwzksyAl-eATP99mxACJq1Z1MLOscZc");

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const result = await model.generateContent(userInput);

//   console.log(result.response.text());

// });

// Backend code (e.g., server.js or index.js)
app.post("/api/financial-advice", async (req, res) => {
  const { salary, expenses, savings } = req.body;

  if (!salary || !expenses || !savings) {
    return res
      .status(400)
      .json({ error: "Please provide all financial details." });
  }

  const userInput = `My salary is ${salary}. My monthly expenses are ${expenses}, and I have ${savings} in savings. Provide me with financial advice.`;

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAuVwzksyAl-eATP99mxACJq1Z1MLOscZc"
  ); // Replace with your actual API key

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(userInput);
    const advice = result.response.text(); // Extract the text from the response

    if (advice) {
      res.json({ advice: advice }); // Send the advice back to the frontend
    } else {
      console.error("No advice generated by the model.");
      res.status(500).json({ error: "No advice generated." });
    }
  } catch (error) {
    console.error("Error generating advice:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating advice." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
