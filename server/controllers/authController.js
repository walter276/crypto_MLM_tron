const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, walletAddress } = req.body;

  if (!email || !walletAddress) {
      return res.status(400).json({type: "failed", message: 'Please provide both email and wallet address.' });
  }

  // Check if the user already exists
  let user = await User.findOne({ username });

  if (user) {
      return res.status(409).json({type: "failed", message: 'Username already taken.' });
  }

  user = await User.findOne({ email });

  if (user) {
      return res.status(409).json({type: "failed", message: 'Email already taken.' });
  }

  user = await User.findOne({ walletAddress });

  if (user) {
      return res.status(409).json({type: "failed", message: 'Wallet address already taken.' });
  }

  try {
      // Hash the password before storing it
      // const hashedPassword = await bcrypt.hash(password, 10);
      // const newUser = { username, email, password: hashedPassword };
      const newUser = { username, email, walletAddress };
      await User.create(newUser);

      res.status(201).json({type: "success", message: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
      res.status(500).json({type: "failed", message: 'Failed to register user.' });
  }
};

exports.login = async (req, res) => {
  const { email, walletAddress } = req.body;

  if (!email || !walletAddress) {
      return res.status(400).json({ message: 'Please provide both email and wallet address.' });
  }

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
      // Compare the hashed password
      // const passwordMatch = await bcrypt.compare(password, user.password);
      // if (!passwordMatch) {
      //     return res.status(401).json({ message: 'Invalid credentials.' });
      // }

      // Create and sign a JSON Web Token (JWT)
      const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });

      res.json({ token, user });
  } catch (error) {
    console.log(error);
      res.status(500).json({ message: 'Login failed.' });
  }
};
