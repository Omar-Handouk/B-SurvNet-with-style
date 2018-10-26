const ActiveDisasterUrl = 'http://18.217.146.148:3000/api/queries/getActiveDisaster';
const StoreSupplyUrl = 'http://18.217.146.148:3000/api/queries/getStoreSupplies';
const ReceiverUrl = 'http://18.217.146.148:3000/api/Receiver';
const reportUrl = 'http://18.217.146.148:3000/api/CreateDisaster';
const AcceptedSendSupplyUrl = 'http://18.217.146.148:3000/api/AcceptedSendSupply';

$(document).ready(function () {
    setInterval(function () {
        console.log("check is on...");
        $.ajax({
            url: ActiveDisasterUrl,
            type: "GET",
            success: function (data) {
                if (data.length > 0) {
                    console.log(data.length + " disaster detected!")
                    $.ajax({
                        url: StoreSupplyUrl,
                        type: "GET",
                        success: function (data) {
                            console.log(data.length + " supplies detected!");
                            $.ajax({
                                url: ReceiverUrl,
                                type: "GET",
                                success: function (data) {
                                    console.log(data.length + " receivers found!");
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
    }, 10000);

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
            complete: function(status, error){
                closeReportForm();
                if(status.status != 200){
                    alert(status.responseText);
                }
                else{
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
            complete: function(status, error){
                closeSendForm();
                if(status.status != 200){
                    alert(status.responseText);
                }
                else{
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