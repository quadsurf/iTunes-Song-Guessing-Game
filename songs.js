$(function() {

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
      $(".lists").append(`<li><img src="${song.songThumb}" /> ${song.songName} | Guess: ${song.guessAccuracy} | <a data-uri="${song.songClip}" href="#">Play</a></li>`);
    });

    // <audio type="audio/mp4" src="${song.songClip}" class="history" controls></audio>

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

    getSong();

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
          var audioPrev = $("#audio_preview");
          audioPrev.attr('src', songClip);
          audioPrev.on('canplay', function() {
            audioPrev[0].pause();
          });
      });
    };

    setTimeout(function() {console.log('Song: ', songName)},1000);
    setTimeout(function() {console.log('Artist: ', songArtist)},1500);
    setTimeout(function() {console.log('Album: ', albumName)},2000);

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

      $(".lists").append(`<li><img src="${tempObj.songThumb}" /> ${tempObj.songName} | Guess: ${tempObj.guessAccuracy} | <a data-uri="${tempObj.songClip}" href="#">Play</a></li>`);

      data.set('songs', songs);

      $('#guess').val('');

      getSong();

    });

    $(".lists").on('click', 'a', function(){
      var songLink = $(this).attr('data-uri');
      $("#history").attr('src', songLink);
      $("#history").on('canplay', function() {
        $("#history")[0].play();
        });
      });


});
