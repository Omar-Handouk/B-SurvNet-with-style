'use strict';

const disasterURL = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Disaster';

let disastersCurr = [];
let disastersCheck = [];

const INTERVAL = 2000;

$(() => {

    //First Fetch

    window.setInterval(() => {

        getAllDisasters();

        if (!checkDiff(disastersCheck, disastersCurr)) {
            disastersCurr = disastersCheck;
            insertSelect();
        }

    }, INTERVAL);

    $('#disasters').change(function (e) { 
        e.preventDefault();
        
        let selc = '#disasterInfo> tbody:last';

        $(selc).empty();

        $('#disasterInfo').css('display', 'table');

        let reportID = $('#disasters').val();

        let disaster;

        for (let value of disastersCurr)
        {
            if (value.disasterId == reportID)
                {
                    disaster = value;
                    break;
                }
        }

        let supplies = '';

        for (var i = 0 ; i < (disaster.suppliesTypeNeeded).length ; ++i)
        {   
            supplies += (disaster.suppliesTypeNeeded)[i] + "/" + (disaster.amountOfSupplies)[i];

            if (i === (disaster.suppliesTypeNeeded).length - 1)
                break;
            else
                supplies += ' - ';
        }

        var $row = $('<tr>' 
        + '<td>' + disaster.disasterId + '</td>'
        + '<td>' + disaster.location + '</td>'
        + '<td>' + disaster.type + '</td>'
        + '<td>' + disaster.state + '</td>'
        + '<td>' + supplies + '</td>'
        + '</tr>')

        $(selc).append($row);
    });

});

function checkDiff(fetched, curr) {
    if (fetched.length != curr.length) {
        return false;
    } else {
        for (let i of fetched) {
            let exists = false;

            for (let j of curr) {
                if (i.disasterId === j.disasterId) {
                    exists = true;
                    break;
                }
            }

            if (!exists)
                return false;
        }
    }

    return true;
}

function getAllDisasters() {
    $.get(disasterURL,
            function (data, textStatus, jqXHR) {
                disastersCheck = data;
            },
            "json"
        )
        .fail((error) => {
            alert('Error Fetch Disasters')
        });
}

function insertSelect() {
    $('#disasters').empty();

    $('#disasters').append('<option disabled selected>-Select A Disaster-</option>');

    for (let report of disastersCurr) {
        let disaster_name = report.type + '_' + report.location + '_' + report.disasterId;

        let opt = new Option(disaster_name, report.disasterId);

        $(opt).html(disaster_name);

        $('#disasters').append(opt);
    }
}