let getVideos = function () {
    let videos = [...document.getElementsByTagName("video-preview")];
    return videos;
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
            addHoverListener(videoPreview);
        }).catch(err => {
            console.error(err);
        })
    }
}

let addHoverListener = function(videoPreview){
    videoPreview.addEventListener('mouseover', function _thumbnailHover() {
        thumbnailHover(videoPreview);
        videoPreview.removeEventListener('mouseover',_thumbnailHover);
    })
}

let removeHoverListener = function(videoPreview,animationId){
    videoPreview.addEventListener("mouseleave",function _thumbnailLeave(){
        thumbnailLeave(videoPreview,animationId);
        videoPreview.removeEventListener('mouseleave',_thumbnailLeave);
        addHoverListener(videoPreview);
    });
}

let thumbnailHover = function (videoPreview) {
    let images = [];

    let src = videoPreview.getAttribute("src");
    if (src != null) {
        let psudoFrames = [10,70,60,80,100]; 
        
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

            let animationId = thumbnailAnimate(videoPreview,psudoFrames.length);
            removeHoverListener(videoPreview,animationId);  
        })
    }
}

let thumbnailLeave = function(videoPreview,animation){
    clearInterval(animation);
    let frames = [...videoPreview.getElementsByTagName('img')];
    
    for(let i=1;i<frames.length;i++){
        frames[i].hidden = true;
    }

    frames[0].hidden = false;

    for(let i=1;i<frames.length;i++){
        frames[i].remove();
    }
    
    
}

let thumbnailAnimate = function (videoPreview,numFrames) {
    let i = 0;
    let animation = setInterval(function () {
        (videoPreview.getElementsByTagName('img'))[i].hidden = true;
        i++;
        i = i%(numFrames+1);
        (videoPreview.getElementsByTagName('img'))[i].hidden = false;   
    }, 1000);
    return animation;
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

