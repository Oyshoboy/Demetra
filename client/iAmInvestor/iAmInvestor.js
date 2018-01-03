import '/client/main.js';

Template.iAmInvestor.onRendered(() => {
    Meteor.setInterval(() => { // ERROR CHECKER
        var errorComesin = Session.get('errorComesIn');
        var errorStage = Session.get('processStage');
        if (errorComesin !== null && errorComesin !== undefined) {
            if (Date.now() > errorComesin) {
                if (errorStage !== null && errorStage !== undefined) {
                    if (errorStage == "start") {
                        callForError("Hmm... Something went wrong while packaging your order :(");
                        Session.set('processStage', null);
                        Session.set('errorComesIn', null);
                        return;
                    } else if (errorStage == "coinmarket") {
                        callForError("Aah... Request timeout. CoinMarketCap doesn't answering :(");
                        Session.set('processStage', null);
                        Session.set('errorComesIn', null);
                        return;
                    } else if (errorStage == "randomorg") {
                        callForError("Ouf... Request timeout. Random.org doesn't answering :(");
                        Session.set('processStage', null);
                        Session.set('errorComesIn', null);
                        return;
                    }
                }

                callForError("Hmm... We got Request timeout! Somebody doesn't answered :(");
                Session.set('errorComesIn', null);
            }
        }
    }, 3000);

    Meteor.setTimeout(() => {
        $('.rock-block').addClass('appear');
        setUpHeight('input-stuff');
        $(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }, 100);
});

Template.iAmInvestor.helpers({
    answerFound(index) {
        var answers = ['Also with this', 'Together with this', 'As well as this', 'And this', 'Including this', 'Plus this', 'Even this', 'Don\'t forget about this'];
        if (index == 0) {
            return "Ok Boss! Buy this";
        } else {
            //    console.log(Math.random * answers.length - 1);
            return answers[parseInt(Math.random() * answers.length - 1)];
        }
    },

    resultFound() {
        if (Session.get('resultCoins')) {
            //   console.log(Session.get('resultCoins'));
        }
        return Session.get('resultCoins');
    },
    calculateAmount(index) {
        if (Session.get('priceDivided')) {
            return Session.get('priceDivided')[index];
        }
    },
    howMuchCoinsGet(divided, currPrice) {
        //       console.log(divided, currPrice);
        var result = divided / currPrice;
        var fixedIndex = 0;
        if (result > 5) {
            fixedIndex = 2;
        } else if (result > 1) {
            fixedIndex = 4;
        } else if (result > 0.01) {
            fixedIndex = 6;
        } else {
            fixedIndex = 8;
        }
        return result.toFixed(fixedIndex);
    }
});

Template.iAmInvestor.events({
    'click .advanced-toggle.unshown' () {
        var state = $('.advanced-toggle').attr("aria-expanded");
        $('.advanced-toggle.unshown').addClass('show');
        $('.advanced-toggle.unshown').removeClass('unshown');
        if (state) {
            Meteor.setTimeout(() => {
                setUpHeight('input-stuff');
                Meteor.setTimeout(() => {
                    $('#collapseAdvanced').addClass('appear');
                }, 600);
            }, 300);
        } else {
            $('#collapseAdvanced').removeClass('appear');
        }
    },

    'click .advanced-toggle.show' () {
        $('#collapseAdvanced').removeClass('appear');
        $('.advanced-toggle.show').addClass('unshown');
        $('.advanced-toggle.show').removeClass('show');
        Meteor.setTimeout(() => {
            setUpHeight('input-stuff');
        }, 300);
    },

    'click .reboot-dat-shit' () {
        restart();
    },

    'click .submit-choose-investor' () {
        var amount = $('.input-stuff-amount')[0].value;

        Session.set('investAmount', amount);
        var max = 1381;
        var quantity = $('.input-stuff-Quantity')[0].value;
        var maxPrice = $('.input-stuff-MaxPrice')[0].value;
        var splitTipe = $("input[type='radio'][name='splitType']:checked").val();

        if (!amount || amount < 1) {
            console.log('too small', amount);
            shakeClass('.input-stuff');
            return;
        }

        if (!quantity || quantity < 1) {
            quantity = 1;
        }
        console.log(maxPrice);
        if (!maxPrice || maxPrice < 0) {
            maxPrice = 99999999;
        }

        $('.input-stuff').addClass('desappeared');
        $('.order-status')[0].innerText = 'starting your order...';
        Meteor.setTimeout(() => {
            $('.input-stuff').fadeOut();
            $('.thecube').fadeIn();
            setUpHeight('thecube', 140);
        }, 700);
        Session.set('processStage', 'start');
        Meteor.call('addRequest', amount, quantity, maxPrice, (err) => {
            if (err) {
                console.log(err.reason);
                Meteor.setTimeout(() => {
                    callForError("Something Went Wrong :(");
                }, 600);
            } else {
                Meteor.setTimeout(() => {
                    Session.set('errorComesIn', Date.now() + 15000);
                    chooseCurrency(amount, maxPrice, quantity, splitTipe);
                }, 100);
            }
        });
    },
});

function restart() {
    $('.result-stuff').removeClass('appear');
    $('.error-stuff').removeClass('appear');
    $('.order-status')[0].innerText = '';
    Session.set('processStage', null);
    Meteor.setTimeout(() => {
        $('.result-stuff').fadeOut();
        $('.error-stuff').fadeOut();
    }, 600);

    Meteor.setTimeout(() => {
        $('.input-stuff').fadeIn()
        Meteor.setTimeout(() => {
            $('.input-stuff').removeClass('desappeared');
        }, 600);
        setUpHeight('input-stuff');
    }, 1200);
}

function setUpHeight(id, offset) {
    if (!offset) {
        offset = 40;
    }
    //  document.getElementById(id).setAttribute("style", "height:auto");
    var elUeight = document.getElementById(id).clientHeight + offset;
    document.getElementById('stuff-container').setAttribute("style", "height:" + elUeight + "px");
}

function chooseCurrency(amount, maxPrice, quantity, splitTipe) {

    Session.set('processStage', 'coinmarket');
    $('.order-status')[0].innerText = 'retrieving data from CoinMarketCap...';
    HTTP.call('GET', 'https://api.coinmarketcap.com/v1/ticker/?limit=0', (err, res) => {
        if (err) {
            console.log(err);
        } else if (res) {
            var filteredCurrs = [];
            res.data.forEach((curr) => {
                //console.log(curr.name, parseFloat(curr.price_usd) < maxPrice);
                if (parseFloat(curr.price_usd) < maxPrice) {
                    filteredCurrs.push(curr);
                }
            });

            getRandom(filteredCurrs.length, quantity, filteredCurrs, amount, splitTipe);
        }
    });
}


function getRandom(max, quantity, currsLeft, amount, splitTipe) {
    Session.set('processStage', 'randomorg');
    $('.order-status')[0].innerText = 'getting values from Random.org...';
    if (quantity > max) {
        callForError("Usually it's happened if you set Max Currency price to low or there are not enough currencies mathching your request :(");
        return;
    }

    // console.log(currsLeft);
    HTTP.call('POST', 'https://api.random.org/json-rpc/1/invoke', {
        data: {
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": "36f4c097-1e98-434f-afa3-3457d3320621",
                "n": quantity,
                "min": 0,
                "max": max,
                "replacement": false,
                "base": 10
            },
            "id": 5212
        }
    }, (err, res) => {
        if (err) {
            console.log(err);
        } else if (res) {
            console.log(res);
            var i = 0;
            var resultCoins = [];
            var id = res.data.result.random.data;
            id.forEach((curr) => {
                resultCoins.push(currsLeft[id[i]]);
                // console.log(currsLeft[i]);
                i++;
            });

            var errorComesin = Session.get('errorComesIn');
            if (errorComesin == null) {
                return;
            }

            Session.set('resultCoins', resultCoins);
            Session.set('priceDivided', createRandomSumNumbers(amount, quantity, splitTipe));

            Meteor.call('addResponse', Session.get('resultCoins'), Session.get('priceDivided'), (err) => {
                if (err) {
                    console.log(err.reason);
                    Meteor.setTimeout(() => {
                        callForError("Something Went Wrong :(");
                    }, 600);
                } else {
                    Meteor.setTimeout(() => {
                        Session.set('errorComesIn', null);
                        Session.set('processStage', null);
                        $('.result-stuff').fadeIn();
                        $('.thecube').fadeOut();
                        $('.order-status')[0].innerText = '';
                        Meteor.setTimeout(() => {
                            $('.result-stuff').addClass('appear');
                            setUpHeight('result-stuff');
                        }, 600);
                    }, 1400);
                }
            });
        }
    });
}

