let texts = [
    `Why lose time on hating her. She knows that we're losing time`,
    `Why lose time on blaming her. You know she won't give a damn`,
    `I think you have bigger sorrows. You'd rather tell me about those`,
    `Don't you think there is no tomorrow for the bloody things that you chose`,
    `Love me, tell me. I don't think that you are doing fine`,
    `Hold me, sorry. It's not that easy to cross the line`,
    `FOR THE PEOPLE LOSING TIME`,
    `So brave to make fun of her, if you don't look into her eyes`,
    `So easy to bring others down, if you can't handle your own lies`,
    `I think you have bigger troubles, you'd rather tell me about those`,
    `Let's get rid of those bubbles, enough of that overdose`,
    `Love me, tell me. I don't think that you are doing fine`,
    `Hold me, sorry. It's not that easy to cross the line`,
    `FOR THE PEOPLE LOSING TIME`,
];

let posts;
let videoUrl = 'https://dl.dropboxusercontent.com/s/4k25oneo0ltz0r6/hilke.mov'
let videos = [];
let songUrl = 'https://dl.dropboxusercontent.com/s/zkhoe2ujn2h0uxa/greta.mp3';
let song;
let musicButton;

function preload() {
    song = loadSound(songUrl);
}

function setup() {
    // canvas = createCanvas(400, 300);
    texts.map(createPost);

    musicButton = createButton('Play music').parent('controls').mousePressed(toggleSong);
    createButton('Love').parent('controls').mousePressed(spreadLove);
}

function toggleSong(){
    if (song.isPlaying()) {
        song.stop();
        musicButton.html('Play Music');
      } else {
        song.play();
        musicButton.html('Pause Music');
      }
}

function spreadLove() {
    const logo = select('.logo');
    const header = select('.header');
    if (logo.html() === 'hatebook') {
        logo.html('lovebook');
        videos.map(video => video.loop());
    } else {
        logo.html('hatebook');
        videos.map(video => video.pause());
    }
    header.toggleClass('love');
}

function createPost(text, index) {
    const even = index % 2 === 0;
    const userName = even ? 'Hilke' : 'Gregory';
    const profilePic = even ? './images/hilke.png' : './images/gregory.png';
    
    const postWrapper = createDiv().parent('#posts').class('post');
    const userWrapper = createDiv().parent(postWrapper).class('user-wrapper');
    createImg(profilePic, userName).parent(userWrapper).class('profile-pic');
    createSpan(userName).parent(userWrapper).class('user-name');
    createDiv(text).parent(postWrapper).class('text');

    let videoWrapper = createDiv().parent(postWrapper).class('video');
    let myVideo = createVideo(videoUrl);
    myVideo.style("width", "480px")
    myVideo.style("height", "320px")
    myVideo.parent(videoWrapper);
    myVideo.volume(0);
    videos.push(myVideo);
    return postWrapper;
}

