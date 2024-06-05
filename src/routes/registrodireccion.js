const connection = require("./connection");
function registrodireccion(req, res) {
  //variables
  let CALLE = req.body.CALLE;
  let FORMNOMBREPAIS = req.body.PAIS;
  let FORMNOMBREESTADO = req.body.ESTADO;
  let FORMNOMBRECIUDAD = req.body.CIUDAD;
  let CODIGOPOSTAL = req.body.CODIGOPOSTAL;
  let DOCUMENTO = req.body.DOCUMENTO;
  //funcion obtener id del usuario
  function obtenerIdUsuario(DOCUMENT) {
    return new Promise((resolve, reject) => {
      const usuarioquery = `SELECT USUARIOID FROM usuarios WHERE DOCUMENTO = '${DOCUMENT}'`;
      connection.connection.query(
        usuarioquery,
        (err, resultadoqueryusuario) => {
          if (err) {
            reject(err);
          } else {
            if (resultadoqueryusuario.length == 0) {
              res.status(404).send();
            } else {
              const IDUSUARIO = resultadoqueryusuario[0].USUARIOID;
              console.log("usuario", IDUSUARIO);
              resolve(IDUSUARIO);
            }
          }
        }
      );
    });
  }
  //funcion para obtener el id del pais
  function obtenerIdPais(NOMBREPAIS) {
    return new Promise((resolve, reject) => {
      const paisquery = `SELECT PAISID FROM paises WHERE NOMBRE LIKE '${NOMBREPAIS}'`;
      connection.connection.query(paisquery, (err, resultadoquerypais) => {
        if (err) {
          reject(err);
        } else {
          //si no se encuentra un pais se hace la incercion de este
          if (resultadoquerypais.length === 0) {
            connection.connection.query(
              "INSERT INTO paises (NOMBRE) VALUES (?)",
              [NOMBREPAIS],
              (err, resultadoinsertpais) => {
                if (err) {
                  reject(err);
                } else {
                  console.log("Pais Ingresado Correctamente");
                  const IDPAIS = resultadoinsertpais.insertId;
                  console.log(IDPAIS);
                  resolve(IDPAIS);
                }
              }
            );
          } else {
            //si encuentra un pais obtiene su id
            const IDPAIS = resultadoquerypais[0].PAISID;
            console.log("pais", IDPAIS);
            resolve(IDPAIS);
          }
        }
      });
    });
  }

  //funcion para otener el id del estado
  function obtenerIdEstado(NOMBRESTADO, IDPAIS) {
    return new Promise((resolve, reject) => {
      const estadoquery = `SELECT ESTADOID FROM estados WHERE PAISID = '${IDPAIS}' AND NOMBRE LIKE '${NOMBRESTADO}'`;
      connection.connection.query(estadoquery, (err, resultadoqueryestado) => {
        if (err) {
          reject(err);
        } else {
          if (resultadoqueryestado.length === 0) {
            connection.connection.query(
              "INSERT INTO estados (PAISID, NOMBRE) VALUES (?, ?)",
              [IDPAIS, NOMBRESTADO],
              (err, resultadoinsertestado) => {
                if (err) {
                  reject(err);
                } else {
                  console.log("Estado Ingresado Correctamente");
                  const IDESTADO = resultadoinsertestado.insertId;
                  console.log(IDESTADO);
                  resolve(IDESTADO);
                }
              }
            );
          } else {
            const IDESTADO = resultadoqueryestado[0].ESTADOID;
            console.log("estado", IDESTADO);
            resolve(IDESTADO);
          }
        }
      });
    });
  }

  //funcion para obtener el id de la ciudad
  function obtenerIdCiudad(NOMBRECIUDAD, IDESTADO) {
    return new Promise((resolve, reject) => {
      const ciudadquery = `SELECT CIUDADID FROM ciudades WHERE ESTADOID = '${IDESTADO}' AND NOMBRE LIKE '${NOMBRECIUDAD}'`;
      connection.connection.query(ciudadquery, (err, resultadoqueryciudad) => {
        if (err) {
          reject(err);
        } else {
          if (resultadoqueryciudad.length === 0) {
            connection.connection.query(
              "INSERT INTO ciudades (ESTADOID, NOMBRE) VALUES(?,?)",
              [IDESTADO, NOMBRECIUDAD],
              (err, resultadoinsertciudad) => {
                if (err) {
                  reject(err);
                } else {
                  const IDCIUDAD = resultadoinsertciudad.insertId;
                  console.log(IDCIUDAD);
                  resolve(IDCIUDAD);
                }
              }
            );
          } else {
            const IDCIUDAD = resultadoqueryciudad[0].CIUDADID;
            console.log("ciudad", IDCIUDAD);
            resolve(IDCIUDAD);
          }
        }
      });
    });
  }
  function insertardireccion(
    CALLE,
    PAISID,
    ESTADOID,
    CIUDADID,
    CODIGOPOSTAL,
    USUARIOID
  ) {
    return new Promise((resolve, reject) => {
      connection.connection.query(
        "INSERT INTO direccion (CALLE, PAISID, ESTADOID, CIUDADID, CODIGOPOSTAL, USUARIOID) VALUES (?, ?, ?, ?, ?, ?)",
        [CALLE, PAISID, ESTADOID, CIUDADID, CODIGOPOSTAL, USUARIOID],
        (err, resultadoinsertdireccion) => {
          if (err) {
            reject(err)
          } else {
            const IDDIRECCION = resultadoinsertdireccion.insertId;
            console.log("IDINFORACIONSALUD: ", IDDIRECCION);
          }
        }
      );
    });
  }
  // Uso de la función
  obtenerIdUsuario(DOCUMENTO)
    .then(async (idUsuario) => {
      const idPais = await obtenerIdPais(FORMNOMBREPAIS);
      const idEstado = await obtenerIdEstado(FORMNOMBREESTADO, idPais);
      const idCiudad = await obtenerIdCiudad(FORMNOMBRECIUDAD, idEstado);
//this way chek if the asycronous function insertardireccion is done to generate the response
      try {
        Promise.all([
            insertardireccion(
              CALLE,
              idPais,
              idEstado,
              idCiudad,
              CODIGOPOSTAL,
              idUsuario
            ),
          ]);
        res.status(200).send();
      } catch (error) {
        res.status(500).send();
      }
    })
    .catch((err) => {
      res.status(500).send();
    });
}
module.exports = {
  registrodireccion,
};
