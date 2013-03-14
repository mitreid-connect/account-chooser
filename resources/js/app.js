/**
 *
 * Our global app functions are in the app namespace
 *
 */
var app = {};
var OIDCclients = [];
var OIDCproviders = [];

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

    jQuery.ajaxSetup({async:true});
    
    // get some URL parameters and persist them via cookies
    var redirect_uri = $.query.get('redirect_uri');

    var last_issuer = $.cookie('last_issuer');
    
    // build some buttons
    var button_tmpl = _.template($('#tmpl-button').html());
    var error_tmpl = _.template($('#tmpl-error-client').html());

    $.each(OIDCproviders, function (key, button) {

        // build a button and append it
        var $buttonEl = $(button_tmpl(button)).appendTo('#button-container');

        // bind a click event
        $("a", $buttonEl).click(function () {
        	
        	$.cookie('last_issuer', button.issuer);
        	
            // Account Chooser Sends the End-User back to the Client
            //document.location.href = document.readCookie("redirect_uri") + '?issuer=' + encodeURI(button.issuer);
        	
        	// TODO: make this safer for existing query parameters if they exist by using a parser of some type
        	var redirect_to = redirect_uri + (redirect_uri.indexOf("?") !== -1 ? "&" : "?") + "iss=" + encodeURI(button.issuer);
        	
        	if ($.inArray(redirect_uri, OIDCclients) != -1) {
        		window.location.href = redirect_to;
        	} else {
        		$("#content").html(error_tmpl({redirectUrl: redirect_to}));
        	}
        	
        });

    });

});