const connection = require('./connection')
//validar acceso
function validarcorreo(CORREOELECTRONICO,CONTRASENA, res) {
      //return new Promise((resolve, reject) => {
      const usuarioquery = `SELECT USUARIOID FROM usuarios WHERE CORREOELECTRONICO = '${CORREOELECTRONICO}' AND CONTRASENA = '${CONTRASENA}'`;
      connection.connection.query(usuarioquery, (err, resultadoqueryusuario) => {
        if (err) {
          throw err;
        } else {
          if (resultadoqueryusuario.length == 0) {
            res.status(403).send();
          } else {
            res.status(200).send();
          }
        }
      });
      //});
    }
module.exports = {
        validarcorreo
}