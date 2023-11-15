// imports

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

//arrancar el servidor

const app = express();

//configurar

app.use(cors());
app.use(express.json());

//conexion con mi bd: MYSQL
async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taller_db',
  });

  connection.connect();
  return connection;
}

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

//endpoints

//OBTENER TODAS LOS CLIENTES (punto 2)
app.get('/clientes', async (req, res) => {
  let query = 'SELECT * FROM clientes';

  const conn = await getConnection();

  const [results] = await conn.query(query);
  const numOfElements = results.length;

  res.json({
    info: { count: numOfElements },
    results: results,
  });
});

//CREAR UN NUEVO CLIENTE (punto 1)
app.post('/clientes', async (req, res) => {
  const dataClientes = req.body;
  const { Nombre, Apellido, Telefono, Vehiculo, Matricula } = dataClientes;

  let sql =
    'INSERT INTO `clientes` (`Nombre`, `Apellido`, `Telefono`, `Vehiculo`, `Matricula`) VALUES (?, ?, ?, ?, ?);';

  const conn = await getConnection();

  const [results] = await conn.query(sql, [
    Nombre,
    Apellido,
    Telefono,
    Vehiculo,
    Matricula,
  ]);

  res.json({
    succes: true,
    id: results.insertId,
  });
});

//ACTUALIZAR UN CLIENTE (punto3)
app.put('/clientes/:id', async (req, res) => {
  const dataClientes = req.body;
  const { Nombre, Apellido, Telefono, Vehiculo, Matricula } = dataClientes;

  const idCliente = req.params.id;

  let sql =
    'UPDATE clientes SET Nombre = ?, Apellido = ?, Telefono = ?, Vehiculo = ?, Matricula = ? WHERE id = ?';

  const conn = await getConnection();

  const [results] = await conn.query(sql, [
    Nombre,
    Apellido,
    Telefono,
    Vehiculo,
    Matricula,
    idCliente,
  ]);
  res.json({
    success: true,
    message: 'Actualizado correctamente',
  });
});

//ELIMINAR UN CLIENTE (punto4)
app.delete('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id;

  let sql = 'DELETE FROM clientes WHERE id = ?;';

  const conn = await getConnection();

  const [results] = await conn.query(sql, [idCliente]);
  res.json({
    success: true,
    message: 'Eliminado correctamente',
  });
});
