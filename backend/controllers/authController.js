// controllers/authController.js
import { db } from '../config/db.js';
import bcrypt from 'bcrypt';

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received");

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // ✅ pg uses $1, not ?
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login query error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
