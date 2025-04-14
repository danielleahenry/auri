const menuButton = document.querySelector(".button.menu");
const navMenu = document.getElementById("navMenu");
const screenOverlay = document.getElementById("screenOverlay");
const scrollUpBtn = document.getElementById("scrollUp");
const scrollDownBtn = document.getElementById("scrollDown");
const centerButton = document.querySelector(".center-button");

const navButtons = Array.from(
  document.querySelectorAll("#navMenu .nav-button")
);

const themeToggle = document.getElementById("themeToggle");
const ipodElement = document.querySelector(".ipod");
const colorCircles = document.querySelectorAll(".color-circle");

let currentIndex = 0;
let navIndex = 0;
let inNavMode = false;
let colorIndex = 0; // for navigating color circles

const scrollAmount = 60;

// === getters ===
function getCurrentAlbums() {
  const activeScreen = document.querySelector(".app-screen.show");
  return Array.from(activeScreen.querySelectorAll(".album"));
}

function getCurrentSettings() {
  const activeScreen = document.querySelector(".app-screen.show");
  return Array.from(activeScreen.querySelectorAll(".setting-item"));
}

function getCurrentScrollContainer() {
  const activeScreen = document.querySelector(".app-screen.show");
  return (
    activeScreen.querySelector(".playlist-section") ||
    activeScreen.querySelector(".library-section") ||
    activeScreen.querySelector(".settings-container")
  );
}

//navi toggle
menuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("show");

  if (isOpen) {
    navMenu.classList.remove("show");
    screenOverlay.classList.remove("show");
    document.querySelector(".screen").classList.remove("no-scroll");
    inNavMode = false;
  } else {
    navMenu.classList.add("show");
    screenOverlay.classList.add("show");
    document.querySelector(".screen").classList.add("no-scroll");
    inNavMode = true;

    const currentScreen = document.querySelector(".app-screen.show");
    let currentId = "home";
    if (currentScreen) {
      const match = currentScreen.id.match(/^(.+)-screen$/);
      if (match) currentId = match[1];
    }

    navIndex = navButtons.findIndex((btn) =>
      btn.getAttribute("onclick")?.includes(currentId)
    );
    if (navIndex === -1) navIndex = 0;
    highlightNav(navIndex);
  }
});

//overlay click closes menu
screenOverlay.addEventListener("click", () => {
  navMenu.classList.remove("show");
  screenOverlay.classList.remove("show");
  document.querySelector(".screen").classList.remove("no-scroll");
  inNavMode = false;
});

//show screen
function showScreen(screenId) {
  document.querySelectorAll(".app-screen").forEach((screen) => {
    screen.classList.remove("show");
  });

  const selected = document.getElementById(`${screenId}-screen`);
  if (selected) selected.classList.add("show");

  document.querySelector(".screen").classList.remove("no-scroll");
  navMenu.classList.remove("show");
  screenOverlay.classList.remove("show");
  inNavMode = false;

  currentIndex = 0;
  highlightCurrentItem();
}

