import '/client/main.js';

Template.frontPageCover.helpers({

});

Template.frontPageCover.events({
    "click .mobile-button-access-left" () {
        if (Session.get('access') == null) {
            Session.set('access', 'right-up');
        } else {
            Session.set('access', null);
        }
    },

    "click .mobile-button-access-right-up" () {
        //alert('right-up');
        if (Session.get('access') == "right-up") {
            Session.set('access', 'right');
        } else {
            Session.set('access', null);
        }
    },

    "click .mobile-button-access-right" () {
        if (Session.get('access') == "right") {
            Session.set('access', 'left-up');
        } else {
            Session.set('access', null);
        }
    },

    "click .mobile-button-access-left-up" () {
        //alert('left-up');
        if (Session.get('access') == "left-up") {
            $('.image-container').removeClass('appear');
            $('.image-container').addClass('desappeared');
            setCookie('access', 'granted', 360);
            Meteor.setTimeout(() => {
                Session.set('access', null);
                FlowRouter.go('/xrp-rock');
            }, 600);
        } else {
            Session.set('access', null);
        }
    },
});

Template.frontPageCover.onRendered(() => {

    var timing = 0;
    var listener = new window.keypress.Listener();
    var dotsText = '';
    //var message = 'prepare your anus...';
    var message = 'key pair encoding...';
    var dots = 0;

    var my_combos = listener.register_many([{
        "keys": "x",
        "on_keyup": function(e) {
            timing = 0;
            if (document.getElementById("dots-loader")) {
                document.getElementById("dots-loader").innerText = '';
            }
        }
    }]);

    listener.simple_combo("shift x", function() {
        timing++;
        dots = timing / 2;
        if (timing > 1) {
            for (var i = dots; i >= 0; i--) {
                dotsText += '.';
            }
            if (document.getElementById("dots-loader")) {
                document.getElementById("dots-loader").innerText = message.substr(0, dots); //dotsText;
            }
        }

        if (timing > 50) {
            $('.image-container').removeClass('appear');
            $('.image-container').addClass('desappeared');
            setCookie('access', 'granted', 360);
            Meteor.setTimeout(() => {
                FlowRouter.go('/xrp-rock');
            }, 600);
        }
    });

    Meteor.setTimeout(() => {
        $('.image-container').addClass('appear');
    }, 100);
});

function setCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=;Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    console.log('cookie', name, 'erased');
}