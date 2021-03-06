$(document).ready(function(){

  function hasWebP() {
    var rv = $.Deferred();
    var img = new Image();
    img.onload = function() { rv.resolve(); };
    img.onerror = function() { rv.reject(); };
    img.src = './icons/testimg.webp';
    return rv.promise();
  }

  hasWebP().then(function() {
    console.log("webp support");
  }, function() {
    console.log("no webp support");
  });

  var outputElement = document.getElementById('output');
  var btnSave = document.getElementById('btnSave');
  var deferredPrompt;


  if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

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

var boxopensize = 650;
if ($(window).width() < 650) {
  if ($(window).height > 650) {
    boxopensize = $(window).height();
  }
};
var fabopensize = Math.sqrt(boxopensize*boxopensize+650*650);
var calctimetable = boxopensize - 66;
var onehoure = calctimetable / 9;

UpdateTimetable("offline");

var timetableurl = settings.RoosterServiceLink;

if (Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname) == undefined) {
  Lockr.set('ICT-ALFA-settings-url-' + window.location.hostname, settings.RoosterServiceLink);
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
} else {
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
}

if (Lockr.get('ICT-ALFA-timetable-update-' + window.location.hostname) == undefined) {
  Lockr.set('ICT-ALFA-timetable-update-' + window.location.hostname, 1);
  timetableurl = timetableurl + "&updated=" + Lockr.get('ICT-ALFA-timetable-update-' + window.location.hostname);
} else {
  Lockr.set('ICT-ALFA-timetable-update-' + window.location.hostname, Lockr.get('ICT-ALFA-timetable-update-' + window.location.hostname) + 1);
  timetableurl = timetableurl + "&updated=" + Lockr.get('ICT-ALFA-timetable-update-' + window.location.hostname);
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
          if (1 < today.length) {
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

  if (settings.webapi == false || settings.webapi == undefined) {
    $.get(proxylink, {url: timetableurl}, function(data){
      timetable = data.replace(/(\r\n|\n|\r)/gm,"");
      if (timetable == "" || timetable == undefined) {
        console.log({timetable: false});
      } else {
        rawhtmltojson();
        console.log({timetable: true});
      }
    });
  } else {
    $.get(proxylink + "/rawhtml/", {url: timetableurl}, function(data){
      timetable = data.replace(/(\r\n|\n|\r)/gm,"");
      if (timetable == "" || timetable == undefined) {
        console.log({timetable: false});
      } else {
        rawhtmltojson();
        console.log({timetable: true});
      }
    });
  }
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

hasWebP().then(function() {
  var homelinks = "";
  for (var i = 0; i < settings.links.length; i++) {
    homelinks = homelinks + "<a href=\"" + settings.links[i].link + "\" class='link-item'><div class='icon-holder'><div class='icon' style=\"background-image: url('icons/" + settings.links[i].icon + ".webp')\"></div></div><div class='texts'><div class='title-item'>" + settings.links[i].name + "</div><div class='description-item'>" + settings.links[i].description + "</div></div></div></a>";
  }
  $(".links .link-items").html(homelinks);
  var HeightOpenMenu = $(".links.md-cart").height() + 2;
  $('.openlinks').css("height", HeightOpenMenu + "px");
  $('.openlinks').css("top", "-" + HeightOpenMenu + "px");
}, function() {
  var homelinks = "";
  for (var i = 0; i < settings.links.length; i++) {
    homelinks = homelinks + "<a href=\"" + settings.links[i].link + "\" class='link-item'><div class='icon-holder'><div class='icon' style=\"background-image: url('icons/" + settings.links[i].icon + ".png')\"></div></div><div class='texts'><div class='title-item'>" + settings.links[i].name + "</div><div class='description-item'>" + settings.links[i].description + "</div></div></div></a>";
  }
  $(".links .link-items").html(homelinks);
  var HeightOpenMenu = $(".links.md-cart").height() + 2;
  $('.openlinks').css("height", HeightOpenMenu + "px");
  $('.openlinks').css("top", "-" + HeightOpenMenu + "px");
});

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


var MoreLinks = "<div class=\"first item\">Meer:</div>"
if (settings.morelinks.length == 0) {
  MoreLinks = ""
}
for (var i = 0; i < settings.morelinks.length; i++) {
  MoreLinks = MoreLinks + "<div class=\"link item a" + i + "\" onclick=\"openmorelinks(" + i + ")\">" + settings.morelinks[i].tabname + "</div>";
}

$(".links .more-links").html(MoreLinks);

openmorelinks = function(data) {
  var getdata = Number(data);
  $(".openlinks .title").html("<p>" + settings.morelinks[getdata].tabname + "</p><i class=\"material-icons\" onclick=\"closemorelinks()\">close</i>");
  var morelinksHTML = "";
  for (var i = 0; i < settings.morelinks[getdata].links.length; i++) {
    var JSONdata = settings.morelinks[getdata].links[i];
    morelinksHTML = morelinksHTML + "<a class=\"link-item\" href=\"" + JSONdata.link + "\">" + "<h1>" + JSONdata.name + "</h1>" + "<p>" + JSONdata.description + "</p>" + "</a>";
    $(".openlinks .links").html(morelinksHTML);
  }
  $('.openlinks').velocity({
    right: "0px"
  }, {
    duration: 500,
    easing: "easeOutCirc"});
}

closemorelinks = function() {
  $('.openlinks').velocity({
    right: "-650px"
  }, {
    duration: 500,
    easing: "easeInQuint"});
}

var schoolJSONdata = {};

if (settings.webapi == false || settings.webapi == undefined) {
  console.log("seems like you don't have the latest update... download: https://github.com/mjarkk/alfa-info-webapp");
} else {
  $.getJSON(settings.TimeTableProxy + "/s", function(data){
    $(".con .save-timetable-url").wrap("<div class='savetimetableurlwrapper'></div>");
    setTimeout(function () {
      $(".savetimetableurlwrapper").append("<button type=\"button\" class=\"save-timetable-url-new\" onclick=\"backschoolselect(0)\">New: selecteer uit lijst</button>");
    }, 10);
    schoolJSONdata = data;
    var schoollist = "<div class=\"title\"><i class=\"material-icons\" onclick=\"backschoolselect('exit')\">arrow_back</i><p>School</p></div>";
    var NOschoollist = "";
    for (var i = 0; i < data.list.length; i++) {
      var listitem = i;
      if (data.list[i].status) {
        schoollist += "<div class=\"schoolitem\" onclick=\"openschoolitem(" + listitem + ")\">" + data.list[i].name + "</div>";
      } else {
        NOschoollist += "<div class=\"noschoolitem\"\">" + data.list[i].name + "</div>";
      }
    }
    $(".select-timetable .school").html(schoollist + NOschoollist);
  });
}

openschoolitem = function(withone) {
  var schoollist = "<div class=\"title\"><i class=\"material-icons\" onclick=\"backschoolselect(0)\">arrow_back</i><p>Locatie</p></div>";
  for (var i = 0; i < schoolJSONdata.list[withone].schools.length; i++) {
    schoollist += "<div class=\"schoolitem\" onclick=\"openschoolclasses('" + schoolJSONdata.list[withone].schools[i].api + "')\">" + schoolJSONdata.list[withone].schools[i].location + "</div>";
  }
  $(".select-timetable .location").html(schoollist);
  $('.select-timetable .it').velocity({
    right: "100vw"
  }, {
    duration: 500,
    easing: "easeInOutCubic"});
}

openschoolclasses = function(withone) {
  $('.select-timetable .it').velocity({
    right: "200vw"
  }, {
    duration: 500,
    easing: "easeInOutCubic"});
  $.getJSON(settings.TimeTableProxy + withone, function(data){
    var schoollist = "<div class=\"title\"><i class=\"material-icons\" onclick=\"backschoolselect(-100)\">arrow_back</i><p>Studiegroep</p></div>";
    var list = data.list.studentgroep;
    for (var i = 0; i < list.length; i++) {
      schoollist += "<div class=\"schoolitem\" onclick=\"savetimetable('" + list[i].url + "')\">" + list[i].name + "</div>";
    }
    $(".select-timetable .class").html(schoollist);
  });
}

savetimetable = function (url) {
  var dataurll = url;
  Lockr.set('ICT-ALFA-settings-url-' + window.location.hostname, dataurll);
  timetableurl = Lockr.get('ICT-ALFA-settings-url-' + window.location.hostname);
  if (timetableurl == dataurll) {
    gettimetable();
    opentoast(".url-saved");
    setTimeout(function () {
      location.reload();
    }, 600);
  } else {
    opentoast(".url-saved-fail");
  }
  backschoolselect("exit");
}

backschoolselect = function (amount) {
  if (amount == 0) {
    $('.select-timetable .it').velocity({
      right: "0vw"
    }, {
      duration: 500,
      easing: "easeInOutCubic"});
    $('.select-timetable').velocity({
      left: "0vw"
    }, {
      duration: 500,
      easing: "easeInOutCubic"});
  } else if (amount == -100) {
    $('.select-timetable .it').velocity({
      right: "100vw"
    }, {
      duration: 500,
      easing: "easeInOutCubic"});
  } else if (amount == 'exit') {
    $('.select-timetable .it').velocity({
      right: "0vw"
    }, {
      duration: 500,
      easing: "easeInOutCubic"});
    $('.select-timetable').velocity({
      left: "100vw"
    }, {
      duration: 500,
      easing: "easeInOutCubic"});
  }

}

});
