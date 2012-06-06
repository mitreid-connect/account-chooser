/**
 *
 * Adding some extra helpers to browser globals
 *
 */

location.getURLParameter = function (name) {
    return decodeURI(
        (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
};

document.createCookie = function (name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
};

document.readCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};

document.eraseCookie = function(name) {
    createCookie(name,"",-1);
};

/**
 *
 * Begin main
 *
 */

$(function () {

    var redirect_uri = location.getURLParameter("redirect_uri");
    var client_id = location.getURLParameter("client_id");

    if (redirect_uri != "null") document.createCookie("redirect_uri",redirect_uri,1);
    if (client_id != "null") document.createCookie("client_id",client_id,1);

    alert(document.readCookie("client_id"));

});