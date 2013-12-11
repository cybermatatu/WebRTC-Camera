;(function (window, document) {

	/* ECMAScript 5 FTW! */
    "use strict";

    var video                   = document.querySelector("#video");
    var canvas                  = document.querySelector("#canvas");
    var photo                   = document.querySelector("#photo");
    var pictureButton           = document.querySelector("#picturebutton");
    var videoPlayButton         = document.querySelector("#play-pause");
    var fullScreenButton        = document.querySelector("#fullscreen");
    var dimension               = document.querySelector("#dimension");
    var dlPhoto                 = document.querySelector("#dl-photo");
    var width                   = 640;
    var height                  = 480;
    var image = new Image();
    var dlImage = new Image();
    var constraints = {
            audio: false, /* Muted for now, since it sends some strange noise while true */
            video: {
                mandatory: {
                    minWidth: 640,
                    minHeight: 480
                }
            }
        };
    var doc = window.document;
    var docEl = doc.documentElement;
    var isFirefox = typeof InstallTrigger !== "undefined"; 

	/* Browser prefixes/vendors */
    navigator.getUserMedia  =   navigator.getUserMedia        ||    /* W3C */
                                navigator.webkitGetUserMedia  ||     /* -Webkit- browsers like Chrome, Safari & Opera 12.10*/
                                navigator.mozGetUserMedia     ||    /* Mozilla Firefox 22+. Added a hack for Firefox < 19 */
                                navigator.msGetUserMedia;           /* Internet Explorer 10+ */

    window.URL              =   window.URL                    ||    /* W3C */
                                window.webkitURL              ||    /* -Webkit- browsers like Chrome, Safari & Opera 12.10*/
                                window.mozURL                 ||    /* Mozilla Firefox 22+. */
                                window.msURL;                       /* Internet Explorer 10+ */

    var requestFullScreen   =   docEl.requestFullscreen       ||    /* W3C */
                                docEl.mozRequestFullScreen    ||    /* Mozilla Firefox 22+. */
                                docEl.webkitRequestFullScreen;      /* -Webkit- browsers like Chrome, Safari & Opera 12.10*/

    var cancelFullScreen    =   doc.exitFullscreen            ||    /* W3C */
                                doc.mozCancelFullScreen       ||    /* Mozilla Firefox 22+. */
                                doc.webkitExitFullscreen;           /* -Webkit- browsers like Chrome, Safari & Opera 12.10*/
          
    /**
     *
     * This function is used for logging.
     * Code taken from adapter.js by Google
     *
     */ 
    var trace = function (text) {
        if (text[text.length - 1] == '\n') {
            text = text.substring(0, text.length - 1);
        }
        console.log((performance.now() / 1000).toFixed(3) + ": " + text);
    };

    /* Create the video stream */
     var videoSuccess = function (localMediaStream) {
        /* Attach video stream to the console */
        doc.localMediaStream = localMediaStream; 

        if (typeof video.srcObject !== 'undefined') {
          video.srcObject = doc.localMediaStream;
          trace("Attaching media stream");
        }
        else if (typeof video.mozSrcObject !== 'undefined') {
          video.mozSrcObject = localMediaStream;   /* Firefox < 19 hack */
          trace("Attaching Firefox media stream");
        } 
        else if (typeof video.src !== 'undefined') {
          video.src = URL.createObjectURL(localMediaStream); /* Blob URL */
          trace("Blob URL object created.");
        } 
        else {
          trace('Error attaching localMediaStream to video.');
        }

        trace("Connection complete. Enjoy!");
    };

    /* Log all errors into the console */
    var bigFail = function (e) {
        trace("Oups, Houston, we have a problem: ", e);
    };

    /* Camera custom controls */
    videoPlayButton.addEventListener("click", function () {
        if (video.paused === true) {
            video.play();
            videoPlayButton.innerHTML = "Pause camera";
            trace("Video started");
        } 
        else {
            video.pause();
            videoPlayButton.innerHTML = "Start camera";
            trace("Video paused");
        }
    }, false);

	/**
     * Lunch fullscreen
     * Code from HTML5rocks
     */
	fullScreenButton.addEventListener("click", function () {
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement) { 
            requestFullScreen.call(docEl);
            fullScreenButton.innerHTML = "Exit fullscreen";
        }
        else {
            fullScreenButton.innerHTML = "Enter fullscreen";
            cancelFullScreen.call(doc);  
        }
    }, false);

	/* Get a single frame from the video and parse it into a canvas element. */
	pictureButton.addEventListener("click", function (e) {
        /* Check for full canvas support */
        if (canvas.getContext) {
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

            /**
             *
             * In browsers that do not support webp format, this will fallback to image/png.
             * Current support is Chrome 21+, Opera 12.1+, Android 4
             *
             */
            image = canvas.toDataURL("image/webp", 1);
            photo.className = document.querySelector("#effect").value;
            photo.setAttribute("src", image);

            /**
             *
             * Take a picture, store it into a <img /> and <a> tags so the user can view and download it.
             *
             */
            dlImage = canvas.toDataURL("image/png", 1);
            dlPhoto.setAttribute("href", dlImage);
            dlPhoto.setAttribute("download", "image.png");

            dlPhoto.innerHTML = "Download Image";

            e.stopPropagation();
            e.preventDefault();

            trace("Image captured");
        }
        else {
            alert("The canvas API is not supported in this browser.");
        }
	}, false);

	/**
     *
     * Get video dimensions and store them into a <p> tag
     * I delay this event with 3.7s, otherwise Firefox (and other browsers)? will load the event much later
     * after the <video> has loaded, and prompting 0px for width and height. Even the "true" attribute didn't help. :(
     *
     */
	doc.addEventListener("loadedmetadata", function () {
		window.setTimeout(function () {
			dimension.innerHTML = "Video dimension is: " + video.videoWidth + "x" + video.videoHeight + "px.";
		}, 3700);
	}, true);

	/**
	 *
	 * Get the value from the <select> menu and apply it as a class on the <video>
     * Firefox doesn't support CSS3 effects, therefore we don't need a <select> dropdown menu.
	 *
	 */
     
    if (isFirefox) {
        document.querySelector("#effect").style.display = 'none';
    }
    else {
        document.addEventListener("change", function () {
            video.className = document.querySelector("#effect").value;
        }, false);
    }

	/**
	 *
	 * This is where all the magic happens.
	 *
	 */
	if (navigator.getUserMedia) {
		  navigator.getUserMedia(constraints, videoSuccess, bigFail);
		  videoPlayButton.innerHTML = "Pause camera";
		  trace("Requesting access to local camera and microphone.");
	}
	else {
		alert("getUserMedia is not supported in this browser.");
	}
})(this, this.document);
