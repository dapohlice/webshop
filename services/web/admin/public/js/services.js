// XHR (XMLHttpRequest) verarbeitet alle Anfragen per ajax request und schickt nach Erfolg alle Antworten an response() weiter  
function XHR(type, url, data, contentType) {
  promise = $.ajax({
    type: type,
    url: url,
    contentType: contentType,
    data: data,
    cache: false
  });
  promise.done(function (data, statusText) {
    console.log(statusText + " - " + data.status);
    console.log('Sucessfull data check');
    console.log('XHR liefert folgendes Ergebnis zurück:');
    console.log(data);
    response(data);
  });

  promise.fail(function (xhr, statusText, errorThrown) {
    console.log(statusText + " - " + xhr.status);
    $('#adminc').empty();
    renderErrorHTML(xhr, statusText);
    return false;
  });

}
