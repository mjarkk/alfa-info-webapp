$(document).ready(function(){
GetXedule = function (APIurl) {
  var APItimetable = "";
  $.get('https://allorigins.pw/get?method=raw&url=' + encodeURIComponent(APIurl) + '&callback=?', function(data){
    APItimetable = data.replace(/(\r\n|\n|\r)/gm,"");
    rawhtmltojson();
  });
  function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); };
  function rawhtmltojson() {
    if (APItimetable.search(/<div class="Les"/i) != -1) {
      APItimetable = APItimetable.substr(APItimetable.search(/<div class="Les"/i), APItimetable.length);
      if (APItimetable.search(/<\/div>                <div class="Les"/i) != -1) {
        APIcurrentworking = APItimetable.substr(0, APItimetable.search(/<\/div>                <div class="Les"/i) + 6);
      } else {
        APIcurrentworking = APItimetable;
      }
      APItimetable = APItimetable.substr(APIcurrentworking.length, APItimetable.length);
      APIcurrentworking = APIcurrentworking.substr(APIcurrentworking.search(/eft:/i) + 4, APIcurrentworking.length);
      APIcurrentworkingday = APIcurrentworking.substr(0, APIcurrentworking.search(/">/i));
      APIcurrentworking = APIcurrentworking.substr(APIcurrentworking.search(/title="/i) + 7, APIcurrentworking.length);
      APIcurrentworkingsubject = APIcurrentworking.substr(0, APIcurrentworking.search(/">/i));
      APIcurrentworking = APIcurrentworking.substr(APIcurrentworking.search(/title="/i) + 7, APIcurrentworking.length);
      APIcurrentworkingtime = APIcurrentworking.substr(0, APIcurrentworking.search(/">/i));
      APIcurrentworking = APIcurrentworking.substr(APIcurrentworking.search(/title="/i) + 7, APIcurrentworking.length);
      APIcurrentworkingplace = APIcurrentworking.substr(0, APIcurrentworking.search(/">/i));
      APIcurrentworking = APIcurrentworking.substr(APIcurrentworking.search(/title="/i) + 7, APIcurrentworking.length);
      APIcurrentworkingteacher = APIcurrentworking.substr(0, APIcurrentworking.search(/">/i));
      if (isNumber(APIcurrentworkingplace.substr(0,1))) {
        APIcurrentworkingplace = "none";
      }
      if (APIcurrentworkingteacher == "" || false || 0 || NaN || null || undefined) {
        APIcurrentworkingteacher = "none";
      }
      APIcurrentworkingTimeStartHours = APIcurrentworkingtime.substr(0,2);
      APIcurrentworkingTimeStartMinutes = APIcurrentworkingtime.substr(3,2);
      APIcurrentworkingTimeEndHourse = APIcurrentworkingtime.substr(6,2);
      APIcurrentworkingTimeEndMinutes = APIcurrentworkingtime.substr(9,2);
      var APIcurrentworkingJSON = {
        subject: APIcurrentworkingsubject,
        time: {
          HourseStart: APIcurrentworkingTimeStartHours,
          MinutesStart: APIcurrentworkingTimeStartMinutes,
          HourseEnd: APIcurrentworkingTimeEndHourse,
          MinutesEnd: APIcurrentworkingTimeEndMinutes
        },
        place: APIcurrentworkingplace,
        teacher: APIcurrentworkingteacher
      };
      if (APIcurrentworkingday == " 160px;") {
        APIschoolweek.monday.push(APIcurrentworkingJSON);
      } else if (APIcurrentworkingday == " 318px;") {
        APIschoolweek.tuesday.push(APIcurrentworkingJSON);
      } else if (APIcurrentworkingday == " 476px;") {
        APIschoolweek.wednsday.push(APIcurrentworkingJSON);
      } else if (APIcurrentworkingday == " 634px;") {
        APIschoolweek.thursday.push(APIcurrentworkingJSON);
      } else if (APIcurrentworkingday == " 792px;") {
        APIschoolweek.friday.push(APIcurrentworkingJSON);
      } else {}
      rawhtmltojson();
    } else {

    }
  }
  var APIschoolweek = {
    monday: [],
    tuesday: [],
    wednsday: [],
    thursday: [],
    friday: []
  };
  return APIschoolweek;
}});
