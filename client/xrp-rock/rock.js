import '/client/main.js';

//https://api.liqui.io/api/3/ticker/eth_btc

Template.rock.onRendered(() => {

    var listener = new window.keypress.Listener();

    listener.simple_combo("esc", function() {
        exitApp();
    });

    if (getCookie('access') == "granted") {
        Meteor.setTimeout(() => {
            $('.rock-block').addClass('appear');
        }, 100);

        $('.carousel').carousel({
            interval: 1000
        })
    } else {
        FlowRouter.go('/');
    }

    HTTP.call('GET', 'https://api.liqui.io/api/3/ticker/eth_btc', (err, res) => {
        if (err) {
            console.log(err);
        } else if (res) {
            var thisMarketLink = res.data.eth_btc.avg;
            //console.log(res.data.eth_btc);
            if (document.getElementById("liqui-avg-id")) {
                document.getElementById("liqui-avg-id").innerText = '2.147065'; //thisMarketLink;
            }
        }
    })
});

Template.rock.events({
    'click .destroy-session' (event) {
        exitApp();
    },
});

function whatToBuy(min, max, amountLeft) {


    HTTP.call('POST', 'https://api.random.org/json-rpc/1/invoke', {
        data: {
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": "00000000-0000-0000-0000-000000000000",
                "n": 1,
                "min": min,
                "max": max,
                "replacement": true,
                "base": 10
            },
            "id": 5212
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
        } else if (res) {
            console.log(res.data.result.random.data[0]);
        }
    });
}

function exitApp() {
    eraseCookie('access');
    $('.rock-block').removeClass('appear');
    Meteor.setTimeout(() => {
        FlowRouter.go('/');
    }, 600);
}

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