$(document).ready(function(){
  var outputElement = document.getElementById('output');
  var btnSave = document.getElementById('btnSave');
  var deferredPrompt;
  navigator.serviceWorker.register('sw.js', { scope: './' })
    .then(function(r) {
      console.log('registered service worker');
    })
    .catch(function(whut) {
      console.error('uh oh... ');
      console.error(whut);
    });
  window.addEventListener('beforeinstallprompt', function(e) {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();
    btnSave.removeAttribute('disabled');
    deferredPrompt = e;
    return false;
  });
  btnSave.addEventListener('click', function() {
    if (deferredPrompt !== undefined) {
      deferredPrompt.prompt();
      outputElement.textContent = 'Deferred Prompt shown';
      deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome == 'dismissed') {
          console.log('User cancelled homescreen install');
        }
        else {
          console.log('User added to homescreen');
        }
        deferredPrompt = null;
      });
    }
  });

  var schoolweekcache = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  }

  var schoolweek = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  };

var d = new Date();
var weekday = new Array(7);
weekday[0] = "sunday";
weekday[1] = "monday";
weekday[2] = "tuesday";
weekday[3] = "wednesday";
weekday[4] = "thursday";
weekday[5] = "friday";
weekday[6] = "saturday";
var NowToday = weekday[d.getDay()];
var NowHour = d.getHours();
var NowMinut = d.getMinutes();

UpdateTimetable("offline");

var timetableurl = settings.RoosterServiceLink;

if (Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname) == undefined) {
  Lockr.set('ICT-ALFA-settings-url-' + window.location.hostname, settings.RoosterServiceLink);
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
} else {
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
}

console.log(timetableurl);

