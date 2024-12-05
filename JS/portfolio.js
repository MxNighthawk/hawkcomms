//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

let portfolioContainer = document.getElementById("portfolioContainer");
let portfolioMask = document.getElementById("portfolioPieces");
let portfolioOverlay = document.getElementById("focusedDisplay");

let overlayPiece = document.getElementById("focusedPiece");

let expansionVisual = document.getElementById("piece");
let expansionMeta = document.getElementById("pieceMeta");

let overlayCredit = document.getElementById("creditLink").getElementsByTagName("p")[0];
let creditIcon = document.getElementById("creditLink").getElementsByTagName("img")[0];

let portfolioWarning = document.getElementById("contentWarning");
let goToLink = document.getElementById("creditProceed");

let portfolioIsOpen = false;

let stickerFilter = document.getElementsByClassName("category")[0];
let sacFilter = document.getElementsByClassName("category")[1];

let setsActive = true, sacsActive = true, needsAWarning = false;
let redirectionLink = "";

let pieceInFrames = [
	{
		transform: "translateX(128px)",
		opacity: "0",
	},
	{
		transform: "translateX(0px)",
		opacity: "1",
	},
];
let pieceOutFrames = [
	{
		transform: "translateX(0px)",
		opacity: "1",
	},
	{
		transform: "translateX(-128px)",
		opacity: "0",
	},
];
let overlayFadeIn = [
	{
		transform: "translateX(100%)",
		opacity: "0",
		zIndex: "1"
	},
	{
		transform: "translateX(0px)",
		opacity: "1",
		zIndex: "1"
	}
]
let overlayFadeOut = [
	{
		transform: "translateX(0px)",
		opacity: "1"
	},
	{
		transform: "translateX(-100%)",
		opacity: "0",
		zIndex: "-1"
	}
]

let portfolioTiming = {
	duration: 150,
	easing: "ease",
	fill: "forwards"
};
let portfolioDisplayTiming = {
	delay: 150,
	duration: 150,
	easing: "ease",
	fill: "forwards"
};

let toggleFadeOut = [
	{
		transform: "scale(1)",
		opacity: "1",
	},
	{
		transform: "scale(0.95)",
		opacity: "0.25",
	}
]
let toggleFadeIn = [
	{
		transform: "scale(0.95)",
		opacity: "0.25",
	},
	{
		transform: "scale(1)",
		opacity: "1",
	}
]
let toggleTiming = {
	duration: 150,
	easing: "ease",
	fill: "forwards"
};

let safeguardFrames = new KeyframeEffect(
	goToLink,
	[
		{
			opacity: "0",
			pointerEvents: "none"
		},
		{
			opacity: "1",
			pointerEvents: "fill"
		}
	],
	{
		iterations: 1,
		delay: 1500,
		duration: 250,
		easing: "ease",
		fill: "forwards"
	}
);

let buttonSafeguard = new Animation(safeguardFrames);

class Piece
{
	title;
	information = "";
	
	item;
	image;
	shadowColor;
	outlineColor;
	warning;

	credit;

	constructor(name, info, file, color, tint, credit, warn)
	{
		this.title = name;

		this.shadowColor = color;
		this.outlineColor = tint;

		this.credit = credit;
		this.warning = warn;
		
		this.item = document.createElement("button");
		this.item.type = "button";
		this.item.ariaLabel = `Piece example - ${this.title}`;
		this.item.style.setProperty("background-image", `url(./Graphics/Portfolio/${file})`);

		this.item.classList.add("exampleItem");
		this.item.addEventListener("click", (e) => {
			ShowPortfolio(this);
		});

		this.image = `./Graphics/Portfolio/${file}`;
		portfolioMask.append(this.item);
		
		for (let i = 0; i < info.length; i++) {
			const element = info[i];
			
			if(i < info.length - 1)
				this.information += `<li ${i == 0 ? 'style="list-style: none;"' : ""}>${element}</li>`;
			else
				this.information += `<li class="${element}">${element}</li>`;
		}
	}

	Toggle(state)
	{
		this.item.animate(state ? toggleFadeIn : toggleFadeOut, toggleTiming);
		this.item.disabled = !state;
	}
}

