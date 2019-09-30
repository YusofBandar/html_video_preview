let getVideos = function(){
    let videos = [];

    let videoEls = document.getElementsByTagName("video");  
    for(let i=0;i<videoEls.length;i++){
        if(videoEls[i].getAttribute('video-preview') != null){
            videos.push(videoEls[i]);
        }
    }

    return videos;
}

window.onload = function(){
    console.log(getVideos());
}

