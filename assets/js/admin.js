'use strict';

const suppliersURL = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Supplier';
const supplyURL = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Supply';
const receiverURL = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Receiver';
const transporterURL = 'http://survival-network-rest-server-smart-panda.mybluemix.net/api/Transporter';

$(() => {

    $('#regTypeSelect').on('change', function (e) {
        e.preventDefault();

        let registry = $('#regTypeSelect').val();

        if (registry === null) {
            alert('Please Select A Valid Registry');
        } else {
            $('#registryForm').empty();

            switch (registry) {
                case 'supply':

                    $('#registryForm').append('<h3>Add Supplies</h3>');

                    $('#registryForm').append(' <div class="12u$"><div class="select-wrapper"><select name="supplyType" id="supplyType"><option disabled selected>-Choose Supply Type-</option><option value="FOOD">Food Supplies</option><option value="MEDS">Medication Supplies</option><option value="BLOOD">Blood Bags</option></select></div></div>');

                    $('#registryForm').append('<div class="12u$"><div class="select-wrapper"><select name="suppliersID" id="suppliersID"><option disabled selected>-Select Supply Owner-</option></select></div></div>');

                    getSuppliers();

                    $('#registryForm').append('<div class="12u$"><label>Number of Supplies: </label><input type="number" id="supplyQuan" min="1" value="1"></div>');

                    $('#registryForm').append('<div class="12u$"><button type="submit" class="btn btn-info">Submit</button></div>');

                    break;

                case 'supplier':

                    $('#registryForm').append('<h3>Add Suppliers</h3>');

                    $('#registryForm').append('<div class="12u$" style="margin-bottom: 50px"><input type="text" name="supplierName" id="supplierName" placeholder="Enter Supplier Name" required></div>');

                    $('#registryForm').append('<div id="report-map" style="width: 90%; height: 300px; margin:auto;"></div>');

                    $('#registryForm').append('<script src="assets/js/map.js"></script>');

                    $('#registryForm').append('<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBQ2ceeY7Pe72QCbTn2mcshWmgLHO9r2Hw&callback=initMap"></script>');

                    $('#registryForm').append('<div class="12u$"><input type="text" name="supplierLoc" id="markerLocation" placeholder="Select Supplier Location" required disabled></div>');


                    $('#registryForm').append('<div class="12u$"><button type="submit" class="btn btn-info">Submit</button></div>');

                    break;

                case 'receiver':

                    $('#registryForm').append('<h3>Add Receivers</h3>');

                    $('#registryForm').append('<div class="12u$" style="margin-bottom: 50px"><input type="text" name="receiverName" id="receiverName" placeholder="Enter Receiver Name" required></div>');

                    $('#registryForm').append('<div id="report-map" style="width: 90%; height: 300px; margin:auto;"></div>');

                    $('#registryForm').append('<script src="assets/js/map.js"></script>');

                    $('#registryForm').append('<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBQ2ceeY7Pe72QCbTn2mcshWmgLHO9r2Hw&callback=initMap"></script>');

                    $('#registryForm').append('<div class="12u$"><input type="text" name="receiverLoc" id="markerLocation" placeholder="Select Supplier Location" required disabled></div>');


                    $('#registryForm').append('<div class="12u$"><button type="submit" class="btn btn-info">Submit</button></div>');

                    break;

                default:
                    $('#registryForm').append('<h3>Add Transporters</h3>');

                    $('#registryForm').append('<div class="12u$" style="margin-bottom: 50px"><input type="text" name="transporterName" id="transporterName" placeholder="Enter Receiver Name" required></div>');

                    $('#registryForm').append('<div class="12u$"><button type="submit" class="btn btn-info">Submit</button></div>');
                    break;
            }

        }

    });

    $('#submitRegForm').submit(function (e) {
        e.preventDefault();

        switch ($('#regTypeSelect').val()) {

            case 'supply':
                let supply = {};

                supply.supplyId = getRandomID;
                supply.supplyType = $('#supplyType').val();
                supply.owner = $('#suppliersID').val();
                supply.state = "AT_STORE";
                supply.amount = $('#supplyQuan').val();

                if ($('#supplyType').val() === null) {
                    alert('Please Select A Supply Type');
                } else if ($('#suppliersID').val() === null) {
                    alert('Please Select The Supply Owner');
                } else {
                    $.post(supplyURL, supply,
                            function (data, textStatus, jqXHR) {
                                alert('Supply Added');
                            },
                            "json"
                        )
                        .fail(function (error) {
                            alert('Error Sending Supplies')
                        });
                }
                break;

            case 'supplier':

                let supplier = {};

                supplier.location = $('#markerLocation').val();
                supplier.orgId = $('#supplierName').val() + '_' + (getRandomID());

                if ($('#markerLocation').val() === '') {
                    alert("Please Enter The Supplier's Location");
                } else if ($('#supplierName').val() === null) {
                    alert("Please Enter The Supplier's Name");
                } else {
                    $.post(suppliersURL, supplier,
                            function (data, textStatus, jqXHR) {
                                alert('Supplier Added');
                            },
                            "json"
                        )
                        .fail(function (error) {
                            alert('Error Adding Supplier')
                        });
                }

                break;

            case 'receiver':

                let receiver = {};

                receiver.location = $('#markerLocation').val();
                receiver.orgId = $('#receiverName').val() + '_' + (getRandomID());

                if ($('#markerLocation').val() === '') {
                    alert("Please Enter The Receiver's Location");
                } else if ($('#receiverName').val() === null) {
                    alert("Please Enter The Receiver's Name");
                } else {
                    $.post(receiverURL, receiver,
                            function (data, textStatus, jqXHR) {
                                alert('Receiver Added');
                            },
                            "json"
                        )
                        .fail(function (error) {
                            alert('Error Adding Receiver')
                        });
                }

                break;
            default:

                let transporter = {};

                transporter.orgId = $('#transporterName').val() + '_' + (getRandomID());

                if ($('#transporterName').val() === null) {
                    alert("Please Enter The Transporter's Name");
                } else {
                    $.post(transporterURL, transporter,
                            function (data, textStatus, jqXHR) {
                                alert('Transporter Added');
                            },
                            "json"
                        )
                        .fail(function (error) {
                            alert('Error Adding Transporter');
                        });
                }
                break;
        }
    });



});

function getSuppliers() {
    $.get(suppliersURL,
        function (data, textStatus, jqXHR) {

            for (let value of data) {
                let opt = new Option(value.orgId, value.orgId);
                $(opt).html(value.orgId)
                $('#suppliersID').append(opt);
            }
        },
        "json"
    );
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

function getRandomID() {
    return ((new Random(Math.floor(Math.random() * 2147483647))).next());
}