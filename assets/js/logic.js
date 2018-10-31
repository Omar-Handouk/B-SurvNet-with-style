const ActiveDisasterUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getActiveDisaster';
const StoreSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getStoreSupplies';
const ReceiverUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Receiver';
const reportUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/CreateDisaster';
const AcceptedSendSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/AcceptedSendSupply';

var activeDisasters = [];
var storeSupplies = [];
var receivers = [];

$(document).ready(function () { // Document Ready
    setInterval(function () { // periodic Function used to fetch active disasters, stores and receivers
        console.log("check is on...");
        $.ajax({ // AJAX request for getting active disaster - TODO: Replace with $.get
            url: ActiveDisasterUrl,
            type: "GET",
            success: function (data) {
                if (data.length > 0) { // Check if Disaster Registry contains disasters
                    console.log(data.length + " disaster detected!");
                    for (var i = 0; i < data.length; i++) { // Loop used to pull disasters into an array <<Used to fetch other information>>
                        activeDisasters[i] = data[i].disasterId; // Get Disaster ID
                    }
                    $.ajax({ // AJAX request for getting active disaster - TODO: replace with $.get
                        url: StoreSupplyUrl,
                        type: "GET",
                        success: function (data) {
                            console.log(data.length + " supplies detected!");
                            for (var i = 0; i < data.length; i++) {
                                storeSupplies[i] = data[i].supplyId; // Get supply ID
                            }
                            $.ajax({ // AJAX request used to fetch suppliers. IMPORTANT: This with the three other AJAX calls used to push into the notification
                                url: ReceiverUrl,
                                type: "GET",
                                success: function (data) {
                                    console.log(data.length + " receivers found!");
                                    for (var i = 0; i < data.length; i++) {
                                        receivers[i] = data[i].orgId; // Get the ID of the Receivers' Orgs
                                    }
                                    openSendForm(); // Used to render the notification
                                },
                                error: function (error) {
                                    console.log(error);
                                }
                            })
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    })

                } else {
                    console.log("no active disasters found");
                    closeSendForm();
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    }, 5000);

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
        })
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
                }
            }
        })
        return false;
    });
});

function openReportForm() {
    document.getElementById("myReportForm").style.display = "block";
}

function closeReportForm() {
    document.getElementById("myReportForm").style.display = "none";
}

function openSendForm() {
    console.log(activeDisasters);
    console.log(storeSupplies);
    console.log(receivers);
    document.getElementById("mySendForm").style.display = "block";
    var disasterOptions = document.getElementById("disaster-drop");
    var receiverOptions = document.getElementById("receiver-drop");
    var supplyOptions = document.getElementById("supply-drop");
    for (var i = 0; i < 20; i++) { // Mystery Loop
        disasterOptions.remove(disasterOptions);
        receiverOptions.remove(receiverOptions);
        supplyOptions.remove(supplyOptions);
    }
    for (var i = 0; i < activeDisasters.length; i++) { // Loop used to loop on active disasters
        var option = document.createElement("option");
        option.text = activeDisasters[i];
        disasterOptions.add(option);
    }
    for (var i = 0; i < receivers.length; i++) { // Loop used to Loop on available receivers ??
        var option = document.createElement("option");
        option.text = receivers[i];
        receiverOptions.add(option);
    }
    for (var i = 0; i < storeSupplies.length; i++) { // Loop used to Loop on available supplies - TODO: This part needs to be changed to only available supplies only
        var option = document.createElement("option");
        option.text = storeSupplies[i];
        supplyOptions.add(option);
    }
}

function closeSendForm() {
    document.getElementById("mySendForm").style.display = "none";
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