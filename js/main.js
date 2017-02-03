
$(window).load(function(){
    $('#modal-intro').modal('show');
    setScores();
});

$('#submit').click(function() {
    postScore();
    setScores();
    $('#modal-submit').modal('hide');
});

function postScore(){    
    var name = $('#username1').val();
    var score = $('#score').text();
    $.ajax({
        type: "POST",
        url: "./ProjectApi.php",
        data: {
            name: name,
            score: score
        },
        // Error processing
        error: function (xhr, string, thrownError) {
            console.log('error:' + thrownError);
        },
        // Ok processing
        success: function (xml) {
            console.log('success');
        }
    });
};


function getScores(handleData){
    $.ajax({       
        type : "GET",
        dataType: 'json',
        url: "./ProjectApi.php",  
        error : function(xhr, ajaxOptions, thrownError){
           console.log("error:" + thrownError);
        },     
        success : function(data){
           console.log(data);
           handleData(data);
       },
    });
};


function setScores(){
    $("#score-table tbody").empty();
    getScores(function(scores){
        for (var i = 0; i < scores.length; i++) {
            $('#score-table tbody').append("<tr><td>"+scores[i].Name+"</td><td>"+scores[i].Score+"</td></tr>");
        }
    });
};


