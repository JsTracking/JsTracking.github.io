//importar libreria
const connection = require('./src/routes/connection')
const { resolve } = require("dns");
const express = require("express");
const path = require("path");


//objetos para llamr los metodos express
const app = express();

//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos
app.use(express.static(path.join(__dirname, "public")));

//ruta de la carpeta contenedora de los archinos dinamicos
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

//renderizar el registro
app.get("/registro", function (req, res) {
  connection.connection.query("SELECT * FROM generos", (err, results) => {
    if (err) throw err;
    res.render("registro", { generos: results });
  });
});

//renderizar el registrodireccion
app.get("/registrodireccion", function (req, res) {
  res.render("registrodireccion")
})

//renderizar el registro informacion salud
app.get("/registroinformacionsalud", function (req, res) {
  res.render("registroinformacionsalud.ejs");
});

//metodo para obtener datos de una pagina
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//llamar las funciones exportadas para registrar un usuario
const registrarusuario = require('./src/routes/registrousuario')

//recibir los datos del formulario en el front
app.post("/validar", function (req, res) {
//utilizar la funcion exportada de registrarusuario
  registrarusuario.registrarusuario(req,res)
});

//llamar las funciones exportadas para registrar la direccion
const registrodireccion = require ('./src/routes/registrodireccion')
app.post("/direccion", function (req, res) {
//utilizar la funcion exportada
  registrodireccion.registrodireccion(req,res)
});



//requerir las funciones de insertar salud
const functioninsertsalud = require('./src/routes/registroinformacionsalud')
//informacion salud

app.post("/informacionsalud", (req, res) => {
functioninsertsalud.registroinformacionsalud(req, res)
})

//hacer el render del login
app.get("/login", function (req, res) {
  res.render("login.ejs");
});
//requerir el modulo exportado para la validacion
const functionvalidarcorreo = require ('./src/routes/validar-login');

//recibir los datos del front
app.post("/validar-login", (req, res) => {
  //utilizar el modulo requerido
  functionvalidarcorreo.validarcorreo(req,res)
})
//configurar el puerto parar el servidor
app.listen(3000, function () {
  console.log("servidor creado es http://localhost:3000");
});
