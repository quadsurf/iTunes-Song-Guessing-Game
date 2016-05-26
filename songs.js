$(function() {

  var songIds = ["995535015", "966411602", "823593456", "956689796", "943946671",
                 "982388023", "907242704", "201281527", "656801339", "910038357",
                 "250038575", "878000348",  "794095205",  "1645339",  "400835962",
                 "325618",  "169003415",  "51958108",
                 "192688540", "684811768", "344799464", "217633921",
                 "192811017", "71068886", "640047583", "517438248",
                "656479859", "310237", "991390352", "901614155",
                 "344799727", "162337613", "121695005", "159293848", "305118379" ];

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

   // Random Song Generator
   function randomSongId() {
     var randomIndex = Math.floor(Math.random() * songIds.length);
     return songIds[randomIndex];
   }

   //JSON P ajax request
   $.ajax({
      url: "https://itunes.apple.com/us/lookup?id="+randomSongId(),
      jsonp: "callback",
      dataType: "jsonp"
   }).done(function(data) {
      console.log(data);
   });






});
