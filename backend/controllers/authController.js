// controllers/authController.js
import {db} from '../config/db.js';

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Login request received");
  console.log("Request body:", username, password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [results] = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        }
      });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error("Login query error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
