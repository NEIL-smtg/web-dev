var buttonColors = ['red', 'blue', 'green', 'yellow'];
var randomChosenColour;
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var win = false;

function rand() {return (Math.floor(Math.random() * Math.floor(4)));}

function playAudio(id)
{
	var audio = new Audio('sounds/' + id + '.mp3');
	audio.play();
}

function flash(id) {$("#" + id).fadeOut(200).fadeIn(200); }

function animatePress(id)
{
	$("#" + id).addClass('pressed');
	setTimeout(function () {
		$("#" + id).removeClass('pressed');
	}, 100);
}

function nextSequence()
{
	level++;
	$('h1').text('Level ' + level);
	
	userClickedPattern = [];
	randomChosenColour = buttonColors[rand()];
	setTimeout(function () {
		flash(randomChosenColour);
	}, 500);
	gamePattern.push(randomChosenColour);
	console.log(gamePattern);
}

function comparePattern()
{
	for (i = 0; i < userClickedPattern.length; i++)
	{
		if (userClickedPattern[i] != gamePattern[i])
			return (false);
	}
	return (true);
}

function gameOver()
{
	$('body').addClass('game-over');
	setTimeout(function () {
		$('body').removeClass('game-over');
	}, 100);
	$('h1').text('GameOver, Press any key to restart.');

	var audio = new Audio('sounds/wrong.mp3');
	audio.play();

	level = 0;
	gamePattern = [];
	userClickedPattern = [];
}

for (i = 0; i < buttonColors.length; i++)
{
	(function (i) {
		$("#" + buttonColors[i]).click(function () {
			animatePress(buttonColors[i]);
            playAudio(buttonColors[i]);
			if (level > 0)
			{
				userClickedPattern.push(buttonColors[i]);
				if (!comparePattern())
					gameOver();
				else if (userClickedPattern.length == gamePattern.length)
					nextSequence();
				else
					playAudio(buttonColors[i]);
				console.log(userClickedPattern);
			}
        });
	})(i);
}

$(document).keypress(function (e) {
	if (level == 0)
		nextSequence();
});