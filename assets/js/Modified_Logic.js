'use strict';

const ActiveDisasterUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getActiveDisaster';
const StoreSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getStoreSupplies';
const ReceiverUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Receiver';
const reportUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/CreateDisaster';
const AcceptedSendSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/AcceptedSendSupply';

let activeDisasters = [];
let activeDisastersInfo = [];

let storeSupplies = [];
let storeSuppliesInfo = [];

let receivers = [];
let receiversInfo = [];


const INTERVAL = 5000;



$(document).ready(function () {

    window.setInterval(function () {

        window.setTimeout(function () {
            getDisasterFromReg();
        }, 1500);

        getSuppliesFromReg();
        getReceiversFromReg();

        if (activeDisasters.length == 0) {
            console.log('Modified_Logic<Info>: No active Disasters');
            closeSendForm();
        }

    }, INTERVAL);

    $('#disaster-drop').on('change', function () {
        updateSupplies(this);
    });

    $('#report-form').submit(function (e) {

        e.preventDefault(); // Prevent Page Refresh

        var formData = submitReport();

        $.post(reportUrl, formData,
                function (data, textStatus, jqXHR) {
                    alert('Incident Report Success');
                    closeReportForm();
                },
                'json'
            )
            .fail(function (response) {
                alert(response);
            });
        return false;

    });

    $('#send-form').submit(function (e) { // Disaster Notification Form

        e.preventDefault();

        var formData = submitSend();

        $.post(AcceptedSendSupplyUrl, formData,
                function (data, textStatus, jqXHR) {
                    alert('Supply Send Success');
                    closeSendForm();

                    window.setTimeout(function () {
                        getDisasterFromReg();
                    }, 1500);

                    getSuppliesFromReg();
                    getReceiversFromReg();

                },
                'json'
            )
            .fail(function (response) {
                alert(response)
            });

        return false;
    });
});

function checkDiff(check, curr) {

    let noChange = true;

    if (check.length != curr.length) {
        noChange = false;
    } else {
        for (let i of check) {
            noChange = false;

            for (let j of curr) {
                if (i == j) {
                    noChange = true;
                    break;
                }
            }

            if (!noChange) {
                break;
            }
        }
    }

    return noChange;
}

function updateSupplies(dropDown) {
    $('#supply-drop').empty();

    let report_ID = dropDown.value;

    let report;

    for (let value of activeDisastersInfo) {
        if (value.disasterId == report_ID) {
            report = value;
            break;
        }
    }

    let supp = report.suppliesTypeNeeded; //Disaster Supplies

    for (var i = 0; i < supp.length; ++i) {
        for (var j = 0; j < storeSuppliesInfo.length; ++j) {
            if (storeSuppliesInfo[j].supplyType == supp[i]) {
                let op = new Option(supp[i], storeSuppliesInfo[j].supplyId); // Supply Name and ID
                $(op).html(supp[i]);
                $('#supply-drop').append(op);
            }
        }
    }
}

function assignUpdater(assigner) {
    openSendForm(assigner);
}

function getDisasterFromReg() {

    $.get(ActiveDisasterUrl, function (data, textStatus, jqXHR) {

                let activeCheck = [];
                let infoCheck = [];

                console.log("Modified_Logic:getDisasterFromReg<Info>: Checking Active Disasters");

                if (data.length != 0) {

                    for (let value of data) {
                        activeCheck.push(value.disasterId);
                        infoCheck.push(value);
                    }

                    let noChange = checkDiff(activeCheck, activeDisasters);

                    if (!noChange) {
                        activeDisasters = activeCheck;
                        activeDisastersInfo = infoCheck;
                        if (activeDisasters.length != 0)
                            assignUpdater(true);
                    } else if (activeDisasters.length != 0) {
                        assignUpdater(false);
                    }

                }
            },
            "json"
        )
        .fail(function () {
            console.log("Modified_Logic:getDisasterFromReg<Error>");
        });
}

function getSuppliesFromReg() // IMPORTANT: Do we need to clear the array after every check so that no supplies that were sent be sent again?
{


    $.get(StoreSupplyUrl,
            function (data, textStatus, jqXHR) {
                console.log("Modified_Logic:getSuppliesFromReg<Info>: Fetching Available Supplies");
                if (data.length != 0) {
                    for (let value of data) {
                        if (!storeSupplies.includes(value.supplyId)) {
                            storeSupplies.push(value.supplyId);
                            storeSuppliesInfo.push(value);

                        }
                    }
                }
            },
            "json"
        )
        .fail(function () {
            console.log("Modified_Logic:getSuppliesFromReg<Error>");
        });


}

function getReceiversFromReg() {
    $.get(ReceiverUrl,
            function (data, textStatus, jqXHR) {
                console.log("Modified_Logic:getReceiversFromReg<Info>: Fetching Available Receivers");
                if (data.length != 0) {
                    for (let value of data) {
                        if (!receivers.includes(value.orgId)) {
                            receivers.push(value.orgId);
                            receiversInfo.push(value);
                        }
                    }
                }
            },
            "json"
        )
        .fail(function () {
            console.log("Modified_Logic:getReceiversFromReg<Error>");
        });
}

function openSendForm(changed) {
    document.getElementById('mySendForm').style.display = 'block';
    document.getElementById('mySendForm').style.zIndex = -1;

    if (!changed)
        return;

    $('#disaster-drop').empty();
    $('#receiver-drop').empty();
    $('#supply-drop').empty();

    $('#disaster-drop').append('<option selected disabled label="Select Disaster">Select Disaster</option>')

    for (let value of activeDisasters) //Append Disasters
    {
        let report;

        for (var i = 0; i < activeDisastersInfo.length; ++i) {
            if (value == activeDisastersInfo[i].disasterId) {
                report = activeDisastersInfo[i];
                break;
            }
        }

        let optionText = report.disasterId;

        let op = new Option(optionText, value); // Option Text and value tags

        $(op).html(optionText);

        $('#disaster-drop').append(op);
    }

    for (let value of receivers) //Append Receivers
    {
        let op = new Option(value, value);

        $(op).html(value);
        $('#receiver-drop').append(op);
    }
}

function closeSendForm() {
    document.getElementById("mySendForm").style.display = "none";
}

function openReportForm() {
    document.getElementById("myReportForm").style.display = "block";
}

function closeReportForm() {
    document.getElementById("myReportForm").style.display = "none";
}


function submitReport() {

    var x = document.getElementById("report-form");

    var text = {
        "location": "",
        "disasterType": ""
    };
    for (var key in text) {
        text[key] = x.elements[key].value;
    }

    text.disasterId = text.disasterType + '_' + x.elements['country'].value + '_' + x.elements['region'].value + '_' + text.location + '_' + ((new Random(Math.floor(Math.random() * 2147483647))).next());

    console.log(text);
    return text;
}

function submitSend() {
    var x = document.getElementById("send-form");
    var text = {
        "supplyId": "",
        "receiverId": "",
        "disasterId": "",
        "amount": 0
    };
    for (var key in text) {
        text[key] = x.elements[key].value;
    }

    text.deviceId = ((new Random(Math.floor(Math.random() * 2147483647))).next());

    console.log(text);
    return text;
}

function Random(seed) {
    this._seed = seed % 2147483647;
    if (this._seed <= 0) this._seed += 2147483646;
}


Random.prototype.next = function () {
    return this._seed = this._seed * 16807 % 2147483647;
};



Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
    return (this.next() - 1) / 2147483646;
};