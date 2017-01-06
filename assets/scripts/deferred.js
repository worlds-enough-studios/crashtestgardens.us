// segment.io
!(function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
analytics.load("bOeF2sv6m6eqUrWmLteTtKwxJDMvHIXg");
analytics.page()
}})();

if ((window.analytics) && window.tracking_events) {
  window.tracking_events.forEach(function (event) {
    window.analytics.track(event);
  });
}

// Exit-intent-popup: Based on https://github.com/beeker1121/exit-intent-popup
!(function() {
  window.bioEp = {
    // Private variables
    bgEl: {},
    popupEl: {},
    closeBtnEl: {},
    shown: false,
    overflowDefault: "visible",
    transformDefault: "",
    
    // Popup options
    width: 400,
    height: 220,
    delay: 10,
    showOnDelay: false,
    cookieExp: 30,
    onPopup: null,
    cookie_name: 'popup_shown',
    
    // Object for handling cookies, taken from QuirksMode
    // http://www.quirksmode.org/js/cookies.html
    cookieManager: {
      // Create a cookie
      create: function(name, value, days) {
        var expires = "";
        
        if(days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toGMTString();
        }
        
        document.cookie = name + "=" + value + expires + "; path=/";
      },
      
      // Get the value of a cookie
      get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        
        return null;
      },
      
      // Delete a cookie
      erase: function(name) {
        this.create(name, "", -1);
      }
    },
    
    // Handle the popup_shown cookie
    // If present and true, return true
    // If not present or false, create and return false
    checkCookie: function() {
      // Handle cookie reset
      if(this.cookieExp <= 0) {
        this.cookieManager.erase("popup_shown");
        return false;
      }

      // If cookie is set to true
      if(this.cookieManager.get("popup_shown") == "true")
        return true;

      return false;
    },


    // Add the popup to the page
    addPopup: function() {
      // Identify the popup elements
      this.bgEl = document.getElementById("popup-background");
      this.popupEl = document.getElementById("popup");
      this.closeBtnEl = document.getElementById("popup-close");
    },

    // Show the popup
    showPopup: function() {
      if(this.shown) return;

      this.bgEl.style.display = "block";
      this.popupEl.style.display = "block";

      // Handle scaling
      this.scalePopup();

      // Save body overflow value and hide scrollbars
      this.overflowDefault = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      this.shown = true;
      
      this.cookieManager.create("popup_shown", "true", this.cookieExp);
    },

    // Hide the popup
    hidePopup: function() {
      this.bgEl.style.display = "none";
      this.popupEl.style.display = "none";

      // Set body overflow back to default to show scrollbars
      document.body.style.overflow = this.overflowDefault;
    },

    // Handle scaling the popup
    scalePopup: function() {
      var margins = { width: 40, height: 40 };
      var popupSize = { width: bioEp.popupEl.offsetWidth, height: bioEp.popupEl.offsetHeight };
      var windowSize = { width: window.innerWidth, height: window.innerHeight };
      var newSize = { width: 0, height: 0 };
      var aspectRatio = popupSize.width / popupSize.height;

      // First go by width, if the popup is larger than the window, scale it
      if(popupSize.width > (windowSize.width - margins.width)) {
        newSize.width = windowSize.width - margins.width;
        newSize.height = newSize.width / aspectRatio;

        // If the height is still too big, scale again
        if(newSize.height > (windowSize.height - margins.height)) {
          newSize.height = windowSize.height - margins.height;
          newSize.width = newSize.height * aspectRatio;
        }
      }

      // If width is fine, check for height
      if(newSize.height === 0) {
        if(popupSize.height > (windowSize.height - margins.height)) {
          newSize.height = windowSize.height - margins.height;
          newSize.width = newSize.height * aspectRatio;
        }
      }

      // Set the scale amount
      var scaleTo = newSize.width / popupSize.width;

      // If the scale ratio is 0 or is going to enlarge (over 1) set it to 1
      if(scaleTo <= 0 || scaleTo > 1) scaleTo = 1;

      // Save current transform style
      if(this.transformDefault === "")
        this.transformDefault = window.getComputedStyle(this.popupEl, null).getPropertyValue("transform");

      // Apply the scale transformation
      this.popupEl.style.transform = this.transformDefault + " scale(" + scaleTo + ")";
    },

    // Event listener initialisation for all browsers
    addEvent: function (obj, event, callback) {
      if(obj.addEventListener)
        obj.addEventListener(event, callback, false);
      else if(obj.attachEvent)
        obj.attachEvent("on" + event, callback);
    },

    // Load event listeners for the popup
    loadEvents: function() {
      // Track mouseout event on document
      this.addEvent(document, "mouseout", function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;

        // Reliable, works on mouse exiting window and user switching active program
        if(!from)
          bioEp.showPopup();
      });

      this.addEvent(document, "keydown", function(e) {
        e = e ? e : window.event;
        var is_escape = false;
        if ('key' in e) {
          is_escape = e.key == "Escape";
        } else {
          is_escape = e.keyCode == 27;
        }
        if (is_escape) bioEp.hidePopup();
      })

      // Handle the popup close button
      this.addEvent(this.closeBtnEl, "click", function() {
        bioEp.hidePopup();
      });
      this.addEvent(this.bgEl, "click", function() {
        bioEp.hidePopup();
      });

      // Handle window resizing
      this.addEvent(window, "resize", function() {
        bioEp.scalePopup();
      });
    },

    // Ensure the DOM has loaded
    domReady: function(callback) {
      (document.readyState === "interactive" || document.readyState === "complete") ? callback() : this.addEvent(document, "DOMContentLoaded", callback);
    },

    // Initialize
    init: function() {
      // Once the DOM has fully loaded
      this.domReady(function() {
        // Handle the cookie
        if(bioEp.checkCookie()) return;

        // Only run if the popup exists on the page
        if (!document.getElementById("popup")) return;

        // Add the popup
        bioEp.addPopup();

        // Load events
        setTimeout(function() {
          bioEp.loadEvents();

          if(bioEp.showOnDelay)
            bioEp.showPopup();
        }, bioEp.delay * 1000);
      });
    }
  }
  bioEp.init();
})();