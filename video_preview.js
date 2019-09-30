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

let addHoverListeners = function(elements){
    elements.map(element => 
        element.addEventListener("mouseover",videoPlay)
    );
}

let videoPlay = function(){
    const video = this;
    console.log(video);
    video.play().then(function(){

    }).catch(function(err){
        console.log(err.name);
    })
}



window.onload = function(){
    addHoverListeners(getVideos());
}

