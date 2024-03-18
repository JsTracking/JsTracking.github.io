const conexion = require("conexion")
module.exports = {
    insertar(nombre, correo, contrasena){
        return new Promise((resolve, reject) => {
        conexion.query(`insert into ususarios (nombre,correo,contrasena)
        values (:nombre,:correo,:contrasena)`, 
        [nombre,correo,contrasena], (err, resultados) => {
            if (err) reject(err);
            else resolve(resultados.insrId);
        });
        });
    }
}
