let getVideos = function(){
    let videos = [... document.getElementsByTagName("video-preview")];  
    return videos;
}

let addHoverListeners = function(elements){
    elements.map(element => 
        element.addEventListener("mouseover",videoPlay)
    );
}

let addThumbnails = function(elements){
    elements.map(element =>
        renderThumbnail(element));
}


let renderThumbnail = function(videoPreview){
    let video = [... videoPreview.getElementsByTagName("video")];
    if(video.length < 1) return;
    
    video = video[0];
    let src = video.getAttribute("src");

    if(src != null){
        getVideoImage(src,10,function(img){
            if(img){
                videoPreview.appendChild(img);
            }
        })
    }
}





// converts frame to image, taken from:
// http://cwestblog.com/2017/05/03/javascript-snippet-get-video-frame-as-an-image/ 
let getVideoImage = function(path, secs, callback) {
    var me = this, video = document.createElement('video');
    video.onloadedmetadata = function() {
      if ('function' === typeof secs) {
        secs = secs(this.duration);
      }
      this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    };
    video.onseeked = function(e) {
      var canvas = document.createElement('canvas');
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var img = new Image();
      img.src = canvas.toDataURL();
      callback.call(me, img, this.currentTime, e);
    };
    video.onerror = function(e) {
      callback.call(me, undefined, undefined, e);
    };
    video.src = path;
  }



window.onload = function(){
    let videos = getVideos();
    addThumbnails(videos);
    
    
    
}

