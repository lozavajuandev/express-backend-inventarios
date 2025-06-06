import pool from "./config/db.js";

try {
  const respuesta = await pool.query("SLECT NOW()");
  console.log(`Respuesta de la base de datos: ${respuesta}`);
} catch (error) {
  console.log(`La conexion a la base de datos no ha sido exitosa`);
}
