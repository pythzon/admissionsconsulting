(function() {
    "use strict";
  
    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }
  
    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
  
    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight
  
      if (!header.classList.contains('header-scrolled')) {
        offset -= 16
      }
  
      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }
  
    /**
     * Header fixed top on scroll
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      let headerOffset = selectHeader.offsetTop
      let nextElement = selectHeader.nextElementSibling
      const headerFixed = () => {
        if ((headerOffset - window.scrollY) <= 0) {
          selectHeader.classList.add('fixed-top')
          nextElement.classList.add('scrolled-offset')
        } 
      }
      window.addEventListener('load', headerFixed)
      onscroll(document, headerFixed)
    }
  
    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
  
    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });
  
    /**
     * Preloader
     */
    let preloader = select('#preloader');
    // if ((preloader) && (window.location.pathname.split("/")[0] != 'success')) {
    if (preloader) {
      if (window.location.pathname.split("/")[0] != 'success') {
          
            window.addEventListener('load', () => {
            preloader.remove()
          });
        }
    }
  
  
    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    });
  })()

  function changeBackground() {
    document.body.classList.toggle("dark-mode");
    
    if (document.body.classList.contains("dark-mode")) {mode = 'dark'} else {mode = 'light'}
    
    if (mode == 'dark') {
      document.getElementById('headerDisplayMode').setAttribute('name', 'sunny-outline');
    } else {
      document.getElementById('headerDisplayMode').setAttribute('name', 'moon-outline');
    }
  }
  
  function checkMode(userid, display) {
    var status = document.body.classList.contains("dark-mode");
    if ((status == true && display == 1 ) || (status == false && display == 0)) {return}
    changeMode(userid, display);
  }
  
  function changeMode(userid=null, val=null) {
    var status = document.body.classList.contains("dark-mode");
    
    if (val != null) {
      if (val) {
        if (status == false) {
          changeBackground();
        }
        }
      else {
        if (status == true) {
          changeBackground();
        }
      }
    } else {
      if (status) {val = 0;}
      else {val = 1;}
      changeBackground()
    }
  
    if (userid != null) {
      var elems = document.getElementsByClassName('displayValue')
      for (var i=0; i<elems.length; i++) {
        elems[i].value = val;
      }
    }
    
    if (val == 1) {result="dark"; opp=0} else {result="light";opp=1}
  
  
    if (userid != null) {
      document.getElementById('displayFormBtn').click();
    }
    
    var testimonial = document.getElementById("testimonial");
    if (userid == null && window.location.pathname == '/') {
      if (result == "dark")  {
        if (testimonial.getAttribute('src').includes("light")) {
            testimonial.setAttribute('src', testimonial.getAttribute('src').replace("light", "dark"));
        }
      } else if(testimonial.getAttribute('src').includes("dark")) {
                testimonial.setAttribute('src', testimonial.getAttribute('src').replace("dark", "light"));
            }
      }
      
      if (signup != null) {
        if (result == 'dark') {
            var url = "/signup?darkMode=1";
        } else {
            var url = "/signup";
        }
      
        document.getElementById('signup-btn').setAttribute('onclick', `window.location.href='${url}'`);
        
        var signup = document.getElementById("signup");
        if (signup != null) {
            document.getElementById('signup').href = url;
            
        }
        
    }
  }
  
  function sendForm(form, userid=null) {
      event.preventDefault();
      // document.getElementById("preloader").style.visibility = "hidden"
      const formData = new FormData(document.getElementById(form));
      // $.getJSON("https://api.ipify.org?format=json", function(data) {
      //    var ip = data.ip
      //    $("#gfg").html(ip);
      // })
      // console.log("ABOUT TO SEND")
      if (form == "displayForm" || form == "getDisplayForm") {
        var path = `/profile`;
      } else if (form == "ipForm") {
        var path = `/createIpSession`;
      } 
      else {
        var path = `${window.location.href}`;
      }
      console.log(path);
      fetch(path, {
          method: 'POST',
          body: 'formData'
  
      }).then(response => response.json()).then (json => {  
        document.getElementById("updateDisplay").style.display = 'flex';
        if (form == "getPreferences") {
          checkMode(userid, json.display);
          if (json.emails == 1) {val="yes"} else {val="no"}
            document.getElementById("emails"+val).click()
          
          if (json.info == 1) {val="yes"} else {val="no"}
            document.getElementById("info"+val).click()
          
          if (window.location.pathname == '/profile') {
            if (json.subscribed == 0) {
              var url = "https://buy.stripe.com/aEU9CJgfn1cs63K3cc?prefilled_email="+json.email;
              var btn = document.getElementById("btn-subscribe");
              btn.innerHTML = "Subscribe";
              btn.setAttribute("onclick", `window.location.href = "${url}";`);}
        } 
        
  
        } else if (form == "updatePreferences" && document.getElementById("preferencesUpdate") != null) {
          document.getElementById("preferencesUpdate").innerHTML = "Your preferences were updated successfully!"
  
        } else if (form == "accountInfo") {
          document.getElementById("infoUpdate").innerHTML = "Your account information was updated successfully!"
  
        } else if (form == "displayForm"){
          // if (document.getElementById("checkbox") != null && document.body.classList.contains("dark-mode")) {
          //   changeVal()
          // }
        }
        else {checkMode(userid, json.display);}
  
       });
  }

  function toggle(id) {
    var elem = document.getElementById(id);
    
    if (elem.classList.contains("show")) {
      var buttons = elem.querySelectorAll('button')
      buttons.forEach(function(button) {
        button.style.transition = 'none';
      });
  
      if (document.getElementById("linkCopied") != null) {
        if (document.getElementById("linkCopied").style.visibility = "") {
          document.getElementById("linkCopied").style.visibility = "hidden";
        }
      }
    }
    
    document.getElementById(id).classList.toggle("show");
  }
  