$(function() {

    var numCorrect = 0;
    var numIncorrect = 0;
    $("#rights").text(numCorrect);
    $("#wrongs").text(numIncorrect);

    $('#reset').hide();

    var songIds = ["995535015", "966411602", "823593456", "956689796", "943946671",
        "982388023", "907242704", "201281527", "656801339", "910038357",
        "250038575", "878000348", "794095205", "1645339", "400835962",
        "325618", "169003415", "51958108",
        "192688540", "684811768", "344799464", "217633921",
        "192811017", "71068886", "640047583", "517438248",
        "656479859", "310237", "991390352", "901614155",
        "344799727", "162337613", "121695005", "159293848", "305118379"
    ];

    //localStorage getter and setter function
    var data = {
        set: function(key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) {
            try {
                return JSON.parse(window.localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        }
    }

    var songs = data.get('songs') || [];

    $.each(songs, function(i, song) {

      (song.guessAccuracy == true) ?

      ($("#corrects").append(`<li><a data-uri="${song.songClip}" href="#">Play</a></li><li><img src="${song.songThumb}" class="img-rounded" /></li><li>${song.songName}<hr></li>`),
      numCorrect++,
      $("#rights").empty().text(numCorrect)) :

      ($("#incorrects").append(`<li><a data-uri="${song.songClip}" href="#">Play</a></li><li><img src="${song.songThumb}" class="img-rounded" /></li><li>${song.songName}<hr></li>`),
      numIncorrect++,
      $("#wrongs").empty().text(numIncorrect));

    });

    (numCorrect === 0 && numIncorrect === 0) ?
    ($("#reset").hide(), $("#middle li:gt(1)").hide(), $("#next").hide()) :
    ($("#reset").show(), $("#start").hide(), $("#guess").hide(), $("#check").hide());

    // Random Song Generator
    function randomSongId() {
        var randomIndex = Math.floor(Math.random() * songIds.length);
        return songIds[randomIndex];
    }

    //JSON P ajax request
    var songThumb,
        songClip,
        songName,
        songArtist,
        userGuess,
        guessAccuracy,
        albumName,
        songId;

    function getSong() {
      $.ajax({
          url: "https://itunes.apple.com/us/lookup?id=" + randomSongId(),
          jsonp: "callback",
          dataType: "jsonp"
      }).done(function(response) {
          var base = response.results[0];
          console.log(base);
          songArtist = base.artistName;
          songThumb = base.artworkUrl60;
          albumName = base.collectionName;
          songClip = base.previewUrl;
          songName = base.trackName;
          songId = base.trackId;
          var audioClip = $("#audio_preview");
          audioClip.attr('src', songClip);
          audioClip.on('canplay', function() {
            audioClip[0].play();
          });
      });
    };

    $("#start").click(function(){
      getSong();
      setTimeout(function() {console.log('Song: ', songName)},1000);
      setTimeout(function() {console.log('Artist: ', songArtist)},1500);
      setTimeout(function() {console.log('Album: ', albumName)},2000);
      $("#middle li:gt(1)").show();
      $(this).hide();
      $("#reset").show();
      $("#next").hide();
    });

    $("#next").click(function(){
      getSong();
      setTimeout(function() {console.log('Song: ', songName)},1000);
      setTimeout(function() {console.log('Artist: ', songArtist)},1500);
      setTimeout(function() {console.log('Album: ', albumName)},2000);
      $(this).hide();
      $("#guess").show();
      $("#check").show();
      $("#history")[0].pause();
    });

    $("#reset").click(function(ev){
      ev.preventDefault();
      $("#audio_preview").attr('src', '');
      $("#middle li:gt(1)").hide();
      localStorage.clear();
      numCorrect = 0;
      numIncorrect = 0;
      $("#rights").empty().append(numCorrect);
      $("#wrongs").empty().append(numIncorrect);
      $("#corrects li:not(':first')").remove();
      $("#incorrects li:not(':first')").remove();
      $(this).hide();
      $("#start").show();
    });

    $('#check').click(function() {

      userGuess = $('#guess').val();
      var guess = true;

      if(songArtist == userGuess) {
        alert('Artist\'s name is correct!');
      } else if(songName == userGuess) {
        alert('Song name is correct!');
      } else if(albumName == userGuess) {
        alert('Album name is correct!');
      } else {
        alert('Sorry, your guess was wrong!');
        guess = false;
      }

      guessAccuracy = guess;

      var tempObj = {
          "songThumb": songThumb,
          "songClip": songClip,
          "songName": songName,
          "songArtist": songArtist,
          "userGuess": userGuess,
          "guessAccuracy": guessAccuracy,
          "albumName": albumName,
          "songId": songId
        };

      console.log(tempObj);

      songs.push(tempObj);

      (tempObj.guessAccuracy == true) ?

      ($("#corrects").append(`<li><img src="${tempObj.songThumb}" class="img-rounded" /> ${tempObj.songName} | <a data-uri="${tempObj.songClip}" href="#">Play</a></li>`),
      numCorrect++,
      $("#rights").empty().text(numCorrect)) :

      ($("#incorrects").append(`<li><img src="${tempObj.songThumb}" class="img-rounded" /> ${tempObj.songName} | <a data-uri="${tempObj.songClip}" href="#">Play</a></li>`),
      numIncorrect++,
      $("#wrongs").empty().text(numIncorrect));

      data.set('songs', songs);

      $('#guess').val('');
      $("#guess").hide();
      $(this).hide();
      $("#next").show();

    });

    $(".features").on('click', 'a', function(){
      var songLink = $(this).attr('data-uri');
      $("#history").attr('src', songLink);
      $("#history").on('canplay', function() {
        $("#history")[0].play();
        });
      });

    var icon = $('.play');
    icon.click(function() {
       icon.toggleClass('active');
       return false;
    });

    // function playSound(url) {
    //   var a = new Audio(url);
    //   a.play();
    // }

});
