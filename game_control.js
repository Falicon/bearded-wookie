/******************************
*** FORMAT RESPONSE
******************************/
function format_response(response) {
  var html = '';
  for (var i = 0; i < response.length; i++) {
    html += '<p><strong>';
    html += response[i]['title'].toUpperCase();
    html += ' &mdash; </strong> ';
    for (var j = 0; j < response[i]['lines'].length; j++) {
      if (response[i]['lines'][j].trim() != '') {
        html += response[i]['lines'][j] + ' ';
      }
    }
    html += '</p>';
  }
  $('#status').html(story['character']['health']);
  return html;
}

/******************************
*** SUBMIT COMMAND (via keyboard)
******************************/
$("#command_form").keypress(function(event) {
  if (event.which == 13) {
    last_command = $('#command').val();
    var html = format_response(attempt_command($('#command').val()));
    $('#game_detail').html(html);
    $('#command').val('');
    $('#command').focus();
    event.preventDefault();
  }
});

/******************************
*** SUBMIT COMMAND (via button click)
******************************/
$('#command_form').submit(function(event){
  last_command = $('#command').val();
  var html = format_response(attempt_command($('#command').val()));
  $('#game_detail').html(html);
  $('#command').val('');
  $('#command').focus();
  event.preventDefault();
});

