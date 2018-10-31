'use strict';

const ActiveDisasterUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getActiveDisaster';
const StoreSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getStoreSupplies';
const ReceiverUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Receiver';
const reportUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/CreateDisaster';
const AcceptedSendSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/AcceptedSendSupply';

//TODO: Check if a Disaster is already reported.

let activeDisasters = [];
let activeDisastersInfo = [];
let storeSupplies = [];
let storeSuppliesInfo = [];
let receivers = [];
let receiversInfo = [];

const FETCH_INTERVAL = 10000; // 10s Periodic Check
const UPDATE_INTERVAL = 20000;

$(document).ready(function () {

    window.setInterval(function () {

        getDisasterFromReg();
        getSuppliesFromReg();
        getReceiversFromReg();

    }, FETCH_INTERVAL);

    window.setInterval(function () {
        if (activeDisasters.length == 0) {
            console.log('Modified_Logic<Info>: No active Disasters');
            closeSendForm();
        } else {
            openSendForm();
        }
    }, UPDATE_INTERVAL);

    $('#disaster-drop').on('change', function () {

        $('#supply-drop').empty();

        let report_ID = this.value;

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

    });

    $('#report-form').submit(function () { // Report Disasters Form
        var tst = submitReport();
        $.ajax({
            url: reportUrl,
            type: "POST",
            data: tst,
            dataType: JSON,
            success: function (result) {
                console.log(result);
                alert("report-form-successed!");
            },
            error: function (error) {
                console.log(error)
            },
            complete: function (status, error) {
                closeReportForm();
                if (status.status != 200) {
                    alert(status.responseText);
                } else {
                    alert("disaster reported successfuly!");
                }
            }
        });
        return false;
    });

    $('#send-form').submit(function () { // Disaster Notification Form
        var tst = submitSend();
        $.ajax({ // TODO: Change to AJAX POST
            url: AcceptedSendSupplyUrl,
            type: "POST",
            data: tst,
            dataType: JSON,
            success: function (result) {
                console.log(result);
            },
            error: function (error) {
                console.log(error);
            },
            complete: function (status, error) {
                closeSendForm();
                if (status.status != 200) {
                    alert(status.responseText);
                } else {
                    alert("supply sent successfuly!");

                    for (var i = 0; activeDisasters.length; ++i) {
                        if (tst.disasterId == activeDisasters[i]) {
                            activeDisasters.splice(i, 1);
                            break;
                        }
                    }

                    for (var i = 0; i < activeDisastersInfo.length; ++i) {
                        if (tst.disasterId == activeDisastersInfo[i].disasterId) {
                            activeDisastersInfo.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        });
        return false;
    });
});

function getDisasterFromReg() {
    $.get(ActiveDisasterUrl, function (data, textStatus, jqXHR) {
                console.log("Modified_Logic:getDisasterFromReg<Info>: Checking Active Disasters");
                if (data.length != 0) {
                    for (let value of data) // IMPORTANT: Maybe replaced with a normal loop
                    {
                        if (!activeDisasters.includes(value.disasterId)) // Check If we have not included the Disaster Yet
                        {
                            activeDisasters.push(value.disasterId);
                            activeDisastersInfo.push(value);
                        }

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

function openSendForm() {
    document.getElementById('mySendForm').style.display = 'block';

    $('#disaster-drop').empty();
    $('#receiver-drop').empty();
    $('#supply-drop').empty();

    $('#disaster-drop').append('<option selected disabled label=" "> </option>')

    for (let value of activeDisasters) //Append Disasters
    {
        let report;

        for (var i = 0; i < activeDisastersInfo.length; ++i) {
            if (value == activeDisastersInfo[i].disasterId) {
                report = activeDisastersInfo[i];
                break;
            }
        }

        let optionText = report.type + '_' + report.location;

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
        "disasterId": "",
        "location": "",
        "disasterType": ""
    };
    for (var key in text) {
        text[key] = x.elements[key].value;
    }
    console.log(text);
    return text;
}

function submitSend() {
    var x = document.getElementById("send-form");
    var text = {
        "supplyId": "",
        "receiverId": "",
        "disasterId": "",
        "deviceId": "",
        "amount": 0
    };
    for (var key in text) {
        text[key] = x.elements[key].value;
    }
    console.log(text);
    return text;
}