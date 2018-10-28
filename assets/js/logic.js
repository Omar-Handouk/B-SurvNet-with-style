const ActiveDisasterUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getActiveDisaster';
const StoreSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/queries/getStoreSupplies';
const ReceiverUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Receiver';
const reportUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/CreateDisaster';
const AcceptedSendSupplyUrl = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/AcceptedSendSupply';

var activeDisasters = [];
var storeSupplies = [];
var receivers = [];

$(document).ready(function () {
    setInterval(function () {
        console.log("check is on...");
        $.ajax({
            url: ActiveDisasterUrl,
            type: "GET",
            success: function (data) {
                if (data.length > 0) {
                    console.log(data.length + " disaster detected!")
                    for (var i = 0; i < data.length; i++) {
                        activeDisasters[i] = data[i].disasterId;
                    }
                    $.ajax({
                        url: StoreSupplyUrl,
                        type: "GET",
                        success: function (data) {
                            console.log(data.length + " supplies detected!");
                            for (var i = 0; i < data.length; i++) {
                                storeSupplies[i] = data[i].supplyId;
                            }
                            $.ajax({
                                url: ReceiverUrl,
                                type: "GET",
                                success: function (data) {
                                    console.log(data.length + " receivers found!");
                                    for (var i = 0; i < data.length; i++) {
                                        receivers[i] = data[i].orgId;
                                    }
                                    openSendForm();
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

    $('#report-form').submit(function () {
        var tst = sumbitReport();
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

    $('#send-form').submit(function () {
        var tst = sumbitSend();
        $.ajax({
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
})

function openReportForm() {
    document.getElementById("myReportForm").style.display = "block";
}

function closeReportForm() {
    document.getElementById("myReportForm").style.display = "none";
}

function openSendForm() {
    document.getElementById("mySendForm").style.display = "block";
    var disasterOptions = document.getElementById("disaster-drop");
    var receiverOptions = document.getElementById("receiver-drop");
    var supplyOptions = document.getElementById("supply-drop");
    for (var i = 0; i < 20; i++) {
        disasterOptions.remove(disasterOptions);
        receiverOptions.remove(receiverOptions);
        supplyOptions.remove(supplyOptions);
    }
    for (var i = 0; i < activeDisasters.length; i++) {
        var option = document.createElement("option");
        option.text = activeDisasters[i];
        disasterOptions.add(option);
    }
    for (var i = 0; i < receivers.length; i++) {
        var option = document.createElement("option");
        option.text = receivers[i];
        receiverOptions.add(option);
    }
    for (var i = 0; i < storeSupplies.length; i++) {
        var option = document.createElement("option");
        option.text = storeSupplies[i];
        supplyOptions.add(option);
    }
}

function closeSendForm() {
    document.getElementById("mySendForm").style.display = "none";
}

function sumbitReport() {
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

function sumbitSend() {
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