$(document).ready(function() {

    // $('.container').on('change', '#pi', function(e) {
    //     var piId = $("#pi").val(); 
    //     alert(piId);  //getPies/ 
    //     $.ajax({
    //         method: 'GET',
    //         url: 'http://localhost:3000/?buildingId=' + buildingId,
    //         //url: 'http://localhost:3000/' ,
    //         dataType: "html",
    //         contentType: "application/json",
    //         data: JSON.stringify({'building': buildingId }),
    //         success: function(data){
    //             alert('dogs');
    //             $('#users_list').html(data);
    //         },
    //     });
    // });

    $('.container').on('change', '#sensor', function(e) {
        var buildingId = $("#building").val();
        var piId = $("#pi").val();
        var sensor = $("#sensor").val();
        var batch = $("#batch").val();
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/getReadings/',
            dataType: "html",
            contentType: "application/json",
            data: JSON.stringify({'building': buildingId, 'pi' : piId, 
                'sensor': sensor, 'batch' : batch }),
            success: function(data){
                //alert('dogs');
                $('#users_list').html(data);
            },
        });
    });

});
//var txt = $("#building option:selected").text();