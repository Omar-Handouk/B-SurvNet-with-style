$(document).ready(function () {
    const SupplyUrl = 'http://18.217.146.148:3000/api/net.biz.disasterSampleNetwork/Disaster';
    const ReceiverUrl = 'http://18.217.146.148:3000/api/net.biz.disasterSampleNetwork.Receiver';
    const reportUrl = 'http://18.217.146.148:3000/api/net.biz.disasterSampleNetwork.CreateDisaster';
    $('.btn-send').click(function () {
        $.ajax({
            url: SupplyUrl,
            type: "GET",
            success: function (data) {
                console.log(data)
                $.ajax({
                    url: ReceiverUrl,
                    type: "GET",
                    success: function (data) {
                        console.log(data)
                    }
                })
            },
            error: function (error) {
                console.log(error)
            }
        })
    })
    $('.btn-report').click(function () {
        var tst = popReport();
        $.ajax({
            url: reportUrl,
            type: "POST",
            data: tst,
            dataType: JSON,
            success: function (result) {
                console.log(result)
            },
            error: function (error) {
                console.log(error)
            }
        })
    })

})


function popReport() {
    var txt;
    var disasterId = prompt("Please enter disaster ID:", "disaster_2");
    var location = prompt("Please enter disaster location:", "cairo");
    var disasterType = prompt("Please enter disaster type:", "flood");
    if (disasterId == null || disasterId == "" || location == null || location == "" || disasterType == null || disasterType == "") {
        txt = "User cancelled the prompt.";
    } else {
        var txt = {
            "disasterId": disasterId,
            "location": location,
            "disasterType": disasterType
        };
    }
    //    document.getElementById("demo").innerHTML = txt;
    return txt ;
}