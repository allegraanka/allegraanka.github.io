const sessionUrlInjection = document.getElementById("sessionURL-injection");

FS("observe", {
  type: "start",
  callback: () => {
    const sessionURL = FS("getSession", { format: "url" });
    console.log(sessionURL);
    sessionUrlInjection.innerHTML = sessionURL;
  },
});

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
