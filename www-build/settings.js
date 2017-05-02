var settings = {
  // if site is NOT in the root site folder  you need to cange "dirtosite": "/", to your subdir
  //like this: "dirtosite": "/your-site/",
  "SiteDir": "/",
  "SiteTitle": "ICT-ALFA app",
  "webapi": true,
  "TimeTableProxy": "https://your.site.com:5055", 
  "RoosterServiceLink": "https://roosters.xedule.nl/Attendee/ScheduleCurrent/14488?Code=B-ITM3-2a&attId=1&OreId=34",
  "links": [
    {
      "name": "Moodle",
      "icon": "moodle",
      "description": "Digitale Leeromgeving voor ICT-opleidingen (Moodle Learning Management System)",
      "link": "http://www.ict-alfa.nl/ict-gron/login/index.php"
    },
    {
      "name": "Rooster service",
      "icon": "xedule",
      "description": "Rooster Service. Hierin kan je alle roosters van alle klassen, lokalen en leraren bekijken.",
      "link": "https://roosters.xedule.nl/Attendee/ScheduleCurrent/14488?Code=B-ITM3-2a&attId=1&OreId=34"
    },
    {
      "name": "Actie",
      "icon": "alfa-logo1",
      "description": "Actie (portal) van het Alfa College.",
      "link": "https://actie.alfa-college.nl/CookieAuth.dll?GetLogon?curl=Z2F&reason=0&formdir=2"
    },
    {
      "name": "School Webmail",
      "icon": "email-icon",
      "description": "Hier kan je mensen vinden om mee te daten",
      "link": "https://login.microsoftonline.com/"
    }
  ],
  "morelinks": [
    {
      "tabname": "Cijfer",
      "links": [
        {
          "name": "EduArte",
          "description": "Hier zijn alle school cijfers te vinden en je 60% aanwezighijt.",
          "link": "https://alfacollege-selfservice.educus.nl/app/login/Alfa-college?0"
        },
        {
          "name": "Alfa-online",
          "description": "Ik weet ook niet wat hier valt ze zien.",
          "link": "https://www.alfa-online.nl/ict-gron-05/"
        }
      ]
    },
    {
      "tabname": "ICT-Beheer",
      "links": [
        {
          "name": "OracleAcademy",
          "description": "Hier kan je oracles verslaan met ict krachten.",
          "link": "https://ilearning.oracle.com/ilearn/en/learner/jsp/login.jsp?site=OracleAcad"
        },
        {
          "name": "Microsoft Dreamspark",
          "description": "Hier kan je GRATIS stuff halen!",
          "link": "https://e5.onthehub.com/WebStore/ProductsByMajorVersionList.aspx?ws=02980f50-a58b-e011-969d-0030487d8897&vsro=8"
        }
      ]
    },
    {
      "tabname": "Net-Beheer",
      "links": [
        {
          "name": "CISCO Netacad",
          "description": "Hier staat al het lesmateriaal een toetsen van cisco.",
          "link": "https://www.netacad.com"
        },
        {
          "name": "Microsoft Dreamspark",
          "description": "Hier kan je GRATIS stuff halen!",
          "link": "https://e5.onthehub.com/WebStore/ProductsByMajorVersionList.aspx?ws=02980f50-a58b-e011-969d-0030487d8897&vsro=8"
        }
      ]
    },
    {
      "tabname": "APP-Ontwikkeling",
      "links": [
        {
          "name": "Codecademy.",
          "description": "Leer html, css, javascript, php, java, pyton en nog veel meer.",
          "link": "https://www.codecademy.com/"
        },
        {
          "name": "Codrops",
          "description": "Leuke web tutorials en ideeën",
          "link": "https://tympanus.net/codrops/"
        },
        {
          "name": "Google fonts",
          "description": "Font's voor je website en/of photoshop.",
          "link": "https://fonts.google.com/"
        },
        {
          "name": "Electron",
          "description": "Maak van je website een desktop app.",
          "link": "http://electron.atom.io/"
        }
      ]
    }
  ]
}
