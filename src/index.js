// imports

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

//arrancar el servidor

const app = express();

app.use(cors());
app.use(express.json());

//conexion con mi bd: MYSQL
async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });
  await connection.connect();
  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );

  return connection;
}

const generateToken = (payload) => {
  const token = jwt.sign(payload, 'secreto', { expiresIn: '12h' });
  return token;
};

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

//endpoints

//OBTENER TODOS LOS CLIENTES
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

//CREAR UN NUEVO CLIENTE
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

//ACTUALIZAR UN CLIENTE
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

//ELIMINAR UN CLIENTE
app.delete('/clientes/:id', async (req, res) => {
  try {
    const idCliente = req.params.id;
    let sql = 'DELETE FROM clientes WHERE id = ?;';

    const conn = await getConnection();

    const [results] = await conn.query(sql, [idCliente]);
    res.json({
      success: true,
      message: 'Eliminado correctamente',
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Error, no se ha podido eliminar',
    });
  }
});

//REGISTRO

app.post('/register', async (req, res) => {
  const email = req.body.email;
  const nombre = req.body.nombre;
  const password = req.body.password;

  const passwordHashed = await bcrypt.hash(password, 5);

  const sql = 'INSERT INTO usuarios(email, nombre, password) VALUES (?, ?, ?)';

  const conn = await getConnection();

  const [results] = await conn.query(sql, [email, nombre, passwordHashed]);
  conn.end();
  res.json({
    success: true,
    id: results.insertId,
  });
});

//LOGIN
app.post('/login', async (req, res) => {
  const nombre = req.body.nombre;
  const password = req.body.password;

  const sql = 'SELECT * FROM usuarios WHERE nombre = ?';

  const conn = await getConnection();

  const [users] = await conn.query(sql, [nombre]);
  const user = users[0];

  const isOkPassword =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!(isOkPassword && user)) {
    return res.json({ success: false, error: 'Error' });
  }
  const infoToken = {
    username: user.nombre,
    id: user.id,
  };

  const token = generateToken(infoToken);
  res.json({ success: true, token, username: user.nombre });
});
