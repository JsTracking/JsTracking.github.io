//archivo crear servidor local
//importar libreria
const express = require('express');
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
//ruta para objetos dinamicos



//registro
app.get('/registro', function(req, res){
    connection.query('SELECT * FROM generos', (err, results) => {
        if (err) throw err;
    res.render('registro', {generos : results})
})
});



//login
app.get('/login', function(req, res){
    res.render('login.ejs')
})

//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos
app.use(express.static("public"));


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
    let NOMBRE = datos.NOMBRE;
    let APELLIDO = datos.APELLIDO;
    let DOCUMENTO = datos.DOCUMENTO;
    let FECHANACIMIENTO = datos.FECHANACIMIENTO;
    let GENEROID = datos.GENERO;
    let CORREOELECTRONICO = datos.CORREOELECTRONICO;
    let CONTRASENA = datos.CONTRASENA;
    let OCUPACION = datos.OCUPACION;
    let NUMEROTELEFONO = datos.NUMEROTELEFONO;

    connection.query('INSERT INTO usuarios (NOMBRE, APELLIDO, DOCUMENTO, FECHANACIMIENTO, GENEROID, CORREOELECTRONICO, CONTRASENA, OCUPACION, NUMEROTELEFONO) VALUES (?,?,?,?,?,?,?,?,?)', 
    [NOMBRE, APELLIDO, DOCUMENTO, FECHANACIMIENTO, GENEROID, CORREOELECTRONICO , CONTRASENA, OCUPACION, NUMEROTELEFONO ], (error) =>{
        if(error){
            throw error;
    }
    else console.log('datos ingresados correctamente')
    //REDIRECCIONAR A LA PAGINA INICIO
    res.redirect('/public/index.html')
});
})




//configurar el puerto parar el servidor
app.listen(3000, function(){
    console.log("servidor creado es http://localhost:3000");
});

