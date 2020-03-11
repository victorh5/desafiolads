var mus = "";

function capturarTexto () {
    mus = document.getElementById('valor').value
    document.getElementById('music').innerHTML = mus;
    
    function showLetra (data,art,mus,arrayid) {
        if (! arrayid) arrayid = 0;

        if (data.type == 'exact' || data.type == 'aprox') {
            // Print lyrics text
            $('#letra .text').text(data.mus[arrayid].text);

            // Show buttons to open original and portuguese translation
            if (data.mus[arrayid].translate) {
                $('#letra .text').prepend('<input type=button value="Portuguese &raquo;" onClick="$(document).trigger(\'translate\')"><br/>');
                $(document).one('translate',function() {
                    $('#letra .text').text(data.mus[arrayid].translate[0].text);
                    $('#letra .text').prepend('<input type=button value="&laquo; Original" onClick="$(document).trigger(\'original\')"><br/>');
                    $(document).one('original',function() {
                        showLetra(data,art,mus,arrayid);
                    });
                });
            }

            // If not exact match (ex: U2 / Beautiful)
        if (data.type == 'aprox' && !$('#aprox').is('div')) {
                $('#letra').prepend('<div id=aprox>We found something similar<br/><span class=songname>"' + data.mus[arrayid].name + '"</span></div>');

                // If Vagalume found more than one possible matches
                if (data.mus.length > 0) {
                    var html = '<select class=songselect>';
                    for (var i = 0; i < data.mus.length; i++) {
                        html += '<option value="'+i+'"'+(i==arrayid?' selected':'')+'>'+data.mus[i].name+'</option>';
                    }
                    html += '</select>';
                    $('#aprox span.songname').html(html);
                    $('#aprox select.songselect').change(function() {
                        var aID = $('option:selected',this).val();
                        showLetra (data,art,mus,aID);
                    });
                }
            }
        } else if (data.type == 'song_notfound') {
            // Song not found, but artist was found
            // You can list all songs from Vagalume here
            $('#letra .text').html(
                'Song "'+mus+'" from "'+art+'" was not found.<br/>'
                +'<a target=_blank href="http://www.vagalume.com.br/add/lyrics.php">'
                +'Add this song to Vagalume &raquo;</a>'
            );
        } else {
            // Artist not found
            $('#letra .text').html(
                'Song "'+mus+'" from "'+art+'" was not found<br/>'
                +'(artist not found)<br/>'
                +'<a target=_blank href="http://www.vagalume.com.br/add/lyrics.php">'
                +'Add this song to Vagalume &raquo;</a>'
            );
        }
    }
    function fetchLetra (art,mus) {
        var data = jQuery.data(document,art + mus); // cache read
        if (data) {
            showLetra(data, art, mus);
            return true;
        }

        var url = "http://api.vagalume.com.br/search.php"
            +"?art="+encodeURIComponent(art)
            +"&mus="+encodeURIComponent(mus);

        // Check if browser supports CORS - http://www.w3.org/TR/cors/
        if (!jQuery.support.cors) {
            url += "&callback=?";
        }

        jQuery.getJSON(url,function(data) {
            // What we do with the data
            jQuery.data(document,art + mus,data); // cache write
            showLetra(data, art, mus);
        });
    }

    // Just an example of how you can call this using elements on the page
    fetchLetra($("#artista").text(),$("#music").text());
}



function mostra() {
    document.getElementById('hi').style.display = 'block';
    document.getElementById('c2').style.display = 'none';
}






document.getElementById('botao').onclick = function () {
    if (document.form1.radioo[0].checked == true) {
        mostra();
        capturarTexto();
    } else if(document.form1.radioo[1].checked == true) {
        document.getElementById('c2').style.display = 'block';
        document.getElementById('hi').style.display = 'none';
        
        filme = document.getElementById('valor').value
        buscarFilmes(filme)
        
        function buscarFilmes(filme){
            
            axios.get('https://api.themoviedb.org/3/search/movie?api_key=5417af578f487448df0d4932bc0cc1a5&query='+filme).then(function(response){
                console.log(response);
                var filmePesquisado  =  response.data.results;
                var mostraFilmes = '';
                console.log(filmePesquisado);
        
                
                    mostraFilmes += '<div class="col-md-4" style="padding: 40px; margin: 10px auto 0 10px">';
                    //mostraFilmes += '<span>#'+filmePesquisado[i].id+'</span>';
                    mostraFilmes += '<img class="img-thumbnail" src="https://image.tmdb.org/t/p/w300/'+filmePesquisado[0].poster_path+'">';
                    mostraFilmes += '<br/><br/>';
                    mostraFilmes += '<h6 class="text-muted">'+filmePesquisado[0].title+'</h6><br/>';
                    mostraFilmes += '<br/><br/>';
        
                    //mostraFilmes += '<p><h4 class="">'+filmePesquisado[i].title+'</h4></p>';
                    mostraFilmes += '<span>Ano de Lançamento: '+filmePesquisado[0].release_date+'</span>'
                    mostraFilmes += '<p style="text-align: center; margin: 10px auto 0 auto;">Resumo(apenas em inglês):' + filmePesquisado[0].overview + '</p></div>';			
                    mostraFilmes += '</div>';
                    
        
                    console.log(filmePesquisado[0].title);			
                
                
                document.getElementById('c2').innerHTML = mostraFilmes;			
        
                
            }).catch(function (error){
                console.log(error);
            });
        }
        
    } else {
        alert('Escolha uma opção: Letra ou Filme')
    }
}
