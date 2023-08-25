const mysql = require('mysql');

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'kalama1024',
  database: 'POSPLEBES'
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL.');
});

// Cierra la conexión a la base de datos cuando hayas terminado
connection.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión: ' + err.stack);
      return;
    }
    console.log('Conexión a la base de datos cerrada.');
  });
  