//Made by Dread Pirate Roberts
//Copyright 2021

//Variables
var searchbox = document.getElementById("search")
var searchbtn = document.getElementById("searchbtn")

//Events
searchbox.addEventListener("keypress",evt => {
	if(evt.keyCode == 13){
		evt.preventDefault();
		window.location.assign("/results?s=" + encodeURIComponent(searchbox.value));
	}
});

searchbtn.addEventListener("click",() => {
	window.location.assign("/results?s=" + encodeURIComponent(searchbox.value));
});