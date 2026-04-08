const sessionUrlInjection = document.getElementById("sessionURL-injection");
const sessionUrlLabel = document.getElementById("sessionURL-label");
const startCapture = document.getElementById("startCapture");
const anonymize = document.getElementById("anonymize");
const identify = document.getElementById("identify");
const shutdownCapture = document.getElementById("shutdownCapture");
const trackEvent = document.getElementById("trackEvent");

let orgId = document.getElementById("displayOrgId");
let fsSnippetVersion = document.getElementById("fsSnippetVersion");
let fsLoaded = document.getElementById("fsLoaded");
let captureStarted = document.getElementById("captureStarted");
let currentOrgId = window._fs_org ? window._fs_org : "NO ORG ID!";

// Move privacy rules code into its own module, run it on click of a button in the browser as a starting point
const RULES_KEY = "_fs_css_rules";
const CONSOLE_ONLY_KEY = "_fs_css_console_only";

let rulesInput = window[RULES_KEY];
let consoleOnly = window[CONSOLE_ONLY_KEY] ?? false;

function getFullstoryDetails() {
  console.log('...getting FS details');
  if (window._fs_org) {
    orgId.innerHTML = window._fs_org;
  } else {
    orgId.innerHTML = "No org ID.";
  }

  if (window.FS._v) {
    fsSnippetVersion.innerHTML = window.FS._v;
  } else {
    fsSnippetVersion.innerHTML = "No snippet version.";
  }

  if (window.FS._fs_loaded) {
    fsLoaded.innerHTML = window.FS._fs_loaded;
  } else {
    fsLoaded.innerHTML = "The FS object is not initialized on this page.";
  }
}

// Give FS time to initialize before grabbing details
setTimeout(getFullstoryDetails, 500);

sessionUrlLabel.innerHTML = "No session URL, not capturing.";
captureStarted.innerText = "Capture has shut down.";

FS("observe", {
  type: "start",
  callback: () => {
    captureStarted.innerText = "Capture has started up."
    const sessionURL = FS("getSession", { format: "url" });
    if (sessionURL) {
      console.log(sessionURL);
      sessionUrlLabel.innerHTML = "";
      sessionUrlInjection.href = sessionURL;
      sessionUrlInjection.innerHTML = "Current session URL";
      fetchFSrules();
    } else {
      console.log("No session URL, not capturing");
      sessionUrlLabel.innerHTML = "No session URL, not capturing.";
    }
  },
});

FS("observe", {
  type: "shutdown",
  callback: () => {
    captureStarted.innerText = "Capture has shut down.";
    const sessionURL = FS("getSession");
    if (sessionURL) {
      console.log(sessionURL);
      sessionUrlLabel.innerHTML = "";
      sessionUrlInjection.href = sessionURL;
      sessionUrlInjection.innerHTML = "Session URL";
    } else {
      console.log("Called FS('shutdown'), not capturing.");
      sessionUrlLabel.innerHTML =
        "Called FS('shutdown'). No session URL, not capturing.";
      sessionUrlInjection.innerHTML = "";
    }
    // clear browser cookies
    // deleteCookie('fs_uid');
  },
});

// Start Fullstory Data Capture
startCapture.addEventListener("click", () => {
  FS("start");
});

// Anonymize, release current user identity and start new anonymous session
anonymize.addEventListener("click", () => {
  FS("setIdentity", { anonymous: true });
});

// Shutdown Fullstory Data Capture
shutdownCapture.addEventListener("click", () => {
  FS("shutdown");
});

// Identify current user
identify.addEventListener("click", () => {
  let uid = generateUid(15);
  console.log(`Current uid is: ${uid}`);
  FS("setIdentity", {
    uid: uid,
    properties: {
      identifiedAt: Date.now(),
    },
  });
});

