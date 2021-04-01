let texts = [
    `Why lose time on hating her. She knows that we're losing time`,
    `Why lose time on blaming her. You know she won't give a damn`,
    `I think you have bigger problems. You'd better tell me about those`,
    `Don't you think there is no tomorrow for the bloody things that you chose`
];
// let myVideo;
let pic;
let posts;
let videos = [];

function setup() {
    canvas = createCanvas(400, 300);
    const doms = texts.map(post => {
        return createDiv(post).parent('#posts').class('post');
    });
    doms.map(dom => {
        let videoWrapper = createDiv().parent(dom).class('video');
        let myVideo = createVideo('images/hilke.mov');
        myVideo.style("width", "480px")
        myVideo.style("height", "320px")
        myVideo.parent(videoWrapper);
        // myVideo.play();
        myVideo.volume(0);
        // myVideo.loop();
        videos.push(myVideo);
    });
}

function mouseClicked() {
    const logo = select('.logo');
    const header = select('.header');
    if (logo.html() === 'hatebook') {
        logo.html('lovebook');
        videos.map( video => video.loop());
    } else {
        logo.html('hatebook');
        videos.map( video => video.pause());
    }
    header.toggleClass('love');
}


