let getVideos = function () {
    let videos = [...document.getElementsByTagName("video-preview")];
    return videos;
}

let addHoverListeners = function (elements) {
    elements.map(element =>
        element.addEventListener("mouseover", videoPlay)
    );
}

let addThumbnails = function (elements) {
    elements.map(element =>
        renderThumbnail(element));
}

let renderThumbnail = function (videoPreview) {
    let frame = videoPreview.getAttribute("thumbnail-frame");

    let sec = frame != null ? frame : 0;

    let src = videoPreview.getAttribute("src");
    if (src != null) {

        getVideoImage(src, sec).then((img) => {
            videoPreview.appendChild(img);
            img.addEventListener('mouseover', function () {
                thumbnailHover(videoPreview);
            })
        }).catch(err => {
            console.error(err);
        })
    }
}

let thumbnailHover = function (videoPreview) {
    let images = [];

    let src = videoPreview.getAttribute("src");
    if (src != null) {
        let psudoFrames = [1,20,30,40,50]; 
        
        let thumbnail = videoPreview.getElementsByTagName('img')[0];
        thumbnail.setAttribute('frame',0);
        
        psudoFrames.forEach(frame => {
            images.push(getVideoImage(src,frame));
        });

        Promise.all(images).then(function(v){
            v.forEach((frame,index) => {
                frame.setAttribute('frame',index+1);
                frame.hidden = true;
                videoPreview.appendChild(frame);
            });
        })
    }

    thumbnailAnimate(videoPreview);

}

let thumbnailAnimate = function (videoPreview) {
    let i = 0;
    setInterval(function () {
        (videoPreview.getElementsByTagName('img'))[i].hidden = true;
        i++;
        i = i%6;
        (videoPreview.getElementsByTagName('img'))[i].hidden = false;   
    }, 2000);
}


// converts frame to image, taken from:
// http://cwestblog.com/2017/05/03/javascript-snippet-get-video-frame-as-an-image/ 
let getVideoImage = function (path, secs) {
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

window.onload = function () {
    let videos = getVideos();
    addThumbnails(videos);
}

