//Made by Dread Pirate Robers
//Copyright 2020

//Variables
var slug = window.location.pathname.split("/")[window.location.pathname.split("/").length-1];
var video = document.getElementById("movie");

//Functions
function get(url){
	let req = new XMLHttpRequest();
	req.open("GET",url,false);
	req.setRequestHeader("User-Agent","Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0");
	req.send(null);
	return req.responseText;
}

function loadvideo(){
	let txt = get("https://cors.club/https://lookmovie.io/movies/view/" + slug);
	let movieid = txt.split("id_movie: ")[1].split(",")[0];
	fetch("https://cors.club/https://lookmovie.io/api/v1/security/movie-access?id_movie=" + movieid + "&token=1&sk=&step=1")
		.then(res => {
			if(res.ok){
				return res.json();
			} else{
				throw new Error("Network response error, couldn't load video");
			}
		})
		.then(data => {
			let exp = data["data"]["expires"];
			let act = data["data"]["accessToken"];
			let m3u8data = JSON.parse(get("https://cors.club/https://lookmovie.io/manifests/movies/json/" + movieid + "/" + exp + "/" + act + "/master.m3u8"));
			if(Hls.isSupported()){
				let hls = new Hls();
				hls.loadSource("https://cors.club/" + m3u8data["720p"].replace("/720p/","/1080p/"));
				hls.attachMedia(video);
			} else if(video.canPlayType("application/vnd.apple.mpegurl")){
				video.src = m3u8data["720p"].replace("/720p/","/1080p/");
			}
			video.load();
			video.play();
		})
		.catch(err => console.error(err));
}

//Main
loadvideo();