function UpdateTimetable(state) {
  if (state == "new") {
    Lockr.set('ICT-ALFA-' + window.location.hostname, schoolweekcache);
    schoolweek = schoolweekcache;
  } else if (state == "offline") {
    if (Lockr.get('ICT-ALFA-' + window.location.hostname) != undefined) {
      schoolweek = Lockr.get('ICT-ALFA-' + window.location.hostname);
    }
  } else {

  }
  if (schoolweek.monday.length + schoolweek.tuesday.length + schoolweek.wednesday.length + schoolweek.thursday.length + schoolweek.friday.length != 0) {
    if (NowToday == 'monday') {
      subjectNow(schoolweek.monday);
    } else if (NowToday == 'tuesday') {
      subjectNow(schoolweek.tuesday);
    } else if (NowToday == 'wednesday') {
      subjectNow(schoolweek.wednesday);
    } else if (NowToday == 'thursday') {
      subjectNow(schoolweek.thursday);
    } else if (NowToday == 'friday') {
      subjectNow(schoolweek.friday);
    } else {
      $(".con .last .subject").html("Geen les!");
      $(".con .last .subject").addClass("nosubject");
      subjectNow("etc");
    }
    function subjectNow(day) {
      var subjectlistitem = 999999999;
      var today;
      var todayselect;
      var last;
      var next;
      var daycange = "true";
      if (day != "etc") {
        for (var i = 0; i < day.length; i++) {
            if (NowHour <= day[i].time.HourseStart && daycange == "true") {
              function next() {
                var returnback;
                if (NowHour == day[i].time.HourseStart) {
                  if (NowMinut < day[i].time.MinutesStart) {
                    returnback = "true";
                  } else {
                    returnback = "false"
                  }
                } else {
                  returnback = "true";
                }
                return returnback;
              }
              if (next() == "true") {
                daycange = "false";
                subjectlistitem = i;
                if (i-1 > 0) {
                  if (NowHour != 0) {
                    if (day[i-1].time.HourseEnd >= NowHour || day[i-1].time.HourseStart <= NowHour) {
                      if (day[i-1].time.HourseEnd == NowHour) {
                        if (day[i-1].time.MinutesEnd > NowMinut) {
                          setcurrentsubjects(1,day[i-1].subject, day[i-1].place, day[i-1].time.TimeRaw, day[i-1].teacher);
                        } else {
                          $(".con .last .subject").html("Geen les!");
                          $(".con .last .subject").addClass("nosubject");
                        }
                      } else {
                        setcurrentsubjects(1,day[i-1].subject, day[i-1].place, day[i-1].time.TimeRaw, day[i-1].teacher);
                      }
                    } else {
                      $(".con .last .subject").html("Geen les!");
                      $(".con .last .subject").addClass("nosubject");
                    }
                  } else {
                    $(".con .last .subject").html("Geen les!");
                    $(".con .last .subject").addClass("nosubject");
                  }

                } else {
                  $(".con .last .subject").html("Geen les!");
                  $(".con .last .subject").addClass("nosubject");
                }
                if (i+1 < day.length) {
                  setcurrentsubjects(3,day[i+1].subject, day[i+1].place, day[i+1].time.TimeRaw, day[i+1].teacher);
                } else {
                  $(".con .next .subject").html("Geen les!");
                  $(".con .next .subject").addClass("nosubject");
                }
              }
            }
        }
      }
        if (subjectlistitem == 999999999) {
          if (NowToday == 'monday') {
            if (schoolweek.tuesday.length == 0) {
              if (schoolweek.wednesday.length == 0) {
                if (schoolweek.thursday.length == 0) {
                  if (schoolweek.friday.length == 0) {
                    today = "noting";
                  } else {
                    today = schoolweek.friday;
                  }
                } else {
                  today = schoolweek.thursday;
                }
              } else {
                today = schoolweek.wednesday;
              }
            } else {
              today = schoolweek.tuesday;
            }
          } else if (NowToday == 'tuesday') {
            if (schoolweek.wednesday.length == 0) {
              if (schoolweek.thursday.length == 0) {
                if (schoolweek.friday.length == 0) {
                  if (schoolweek.monday.length == 0) {
                    today = "noting";
                  } else {
                    today = schoolweek.monday;
                  }
                } else {
                  today = schoolweek.friday;
                }
              } else {
                today = schoolweek.thursday;
              }
            } else {
              today = schoolweek.wednesday;
            }
          } else if (NowToday == 'wednesday') {
            if (schoolweek.thursday.length == 0) {
              if (schoolweek.friday.length == 0) {
                if (schoolweek.monday.length == 0) {
                  if (schoolweek.tuesday.length == 0) {
                    today = "noting";
                  } else {
                    today = schoolweek.tuesday;
                  }
                } else {
                  today = schoolweek.monday;
                }
              } else {
                today = schoolweek.friday;
              }
            } else {
              today = schoolweek.thursday;
            }
          } else if (NowToday == 'thursday') {
            if (schoolweek.friday.length == 0) {
              if (schoolweek.monday.length == 0) {
                if (schoolweek.tuesday.length == 0) {
                  if (schoolweek.wednesday.length == 0) {
                    today = "noting";
                  } else {
                    today = schoolweek.wednesday;
                  }
                } else {
                  today = schoolweek.tuesday;
                }
              } else {
                today = schoolweek.monday;
              }
            } else {
              today = schoolweek.friday;
            }
          } else {
            if (schoolweek.monday.length == 0) {
              if (schoolweek.tuesday.length == 0) {
                if (schoolweek.wednesday.length == 0) {
                  if (schoolweek.thursday.length == 0) {
                    today = "noting";
                  } else {
                    today = schoolweek.thursday;
                  }
                } else {
                  today = schoolweek.wednesday;
                }
              } else {
                today = schoolweek.tuesday;
              }
            } else {
              today = schoolweek.monday;
            }
          }
          $(".con .last .subject").html("Geen les!");
          $(".con .last .subject").addClass("nosubject");
          setcurrentsubjects(2,today[0].subject, today[0].place, today[0].time.TimeRaw, today[0].teacher);
          if (0 < today.length) {
            setcurrentsubjects(3,today[1].subject, today[1].place, today[1].time.TimeRaw, today[1].teacher);
            $(".con .next .subject").removeClass("nosubject");
          } else {
            $(".con .next .subject").html("Geen les!");
            $(".con .next .subject").addClass("nosubject");
          }
          $(".con .now .subject").removeClass("nosubject");
          if (today == "noting") {
            $(".con .now .subject").html("Geen les!");
            $(".con .now .subject").addClass("nosubject");
            $(".con .next .subject").html("Geen les!");
            $(".con .next .subject").addClass("nosubject");
          }
        } else {
          setcurrentsubjects(2,day[subjectlistitem].subject,day[subjectlistitem].place,day[subjectlistitem].time.TimeRaw,day[subjectlistitem].teacher);
          $(".con .now .subject").removeClass("nosubject");
        }

    }

  } else {
    $(".con .last .subject").html("Geen les!");
    $(".con .last .subject").addClass("nosubject");
    $(".con .now .subject").html("Geen les!");
    $(".con .now .subject").addClass("nosubject");
    $(".con .next .subject").html("Geen les!");
    $(".con .next .subject").addClass("nosubject");
  }


  for (var i = 0; i < schoolweek.monday.length; i++) {
    pushtotimetable("monday",schoolweek.monday[i]);
  }
  for (var i = 0; i < schoolweek.tuesday.length; i++) {
    pushtotimetable("tuesday",schoolweek.tuesday[i]);
  }
  for (var i = 0; i < schoolweek.wednesday.length; i++) {
    pushtotimetable("wednesday",schoolweek.wednesday[i]);
  }
  for (var i = 0; i < schoolweek.thursday.length; i++) {
    pushtotimetable("thursday",schoolweek.thursday[i]);
  }
  for (var i = 0; i < schoolweek.friday.length; i++) {
    pushtotimetable("friday",schoolweek.friday[i]);
  }
};

