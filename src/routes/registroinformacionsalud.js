const connection = require("./connection");
//obtener idusuario
function registroinformacionsalud(req, res) {
  const FORMALERGIAS = req.body.ALERGIAS;
  const FORMCONDICIONESMEDICAS = req.body.CONDICIONESMEDICAS;
  const FORMMEDICAMENTOS = req.body.MEDICAMENTOS;

  // Get the user ID from the session
  const IDUSUARIO = req.session.userId;

  if (!IDUSUARIO) {
    return res.status(401).send("User not authenticated");
  }

  console.log("USUARIO: ", IDUSUARIO);
  console.log("FORMALERGIAS:", FORMALERGIAS);
  console.log("FORMCONDICIONESMEDICAS:", FORMCONDICIONESMEDICAS);
  console.log("FORMMEDICAMENTOS", FORMMEDICAMENTOS);

  //insertar en informacion salud y obtener id
  function insertarInformacionSalud(IDUSUARIO) {
    return new Promise((resolve, reject) => {
      connection.connection.query(
        "INSERT INTO informacionSalud (USUARIOID) VALUES(?)",
        [IDUSUARIO],
        (err, resultadoinsertinformacion) => {
          if (err) {
            reject(err);
          } else {
            const IDINFORMACIONSALUD = resultadoinsertinformacion.insertId;
            console.log("IDINFORACIONSALUD: ", IDINFORMACIONSALUD);
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
        connection.connection.query(
          alergiasquery,
          (err, resultadoqueryalergia) => {
            if (err) {
              reject(err);
            } else {
              if (resultadoqueryalergia.length === 0) {
                connection.connection.query(
                  "INSERT INTO alergias (ALERGIA) VALUES(?)",
                  [ALERGIA],
                  (err, resultadoinsertalergia) => {
                    if (err) {
                      reject(err);
                    } else {
                      const IDALERGIA = resultadoinsertalergia.insertId;
                      console.log("ALERGIA: ", IDALERGIA);
                      connection.connection.query(
                        "INSERT INTO alergias_informacionsalud (ALERGIAID, INFORMACIONSALUDID)VALUES (?,?)",
                        [IDALERGIA, IDINFORMACIONSALUD]
                      );
                    }
                  }
                );
              } else {
                const IDALERGIA = resultadoqueryalergia[0].ALERGIAID;
                console.log("ALERGIA: ", IDALERGIA);
                connection.connection.query(
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
        connection.connection.query(
          condicionmedicaquery,
          (err, resultadoquerycondicionmedica) => {
            if (err) {
              reject(err);
            } else {
              if (resultadoquerycondicionmedica.length === 0) {
                connection.connection.query(
                  "INSERT INTO condicionesmedicas (CONDICIONMEDICA) VALUES(?)",
                  [CONDICIONMEDICA],
                  (err, resultadoinsertcondicionmedica) => {
                    if (err) {
                      reject(err);
                    } else {
                      const IDCONDICIONMEDICA =
                        resultadoinsertcondicionmedica.insertId;
                      console.log("CONDICION MEDICA: ", IDCONDICIONMEDICA);
                      connection.connection.query(
                        "INSERT INTO condicionesmedicas_informacionsalud (CONDICIONMEDICAID, INFORMACIONSALUDID)VALUES (?,?)",
                        [IDCONDICIONMEDICA, IDINFORMACIONSALUD]
                      );
                    }
                  }
                );
              } else {
                const IDCONDICIONMEDICA =
                  resultadoquerycondicionmedica[0].CONDICIONMEDICAID;
                console.log("CONDICION MEDICA: ", IDCONDICIONMEDICA);
                connection.connection.query(
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

  //insertar las medicamentos
  function insertarMedicamentos(MEDICAMENTOS, IDINFORMACIONSALUD) {
    return new Promise((resolve, reject) => {
      MEDICAMENTOS.forEach((MEDICAMENTO) => {
        const medicamentoquery = `SELECT MEDICAMENTOID FROM medicamentos WHERE MEDICAMENTO = '${MEDICAMENTO}'`;
        connection.connection.query(
          medicamentoquery,
          (err, resultadoquerymedicamento) => {
            if (err) {
              reject(err);
            } else {
              if (resultadoquerymedicamento.length === 0) {
                connection.connection.query(
                  "INSERT INTO medicamentos (MEDICAMENTO) VALUES(?)",
                  [MEDICAMENTO],
                  (err, resultadoinsertmedicamento) => {
                    if (err) {
                      reject(err);
                    } else {
                      const IDMEDICAMENTO = resultadoinsertmedicamento.insertId;
                      console.log("MEDICAMENTOS: ", IDMEDICAMENTO);
                      connection.connection.query(
                        "INSERT INTO medicamentos_informacionsalud (MEDICAMENTOID, INFORMACIONSALUDID)VALUES (?,?)",
                        [IDMEDICAMENTO, IDINFORMACIONSALUD]
                      );
                    }
                  }
                );
              } else {
                const IDMEDICAMENTO =
                  resultadoquerymedicamento[0].MEDICAMENTOID;
                console.log("MEDICAMENTO: ", IDMEDICAMENTO);
                connection.connection.query(
                  "INSERT INTO medicamentos_informacionsalud (MEDICAMENTOID, INFORMACIONSALUDID)VALUES (?,?)",
                  [IDMEDICAMENTO, IDINFORMACIONSALUD]
                );
              }
            }
          }
        );
      });
    });
  }

  insertarInformacionSalud(IDUSUARIO)
  .then(async (InformacionSaludId) => {
    const promesas = [
      insertarCondicionesMedicas(
        FORMCONDICIONESMEDICAS,
        InformacionSaludId
      ),
      insertarAlergias(FORMALERGIAS, InformacionSaludId),
      insertarMedicamentos(
        FORMMEDICAMENTOS,
        InformacionSaludId
      ),
    ];
    try {
      await Promise.all(promesas);
      res.status(200).send();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send();
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    res.status(500).send("Error al insertar la información de salud");
  });
}

module.exports = {
registroinformacionsalud,
};