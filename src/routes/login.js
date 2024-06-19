const session = require('express-session');
const connection = require('./connection')

//validar acceso
function login(req, res) {
  

  const CORREOELECTRONICO = req.body.CORREOELECTRONICO;
  const CONTRASENA = req.body.CONTRASENA;

  //return new Promise((resolve, reject) => {
  const usuarioquery = `SELECT USUARIOID FROM usuarios WHERE CORREOELECTRONICO = '${CORREOELECTRONICO}' AND CONTRASENA = '${CONTRASENA}'`;
  connection.connection.query(usuarioquery, (err, resultadoqueryusuario) => {
    if (err) {
      throw err;
    } else {
      if (resultadoqueryusuario.length == 0) {
        res.status(403).send();
      } else {
        let IDUSUARIO = resultadoqueryusuario[0].USUARIOID;
        console.log(IDUSUARIO)
        res.status(200).send();
        return req.session.userId = IDUSUARIO;
      }
    }
  //});
  });
}
module.exports = {
 login
}
