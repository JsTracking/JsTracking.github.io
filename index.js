//archivo crear servidor local
//importar libreria
const express = require("express");
const mysql = require('mysql');
//put here the credentials of access
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'jstracking'
});
connection.connect((err) =>{
    if(err) throw err // not connected!
    console.log('Connected to MySQL')
});
 //objetos para llamr los metodos express
 const app = express();
//objetos dinamicos
app.set('view engine', 'ejs');

//metodo para obtener datos de una pagina
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//ruta archivos dinamicos
//app.get('/', function(req, res) {
//    res.render('registro');
//});

//enviar formulario a la ruta /validar
app.post('/validar', function(req, res) {
    const datos = req.body;
    //variables para cada input
    let nombre = datos.nombre;
    let correo = datos.correo;
    let contrasena = datos.contrasena;

    connection.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?,?,?)', 
    [nombre, correo , contrasena ], (error) =>{
        if(nombre, correo, contrasena == ""){
        console.log('Todos los campos son obligatorios')
        }
        else if(error){
            throw error;
    }
    else console.log('datos ingresados correctamente')
});
})


//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos
app.use(express.static("public"));

//configurar el puerto parar el servidor
app.listen(3000, function(){
    console.log("servidor creado es http://localhost:3000");
});