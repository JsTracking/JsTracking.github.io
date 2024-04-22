//archivo crear servidor local
//importar libreria
const express = require("express");
const mysql = require("mysql");
//put here the credentials of access
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jstracking",
});
connection.connect((err) => {
  if (err) throw err; // not connected!
  console.log("Connected to MySQL");
});

//objetos para llamr los metodos express
const app = express();

//objetos dinamicos
app.set("view engine", "ejs");
//ruta para objetos dinamicos

//registro
app.get("/registro", function (req, res) {
  connection.query("SELECT * FROM generos", (err, results) => {
    if (err) throw err;
    res.render("registro", { generos: results });
  });
});

//login
app.get("/login", function (req, res) {
  res.render("login.ejs");
});

//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos
app.use(express.static("public"));
app.get("/map", function (req, res) {
  res.render("public/map/index.html");
});
//metodo para obtener datos de una pagina
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//ruta archivos dinamicos
//app.get('/', function(req, res) {
//    res.render('registro');
//});

//enviar formulario a la ruta /validar
app.post("/validar", function (req, res) {
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

  connection.query(
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
      res.redirect("/");
    }
  );
});

app.post("/direccion", function (req, res) {
  const datos = req.body;
  //variables
  let CALLE = datos.CALLE;
  let FORMNOMBREPAIS = datos.PAISID;
  let FORMNOMBREESTADO = datos.ESTADOID;
  let FORMNOMBRECIUDAD = datos.CIUDADID;
  let CODIGOPOSTAL = datos.CODIGOPOSTAL;
  let DOCUMENTO = datos.DOCUMENTO;
  //funcion obtener id del usuario
  function obtenerIdUsuario(DOCUMENT) {
    return new Promise((resolve, reject) => {
      const usuarioquery = `SELECT USUARIOID FROM usuarios WHERE DOCUMENTO = '${DOCUMENT}'`;
      connection.query(usuarioquery, (err, resultadoqueryusuario) => {
        if (err) {
          reject(err);
        } else {
          const IDUSUARIO = resultadoqueryusuario[0].USUARIOID;
          console.log("usuario", IDUSUARIO);
          resolve(IDUSUARIO);
        }
      });
    });
  }
  //funcion para obtener el id del pais
  function obtenerIdPais(NOMBREPAIS) {
    return new Promise((resolve, reject) => {
      const paisquery = `SELECT PAISID FROM paises WHERE NOMBRE LIKE '${NOMBREPAIS}'`;
      connection.query(paisquery, (err, resultadoquerypais) => {
        if (err) {
          reject(err);
        } else {
          //si no se encuentra un pais se hace la incercion de este
          if (resultadoquerypais.length === 0) {
            connection.query(
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
      connection.query(estadoquery, (err, resultadoqueryestado) => {
        if (err) {
          reject(err);
        } else {
          if (resultadoqueryestado.length === 0) {
            connection.query(
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
      connection.query(ciudadquery, (err, resultadoqueryciudad) => {
        if (err) {
          reject(err);
        } else {
          if (resultadoqueryciudad.length === 0) {
            connection.query(
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
  // Uso de la función
  obtenerIdUsuario(DOCUMENTO)
    .then(async (idUsuario) => {
      const idPais = await obtenerIdPais(FORMNOMBREPAIS);
      const idEstado = await obtenerIdEstado(FORMNOMBREESTADO, idPais);
      const idCiudad = await obtenerIdCiudad(FORMNOMBRECIUDAD, idEstado);
      connection.query(
        "INSERT INTO direccion (CALLE, PAISID, ESTADOID, CIUDADID, CODIGOPOSTAL, USUARIOID) VALUES (?, ?, ?, ?, ?, ?)",
        [CALLE, idPais, idEstado, idCiudad, CODIGOPOSTAL, idUsuario],
        (err, resultadoinsertdireccion) => {
          if (err) {
            throw err;
          } else {
            console.log("dir ingresada");
          }
        }
      );
    })
    .catch((err) => {
      console.error(err);
    });
  //REDIRECCIONAR A LA PAGINA INICIO
  res.redirect("/");
});

//informacion salud

app.post("/informacionsalud", (req, res) => {
  const DOCUMENTO = req.body.DOCUMENTO;
  const FORMALERGIAS = req.body.ALERGIAS;
  const FORMCONDICIONESMEDICAS = req.body.CONDICIONESMEDICAS;
  console.log('DOCUMENTO:', DOCUMENTO);
  console.log('FORMALERGIAS:', FORMALERGIAS);
  console.log('FORMCONDICIONESMEDICAS:', FORMCONDICIONESMEDICAS);
  //obtener idusuario
  function obtenerIdUsuario(DOCUMENT) {
    return new Promise((resolve, reject) => {
      const usuarioquery = `SELECT USUARIOID FROM usuarios WHERE DOCUMENTO = '${DOCUMENT}'`;
      connection.query(usuarioquery, (err, resultadoqueryusuario) => {
        if (err) {
          reject(err);
        } else {
          const IDUSUARIO = resultadoqueryusuario[0].USUARIOID;
          console.log("usuario", IDUSUARIO);
          resolve(IDUSUARIO);
        }
      });
    });
  }
  //insertar en informacion salud y obtener id
  function insertarInformacionSalud(IDUSUARIO) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO informacionSalud (USUARIOID) VALUES(?)",
        [IDUSUARIO],
        (err, resultadoinsertinformacion) => {
          if (err) {
            reject(err);
          } else {
            const IDINFORMACIONSALUD = resultadoinsertinformacion.insertId;
            console.log("idinformacion", IDINFORMACIONSALUD);
            resolve(IDINFORMACIONSALUD);
          }
        }
      );
    });
  }
  //insertar alergias
  function insertarAlergias(ALERGIAS, IDINFORMACIONSALUD) {
    return new Promise((resolve, reject) => {
      ALERGIAS.forEach((ALERGIA) => {
        const alergiasquery = `SELECT ALERGIAID FROM alergias WHERE ALERGIA = '${ALERGIA}'`;
        connection.query(alergiasquery, (err, resultadoqueryalergia) => {
          if (err) {
            reject(err);
          } else {
            if (resultadoqueryalergia.length === 0) {
              connection.query(
                "INSERT INTO alergias (ALERGIA) VALUES(?)",
                [ALERGIA],
                (err, resultadoinsertalergia) => {
                  if (err) {
                    reject(err);
                  } else {
                    const IDALERGIA = resultadoinsertalergia.insertId;
                    console.log("alergia", IDALERGIA);
                    connection.query(
                      "INSERT INTO alergias_informacionsalud (ALERGIAID, INFORMACIONSALUDID)VALUES (?,?)",
                      [IDALERGIA, IDINFORMACIONSALUD]
                    );
                  }
                }
              );
            } else {
              const IDALERGIA = resultadoqueryalergia[0].ALERGIAID;
              console.log("alergia", IDALERGIA);
              connection.query(
                "INSERT INTO alergias_informacionsalud (ALERGIAID, INFORMACIONSALUDID)VALUES (?,?)",
                [IDALERGIA, IDINFORMACIONSALUD]
              );
            }
          }
        }
      );
      });
    });
  }
  //insertar las condiciones medicas
  function insertarCondicionesMedicas(CONDICIONESMEDICAS, IDINFORMACIONSALUD) {
    return new Promise((resolve, reject) => {
      CONDICIONESMEDICAS.forEach((CONDICIONMEDICA) => {
        const condicionmedicaquery = `SELECT CONDICIONMEDICAID FROM condicionesmedicas WHERE CONDICIONMEDICA = '${CONDICIONMEDICA}'`;
        connection.query(
          condicionmedicaquery,
          (err, resultadoquerycondicionmedica) => {
            if (err) {
              reject(err);
            } else {
              if (resultadoquerycondicionmedica.length === 0) {
                connection.query(
                  "INSERT INTO condicionesmedicas (CONDICIONMEDICA) VALUES(?)",
                  [CONDICIONMEDICA],
                  (err, resultadoinsertcondicionmedica) => {
                    if (err) {
                      reject(err);
                    } else {
                      const IDCONDICIONMEDICA =
                        resultadoinsertcondicionmedica.insertId;
                      console.log("condicion medica", IDCONDICIONMEDICA);
                      connection.query(
                        "INSERT INTO condicionesmedicas_informacionsalud (CONDICIONMEDICAID, INFORMACIONSALUDID)VALUES (?,?)",
                        [IDCONDICIONMEDICA, IDINFORMACIONSALUD]
                      );
                    }
                  }
                );
              } else {
                const IDCONDICIONMEDICA =
                  resultadoquerycondicionmedica[0].CONDICIONMEDICAID;
                console.log(IDCONDICIONMEDICA);
                connection.query(
                  "INSERT INTO condicionesmedicas_informacionsalud (CONDICIONMEDICAID, INFORMACIONSALUDID)VALUES (?,?)",
                  [IDCONDICIONMEDICA, IDINFORMACIONSALUD]
                );
              }
            }
          }
        );
      });
    });
  }

  obtenerIdUsuario(DOCUMENTO)
  .then(async (IdUsuario) => {
    const InformacionSaludId = await insertarInformacionSalud(IdUsuario);

    const CondicionesMedicas = await insertarCondicionesMedicas(['FORMCONDICIONESMEDICAS'], InformacionSaludId);
    
    const Alergias = await insertarAlergias(['FORMALERGIAS'], InformacionSaludId);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

//configurar el puerto parar el servidor
app.listen(3000, function () {
  console.log("servidor creado es http://localhost:3000");
});
