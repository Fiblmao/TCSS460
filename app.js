const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/bodyfat/:age/:height/:weight/:gender", (req, res) => {
  // Get age, height, weight, and gender from the request parameters
  const age = parseInt(req.params.age);
  const height = parseFloat(req.params.height);
  const weight = parseFloat(req.params.weight);
  const gender = req.params.gender.toLowerCase();

  if (isNaN(age) || isNaN(height) || isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
    // Handle invalid input
    res.status(400).json({ error: "Invalid age, height, or weight parameters" });
    return;
  }

  // Calculate body fat 
  const bmi = Math.round(weight / Math.pow(height, 2) * 10000)
  var bodyfat;
  if (gender === "male" && age >= 18) {
    bodyfat = bmi * 1.20 + 0.23 * age -16.2
  } else if (gender === "male" && age < 18) {
    bodyfat = 1.51 * bmi - 0.70 * age - 2.2
  } else if (gender === "female" && age >= 18) {
    bodyfat = bmi * 1.20 + 0.23 * age - 5.4
  } else if (gender === "female" && age < 18) {
    bodyfat = 1.51 * bmi - 0.70 * age + 1.4
  } else {
    res.status(400).json({ error: "Invalid gender parameter" });
    return;
  }

  // Return the calculated body fat
  res.json({ bodyfat });
});


app.get("/bmi/:weight/:height", (req, res) => {
  // Get weight and height from the request parameters
  const weight = parseFloat(req.params.weight);
  const height = parseFloat(req.params.height);

  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    // Handle invalid input
    res.status(400).json({ error: "Invalid weight or height parameters" });
    return;
  }

  const bmi = Math.round(weight / Math.pow(height, 2) * 10000)

  // Return the calculated BMR
  res.json({ bmi });
});

app.get("/idealweight/:gender/:height", (req, res) => {
  // Get gender and height from the request parameters
  const gender = req.params.gender;
  const height = parseFloat(req.params.height);
  const inchesOverFive = (height - 152.4);

  const MbaseWeight = 56.2;
  const MweightIncreaseKg = inchesOverFive * 0.035;

  const FbaseWeightKg = 53.1;
  const FweightIncreaseKg = inchesOverFive * 0.035;

  if (isNaN(height) || height <= 0) {
    // Handle invalid input
    res.status(400).json({ error: "Invalid height parameter" });
    return;
  }

  // Calculate ideal weight based on gender
  const idealWeight = gender === "male" ? Math.round(MbaseWeight + MweightIncreaseKg) : Math.round(FbaseWeightKg + FweightIncreaseKg);

  // Return the calculated ideal weight
  res.json({ idealWeight });
});



app.get("/caloriesburned/:weight/:runTime", (req, res) => {
  // Get weight and run time from the request parameters
  const weight = parseFloat(req.params.weight);
  const runTime = parseFloat(req.params.runTime);
  const MET = 10;

  if (isNaN(weight) || isNaN(runTime) || weight <= 0 || runTime <= 0) {
      // Handle invalid input
      res.status(400).json({ error: "Invalid weight or run time parameter" });
      return;
  }

  // Calculate calories burned
  const caloriesBurned = MET * weight * runTime

  // Return the calculated calories burned
  res.json({ caloriesBurned });
});

app.use(function(req, res) {
  res.status(404);
  return res.send(`404 Error: Resource not found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
