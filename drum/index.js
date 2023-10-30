
var drum = document.querySelectorAll('.drum');
var drumNum = drum.length;

for (var i = 0; i < drumNum; i++)
{
	drum[i].addEventListener('click', function () {
		animation(this.innerHTML);
		playIt(this.innerHTML);
	});
}

addEventListener('keypress', function (event) {
	animation(event.key);
	playIt(event.key);
});


function playIt(key)
{
	switch (key) {
		case 'w':
			var audio = new Audio("sounds/tom-1.mp3");
			audio.play();
			break;
		case 'a':
			var audio = new Audio("sounds/tom-2.mp3");
			audio.play();
			break;
		case 's':
			var audio = new Audio("sounds/tom-3.mp3");
			audio.play();
			break;
		case 'd':
			var audio = new Audio("sounds/tom-4.mp3");
			audio.play();
			break;
		case 'j':
			var audio = new Audio("sounds/snare.mp3");
			audio.play();
			break;
		case 'k':
			var audio = new Audio("sounds/crash.mp3");
			audio.play();
			break;
		case 'l':
			var audio = new Audio("sounds/kick-bass.mp3");
			audio.play();
			break;
		default:
			break;
	}
}

function animation(key){
	var active = document.querySelector('.' + key);
	if (!active)
		return ;

	active.classList.add('pressed');

	setTimeout(function () {
		active.classList.remove('pressed');
	}, 300);
}
