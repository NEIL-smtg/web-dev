var	p1 = Math.random() * Math.floor(6);
var	p2 = Math.random() * Math.floor(6);

p1 = Math.floor(p1) + 1;
p2 = Math.floor(p2) + 1;

var winner = document.querySelector('h1');
var p1Img = document.querySelector('.img1');
var p2Img = document.querySelector('.img2');

var dicepic1 = "images/dice";
var dicepic2 = "images/dice";

if (p1 == p2)
{
	winner.textContent = "Draw";
}
else if (p1 > p2)
{
	winner.textContent = "Player 1 wins";
}
else
{
	winner.textContent = "Player 2 wins";
}

dicepic1 += p1 + ".png";
dicepic2 += p2 + ".png";
p1Img.setAttribute('src', dicepic1);
p2Img.setAttribute('src', dicepic2);