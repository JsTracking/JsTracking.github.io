const connection = require("./connection");
function registrarusuario(req, res) {
  let NOMBRE = req.body.NOMBRE;
  let APELLIDO = req.body.APELLIDO;
  let DOCUMENTO = req.body.DOCUMENTO;
  let FECHANACIMIENTO = req.body.FECHANACIMIENTO;
  let GENEROID = req.body.GENERO;
  let CORREOELECTRONICO = req.body.CORREOELECTRONICO;
  let CONTRASENA = req.body.CONTRASENA;
  let OCUPACION = req.body.OCUPACION;
  let NUMEROTELEFONO = req.body.NUMEROTELEFONO;
  connection.connection.query(
    "INSERT INTO usuarios (NOMBRE, APELLIDO, DOCUMENTO, FECHANACIMIENTO, GENEROID, CORREOELECTRONICO, CONTRASENA, OCUPACION, NUMEROTELEFONO) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      NOMBRE,
      APELLIDO,
      DOCUMENTO,
      FECHANACIMIENTO,
      GENEROID,
      CORREOELECTRONICO,
      CONTRASENA,
      OCUPACION,
      NUMEROTELEFONO,
    ],
    (error) => {
      if (error) {
        throw error;
      } else console.log("datos ingresados correctamente");
      //REDIRECCIONAR A LA PAGINA INICIO
      res.redirect("/login");
    }
  );
}
module.exports = {
  registrarusuario,
};
