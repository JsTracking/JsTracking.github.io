//archivo crear servidor local
//importar libreria
const express = require("express");
 //objetos para llamr los metodos express
const app = express();
//ruta inicial
app.get("/", function(req, res){
    res.send("hello");
});

//configurar el puerto parar el servidor
app.listen(3000, function(){
    console.log("servidor creado es http://localhost:3000");
});