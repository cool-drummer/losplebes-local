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
      productoCategoria: row.TSCAT_ID,
      productoNombre: row.PRODUCTO_DESC,
      productoPrecio: row.PRODUCTO_COST_VENTA,
      productoUrl: row.URL_IMG,
    }));

    res.json(productos);
    console.log(productos);
  });
});


/*app.post('/insertarOrdenVenta', (req, res) => {
  // Extraer datos del cuerpo de la solicitud (request body)
  const {
    OV_FOLIO,
    OV_FEC_CAPTURA,
    CLIENTE_ID = 2793,
    OV_FACTURA,
    USUARIO_ID = 6469,
    CBDIV_ID = 45,
    OV_STATUS = 23,
    SUBTOTAL,
    IVA,
    TOTAL_OV,
    TIPO_PAGO = 0,
    DESCUENTO = null,
    DESC_MONTO = 0,
    TOTAL_NETO,
    TOTAL_EFECTIVO = null,
    TOTAL_TARJETA = null,
    TIENDA_ID = 2049,
    CAJAVENTA_ID,
    PERSONA_ID,
    FOLIO_TICKET,
    TIPO_VENTA = 3,
    TURNO,
    MESA,
    TPLAT_ID = 0,
    PROPINA,
    OV_OBS = null,
    MESERO_ID,
    ID_LOCAL = null,
    OBS_DESCUENTO = null,
    ID_ASISTENCIA = null,
    MESA_APODO = null
  } = req.body;

  // Generar la fecha actual con el formato deseado (23-OCT-21)
  /*const fechaActual = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'short',
    day: 'numeric'
  });


  const query = `
    INSERT INTO tra_ov (
      OV_FOLIO,
      OV_FEC_CAPTURA,
      CLIENTE_ID,
      OV_FACTURA,
      USUARIO_ID,
      CBDIV_ID,
      OV_STATUS,
      SUBTOTAL,
      IVA,
      TOTAL_OV,
      TIPO_PAGO,
      DESCUENTO,
      DESC_MONTO,
      TOTAL_NETO,
      TOTAL_EFECTIVO,
      TOTAL_TARJETA,
      TIENDA_ID,
      CAJAVENTA_ID,
      PERSONA_ID,
      FOLIO_TICKET,
      TIPO_VENTA,
      TURNO,
      MESA,
      TPLAT_ID,
      PROPINA,
      OV_OBS,
      MESERO_ID,
      ID_LOCAL,
      OBS_DESCUENTO,
      ID_ASISTENCIA,
      MESA_APODO
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    OV_FOLIO,
    OV_FEC_CAPTURA,
    CLIENTE_ID,
    OV_FACTURA, // OV_FACTURA (null por defecto)
    USUARIO_ID,
    CBDIV_ID,
    OV_STATUS,
    SUBTOTAL,
    IVA,
    TOTAL_OV,
    TIPO_PAGO,
    DESCUENTO,
    DESC_MONTO,
    TOTAL_NETO,
    TOTAL_EFECTIVO,
    TOTAL_TARJETA,
    TIENDA_ID,
    CAJAVENTA_ID,
    PERSONA_ID,
    FOLIO_TICKET,
    TIPO_VENTA,
    TURNO,
    MESA,
    TPLAT_ID,
    PROPINA,
    OV_OBS,
    MESERO_ID,
    ID_LOCAL,
    OBS_DESCUENTO,
    ID_ASISTENCIA,
    MESA_APODO
  ]; 
  


  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error al insertar la orden de venta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    const respuesta = {
      success: true,
      message: 'Orden de venta insertada con éxito.'
    };

    res.json(respuesta);
  });
});
*/
app.post('/insertarOrdenVenta', (req, res) => {
  console.log('Datos en req.body:', req.body);
  
  // Extraer datos del cuerpo de la solicitud (request body)
  const {
    total,
    subtotal,
    iva,
    numeroMesa,
    propina,
    CBDIV_ID
    // Otros datos que necesitas
  } = req.body;

  // Generar la fecha actual con el formato deseado (23-OCT-21)
  const fechaActual = new Date().toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'short',
    day: 'numeric'
  });
 

  const query = `
  INSERT INTO tra_ov_sku (
    TOTAL_NETO,
    SUBTOTAL,
    IVA,
    MESA,
    PROPINA,
    CBDIV_ID
  )
  VALUES (?, ?, ?, ?, ?, 45)
`;

const values = [
  total,
  subtotal,
  iva,
  numeroMesa,
  propina,
  CBDIV_ID
  // Agrega aquí los valores de otros campos que necesitas
];


  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Error al insertar la orden de venta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    const respuesta = {
      success: true,
      message: 'Orden de venta insertada con éxito.'
    };

    res.json(respuesta);
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
