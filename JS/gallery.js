let galleryContainer = document.getElementById("galleryContainer");
let galleryMask = document.getElementById("galleryPieces");
let galleryOverlay = document.getElementById("focusedDisplay");

let overlayPiece = document.getElementById("focusedPiece");

let expansionVisual = document.getElementById("piece");
let expansionMeta = document.getElementById("pieceMeta");

let overlayCredit = document.getElementById("creditLink").getElementsByTagName("p")[0];
let creditIcon = document.getElementById("creditLink").getElementsByTagName("img")[0];

let galleryWarning = document.getElementById("contentWarning");
let goToLink = document.getElementById("creditProceed");

let galleryIsOpen = false;

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

let galleryTiming = {
	duration: 150,
	easing: "ease",
	fill: "forwards"
};
let galleryDisplayTiming = {
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

class Piece
{
	title;
	information = "";
	
	item;
	image;
	shadowColor;
	warning;

	credit;

	constructor(name, info, file, color, credit, warn)
	{
		this.title = name;
		this.shadowColor = color;
		this.credit = credit;
		this.warning = warn;
		
		this.item = document.createElement("button");
		this.item.type = "button";
		this.item.ariaLabel = `Piece example - ${this.title}`;

		this.item.classList.add("exampleItem");
		this.item.addEventListener("click", (e) => {
			ShowGallery(this);
		});

		this.image = document.createElement("img");
		this.image.src = `./Graphics/Portfolio/${file}`;
		this.image.alt = "example";
		
		this.item.append(this.image);
		galleryMask.append(this.item);
		
		for (let i = 0; i < info.length; i++) {
			const element = info[i];
			
			if(i == 0)
				this.information += `<li style="list-style: none;">${element}</li>`;
			else
				this.information += `<li>${element}</li>`;
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
				["1 Character", "Lit", "Distortion (Red Base)"], 
				"/Bman_Stickers.png", "red",
				"https://x.com/BmanTwt", false),
	new Piece("Trick x Orion Friendship", 
				["2 Character", "Unlit", "Distortion (Yellow Base)"], 
				"/Friendship.png", "blue",
				"https://linktr.ee/trickqrex", true),
];
let sacs = [
	// new Piece("Hottest Voice Guy (C)", ["Single Piece", "Lit", "1 Character"], "/IMG_1152.png"),
];

galleryContainer.addEventListener("keydown", (e) =>
{
	if(e.key == "ESC" && galleryIsOpen)
		ShowGallery();
});
function ShowGallery(piece)
{
	if(piece != null)
	{
		expansionVisual.getElementsByTagName("img")[0].src = piece.image.src;
		expansionVisual.style.setProperty("--outlineColor", piece.shadowColor);
		expansionMeta.getElementsByTagName("h1")[0].innerText = piece.title;
		expansionMeta.getElementsByTagName("ul")[0].innerHTML = piece.information;

		overlayCredit.innerText = piece.warning ? "Character Credits (Content Warning)" : "Character Credits";
		creditIcon.src = `./Graphics/Icons/${piece.warning ? "Warning" : "Direct"}.png`;
		needsAWarning = piece.warning;
		redirectionLink = piece.credit;
	}
	
	if(!galleryIsOpen)
	{
		galleryOverlay.animate(overlayFadeIn, galleryTiming);
		overlayPiece.animate(pieceInFrames, galleryDisplayTiming);
	}
	else
	{
		galleryOverlay.animate(overlayFadeOut, galleryDisplayTiming);
		overlayPiece.animate(pieceOutFrames, galleryTiming);
	}

	galleryIsOpen = !galleryIsOpen;
}

function LinkBackWarning()
{
	if(needsAWarning)
	{
		galleryWarning.style.setProperty("opacity", 1);
		galleryWarning.style.setProperty("z-index", 2);
		document.body.style.setProperty("overflow-y", "hidden");
	}
	else
		window.open(redirectionLink);
}
function DisposeWarning()
{	
	galleryWarning.style.setProperty("opacity", 0);
	galleryWarning.style.setProperty("z-index", -1);
	document.body.style.setProperty("overflow-y", "auto");
}
function OpenRedirection()
{
	window.open(redirectionLink);
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

	SetGalleryFilterStyle();
}
function SetGalleryFilterStyle()
{
	stickerFilter.style.setProperty("opacity", setsActive ? 1 : 0.25);
	stickerFilter.style.setProperty("background-color", `hsl(var(--interfaceHue), calc(var(--interfaceSaturation) * 93%), ${setsActive ? 30 : 20}%)`);

	sacFilter.style.setProperty("opacity", sacsActive ? 1 : 0.25);
	sacFilter.style.setProperty("background-color", `hsl(var(--interfaceHue), calc(var(--interfaceSaturation) * 93%), ${sacsActive ? 30 : 20}%)`);
}