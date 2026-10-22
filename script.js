const INQUIRY_EMAIL = "seattle@junbishop.com";


// Primary buttons jump to the quote form and put the cursor in the first field.
document.querySelectorAll('a[href="#inquire"]').forEach(function (a) {
  a.addEventListener("click", function () {
    setTimeout(function () {
      var first = document.querySelector("#inquiry input[name=name]");
      if (first) first.focus({ preventScroll: true });
    }, 400);
  });
});

// Clicking a card's button pre-selects that experience in the form.
document.querySelectorAll("[data-interest]").forEach(function (a) {
  a.addEventListener("click", function () {
    document.getElementById("interest").value = a.dataset.interest;
  });
});

// "Explore Workshops" plays the Instagram video in a pop-up (loads only when clicked).
// Without JavaScript or dialog support, the button simply opens Instagram.
var vDialog = document.getElementById("videoDialog");
var vWrap = document.getElementById("videoWrap");
if (vDialog && typeof vDialog.showModal === "function") {
  document.querySelectorAll("[data-video]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = a.dataset.video;
      f.title = "Matcha 101 Workshop video";
      f.allowFullscreen = true;
      f.setAttribute("allow", "encrypted-media; picture-in-picture");
      vWrap.appendChild(f);
      vDialog.showModal();
    });
  });
  var closeVideo = function () { vDialog.close(); };
  document.getElementById("videoClose").addEventListener("click", closeVideo);
  vDialog.addEventListener("click", function (e) { if (e.target === vDialog) closeVideo(); });
  vDialog.addEventListener("close", function () { vWrap.innerHTML = ""; });
}

// Company is only asked for corporate events.
var typeSel = document.getElementById("eventType");
var companyWrap = document.getElementById("companyWrap");
var companyInput = document.getElementById("company");
typeSel.addEventListener("change", function () {
  var corporate = typeSel.value === "Corporate event";
  companyWrap.hidden = !corporate;
  companyInput.required = corporate;
  if (!corporate) companyInput.value = "";
});

// No server yet: opens the visitor's email app with the inquiry filled in.
document.getElementById("inquiry").addEventListener("submit", function (e) {
  e.preventDefault();
  var f = e.target, status = document.getElementById("status");
  if (!f.checkValidity()) {
    status.textContent = "Please fill in the required fields (marked *).";
    return;
  }
  var d = new FormData(f);
  var fields = [
    ["Name", "name"], ["Email", "email"], ["Type of event", "eventType"], ["Company", "company"],
    ["Event date", "date"], ["Event location", "location"], ["Experience", "interest"],
    ["Guests", "guests"], ["Notes", "details"]
  ];
  var body = fields.map(function (f) { return f[0] + ": " + (d.get(f[1]) || ""); }).join("\n");
  window.location.href = "mailto:" + INQUIRY_EMAIL +
    "?subject=" + encodeURIComponent("Event inquiry: " + d.get("eventType") + " (" + (d.get("company") || d.get("name")) + ")") +
    "&body=" + encodeURIComponent(body);
  status.textContent = "Thank you! Your email app should open with your inquiry ready to send.";
});

// People who prefer less motion get a paused video they can play themselves.
var hv = document.getElementById("heroVideo");
if (hv && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hv.removeAttribute("autoplay"); hv.pause(); hv.controls = true;
}
