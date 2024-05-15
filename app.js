const connection = require('./src/routes/connection')
//archivo crear servidor local
//importar libreria
const { resolve } = require("dns");
const express = require("express");

const path = require("path");
const { default: swal } = require("sweetalert");
const sweetalert = require("sweetalert");
//put here the credentials of access


//objetos para llamr los metodos express
const app = express();

//objetos dinamicos
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

//ruta para objetos dinamicos

//registro
app.get("/registro", function (req, res) {
  connection.connection.query("SELECT * FROM generos", (err, results) => {
    if (err) throw err;
    res.render("registro", { generos: results });
  });
});

//ruta archivos estaticos (indexes), es decir, paginas sin conexion a base de datos

app.use(express.static(path.join(__dirname, "public")));

//metodo para obtener datos de una pagina
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
});

/*app.post("/direccion", function (req, res) {
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
            window.alert("dir ingresada");
          }
        }
      );
    })
    .catch((err) => {
      console.error(err);
    });
  //REDIRECCIONAR A LA PAGINA INICIO
  res.redirect("/registro");
});
*/
//renderizar el registro informacion salud
app.get("/registroinformacionsalud", function (req, res) {
  res.render("registroinformacionsalud.ejs");
});
//requerir las funciones de insertar salud
const functioninsertsalud = require('./src/routes/registroinformacionsalud')
//informacion salud

app.post("/informacionsalud", (req, res) => {
  const DOCUMENTO = req.body.DOCUMENTO;
  const FORMALERGIAS = req.body.ALERGIAS;
  const FORMCONDICIONESMEDICAS = req.body.CONDICIONESMEDICAS;
  const FORMMEDICAMENTOS = req.body.MEDICAMENTOS;
  console.log("DOCUMENTO:", DOCUMENTO);
  console.log("FORMALERGIAS:", FORMALERGIAS);
  console.log("FORMCONDICIONESMEDICAS:", FORMCONDICIONESMEDICAS);
  console.log("FORMMEDICAMENTOS", FORMMEDICAMENTOS);
  functioninsertsalud.obtenerIdUsuario(DOCUMENTO)
    .then(async (IdUsuario) => {
      const InformacionSaludId = await functioninsertsalud.insertarInformacionSalud(IdUsuario);

      const promesas = [
        functioninsertsalud.insertarCondicionesMedicas(FORMCONDICIONESMEDICAS, InformacionSaludId),
        functioninsertsalud.insertarAlergias(FORMALERGIAS, InformacionSaludId),
        functioninsertsalud.insertarMedicamentos(FORMMEDICAMENTOS, InformacionSaludId),
      ];
      res.status(202).send()
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  //redireccionar al mapa
  //res.redirect("/");
})

//hacer el render del login
app.get("/login", function (req, res) {
  res.render("login.ejs");
});
//requerir el modulo exportado para la validacion
const functionvalidarcorreo = require ('./src/routes/validar-login');
//recibir los datos del front
app.post("/validar-login", (req, res) => {
  const datos = req.body;
  const CORREOELECTRONICO = datos.CORREOELECTRONICO;
  const CONTRASENA = datos.CONTRASENA;
  //utilizar el modulo requerido
  functionvalidarcorreo.validarcorreo(CORREOELECTRONICO,CONTRASENA,res)
})
//configurar el puerto parar el servidor
app.listen(3000, function () {
  console.log("servidor creado es http://localhost:3000");
});
