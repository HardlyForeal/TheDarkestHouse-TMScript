// ==UserScript==
// @name         TheDarkestHouse-TMScript
// @license      Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0); https://creativecommons.org/licenses/by-nc-nd/4.0/
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add useability features to The Darkest House.
// @author       HardlyForeal
// @match        https://*.thedarkesthouse.com/*
// @icon         https://www.google.com/s2/favicons?domain=thedarkesthouse.com
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	setTimeout(function () {
		let $ = jQuery;
		console.log("jQuery version", jQuery.fn.jquery);

		let href = location.href;
		let pos = href.indexOf('?');
		if (pos > -1) {
			href = href.substring(0, pos);
		}
		if ((pos = href.indexOf('#')) > -1) {
			href = href.substring(0, pos);
		}
		window.localStorage.setItem(href+"#allCards_original", $("#room_accordion").html());

		let swapVersionIcon = $("<i style='padding-left: 20px;' class='swap-version-icon fa fa-undo'></i>");
		let swapVersionButton = $("<a class='swap-version'></a>");
		swapVersionButton.append(swapVersionIcon);
		$(".return_wrap").append(swapVersionButton);
		$(".swap-version").on("click", function() {
			if (swapVersionIcon.hasClass("fa-undo")) {
				let original = window.localStorage.getItem(href + "#allCards_original");
				if (original) {
					$("#room_accordion").html(original);
				}
				swapVersionIcon.removeClass("fa-undo").addClass("fa-rotate-right");
			} else {
				let myVersion = window.localStorage.getItem(href + "#allCards");
				if (myVersion) {
					$("#room_accordion").html(myVersion);
				}
				swapVersionIcon.removeClass("fa-rotate-right").addClass("fa-undo");
			}
			return false;
		});

		$("head").append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' media='all' /><style>p[contenteditable] {background-color: white;color: black;}</style>");
		let allData = window.localStorage.getItem(href+"#allCards");
		//console.log("alldata", allData);
		//allData = null;
		if (allData) {
			$("#room_accordion").html(allData);
		} else {
			//Edit buttons, new paragraph buttons, etc. will all be in allData if it is present.
			$(".card-body").append("<button style='display:none; border: 0px' class='add-para'><i class='fa fa-plus'></i></button>");
			$(".card").each(function() {
				let $this = $(this);
				let header = $this.find(".card-header").first(); //.first() shouldn't be necessary
				//Add the edit button.
				header.find("h5").append($("<i class='edit-card fa fa-pencil' style='position: absolute; right: 0px; top: 0px;'></a>"));
				//Check for a v1 note
				let hId = header.attr("id");
				var v1Note = window.localStorage.getItem(href+"#" + hId);
				if (v1Note) {
					let cardBody = $this.find(".card-body");
					let newP = $("<p></p>").text(v1Note);
					cardBody.find("p").last().after(newP)
				}
			});
		}
		window.localStorage.setItem(href+"#allCards", $("#room_accordion").html());
		$("body").on("click", ".edit-card", function() {
			let $this = $(this);
			let cardBody = $this.closest(".card").find(".card-body");
			let newEditState = $this.prop("edit-enabled");
			$this.prop("edit-enabled", !newEditState);
			let allPs = cardBody.find("p");
			if (newEditState) {
				//I could use toggleClass, but I want to guarantee that the icon and the state are in sync.
				$this.removeClass("fa-save").addClass("fa-pencil");
				allPs.removeAttr("contenteditable");
				cardBody.find(".add-para").hide();
				//If multiple cards are being edited, any editable ones are saved as editable, since I'm
				//saving the entire set.  It's also saving the open/close state, etc.  Kinda a bug.
				let toSave = $("#room_accordion").html();
				window.localStorage.setItem(href+"#allCards", toSave);
			} else {
				$this.removeClass("fa-pencil").addClass("fa-save");
				allPs.attr("contenteditable", "true");
				cardBody.find(".add-para").show();
			}
		});
		$("body").on("click", ".add-para", function() {
			var cardBody = $(this).closest(".card-body");
			var newP = $("<p contenteditable='true'>New Paragraph</p>");
			cardBody.find("p").last().after(newP);
			newP.focus();
			return;
		});
		$("body").on("blur", "p", function() {
			var t1 =$(this).text();
			if (!t1) {
				$(this).remove();
			}
		});
		//TMiles - This is used to bypass the page transition code.
		$("body").on("click", "a", function() {
			let ahref = $(this).attr("href");
			if (ahref.substring(0,1) != '#' && !$(this)[0].hasAttribute("download")) {
				if ($(this)[0].hasAttribute("target")) {
					let target = $(this).attr("target");
					window.open(ahref, target);
				} else {
					window.location.href = ahref;
				}
				return false;
			}
		});
		$("a[download]").each(function() {
			let $this = $(this);
			let currA = $(this)[0].outerHTML;
			let a = $(currA);
			a.removeAttr("download");
			a.attr("target", "playerView");
			a.text("Show to players");
			if ($this.css("position")) {
				let s = $("<span></span>");
				s.css({
					"position": $this.css("position"),
					"top": $this.css("top"),
					"right": $this.css("right"),
					"left": $this.css("left"),
					"bottom": $this.css("bottom")
				});
				$this.css({"position":"","top":"","right":"","left":"","bottom":""});
				a.css({"position":"","top":"","right":"","left":"","bottom":""})
				s.insertAfter($this).append($this);
			}
			a.insertAfter(this);
		});
	},500);
})();