const sessionUrlInjection = document.getElementById("sessionURL-injection");
const sessionUrlLabel = document.getElementById("sessionURL-label");
const startCapture = document.getElementById("startCapture");
const shutdownCapture = document.getElementById("shutdownCapture");
const orgId = document.getElementById("displayOrgId");

window._fs_org ? orgId.innerHTML = window._fs_org : orgId.innerHTML = 'No org ID.';
sessionUrlLabel.innerHTML = 'No session URL, not capturing.';

FS("observe", {
  type: "start",
  callback: () => {
    const sessionURL = FS("getSession", { format: "url" });
    if (sessionURL) {
      console.log(sessionURL);
      sessionUrlLabel.innerHTML = '';
      sessionUrlInjection.href = sessionURL;
      sessionUrlInjection.innerHTML = "Session URL";
    } else {
      console.log('Not capturing');
      sessionUrlLabel.innerHTML = 'No session URL, not capturing.'; 
    }
  },
});

FS("observe", {
  type: "shutdown",
  callback: () => {
    const sessionURL = FS("getSession");
    if (sessionURL) {
      console.log(sessionURL);
      sessionUrlLabel.innerHTML = "";
      sessionUrlInjection.href = sessionURL;
      sessionUrlInjection.innerHTML = "Session URL";
    } else {
      console.log("Not capturing.");
      sessionUrlLabel.innerHTML = "No session URL, not capturing.";
      sessionUrlInjection.innerHTML = "";
    }
    // clear browser cookies
    // deleteCookie('fs_uid');
  },
});

// Start Fullstory Data Capture
startCapture.addEventListener('click', () => {
  FS('start');
});

// Shutdown Fullstory Data Capture
shutdownCapture.addEventListener('click', () => {
  FS('shutdown');
})

// function deleteCookie(name, path = "/", domain = "") {
//   console.log('Cookie name: ' + name, 'Cookie path: ' + path, 'Cookie domain: ' + domain);
//   document.cookie =
//     name +
//     "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" +
//     path +
//     (domain ? "; domain=" + domain : "");
// }

// Pull Segment anonymousId off the browser
/*
function getSegmentAnonymousIds(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    console.log('cookie string: ', cookieString);

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();

        if (cookie.startsWith(name + '=')) {
            const ids = [];
            ids.push(cookie.substring(name.length + 1));
            return ids;
        }
    }
    return null;
}
let segmentAnonymousIds = getSegmentAnonymousIds('ajs_anonymous_id');
console.log(segmentAnonymousIds);
*/