function setcurrentsubjects(when,subject,place,time,teacher) {
  if (when == 1) {
    $(".con .last .subject").html("<p class=\"sub-title\">Vak: <b>" + subject.toUpperCase() + "</b> In: <b>" + place + "</b></p><p class=\"sub-des\">tijd: <b>" + time + "</b> Van: <b>" + teacher + "</b></p>");
  } else if (when == 2) {
    $(".con .now .subject").html("<p class=\"sub-title\">Vak: <b>" + subject.toUpperCase() + "</b> In: <b>" + place + "</b></p><p class=\"sub-des\">tijd: <b>" + time + "</b> Van: <b>" + teacher + "</b></p>");
  } else if (when == 3){
    $(".con .next .subject").html("<p class=\"sub-title\">Vak: <b>" + subject.toUpperCase() + "</b> In: <b>" + place + "</b></p><p class=\"sub-des\">tijd: <b>" + time + "</b> Van: <b>" + teacher + "</b></p>");
  }
}

function pushtotimetable(day, subject) {
  calcminuts = 100 / 60 * subject.time.MinutesStart;
  calcminutsend = onehoure / 60 * subject.time.MinutesEnd;
  subjectsize = calcminutsend + ((subject.time.HourseEnd - subject.time.HourseStart) * onehoure);
  $("." + day + " .h" + subject.time.HourseStart).html("<div style=\"top:" + calcminuts + "%; min-height:" + subjectsize + "px\" class='subject-item'><p class='a'>" + subject.subject + "</p><p class='b'>" + subject.place + "</p></div>");
}

var timetable = "";