function createRandomSumNumbers(targetNumber, totalSumNumbers, splitTipe) {
    $('.order-status')[0].innerText = 'splitting your budget...';
    if (splitTipe == "fixed") {
        var fixedResult = targetNumber / totalSumNumbers;
        var resultArray = [];
        for (var i = totalSumNumbers; i >= 0; i--) {
            resultArray.push(fixedResult);
        }
        return resultArray;
    }

    if (targetNumber - totalSumNumbers < 0) {
        callForError("Shit man! I can't spit your budget less then 1$ each yet :(");
        throw "Cannot create the desired output if the targetNumber is smaller than the totalSumNumbers";
    }
    if (targetNumber <= 0 || totalSumNumbers <= 0) {
        callForError("Inputted numbers should be greater than 0 :(");
        throw "Inputted numbers should be greater than 0";
    }
    let result = [],
        rest = targetNumber;
    for (let i = 1; i < totalSumNumbers; i++) {
        // to make sure no 0s sneak in, the random pattern should be
        // the rest value minus the number of numbers that should be created + the current I step
        // and the +1 to exclude 0s
        let value = parseInt(Math.random() * (rest - totalSumNumbers + i)) + 1;
        result.push(value);
        rest -= value;
    }
    result.push(rest);
    return result;
}

function callForError(reason) {
    $('.order-status')[0].innerText = '';
    $('.error-stuff-reason')[0].innerText = reason;
    $('.thecube').fadeOut();
    Meteor.setTimeout(() => {
        $('.error-stuff').fadeIn();
        Meteor.setTimeout(() => {
            $('.error-stuff').addClass('appear');
            setUpHeight('error-stuff', 60);
        }, 600);
    }, 600);
}

function shakeClass(id) {
    $(id).addClass('shake');
    Meteor.setTimeout(function() {
        $(id).removeClass('shake');
    }, 600);
}