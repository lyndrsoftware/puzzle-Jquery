

$(function() {
	$(document).on("keyup", function(e)
	{
		switch( e.which )
		{
			case 38:
				Game.Move(5);
			break;

			case 37:
				Game.Move(1); // Gauche
			break;

			case 40:
				Game.Move(-5); // bas
			break;

			case 39:
				Game.Move(-1); // Droite
			break;
		}
	});

	$(window).on("load resize", function(){
		$("body").css("height", $(window).outerHeight());
	});

	$(".gametable td").each(function(index)
	{
		// $(this).text(index);
	});

	// Démarrage du Jeu...
	setTimeout(function()
	{
		Game.Start();
		Game.canStart = true;
	}, 1000);
});


var Game = {
	Remodal: false,
	canStart: false,
	Top: new Array(20, 21, 22, 23, 24),
	Bottom: new Array(0, 1, 2, 3, 4),
	Left: new Array(4, 9, 14, 19, 24),
	Right: new Array(0, 5, 10, 15, 20),
	Move: function(direction)
	{
		if( !this.canStart )
			return;

		var current = this.getPivotPosition();

		if( direction == -1 && $.inArray(current, Game.Right) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == 1 && $.inArray(current, Game.Left) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == -5 && $.inArray(current, Game.Bottom) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else if( direction == 5 && $.inArray(current, Game.Top) != -1 ){
			console.log("Déplacement interdit...");
			return;
		}
		else{
			// autre = ".gametable td:nth-child("+ eval( current + direction ) +")";
			if( current >= 0 && current < 25  ){
				chevalier = document.querySelectorAll(".gametable td")[ eval( current + direction ) ];
				pivot = document.querySelectorAll(".gametable td")[ eval( current ) ];
				
				chevalierID = $(chevalier).attr('data-valid');
				pivotID = $(pivot).attr('data-valid');

				$(pivot).html( $(chevalier).find('button') ).removeClass("pivot").attr('data-valid', chevalierID );
				$(chevalier).addClass("pivot").attr('data-valid', pivotID);

				Game.isWin() ? Game.displayMessage() : false;
			}
		}
	},

	getPivotPosition: function()
	{
		var i = 0;
		var tds = document.querySelectorAll(".gametable td");
		while( ( i < 25 && i >= 0 ) && tds[i].getAttribute('class') != 'pivot' )
		{
			i++;
		}
		return i;
	},

	isWin: function()
	{
		var i = 0; win = true;
		var tds = document.querySelectorAll(".gametable td");
		while( i < 25 )
		{
			if( parseInt( tds[i].getAttribute('data-valid'), 10 ) != i ){
				// console.log("ID = "+tds[i].getAttribute('data-valid')+" et i = "+i);
				win = false
			}	
			i++;
		}
		return win;
	},

	random: function(min, max, integer)
	{
		if (!integer) {
			return Math.random() * (max - min) + min;
		} else {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	},

	permutation: function(index1, index2)
	{
		var elmt1 = $( document.querySelectorAll(".gametable td")[ eval( index1 ) ] );
		var elmt2 = $( document.querySelectorAll(".gametable td")[ eval( index2 ) ] );
		// Permutation...
		var temp = elmt1.clone();
		
		elmt1.attr('data-valid', elmt2.attr('data-valid')).html( elmt2.clone().html() );
		elmt2.attr('data-valid', temp.attr('data-valid')).html( temp.html() );

		if( elmt1.hasClass("pivot") )
		{
			elmt1.removeClass("pivot");
			elmt2.addClass("pivot");
		}
		else if( elmt2.hasClass("pivot") )
		{
			elmt2.removeClass("pivot");
			elmt1.addClass("pivot");
		}
	},

	Start: function()
	{
		Game.canStart = true;
		$(".game").addClass("anime");
		if( $(".remodal-wrapper")[0] || Game.Remodal )
		{
			Game.Remodal.close();	
		}
		/* On supprime les precedentes instances */
		// Il est question d'effectuer 32 permutations sur les éléments du puzzle
		for (var i = 0; i < 64; i++) {
			Game.permutation( Game.random(0, 25, true), Game.random(0, 25, true) );
		}
	},

	displayMessage: function()
	{
		Game.canStart = false;
		$(".game").removeClass("anime");
		$(".remodal-wrapper").remove(); /* On supprime les precedentes instances */
		var remodalDiv = $('<div id="" class="remodal">'
				+'<div class="hidden remodal-heading">'
					+ '<button data-remodal-action="close" class="remodal-close" aria-label="Close"></button>'
				+'</div>'
				+'<div class="remodal-body"></div>'
				// +'<div class="remodal-footer"><button type="button" class="btn-class btn-class-default">Close</button></div>'
			+'</div>');

		remodalDiv.attr({
			'id': 'sdf',
			'data-remodal-id': 'fete',
		}).find(".remodal-body").html("<img class='heart' src='logoH.png' /><h1>&Agrave; une amie pas comme les autres...</h1><strong class='h2'>Inou</strong><h4>Designed and coded by <strong>DrSoftware's Games</strong></h4><div><button type='button' class='btn btn-danger' onclick='Game.Start();'>Play again</button></div>");

		setTimeout(function()
		{
			remodal = remodalDiv.remodal({
				closeOnEscape: true,
				closeOnOutsideClick: false,
				transparency: '0.9',
			});

			Game.Remodal = remodal;
			remodal.open();
		}, 1000);
	},
};