let getVideos = function () {
    let videos = [...document.getElementsByTagName("video-preview")];
    return videos;
}

let addThumbnails = function (elements) {
    elements.forEach(element => {
        (new ThumbnailHover(element)).Init();
    });
}

class ThumbnailHover {
    constructor(videoPreview) {
        this.videoPreview = videoPreview;
        this.counter = 0;
        this.styles = "width: inherit; height: inherit;";
    }

    Init() {
        let frame = this.videoPreview.getAttribute("thumbnail-frame");

        let sec = frame ? frame : 0;

        let src = this.videoPreview.getAttribute("src");
        if (!src) { throw (new Error("Video source not defined")) }
        this.renderThumbnail(src, sec)
    }

    renderThumbnail(src, sec) {
        this.getVideoImage(src, sec).then((img) => {
            this.setStyleAttribute(img, this.styles);
            this.videoPreview.appendChild(img);
            this.addHoverListener(this.videoPreview);
        }).catch(err => {
            console.error(err);
        })
    }

    setStyleAttribute(element, styles) {
        element.setAttribute('style', styles);
    }


    videoFrameVals(videoPreview) {
        let frames = videoPreview.getAttribute('frames');
        frames = frames ? frames.split(',') : [0];
        return frames;
    }

    addHoverListener(videoPreview) {
        const self = this;

        const _thumbnailHover = () => {
            this.thumbnailHover(videoPreview);
            videoPreview.removeEventListener('mouseover', _thumbnailHover);
        }

        const _thumbnailTouch = () => {
            requestAnimationFrame(self.timer.bind(self));
            videoPreview.removeEventListener('touchstart', _thumbnailTouch);
        }

        if (!this.mobileCheck()) {
            videoPreview.addEventListener('mouseover', _thumbnailHover);
        } else {
            videoPreview.addEventListener('touchstart', _thumbnailTouch);
        }
    }

    timer() {
        if (this.counter < 100) {
            this.timerID = requestAnimationFrame(this.timer.bind(this));
            this.counter++;
        } else {
            this.thumbnailHover(this.videoPreview);
        }
    }

    removeHoverListener(videoPreview, animationId) {
        const _thumbnailLeave = () => {
            this.thumbnailLeave(videoPreview, animationId);
            videoPreview.removeEventListener('mouseleave', _thumbnailLeave);
            this.addHoverListener(videoPreview);
        }

        const _thumbnailTouchEnd = () => {
            cancelAnimationFrame(this.timerID);
            this.counter = 0;

            this.thumbnailLeave(videoPreview, animationId);
            videoPreview.removeEventListener("touchend", _thumbnailTouchEnd);
            this.addHoverListener(videoPreview);
        }

        if (!this.mobileCheck()) {
            videoPreview.addEventListener("mouseleave", _thumbnailLeave);
        } else {
            videoPreview.addEventListener("touchend",_thumbnailTouchEnd);
        }
    }

    thumbnailHover(videoPreview) {
        let mouseLeft = false;
        const self = this;
        let _thumbnailLeave = function () {
            self.thumbnailLeave(videoPreview);
            videoPreview.removeEventListener('mouseleave', _thumbnailLeave);
            self.addHoverListener(videoPreview);
            mouseLeft = true;
        }

        let _thumbnailLeaveMob = function () {
            cancelAnimationFrame(self.timerID);
            self.counter = 0;

            self.thumbnailLeave(videoPreview, animationId);
            videoPreview.removeEventListener("touchend", _thumbnailLeave);
            self.addHoverListener(videoPreview);
        }

        /* adds early event listener if user moves cursor off thumbnail
           before promises are all resolved
        */

        if (!this.mobileCheck()) {
            videoPreview.addEventListener("mouseleave", _thumbnailLeave)
        } else {
            videoPreview.addEventListener("touchend", _thumbnailLeaveMob)
        }




        let images = [];

        let src = videoPreview.getAttribute("src");
        if (src != null) {
            let psudoFrames = this.videoFrameVals(videoPreview);

            let thumbnail = videoPreview.getElementsByTagName('img')[0];
            this.setStyleAttribute(thumbnail, this.styles);
            thumbnail.setAttribute('frame', 0);

            psudoFrames.forEach(frame => {
                images.push(this.getVideoImage(src, frame));
            });



            Promise.all(images).then(function (v) {
                v.forEach((frame, index) => {
                    frame.setAttribute('frame', index + 1);
                    self.setStyleAttribute(frame, self.styles);
                    frame.hidden = true;
                    videoPreview.appendChild(frame);
                });

                if (!mouseLeft) {
                    let animationId = self.thumbnailAnimate(videoPreview, psudoFrames.length);
                    videoPreview.removeEventListener('mouseleave', _thumbnailLeave);
                    videoPreview.removeEventListener('touchend', _thumbnailLeaveMob);
                    self.removeHoverListener(videoPreview, animationId);
                }

            })
        }
    }

    thumbnailLeave(videoPreview, animation) {
        clearInterval(animation);
        let frames = [...videoPreview.getElementsByTagName('img')];

        for (let i = 1; i < frames.length; i++) {
            frames[i].hidden = true;
        }

        frames[0].hidden = false;

        for (let i = 1; i < frames.length; i++) {
            frames[i].remove();
        }
    }

    thumbnailAnimate(videoPreview, numFrames) {
        let animationSpeed = videoPreview.getAttribute('animation-speed');
        animationSpeed = animationSpeed != null ? animationSpeed : 1000;

        let i = 0;
        let animation = setInterval(function () {
            (videoPreview.getElementsByTagName('img'))[i].hidden = true;
            i++;
            i = i % (numFrames + 1);
            (videoPreview.getElementsByTagName('img'))[i].hidden = false;
        }, animationSpeed);
        return animation;
    }

    // converts frame to image, taken from:
    // http://cwestblog.com/2017/05/03/javascript-snippet-get-video-frame-as-an-image/ 
    getVideoImage(path, secs) {
        return new Promise(function (resolve, reject) {
            var me = this, video = document.createElement('video');
            video.onloadedmetadata = function () {
                if ('function' === typeof secs) {
                    secs = secs(this.duration);
                }
                this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
            };
            video.onseeked = function (e) {
                var canvas = document.createElement('canvas');
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                var img = new Image();
                img.src = canvas.toDataURL();

                resolve(img, this.currentTime, e);
            };
            video.onerror = function (e) {
                reject(me, undefined, undefined, e);
            };
            video.src = path;
        })
    }

    mobileCheck() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
}


window.onload = function () {
    let videos = getVideos();
    addThumbnails(videos);
}



