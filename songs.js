$(function() {

  var curSongData = {},
      guess,
      correctCount = 0,
      wrongCount = 0,
      randomSongId,
      neutralFace = "http://images.clipartpanda.com/neutral-face-black-and-white-yellow-neutral-face-1.jpg",
      sadFace = "http://upload.wikimedia.org/wikipedia/commons/e/e9/Sad_face.svg",
      happyFace = "http://upload.wikimedia.org/wikipedia/commons/f/fc/Happy_face.svg", 
      songIds = ["995535015", "966411602", "823593456", "956689796", "943946671",
                 "982388023", "907242704", "201281527", "656801339", "910038357",
                 "250038575", "878000348",  "794095205",  "1645339",  "400835962",
                 "325618", "191924084",  "376116617",  "169003415",  "51958108",
                 "76532142", "192688540", "684811768", "344799464", "217633921",
                 "192811017", "258404365", "71068886", "640047583", "517438248",
                 "266075552", "656479859", "310237", "991390352", "901614155",
                 "344799727", "162337613", "121695005", "159293848", "305118379" ];



  $("#startbutton").click(function(e) {
    playNewSong();
  });
  
  $("#guessform").submit(function(e) {
    e.preventDefault();

    $("#audio_preview")[0].pause();
    guess = $("#guessinput").val();
    $("#guessinput").val('');
    showGuessed(guess, curSongData);
  });

  $("#menudiv").on("click", function(e) {
    e.preventDefault();
    if (e.target === document.getElementById("newsongdiv")) {
      playNewSong();
    } else if (e.target === document.getElementById("statsdiv")) {
      displayStats();
    }
  });

  $("#restart").click(function(e) {
    guess = "";
    playNewSong();
  });

  function showGuessed(guess, curSongData) {
    makeActive("guessed");

    var guessedCorrectly = checkAnswer(guess, curSongData);

    var $answerStatus = $("#answerstatus");
    if (guessedCorrectly) {
      correctCount++;
      $answerStatus.removeClass("incorrecttext");
      $answerStatus.addClass("correcttext");
      $answerStatus.html("Correct!");
      
    } else {
      wrongCount++;
      $answerStatus.removeClass("correcttext");
      $answerStatus.addClass("incorrecttext");
      $answerStatus.html("Wrong Answer");
    }

    $("#artist").html(curSongData.artistName);
    $("#track").html(curSongData.trackName);
    $("#album").html(curSongData.collectionName);
    $("#coverart").attr("src", curSongData.artworkUrl100);
  }
  
  function displayStats() {
    makeActive("guessstats");
    $("#audio_preview")[0].pause();

    $("#correctguesses").html(correctCount); 
    $("#wrongguesses").html(wrongCount);
    var srcUrl = "";
    if (correctCount > wrongCount) {
      srcUrl = happyFace;
    } else if (correctCount < wrongCount) {
      srcUrl = sadFace;
    } else {
      srcUrl = neutralFace;
    }

    $("#statsstatus").attr("src", srcUrl);
  }

  function makeActive(divId) {
    $("#start").hide();
    $("#playing").hide();
    $("#guessed").hide();
    $("#guessstats").hide();
    $("#"+divId).show();
  }

  function checkAnswer(guess, curSongData) {
    var answerStr = curSongData.artistName + curSongData.trackName + curSongData.collectionName;
    var regEx = new RegExp(guess, "i");

    var results = answerStr.match(regEx);
    if (results && results.length > 0) {
      return true;
    }
   
    return false;
  }

  function downloadAndPlaySong() {
    $.ajax({
      url: "https://itunes.apple.com/us/lookup?id=" + getAndSetRandomSongId(songIds),
      jsonp: "callback",
      dataType: "jsonp"
    }).done(function(data) {
      var first = data.results[0];
      var audioElem = $("#audio_preview");
      audioElem.attr("src", first.previewUrl);
      curSongData = first; 
      audioElem.on('canplay', function() {
        audioElem[0].play(); 
      });
    });
  }
  
  function getAndSetRandomSongId(songs) {
    var randNum = Math.floor((Math.random() * songs.length));
    randomSongId = songs[randNum];
    return randomSongId;
  }

  function playNewSong() {
    makeActive("playing");
    downloadAndPlaySong();
    $("#guessinput").focus();
  }

});

