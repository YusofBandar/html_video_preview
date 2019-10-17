# html_video_preview

Html_video_preview is JavaScript library to preview videos bypassing browsers auto-play block. Html_video_preview is light weight and has 0 dependencies.



## Usage   

Simply include lib `<script src="video_preview.js"></script>` .

Use the `<video-preview> </video-preview>` element with necessary attributes.

### Attributes 

**`src`**

​	The URL of the video to preview.

`thumbnail-frame`

 	The video frame used a thumbnail 

`frames`

​	The video frames to preview on hover delimited by hover (e.g. 10,11,12,13). Warning
​	previewing too many frames causes performance issues.

`frame-speed`

   The speed, in milliseconds, to play through frames.



## Example

`<video-preview thumbnail-frame=50 frames="10,70,60,80,100" frame-speed="200" src="./black_sabbath_live.mp4">`