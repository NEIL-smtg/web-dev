
$("h1").css("color", "red");

$("button").click(function () { 
	$("h1").text("textString").css("color", "blue");
	$("a").attr("href", "www.google.com");
	$("h1").slideUp().slideDown().animate({opacity:.5})
});

$(document).keypress(function (e) { 
	$("h1").text(e.key).css("color", "blue");
});
