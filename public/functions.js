// CONSTANTS
// ------------------------------------------------------------------------
const COOKIE_ID = "xat-bcds";
const COOKIE_EXPIRATION_DAYS = 14;

const LOGIN_PAGE = "login";
const SALES_PAGE = "sales";
const SALA_PAGE  = "sala";

// PROGRAM VARIABLES
// ------------------------------------------------------------------------
var page = document.URL.includes(SALA_PAGE) ? 3 : document.URL.includes(LOGIN_PAGE) ? 2 : 1;

// PROGRAM INIT
// ------------------------------------------------------------------------
var cookie = getCookie(COOKIE_ID);
if(cookie != ""){
    if(page == 1 || page == 2){
        setCookie(COOKIE_ID, "", -1);
    }
    else{
        // De moment maxaquem la cookie, peró podriem comprovar que es desconnectés.
        setCookie(COOKIE_ID ,{ "user":window.nickname, "room":window.room}, COOKIE_EXPIRATION_DAYS);
    }
}

if(page == 3){
    // Implementem la funcionalitat del xat si i només si és la pàgina del xat.
    xat();
}
else if(page == 2){
    // Implementem la part dels sockets que es comuniquen per saver quins usuaris estan o no connectats i a quines sales.
    login();
}



// FUNCTIONS CHAT
// ------------------------------------------------------------------------

/**
 * Donat un missatge d'actualització d'usuari, cerca una llista amb id 'users_list'
 * i afegeix o elimina un usuari de la llista depenent de si hi és o si no.
 * @param userUpdate Missatge rebut per el socket, conté els camps user, room i connected.
 */
function updateUserOnUl(userUpdate){

        console.log(userUpdate.connected);
        if(userUpdate.connected){
            // Afegeixo el connectat a la llista d'usuaris connectats
            $('#users_list').append( '<li>' + userUpdate.user + '</li>');
        }
        else{
            // Elimino l'usuari del llistat de connectats
            var ul = $('#users_list');
            ul.children('li').each((index) =>{
                console.log( index + " -> " + $('#users_list li').eq(index).text());
                if( $('#users_list li').eq(index).text() == userUpdate.user)
                    $('#users_list li').eq(index).remove();
            });
        }

}

/**
 *
 * @param user
 * @param room
 * @param message
 * @returns {string}
 */
function mapToProtocol(user, room, message){
    return JSON.stringify({ "user" : user, "room": room, "msg":message});
}

/**
 * Converteix el json amb el missatge rebut a un missatge per escriure per pantalla
 * @param json missatge rebut en format json
 */
function mapToMessage(json){

    var p = document.createElement('p');
    console.log(p);
    var b = document.createElement('strong');
    console.log(b);
    b.append(json.user + " : ");
    console.log(b);
    p.append(b);
    console.log(p);
    p.append(json.msg);
    console.log(p);
    return  p;
}

/**
 * Funció que s'executa quan estem a la pàgina de login
 */
function login(){
    $(function(){
        var socket = io();
        /**
         * Quan es reb un missateg d'actualització d'usuari afegim o treiem aquest usuari del llistat
         */
        socket.on('user message', function(msg){
            var userUpdate = JSON.parse(msg);
            if(userUpdate.room == window.room) {
                updateUserOnUl(userUpdate);
            }
        });
    });
}

/**
 *
 */
function xat(){
    $(function() {
        /**
         * Quan connectem li enviem paràmetres al socket. és interessant saber quin usuari es connecta i a quina sala.
         */
        var socket = io({
                query : {
                    user : window.nickname,
                    room : window.room
                }
            }
        );
        /**
         * Quan s'envia un missatge es transforma al protocol format de missatge
         */
        $('form').submit(function(){
            socket.emit('chat message', mapToProtocol(window.nickname, window.room, $('#m').val()));
            $('#m').val('');
            return false;
        });

        /**
         * Quan es reb un missatge es transforma en la cadena a agegir al xat.
         */
        socket.on('chat message', function(msg){
            var json = JSON.parse(msg);
            if(json.room == window.room){
                $('#messages').append($('<li>').append(
                    mapToMessage(json))
                );
            }
        });

        /**
         * Quan es reb un missatge amb el protocol format de usuari
         */
        socket.on('user message', function(msg){
            var userUpdate = JSON.parse(msg);
            if(window.room == parseInt(userUpdate.room)){
                updateUserOnUl(userUpdate);
            }
        });
    });
}

// COOKIES
// ------------------------------------------------------------------------

/**
 * Reference -> https://www.w3schools.com/js/js_cookies.asp
 * @param cname The name of cookie
 * @param cvalue The value for the cookie
 * @param exdays the expiration for the cookie
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Reference -> https://www.w3schools.com/js/js_cookies.asp
 * Retrieves a cookie.
 * @param cname The id for the desired cookie
 * @returns {string} a value for the given cookie, if not exists undefined.
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Check's if a cookie exists on the client cookies hash
 */
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

