import dbConnection from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const listUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

const findOneUser = async (username) => {
  const user = await prisma.users.findUnique({ where: { username } });
  if (!user) {
    return null;
  }
  return user;
};

const register = async (req, res) => {
  const { username, password, role, email } = req.body;
  const existingUser = await findOneUser(username);

  try {
    if (!username || !password || !role || !email) {
      return res.status(400).json({ error: "ususario  no creado" });
    } else {
      if (existingUser) {
        return res.status(404).json({ error: "El usuarario ya existe" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`hashed password result : ${hashedPassword}`);

        const newUser = await prisma.users.create({
          data: {
            username,
            password: hashedPassword,
            role,
            email,
          },
          select: {
            id: true,
            username: true,
            role: true,
          },
        });
        res.status(201).json({
          message: "Usuario creado exitosamente",
          user: newUser,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating user" });
  }
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

export { register, logIn, listUsers, logOut, findOneUser };
