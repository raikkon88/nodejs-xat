console.log("Functions js file included");
console.log("--------------------------------------------------");

const COOKIE_ID = "xat-bcds";
const COOKIE_EXPIRATION_DAYS = 14;

const LOGIN_PAGE = "login";
const SALES_PAGE = "sales";
const SALA_PAGE  = "sala";

// PROGRAM VARIABLES
// ------------------------------------------------------------------------

var page = document.URL.includes(LOGIN_PAGE) ? 1 : document.URL.includes(SALES_PAGE) ? 2 : 3;


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
    // Implementem la funcionalitat del xat.
    xat();
}



// FUNCTIONS CHAT
// ------------------------------------------------------------------------

function mapToProtocol(user, room, message){
    return JSON.stringify({ "user" : user, "room": room, "msg":message});
}

function xat(){
    $(function() {
        // Quan connectem
        var socket = io({
                query : {
                    user : window.nickname,
                    room : window.room
                }
            }
        );
        $('form').submit(function(){
            socket.emit('chat message', mapToProtocol(window.nickname, window.room, $('#m').val()));
            $('#m').val('');
            return false;
        });

        // Quan es reb un missatge
        socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
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