let sets = [
	new Piece("Bman Stickers", 
			["1 Character", "Lit", "Distortion"], 
			"/Bman_Stickers.webp", "red", "#ff0052",
			"https://x.com/BmanTwt", false),
	new Piece("Trick x Orion Friendship", 
			["2 Characters", "Unlit", "Distortion"], 
			"/Friendship.webp", "blue", "#ffea51",
			"https://linktr.ee/trickqrex", true),
	new Piece("USB Stickers", 
			["1 Character", "Unlit", "Solid"], 
			"/Bman_Stickers.webp", "blue", "#ff0052",
			"https://x.com/Mephonizuku", false),
	new Piece("Wildbeast Stickers", 
			["1 Character", "Lit", "Mixed"], 
			"/Bman_Stickers.webp", "yellow", "",
			"https://x.com/NickConter", false),
	new Piece("Fred Mixing Stickers", 
			["1 Character", "Mixed", "Mixed"], 
			"/Bman_Stickers.webp", "green", "",
			"https://x.com/Fredrick7298", true),
];
let sacs = [
	new Piece("Mewmie Draws", 
			["1 Character", "Lit", "Solid"], 
			"/Bman_Stickers.webp", "lime", "#fff",
			"https://x.com/LampCat555", true),
	new Piece("Hector's Best Desert", 
			["1 Character", "Lit", "Solid"], 
			"/Bman_Stickers.webp", "yellow", "#fff",
			"https://bsky.app/profile/thomaslover66.bsky.social", false),
];

portfolioContainer.addEventListener("keydown", (e) =>
{
	if(e.key == "ESC" && portfolioIsOpen)
		ShowPortfolio();
});
function ShowPortfolio(piece)
{
	if(piece != null)
	{
		expansionVisual.style.setProperty("background-image", `url(${piece.image})`);
		expansionVisual.style.setProperty("--dropShadowColor", piece.shadowColor);

		expansionMeta.getElementsByTagName("h1")[0].innerText = piece.title;
		expansionMeta.getElementsByTagName("ul")[0].innerHTML = piece.information;
		expansionMeta.style.setProperty("--outlineTint", piece.outlineColor);

		overlayCredit.innerText = piece.warning ? "Character Credits (Content Warning)" : "Character Credits";
		creditIcon.src = `./Graphics/Icons/${piece.warning ? "Warning" : "Direct"}.webp`;
		needsAWarning = piece.warning;
		redirectionLink = piece.credit;
	}
	
	if(!portfolioIsOpen)
	{
		portfolioOverlay.animate(overlayFadeIn, portfolioTiming);
		overlayPiece.animate(pieceInFrames, portfolioDisplayTiming);
	}
	else
	{
		portfolioOverlay.animate(overlayFadeOut, portfolioDisplayTiming);
		overlayPiece.animate(pieceOutFrames, portfolioTiming);
	}

	portfolioIsOpen = !portfolioIsOpen;
}

function LinkBackWarning()
{
	if(needsAWarning)
	{
		buttonSafeguard.cancel();
		buttonSafeguard.play();

		portfolioWarning.style.setProperty("opacity", 1);
		portfolioWarning.style.setProperty("z-index", 2);
		document.body.style.setProperty("overflow-y", "hidden");
	}
	else
		window.open(redirectionLink);
}
function DisposeWarning()
{	
	portfolioWarning.style.setProperty("opacity", 0);
	portfolioWarning.style.setProperty("z-index", -1);
	document.body.style.setProperty("overflow-y", "auto");

	goToLink.style.setProperty("opactiy", 0);
	goToLink.style.setProperty("pointer-events", "none");
}
function OpenRedirection()
{
	window.open(redirectionLink);
	DisposeWarning();
}

function ToggleCategory(id)
{
	let collection;
	let condition;
	
	switch(id)
	{
		case 0:
			collection = sets;
			setsActive = !setsActive;

			condition = setsActive;
			break;
		case 1:
			collection = sacs;
			sacsActive = !sacsActive;

			condition = sacsActive;
			break;
	}

	for (let i = 0; i < collection.length; i++) {
		const element = collection[i];
		element.Toggle(condition);
	}

	SetPortfolioFilterStyle();
}
function SetPortfolioFilterStyle()
{
	stickerFilter.style.setProperty("opacity", setsActive ? 1 : 0.25);
	stickerFilter.style.setProperty("background-color", `hsl(var(--interfaceHue), calc(var(--interfaceSaturation) * 93%), ${setsActive ? 30 : 20}%)`);

	sacFilter.style.setProperty("opacity", sacsActive ? 1 : 0.25);
	sacFilter.style.setProperty("background-color", `hsl(var(--interfaceHue), calc(var(--interfaceSaturation) * 93%), ${sacsActive ? 30 : 20}%)`);
}