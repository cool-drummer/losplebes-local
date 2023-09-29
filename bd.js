const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Agregar middleware para manejar las solicitudes CORS
app.use(express.json());

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "kalama1024",
  database: "POSPLEBES",
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.stack);
    return;
  }
  console.log("Conexión exitosa a la base de datos MySQL.");
});

app.get("/opciones", (req, res) => {
  // Realiza una consulta SQL para obtener los datos de la tabla en MySQL
  const query =
    "SELECT PERSONA_ID, PERSONA_NOMBRE FROM TRA_PERSONA";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    const opciones = results.map((row) => ({
      value: row.PERSONA_ID,
      text: row.PERSONA_NOMBRE
    }));

    res.json(opciones);
  });
});


app.get("/categorias", (req, res) => {
  const query =
    "SELECT TCAT_ID, TCTA_DESC FROM tra_categorias"; 

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    const categorias = results.map((row) => ({
      value: row.TCAT_ID,
      text: row.TCTA_DESC,
    }));

    res.json(categorias);
  });
});


app.get("/productos", (req, res) => {
  const productos =
    "SELECT TSCAT_ID, PRODUCTO_DESC, PRODUCTO_COST_VENTA, URL_IMG FROM TRA_PRODUCTOS";

  connection.query(productos, (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    // Mapea los resultados de la consulta a un nuevo formato
    const productos = results.map((row) => ({
      value: row.TSCAT_ID,
      text: row.PRODUCTO_DESC,
      price: row.PRODUCTO_COST_VENTA,
      imageUrl: row.URL_IMG,
    }));

    res.json(productos);
    console.log(productos);
  });
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Servidor web en ejecución en el puerto ${PORT}`);
});

// Cierra la conexión a la base de datos cuando hayas terminado
process.on("SIGINT", () => {
  connection.end((err) => {
    if (err) {
      console.error("Error al cerrar la conexión: " + err.stack);
      return;
    }
    console.log("Conexión a la base de datos cerrada.");
    process.exit(0);
  });
});
