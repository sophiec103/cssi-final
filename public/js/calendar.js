    let googleUser;
    let calendarId;
    let calendarExists;
    let timezone;
      
      // Client ID and API key from the Developer Console
      // stored in separate secrets.js file - everyone needs their own file for code to work
      var CLIENT_ID = clientID;
      var API_KEY = apiKey;

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar";

      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');

      //const newCalButton = document.getElementById('newcalendarbutton');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
        console.log("libraries loaded");
      }


    
    // Use this to retain user state between html pages.
    const userCheck = (event) => {
            firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('Logged in as: ' + user.displayName);
                googleUser = user;
                //checkIfRegistered(user);
            } 
            else {
                // If not logged in, navigate back to login page.
                window.location = 'index.html'; 
            }
        });
    }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      async function initClient() {
            await firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('Logged in as: ' + user.displayName);
                googleUser = user;
                //checkIfRegistered(user);
            } 
            else {
                // If not logged in, navigate back to login page.
                window.location = 'index.html'; 
            }
            sleep(2000);
            checkForCalendar();
        });
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        }, function(error) {
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

    async function saveCalendar()
    {
        createCalendar();
        await getLastCalendar();
        sleep(15000);
        firebase.database().ref(`users/${googleUser.uid}`).update({
            calendar: calendarId,
        });

        updateCalendarDirections();

    }

    function updateCalendarDirections()
    {
        listCalendars();
        document.querySelector('#before-calendar').style.visibility = "hidden";
        afterCalOptions();
    }

    async function renderSiteCalendar()
    {
        const userData = firebase.database().ref(`users/${googleUser.uid}`);
        await userData.on('value', async (snapshot) => {
            const data = snapshot.val();
            console.log(data.calendar);
            calendarId = data.calendar;
            doDisplay()
            console.log(calendarId);
        });
    }

    function getSiteCalendarId()
    {
        const userData = firebase.database().ref(`users/${googleUser.uid}`);
        userData.on('value', async (snapshot) => {
            const data = snapshot.val();
            console.log(data.calendar);
            calendarId = data.calendar;
            doDisplay()
            console.log(calendarId);
        });
    }

    //lists all calendars
    function listCalendars()
    {
        let calendars = gapi.client.calendar.calendarList.list().then(function(response) {
          var calendars = response.result.items;

          if (calendars.length > 0) {
            for (i = 0; i < calendars.length; i++) {
              console.log("calendar" + i);
              var calendar = calendars[i];
              var summary = calendar.summary;
              var id = calendar.id;
              var timezone = calendar.timeZone;
              console.log(" summary: " + summary + " id: " + id + " timezone: " + timezone);
            }
          } else {
            console.log('No calendars found.');
          }
        });
    }

    //adds events to calendar whose id is in calendarId
    function addEvents()
    {
        var event = {
            'summary': 'test',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
                'dateTime': '2021-08-09T09:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': '2021-08-09T17:00:00-07:00',
                'timeZone': 'America/Los_Angeles'
            },
        };

        var request = gapi.client.calendar.events.insert({
            'calendarId': `${ calendarId }`,
            'resource': event
        });

       console.log("add events button works");
    }

    //gets events of calendar whose id is in calendarId
    function getCalendarEvents()
    {
        console.log(calendarId);
 gapi.client.calendar.events.list({
          'calendarId': `${calendarId}`,
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          console.log('id: ' + calendarId + ' Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              console.log(event.summary + ' (' + when + ')')
            }
          } else {
            console.log('No upcoming events found.');
          }
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //calls lastCalendarId() function
    async function getLastCalendar()
    {
        await lastCalendarId(); 
        sleep(15000);
        console.log("check id 3: " + calendarId);
        console.log("getLastCalendar() called")
    }

    function createCalendar()
    {
       let res = gapi.client.calendar.calendars.insert({
                resource: {
                    'summary': 'Site Calendar',
                    'timeZone': `${timezone}`,
                        }
                }).execute();

       console.log("createCalendar() called");
    }

    //puts id of last calendar created in calendarId
    async function lastCalendarId()
    {
        let counter = 0;
        let calendars = await gapi.client.calendar.calendarList.list().then(function(response){
          var calendars = response.result.items;

          if (calendars.length > 0) {
            while(counter < (calendars.length-1)) {
              counter++;
              console.log("count" + counter);
            }
            console.log(calendars.length);
            var calendar = calendars[counter];
            console.log("check id 1: " + calendar.id);
            calendarId = calendar.id;
          } else {
            console.log('No calendars found.');
            calendarId = 0;
          }
        console.log("check id 2: " + calendarId);

        });
    }

    //changes settings to make calendar public
    function makeCalendarPublic()
    {
        console.log("make public button works");

        let event = {
            'role': 'reader',
            'scope': {
                'type': 'default'
            }
        };

        let request = gapi.client.calendar.acl.insert({
            'calendarId': `${ calendarId }`,
            'resource': event
        }).execute();

    }

    async function getEmbedLink()
    {
        console.log("getting embed link");
        console.log(`<iframe src="https://calendar.google.com/calendar/embed?src=${calendarId}" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>`);
        console.log("id: " + calendarId);
        let html = `<iframe src="https://calendar.google.com/calendar/embed?src=${calendarId}" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>`;
        document.querySelector('#hold-calendar').innerHTML = html;
    }

    //if no calendar:
    //1. give user option to choose timezone and then create calendar
    //2. save calendar id to database - "saved!"
    //3. give user button to view calendar - calls afterCalOptions()
    function beforeCalOptions()
    {
        console.log("you've reached beforeCalOptions()")
        listCalendars();
        document.querySelector('#before-calendar').style.visibility = 'visible';

    }

    function getTimezone()
    {
        console.log("getting timezone");
        timezone = document.querySelector('#timezone-select').value;
        console.log("timezone: " + timezone);

        firebase.database().ref(`users/${googleUser.uid}`).update({
            timezone: `${timezone}`,
        });

        let html = `
        <h1 class="subtitle is-4 is-dark">Saved!</h1>
        <button class="button is-small is-dark" id="submit-button" onclick="saveCalendar()">Next Step</button>
        `;
        document.querySelector('#hold-directions').innerHTML = html;
    }

    async function afterCalOptions(){

        await renderSiteCalendar();
    }

    async function doDisplay(){
        await getEmbedLink();
        document.querySelector('#after-calendar').style.visibility = 'visible';
    }


    async function checkForCalendar()
    {
        console.log("checking for calendar rn");
        await firebase.database().ref(`users/${googleUser.uid}/calendar`).once("value", snapshot => {
            if (snapshot.exists()){
                console.log("exists!");
                const cal = snapshot.val();
                calendarExists = true;
            }
            else{
                console.log("does not exist");
                calendarExists = false;
            }
        });
        sleep(1500);
        
        if(calendarExists == true)
        {
            afterCalOptions();
        }
        else
        {
            beforeCalOptions();

        }
    }


      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {

        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }