// REQUIRES
// -------------------------------------------------------------------------------------------------------------------

var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

// CONSTANTS
// -------------------------------------------------------------------------------------------------------------------
const DB_FILE = './db/app_db.db'
const CREATE_SALES = 'CREATE TABLE sala (id INTEGER PRIMARY KEY AUTOINCREMENT, name text)';
const CREATE_USUARIS = 'CREATE TABLE usuari (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, sala number)';
const GET_SALES = 'SELECT * FROM sala';

let sales = ['sala 1', 'sala 2', 'sala 3'];
// DATABASE FUNCTIONS
// -------------------------------------------------------------------------------------------------------------------
/**
 * Genera una base de dades per poder emmagatzemar sales i usuaris.
 * Per defecte insereix 3 sales amb els noms : "sala1" "sala2" i "sala3"
 */
function createDatabase(){
    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
            fs.unlinkSync(DB_FILE);
        }
        else{
            // Creació de les taules.
            db.run(CREATE_SALES, (err) => {
                if(err){
                    console.log(err.message);
                    fs.unlinkSync(DB_FILE);
                }
                else{
                    // Genero : (?),(?),(?) per poder-ho passar com a paràmetres a l'insert.
                    let placeholders = sales.map((language) => '(?)').join(',');
                    let sql = 'INSERT INTO sala(name) VALUES ' + placeholders;

                    // insert one row into the langs table
                    db.run(sql, sales, function(err) {
                        if (err) {
                            console.log(err.message);
                            fs.unlinkSync(DB_FILE);
                        }
                    });
                }
            });
            db.run(CREATE_USUARIS);
            db.close();
        }

    });

}


// INIT
// -------------------------------------------------------------------------------------------------------------------
// S'elimina la base de dades existent per crear-ne una de nova i neta.
if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
}
// Es genera la base de dades.
createDatabase();

// FUNCTIONS
// -------------------------------------------------------------------------------------------------------------------


// ROUTES
// -------------------------------------------------------------------------------------------------------------------

app.get('/', function(req, res){
    console.log("petició a l'arrel");
    // Recopero les sales de la base de dades.
    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READONLY, (err) => {
       if(err) {
           console.log(err.message);
           res.send('<h1>NOT OK</h1>');
       }
       else{
           db.get(GET_SALES, (err, rows) => {
              if(err) {
                  console.log(err.message);
                  res.send('<h1>NOT OK</h1>');
              }
              else {
                  // Se li ha d'enviar la resposta.
                  res.send('<h1>OK ' + JSON.stringify(rows) + '</h1>')
              }
           });
       }
    });
});

app.get('/sales', function(req, res){

});

app.get('/sala', function(req, res){
   res.send('<h1>Sala</h1>')
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});