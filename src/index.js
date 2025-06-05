import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import countsRoutes from "./routes/count.routes.js";
import itemsRoutes from "./routes/items.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/counts", countsRoutes);
app.use("/items", itemsRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("dbConnection:", dbConnection.options.database);
    const dbResponse = await dbConnection.query("SELECT NOW()");
    console.log(`Database response: ${dbResponse.rows[0].now}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`app is running at port: ${PORT}`);
  });
}

// Start the server
startServer();
