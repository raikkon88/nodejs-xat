// REQUIRES
// -------------------------------------------------------------------------------------------------------------------

var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var io = require('socket.io')(http);

// CONFIGURACIÓ
// -------------------------------------------------------------------------------------------------------------------
app.set('views', './views');        // anunciem a la aplicació on es troven les vistes.
app.use(express.static('public'));  // Fem public el directori "public".
app.set('view engine', 'pug');      // anunciem a l'aplicació quin motor de plantilles s'utilitza.
app.use(bodyParser.urlencoded({     // li diem a la app que és capaç de parsejar peticions post per el body.
    extended: true
}));
app.use(bodyParser.json());         // li diem a la app que és capaç de parsejar peticions post per el body.

// CONSTANTS
// -------------------------------------------------------------------------------------------------------------------
const DB_FILE = './db/app_db.db'
const CREATE_SALES = 'CREATE TABLE sala (id INTEGER PRIMARY KEY AUTOINCREMENT, name text)';
const CREATE_USUARIS = 'CREATE TABLE usuari (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, sala number)';
const GET_SALES = "SELECT ('/login?id=') || id as id, name FROM sala";
const GET_SALA_NAME = "SELECT name from sala where id = ?";
const GET_USERS_SALA = "select name from usuari where sala = ?";
const GET_USER_FROM_NAME = "select * from usuari where name = ? and sala = ?";
const INSERT_USER_SALA = "insert into usuari ( name, sala) values(?, ?) ";
const DELETE_USER_SALA = "delete from usuari where name = ? and sala = ?";

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

function logError(error, res){
    res.send("<h1>Not Ok</h1>");
}

// ROUTES
// -------------------------------------------------------------------------------------------------------------------

app.get('/', function(req, res){
    // Recopero les sales de la base de dades.
    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READONLY, (err) => {
       if(err) {
           logError(err, res);
       }
       else{
           db.all(GET_SALES, (err, rows) => {
              if(err) {
                  logError(err, res);
              }
              else {
                  res.render('index', {
                      title: 'Xat BCDS',
                      page_title: 'Possibles sales de xat',
                      sales : rows});
              }
           });
       }
    });
});

app.get('/login', function(req, res){
    var visibility = "collapse"
    if(req.query.error == 1){
        visibility = "visible";
    }
    var idSala = req.query.id;

    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READONLY, (err) => {
        if(err) {
            logError(err, res);
        }
        else{
            db.all(GET_SALA_NAME, idSala, (err, rows) => {
                if(err) {
                    logError(err, res);
                }
                else {
                    var title = rows.name
                    db.all(GET_USERS_SALA, idSala, (err, rows) => {
                        if(err) {
                            logError(err, res);
                        }
                        else {
                            var users = rows;
                            res.render('login',
                                {
                                    title: title,
                                    title_page: "Login per la " + idSala,
                                    connected_users: users,
                                    visibility: "visibility :" + visibility ,
                                    sala: idSala
                                });
                        }
                    });
                }
            });
        }
    });
});

app.post('/sala', function(req, res){
    var username = req.body.username;
    var sala = req.body.sala;
    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
        if(err) {
            logError(err, res);
        }
        else{
            db.all(GET_USER_FROM_NAME, [ username , sala ], (err, rows) => {
                if(rows.length > 0){
                    res.redirect(301, '/login?error=1');
                }
                else {
                    res.render('sala', {
                        title: sala,
                        page_title: "Sala de xat " + sala,
                        username: username,
                        users: rows,
                        sala: sala,
                        user: username
                    });
                }
            });
        }
    });

});

// SOCKETS
// -------------------------------------------------------------------------------------------------------------------
io.on('connection', function(socket){

    // LOG IN a una sala
    let user = socket.handshake.query.user;
    let room = socket.handshake.query.room;
    if(user && room) {
        let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.log(err.message);
            else {
                db.run(INSERT_USER_SALA, [user, room], (err) => {
                    if (err) {
                        logError(err, res);
                    }
                    else {
                        io.emit('user message', JSON.stringify(
                            {"user": user, "room": room, "connected": true})
                        );
                    }
                });
            }
        });
    }


    socket.on('chat message', function(msg){
        var message = JSON.parse(msg);

        io.emit('chat message', msg);
    });


    socket.on('disconnect', function(){

        // LOG OUT a una sala
        let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.log(err.message);
            else {
                db.run(DELETE_USER_SALA, [user, room], (err) => {
                    if (err) {
                        logError(err, res);
                    }
                    else {
                        io.emit('user message', JSON.stringify(
                            {"user": user, "room": room, "connected": false})
                        );
                    }
                });
            }
        });
    });

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});