gettimetable();
function gettimetable() {
  var proxylink = settings.TimeTableProxy;
  $.get(proxylink + timetableurl, function(data){
    timetable = data.replace(/(\r\n|\n|\r)/gm,"");
    rawhtmltojson();
  });
  function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); };
  function rawhtmltojson() {
    if (timetable.search(/<div class="Les"/i) != -1) {
      timetable = timetable.substr(timetable.search(/<div class="Les"/i), timetable.length);
      if (timetable.search(/<\/div>                <div class="Les"/i) != -1) {
        currentworking = timetable.substr(0, timetable.search(/<\/div>                <div class="Les"/i) + 6);
      } else {
        currentworking = timetable;
      }
      timetable = timetable.substr(currentworking.length, timetable.length);
      currentworking = currentworking.substr(currentworking.search(/eft:/i) + 4, currentworking.length);
      currentworkingday = currentworking.substr(0, currentworking.search(/">/i));
      currentworking = currentworking.substr(currentworking.search(/title="/i) + 7, currentworking.length);
      currentworkingsubject = currentworking.substr(0, currentworking.search(/">/i));
      currentworking = currentworking.substr(currentworking.search(/title="/i) + 7, currentworking.length);
      currentworkingtime = currentworking.substr(0, currentworking.search(/">/i));
      currentworking = currentworking.substr(currentworking.search(/title="/i) + 7, currentworking.length);
      currentworkingplace = currentworking.substr(0, currentworking.search(/">/i));
      currentworking = currentworking.substr(currentworking.search(/title="/i) + 7, currentworking.length);
      currentworkingteacher = currentworking.substr(0, currentworking.search(/">/i));
      if (isNumber(currentworkingplace.substr(0,1))) {
        currentworkingplace = "none";
      }
      if (currentworkingteacher == "" || false || 0 || NaN || null || undefined) {
        currentworkingteacher = "none";
      }
      CurrentWorkingTimeStartHours = currentworkingtime.substr(0,2);
      CurrentWorkingTimeStartMinutes = currentworkingtime.substr(3,2);
      CurrentWorkingTimeEndHourse = currentworkingtime.substr(6,2);
      CurrentWorkingTimeEndMinutes = currentworkingtime.substr(9,2);
      var currentworkingJSON = {
        subject: currentworkingsubject,
        time: {
          TimeRaw: currentworkingtime,
          HourseStart: Number(CurrentWorkingTimeStartHours),
          MinutesStart: Number(CurrentWorkingTimeStartMinutes),
          HourseEnd: Number(CurrentWorkingTimeEndHourse),
          MinutesEnd: Number(CurrentWorkingTimeEndMinutes)
        },
        place: currentworkingplace,
        teacher: currentworkingteacher
      };
      if (currentworkingday == " 160px;") {
        schoolweekcache.monday.push(currentworkingJSON);
      } else if (currentworkingday == " 318px;") {
        schoolweekcache.tuesday.push(currentworkingJSON);
      } else if (currentworkingday == " 476px;") {
        schoolweekcache.wednesday.push(currentworkingJSON);
      } else if (currentworkingday == " 634px;") {
        schoolweekcache.thursday.push(currentworkingJSON);
      } else if (currentworkingday == " 792px;") {
        schoolweekcache.friday.push(currentworkingJSON);
      } else {

      }
      rawhtmltojson();
    } else {
      UpdateTimetable("new");
    }
  }
}

var boxopensize = 650;
if ($(window).width() < 650) {
  if ($(window).height > 650) {
    boxopensize = $(window).height();
  }
};
var fabopensize = Math.sqrt(boxopensize*boxopensize+650*650);
var calctimetable = boxopensize - 66;
var onehoure = calctimetable / 9;

$(".open-complete-timetable").click(function() {
  $(".day-houre").css("height",onehoure + "px")
  $(".open-complete-timetable-holder").velocity({
    height: boxopensize + "px",
  }, {
      duration: 250,
      easing: "easeInOut"
  });
  setTimeout(function(){
    var fabopensizecalc = fabopensize / 100 * 3.5;
    $(".open-complete-timetable-holder").css("overflow","hidden");
    $(".open-complete-timetable-holder .timetable-full").css("display","block");
    $(".open-complete-timetable").css("cursor","pointer");
    $(".open-complete-timetable").velocity({
      color: '#FFB74D'
    }, {
        duration: 50,
        easing: "easeInOut"
    });
    $(".open-complete-timetable").velocity({
      scale: fabopensizecalc + "," + fabopensizecalc,
      'background-color': '#fff',
      color: '#fff'
    }, {
        duration: 250,
        easing: "easeInOut"
    });
    $(".open-complete-timetable-holder .timetable-full").velocity({
      opacity: 1,
      top: "0px",
    }, {
        duration: 200,
        easing: "easeInOut",
        delay: 80
    });
  }, 100);
});

$(".site-title h1").text(settings.SiteTitle);

var homelinks = "";
for (var i = 0; i < settings.links.length; i++) {
  homelinks = homelinks + "<a href=\"" + settings.links[i].link + "\" class='link-item'><div class='icon-holder'><div class='icon' style=\"background-image: url('icons/" + settings.links[i].icon + "')\"></div></div><div class='texts'><div class='title-item'>" + settings.links[i].name + "</div><div class='description-item'>" + settings.links[i].description + "</div></div></div></a>";
}
$(".links .link-items").html(homelinks);

var moresubjectscurrent = "week";

if (moresubjectscurrent = "week") {
  openweek();
} else {
  openday();
}

function openday() {
  $(".menu-timetable .week").css("border-bottom","3px solid #ccc");
  $(".menu-timetable .today").css("border-bottom","3px solid #2979FF");
  $(".content .timeline").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  if (NowToday == "tuesday") {
    $(".content .monday").velocity({width: '0%', opacity: 0, opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .tuesday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .wednesday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .thursday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .friday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
  } else if (NowToday == "wednesday") {
    $(".content .monday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .tuesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .wednesday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .thursday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .friday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
  } else if (NowToday == "thursday") {
    $(".content .monday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .tuesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .wednesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .thursday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .friday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  } else if (NowToday == "friday") {
    $(".content .monday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .tuesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .wednesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .thursday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .friday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  } else {
    $(".content .monday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .tuesday").velocity({width: '33.33%', opacity: 1}, {duration: 250,easing: "easeInOut"});
    $(".content .wednesday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .thursday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
    $(".content .friday").velocity({width: '0%', opacity: 0}, {duration: 250,easing: "easeInOut"});
  }
}
function openweek() {
  $(".menu-timetable .week").css("border-bottom","3px solid #2979FF");
  $(".menu-timetable .today").css("border-bottom","3px solid #ccc");
  $(".content .timeline").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  $(".content .monday").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  $(".content .tuesday").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  $(".content .wednesday").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  $(".content .thursday").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
  $(".content .friday").velocity({width: '16.66%', opacity: 1}, {duration: 250,easing: "easeInOut"});
}
$(".menu-timetable .today").click(function() {
  if (moresubjectscurrent == "week") {
    openday();
    moresubjectscurrent = "day";
  }
});

$(".menu-timetable .week").click(function() {
  if (moresubjectscurrent == "day") {
    openweek();
    moresubjectscurrent = "week";
  }
});

$(".menu .open-menu").click(function() {
 openmenu();
});
$(".slideout-menu .con .menu-close-holder .menu-close").click(function() {
 closemenu();
});
$(".slideout-menu .overlay").click(function() {
 closemenu();
});

$(".menu-about").click(function () {
  openinfo();
});

$(".appinfo .con i").click(function () {
  closeinfo();
});

$(".app-settings-close").click(function () {
  closesettings();
});

$(".slideout-menu .con .menu-settings").click(function () {
  opensettings();
});

$(".menu .settings").click(function () {
  opensettings();
});

$(".save-timetable-url").click(function () {
  SaveTimetableUrl();
});

function SaveTimetableUrl() {
  var dataurll = $(".timetable-url").val();
  Lockr.set('ICT-ALFA-settings-url-' + window.location.hostname, dataurll);
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
  if (timetableurl == dataurll) {
    gettimetable();
    opentoast(".url-saved");
  } else {
    opentoast(".url-saved-fail");
  }
}

function openmenu() {
  $(".slideout-menu").css("display","block");
  $(".slideout-menu").velocity({
    opacity: 1
}, {
  duration: 250,
  easing: "easeInOut"});
}

function closemenu() {
  $(".slideout-menu").velocity({
    opacity: 0
  }, {
    duration: 250,
    easing: "easeInOut"});
  setTimeout(function(){
    $(".slideout-menu").css("display","none");
  }, 250);
}

function opensettings() {
  closemenu();
  $(".settings-menu").css("display","block");
  $(".settings-menu").velocity({
    opacity: 1
  }, {
    duration: 250,
    easing: "easeInOut"});
  }


function closesettings() {
  $(".settings-menu").velocity({
    opacity: 0
  }, {
    duration: 250,
    easing: "easeInOut"});
  setTimeout(function(){
    $(".settings-menu").css("display","none");
  }, 250);
}

function openinfo() {
  $(".appinfo").css("display","block");
  $(".appinfo").velocity({
    opacity: 1
  }, {
    duration: 250,
    easing: "easeInOut"});
  }


function closeinfo() {
  closemenu();
  $(".appinfo").velocity({
    opacity: 0
  }, {
    duration: 250,
    easing: "easeInOut"});
  setTimeout(function(){
    $(".appinfo").css("display","none");
  }, 250);
}


function opentoast(toast) {
  $(".toasts " + toast).velocity({
    bottom: "0px"
  }, {
    duration: 250,
    easing: "easeInOut"});
  setTimeout(function(){
    $(".toasts " + toast).velocity({
      bottom: "-80px"
    }, {
      duration: 250,
      easing: "easeInOut"});
  }, 5000);
}

// function opensettings() {
//   opentoast(".nosettings");
// }

});