// Helper code, generate random alphanumeric value of a given length
function generateUid(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Fire a test custom event
trackEvent.addEventListener('click', () => {
  FS('trackEvent', {
    name: 'Test Custom Event',
    properties: {
      firedAt: Date.now()
    }
  });
  console.log('Test Custom Event fired.');
});

// Fullstory ragehook
window.addEventListener("fullstory/rageclick", (e) => {
  console.log(`eventStartTimeStamp: ${e.detail.eventStartTimeStamp}`);
  console.log(`eventEndTimeStamp: ${e.detail.eventEndTimeStamp}`);
  console.log(
    `eventReplayUrlAtCurrentTime: ${e.detail.eventReplayUrlAtCurrentTime}`,
  );
  console.log(`eventReplayUrlAtStart: ${e.detail.eventReplayUrlAtStart}`);
  console.log(`targetElement: ${e.target}`);
  window.alert("Need some help there bud?");
});

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

// function checkPrivacyRules() {
//   console.log('CHECK PRIVACY RULES IS RUNNING.');
//   if (!rulesInput) {
//     console.warn(
//       `No CSS rules provided. Set window["${RULES_KEY}"] before running the script.`
//     );
//     return;
//   }

//   let rules = Array.isArray(rulesInput)
//     ? rulesInput
//     : rulesInput.ElementBlocks?.map((rule) => ({
//         ...rule,
//         selector: rule.Selector,
//       })) || [];

//   if (!rules.length) {
//     console.warn("CSS rules list is empty.");
//     return;
//   }

//   const getType = (rule) => {
//     const { type } = rule;

//     switch (type) {
//       case 1:
//         return "Exclude";
//       case 2:
//         return "Mask";
//       case 3:
//         return "Unmask";
//       case 0:
//         return "Unset";
//       default:
//         return "Unknown";
//     }
//   };

//   const getColor = (type) => {
//     switch (type) {
//       case 1:
//         return "red";
//       case 2:
//         return "yellow";
//       case 3:
//         return "green";
//       case 0:
//         return "blue";
//       default:
//         return "pink";
//     }
//   };

//   const getHint = (rule) => {
//     const { name, selector, type } = rule;
//     return type !== undefined
//       ? `${getType(type)} ${selector || ""}`.trim()
//       : `${name || ""} ${selector || ""}`.trim();
//   };

//   const validateSelectors = (rules) => {
//     const valid = [];
//     const invalid = [];

//     rules.forEach((rule) => {
//       try {
//         document.querySelectorAll(rule.selector);
//         valid.push(rule);
//       } catch (e) {
//         invalid.push(rule);
//       }
//     });

//     if (invalid.length) {
//       console.error(`${invalid.length} invalid selector(s):`);
//       invalid.forEach(({ selector }) =>
//         console.error(`Invalid: "${selector}"`)
//       );
//     }

//     return valid;
//   };

//   const validRules = validateSelectors(rules);
//   const activeMatches = {};

//   console.debug(`Processing ${validRules.length} valid CSS rule(s).`);

//   for (const rule of validRules) {
//     const elements = document.querySelectorAll(rule.selector);
//     if (!elements.length) continue;

//     activeMatches[rule.selector] = elements;
//     console.debug(
//       `Selector "${rule.selector}" matched ${elements.length} element(s).`
//     );

//     if (!consoleOnly) {
//       elements.forEach((el) => {
//         el.style.outline = `3px solid ${getColor(rule.type)}`;
//         el.title = getHint(rule);
//       });
//     }
//   }

//   if (Object.keys(activeMatches).length > 0) {
//     console.log("Matched CSS selectors in use:");
//     Object.entries(activeMatches).forEach(([selector, elements]) => {
//       console.log(`Selector: ${selector}`);
//       elements.forEach((el) => console.log(el));
//     });
//   } else {
//     console.info("No matching CSS selectors found on this page.");
//   }
// }

// async function fetchFSrules() {
//   try {
//     console.log(`DO WE HAVE AN ORG ID: ${currentOrgId}`);
//     let response = await fetch(
//       `https://edge.fullstory.com/s/settings/${currentOrgId}/v1/web`
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     let data = await response.json();
//     rulesInput = data;
//     console.log(
//       `Privacy rules fetched and assigned to window._fs_css_rules: ${rulesInput}`
//     );
//     checkPrivacyRules();
//   } catch (error) {
//     console.log(`Error fetching data!!!: ${error}`);
//   }
// }

// Calculator code

// const calculator = document.querySelector(".calculator_container");
// let answerDisplay = document.querySelector(".answer-display");
// const clearButton = document.querySelector(".clear");
// const backspaceButton = document.querySelector(".backspace");
// const divideButton = document.querySelector(".divide");
// const sevenButton = document.querySelector(".seven");
// const eightButton = document.querySelector(".eight");
// const nineButton = document.querySelector(".nine");
// const multButton = document.querySelector(".mult");
// const fourButton = document.querySelector(".four");
// const fiveButton = document.querySelector(".five");
// const sixButton = document.querySelector(".six");
// const subtrButton = document.querySelector(".subtr");
// const oneButton = document.querySelector(".one");
// const twoButton = document.querySelector(".two");
// const threeButton = document.querySelector(".three");
// const additButton = document.querySelector(".addit");
// const zilButton = document.querySelector(".zil");
// const equalsButton = document.querySelector(".equals");

// let firstInputNumber = "";
// let secondInputNumber = "";
// let operator = null;

// calculator.addEventListener("click", (e) => {
//   if (operator === null) {
//     if (
//       !(
//         e.target === divideButton ||
//         e.target === multButton ||
//         e.target === subtrButton ||
//         e.target === additButton ||
//         e.target === equalsButton ||
//         e.target === clearButton
//       )
//     ) {
//       firstInputNumber += e.target.innerText;
//       firstInputNumber = parseInt(firstInputNumber);
//       answerDisplay.innerText = firstInputNumber;
//     }
//   } else {
//     if (
//       !(
//         e.target === divideButton ||
//         e.target === multButton ||
//         e.target === subtrButton ||
//         e.target === additButton ||
//         e.target === equalsButton ||
//         e.target === clearButton
//       )
//     ) {
//       secondInputNumber += e.target.innerText;
//       secondInputNumber = parseInt(secondInputNumber);
//       answerDisplay.innerText = secondInputNumber;
//     }
//   }

//   if (e.target === divideButton) {
//     operator = "divide";
//     answerDisplay.innerText = "/";
//   }

//   if (e.target === multButton) {
//     operator = "multiply";
//     answerDisplay.innerText = "*";
//   }

//   if (e.target === subtrButton) {
//     operator = "subtract";
//     answerDisplay.innerText = "-";
//   }

//   if (e.target === additButton) {
//     operator = "add";
//     answerDisplay.innerText = "+";
//   }

//   if (e.target === answerDisplay) {
//     e.preventDefault;
//   }

//   if (e.target === clearButton) {
//     answerDisplay.innerText = "0";
//     firstInputNumber = "";
//     secondInputNumber = "";
//     operator = null;
//   }

//   if (e.target === equalsButton) {
//     console.log("entering equals button territory!");
//     switch (operator) {
//       case "divide":
//         answerDisplay.innerText = divideNumbers(
//           firstInputNumber,
//           secondInputNumber,
//         );
//         break;
//       case "multiply":
//         answerDisplay.innerText = multiplyNumbers(
//           firstInputNumber,
//           secondInputNumber,
//         );
//         break;
//       case "subtract":
//         answerDisplay.innerText = subtrNumbers(
//           firstInputNumber,
//           secondInputNumber,
//         );
//         break;
//       case "add":
//         answerDisplay.innerText = addNumbers(
//           firstInputNumber,
//           secondInputNumber,
//         );
//         break;
//     }
//   }
// });

// function addNumbers(a, b) {
//   return a + b;
// }

// function subtrNumbers(a, b) {
//   return a - b;
// }

// function multiplyNumbers(a, b) {
//   return a * b;
// }

// function divideNumbers(a, b) {
//   return a / b;
// }
