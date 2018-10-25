$(document).ready(function () {
    const SupplyUrl = 'http://vehicle-manufacture-rest-secured3-anxious-hedgehog.mybluemix.net/api/Supply';
    const ReceiverUrl = 'http://vehicle-manufacture-rest-secured3-anxious-hedgehog.mybluemix.net/api/Disaster';
    $('.btn-report').click(function () {
        $.ajax({
            url: SupplyUrl,
            type: "GET",
            success: function (data) {
                console.log(data)
                // $.ajax({
                //     url: ReceiverUrl,
                //     type: "GET",
                //     success: function(data){
                //         console.log(data)
                //     }
                // })
            },
            error: function (error) {
                console.log(error)
            }
        })
    })

})