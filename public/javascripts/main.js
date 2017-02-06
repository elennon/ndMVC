$(document).ready(function() {
    //$('#pi').prop('disabled', false);
    
    $('.container').on('change', '#sensor', function(e) {
        var buildingId = $("#building").val();
        var piId = $("#pi").val();
        var sensor = $("#sensor").val();
        var batch = $("#batch").val();
        $.ajax({
            method: 'POST',
            url: 'getReadings/',
            dataType: "html",
            contentType: "application/json",
            data: JSON.stringify({'building': buildingId, 'pi' : piId, 
                'sensor': sensor, 'batch' : batch }),
            success: function(data){
                //alert(data); 
                $('#users_list').html(data);
            },
        });
    });

});
//var txt = $("#building option:selected").text();

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
    // var pies = $('#pi');
                // var opts = $.parseJSON(data);
                // $('#pi').empty();
                // $.each(opts, function(i, d) {
                //     //alert(d.name);
                //     $('#pi').append('<option value="' + d.id + '">' + d.name + '</option>');
                // });