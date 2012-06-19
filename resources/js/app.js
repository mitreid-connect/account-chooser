/**
 *
 * Appending extra helpers to browser globals
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
    document.createCookie(name,"",-1);
};

/**
 *
 * Our global app functions are in the app namespace
 *
 */
var app = {};
var OIDCclients = [];
var OIDCproviders = [];

app.validateClient = function (client_id, redirect_uri) {

    for (var i in OIDCclients) {

        var client = OIDCclients[i];
        if (client.clientID == client_id) {
            return ($.inArray(redirect_uri, client.redirectURIs) != -1);
        }
    }

    return false;
};


/**
 *
 * Begin main
 *
 */

$(function () {

    /**
     * Load Config
     */

    jQuery.ajaxSetup({async:false});

    $.getJSON('api/clients.json', function (data) {
        OIDCclients = data;
    });

    $.getJSON('api/providers.json', function (data) {
        OIDCproviders = data;
    });

    // get some URL parameters and persist them via cookies
    var redirect_uri = decodeURIComponent(location.getURLParameter("redirect_uri"));
    var client_id = location.getURLParameter("client_id");

    if (redirect_uri != "null") document.createCookie("redirect_uri",redirect_uri,1);
    if (client_id != "null") document.createCookie("client_id",client_id,1);

    // before we render the page let's validate our client and redirect uri
    if (app.validateClient(document.readCookie("client_id"),document.readCookie("redirect_uri"))) {

        // build some buttons
        var button_tmpl = _.template($('#tmpl-button').html());

        $.each(OIDCproviders, function (key, button) {

            // build a button and append it
            var $buttonEl = $(button_tmpl(button)).appendTo('#button-container');

            // bind a click event
            $("a", $buttonEl).click(function () {
                // Account Chooser Sends the End-User back to the Client
                document.location.href = document.readCookie("redirect_uri") + '?issuer=' + encodeURI(button.issuer);
            });

        });
    } else {
        $("#content").html($("#tmpl-error-client").html());
    }

});