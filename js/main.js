$(document).ready(function() {
    var supportsVideo = !!document.createElement('video').canPlayType;
    if (supportsVideo) {
        var videoContainer = document.getElementById('js-videoContainer');
        var video = document.getElementById('js-video');
        var videoControls = document.getElementById('js-video-controls');

        // Hide the default controls
        video.controls = false;

        // Display the user defined video controls
        videoControls.style.display = 'block';

        var playpause = document.getElementById('js-playpause');
        var mute = document.getElementById('js-mute');
        var progress = document.getElementById('js-progress');
        var progressBar = document.getElementById('js-progress-bar');
        var fullscreen = document.getElementById('js-fs');

        playpause.addEventListener('click', function(e) {
            if (video.paused || video.ended) {
                video.play();
                playpause.classList.add('a-btn--is-playing');
            } else {
                video.pause();
                playpause.classList.remove('a-btn--is-playing');
            }
        });

        video.addEventListener('click', function(e) {
            if (video.paused || video.ended) {
                video.play();
                playpause.classList.add('a-btn--is-playing');
            } else {
                video.pause();
                playpause.classList.remove('a-btn--is-playing');
            }
        });

        mute.addEventListener('click', function(e) {
            if (video.muted) {
                video.muted = false;
                mute.classList.remove('a-btn--is-muted');
            } else {
                video.muted = true;
                mute.classList.add('a-btn--is-muted');
            }
        });

        video.addEventListener('loadedmetadata', function() {
            progress.setAttribute('max', video.duration);
        });

        video.addEventListener('timeupdate', function() {
            progress.value = video.currentTime;
            progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        });

        video.addEventListener('timeupdate', function() {
            if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
            progress.value = video.currentTime;
            progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        });

        progress.addEventListener('click', function(e) {
            var pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
            video.currentTime = pos * video.duration;
        });

        var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

        if (!fullScreenEnabled) {
            fullscreen.style.display = 'none';
        }

        fullscreen.addEventListener('click', function(e) {
            handleFullscreen();
        });

        var handleFullscreen = function() {
            if (isFullScreen()) {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                setFullscreenData(false);
            } else {
                if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
                else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
                else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
                else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
                setFullscreenData(true);
            }
        }

        var isFullScreen = function() {
            return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
        }

        var setFullscreenData = function(state) {
            videoContainer.setAttribute('data-fullscreen', !!state);
        }

        document.addEventListener('fullscreenchange', function(e) {
            setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
        });
        document.addEventListener('webkitfullscreenchange', function() {
            setFullscreenData(!!document.webkitIsFullScreen);
        });
        document.addEventListener('mozfullscreenchange', function() {
            setFullscreenData(!!document.mozFullScreen);
        });
        document.addEventListener('msfullscreenchange', function() {
            setFullscreenData(!!document.msFullscreenElement);
        });
    }
});