//highlighting
function highlightAlbum(index) {
  const albums = getCurrentAlbums();
  albums.forEach((album, i) => {
    album.classList.toggle("selected", i === index);
  });
  if (albums[index]) {
    albums[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function highlightSettings(index) {
  const settings = getCurrentSettings();
  settings.forEach((setting, i) => {
    setting.classList.toggle("selected", i === index);
  });
  if (settings[index]) {
    settings[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function highlightCurrentItem() {
  const isSettings = document
    .querySelector("#settings-screen")
    .classList.contains("show");
  if (isSettings) {
    highlightSettings(currentIndex);
  } else {
    highlightAlbum(currentIndex);
  }
}

function highlightNav(index) {
  navButtons.forEach((btn, i) => {
    btn.classList.toggle("selected", i === index);
  });
  navButtons[index].scrollIntoView({ behavior: "smooth", block: "nearest" });
}

//scroll down
scrollDownBtn.addEventListener("click", () => {
  if (inNavMode) {
    if (navIndex < navButtons.length - 1) {
      navIndex++;
      highlightNav(navIndex);
    }
  } else {
    const isSettings = document
      .querySelector("#settings-screen")
      .classList.contains("show");
    const items = isSettings ? getCurrentSettings() : getCurrentAlbums();
    const container = getCurrentScrollContainer();

    if (isSettings) {
      const currentSetting = items[currentIndex]?.dataset.setting;

      if (
        currentSetting === "color" &&
        items[currentIndex].classList.contains("selected")
      ) {
        if (colorIndex < colorCircles.length - 1) {
          colorCircles[colorIndex].classList.remove("selected");
          colorIndex++;
          colorCircles[colorIndex].classList.add("selected");
        }
      } else {
        if (currentIndex < items.length - 1) {
          currentIndex++;
          highlightCurrentItem();
          colorIndex = 0; // reset when moving between settings
        } else if (container) {
          container.scrollBy({ top: scrollAmount, behavior: "smooth" });
        }
      }
    } else {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        highlightCurrentItem();
      } else if (container) {
        container.scrollBy({ top: scrollAmount, behavior: "smooth" });
      }
    }
  }
});

//scroll up
scrollUpBtn.addEventListener("click", () => {
  if (inNavMode) {
    if (navIndex > 0) {
      navIndex--;
      highlightNav(navIndex);
    }
  } else {
    const isSettings = document
      .querySelector("#settings-screen")
      .classList.contains("show");
    const items = isSettings ? getCurrentSettings() : getCurrentAlbums();
    const container = getCurrentScrollContainer();

    if (isSettings) {
      const currentSetting = items[currentIndex]?.dataset.setting;

      if (
        currentSetting === "color" &&
        items[currentIndex].classList.contains("selected")
      ) {
        if (colorIndex > 0) {
          colorCircles[colorIndex].classList.remove("selected");
          colorIndex--;
          colorCircles[colorIndex].classList.add("selected");
        } else {
          // Move up to previous setting when at first color circle
          if (currentIndex > 0) {
            items[currentIndex].classList.remove("selected");
            currentIndex--;
            highlightCurrentItem();
            colorIndex = 0;
          }
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          highlightCurrentItem();
          colorIndex = 0;
        } else if (container) {
          container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
        }
      }
    } else {
      if (currentIndex > 0) {
        currentIndex--;
        highlightCurrentItem();
      } else if (container) {
        container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
      }
    }
  }
});

//center button select
centerButton.addEventListener("click", () => {
  if (inNavMode) {
    const selectedBtn = navButtons[navIndex];
    flashHighlight(selectedBtn);
    selectedBtn.click();
  } else {
    const isSettings = document
      .querySelector("#settings-screen")
      .classList.contains("show");
    const items = isSettings ? getCurrentSettings() : getCurrentAlbums();
    const selectedItem = items[currentIndex];
    flashHighlight(selectedItem);

    if (isSettings) {
      const settingType = selectedItem.dataset.setting;
      if (settingType === "theme") {
        themeToggle.checked = !themeToggle.checked;
        themeToggle.dispatchEvent(new Event("change"));
      } else if (settingType === "color") {
        const selectedColor = colorCircles[colorIndex].dataset.color;
        ipodElement.style.backgroundColor = selectedColor;
      }
    } else {
      //album section
    }
  }
});

//flash
function flashHighlight(element) {
  if (!element) return;
  element.classList.add("clicked");
  setTimeout(() => {
    element.classList.remove("clicked");
  }, 300);
}

//init on load
window.addEventListener("DOMContentLoaded", () => {
  showScreen("home");
  document.documentElement.setAttribute("data-theme", "dark");
  colorCircles[0]?.classList.add("selected");
});

//theme
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
});

colorCircles.forEach((circle) => {
  const color = circle.dataset.color;
  circle.style.backgroundColor = color;
});

const micPopup = document.getElementById("micPopup");
let micHoldTimer = null;

const micHoldThreshold = 750; // .75 second

console.log("Binding mic listeners...");

centerButton.addEventListener("mousedown", handlePressStart);
centerButton.addEventListener("mouseup", handlePressEnd);
centerButton.addEventListener("mouseleave", handlePressEnd);

centerButton.addEventListener("touchstart", handlePressStart);
centerButton.addEventListener("touchend", handlePressEnd);
centerButton.addEventListener("touchcancel", handlePressEnd);

//speech recog
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let capturedText = "";

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    capturedText = transcript;
    console.log("You said:", transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };
} else {
  console.warn("Speech Recognition not supported in this browser.");
}

//voice to backend
async function sendVoiceQuery(transcribedText) {
  console.log("sendVoiceQuery started with:", transcribedText);

  try {
    const res = await fetch("https://auri-zvxo.onrender.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: transcribedText })
    });

    console.log("🌐 Received response:", res);

    const data = await res.json();
    console.log("Parsed response JSON:", data);

    if (res.ok) {
      console.log("Response is OK — Updating UI...");
      updateNowPlaying(data);
      playPreview(data.previewUrl);
    } else {
      console.error("Backend returned error:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

function updateNowPlaying({ title, artist, coverUrl }) {
  document.getElementById("nowplaying-title").textContent = "Loading...";
  document.getElementById("nowplaying-artist").textContent = "";
  document.getElementById("nowplaying-cover").src = "https://via.placeholder.com/120";

  setTimeout(() => {
    document.getElementById("nowplaying-title").textContent = title;
    document.getElementById("nowplaying-artist").textContent = artist;
    document.getElementById("nowplaying-cover").src = coverUrl;
    showScreen("nowplaying");
  }, 300);
}


function playPreview(previewUrl) {
  const audio = new Audio(previewUrl);
  audio.play();
}

//mic press
function handlePressStart() {
  console.log("handlePressStart triggered");

  micHoldTimer = setTimeout(() => {
    console.log("Long press detected — starting recognition");
    micPopup.classList.add("show");
    screenOverlay.classList.add("show");

    if (recognition) {
      recognition.start();
      console.log("🗣️ recognition.start() called");
    } else {
      console.warn("SpeechRecognition not available");
    }
  }, micHoldThreshold);
}


function handlePressEnd() {
  console.log("handlePressEnd triggered");
  clearTimeout(micHoldTimer);
  micHoldTimer = null;

  if (micPopup.classList.contains("show")) {
    console.log("Mic popup was visible — ending session");

    micPopup.classList.remove("show");
    screenOverlay.classList.remove("show");

    if (recognition) {
      recognition.stop();
      console.log("recognition.stop() called");
    }

    console.log("Captured text:", capturedText);

    if (capturedText.trim()) {
      console.log("Sending captured text to backend...");
      sendVoiceQuery(capturedText.trim());
    } else {
      console.log("No captured text");
    }
  } else {
    console.log("Mic popup was not showing, nothing to stop.");
  }
}


