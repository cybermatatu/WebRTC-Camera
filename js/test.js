var webrtc = {

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
   


   
};