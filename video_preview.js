let getVideos = function(){
    let videos = [... document.getElementsByTagName("video-preview")];  
    return videos;
}

let addHoverListeners = function(elements){
    elements.map(element => 
        element.addEventListener("mouseover",videoPlay)
    );
}

let videoPlay = function(){
    const videoPreview = this;
    
    let video = [... videoPreview.getElementsByTagName("video")];
    if(video.length < 1) return;
    
    video = video[0];

    video.play().catch(function(err){
        console.log(err.name);
    })
}



window.onload = function(){
    addHoverListeners(getVideos());
}

