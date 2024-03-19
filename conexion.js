const mysql = require('mysql');
//put here the credentials of access
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'jstracking'
});
connection.connect((err) =>{
    if(err) throw err // not connected!
    console.log('Connected to MySQL')
});

function select() {
    connection.query('SELECT * FROM usuarios', (error,result) =>{
        if(error) throw error
        console.log('los registros son:', result[2])
    });
}
select();

function instert(){
    connection.query('INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?,?,?)', 
    ['juli', 'juli@juli', 'juli'], (error) =>{
        if(error)  throw error
        console.log("datos ingresados correctamente")
    });
}
