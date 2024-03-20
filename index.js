//archivo crear servidor local
//importar libreria
const express = require("express");
 //objetos para llamr los metodos express
const app = express();
//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos
app.use(express.static("public"));

//configurar el puerto parar el servidor
app.listen(3000, function(){
    console.log("servidor creado es http://localhost:3000");
});