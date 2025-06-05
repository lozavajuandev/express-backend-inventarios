import dbConnection from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    if (!username || !password || !role) {
      return res.status(400).json({ error: "ususario  no creado" });
    } else {
      const existingUser = await dbConnection.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      if (existingUser.rows.length > 0) {
        return res.status(404).json({ error: "El usuarario ya existe" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`hashed password result : ${hashedPassword}`);

        const newUser = await dbConnection.query(
          "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role",
          [username, hashedPassword, role]
        );
        res.status(201).json({
          message: "Usuario creado exitosamente",
          user: newUser.rows[0],
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const listUsers = async (req, res) => {
  const users = (await dbConnection.query("SELECT * FROM users")).rows[0];
  console.log(users);
  res.status(200).json({ users });
};

const logIn = async (req, res) => {
  const { username, password } = req.body;
  const result = await dbConnection.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );
  const user = result.rows[0];
  try {
    if (!user) {
      res.json({ message: "error" });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        const token = jwt.sign(
          { id: user.id, role: user.role, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ message: `Loged in: ${username}`, token });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error al inicar la sesion" });
  }
};

const logOut = async (req, res) => {};

export { register, logIn, listUsers, logOut };
