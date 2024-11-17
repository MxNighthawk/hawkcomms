// let galleryContainer = document.getElementById("galleryContainer");
// let galleryMask = document.getElementById("galleryMask");

let galleryExpansion = document.getElementById("focusedPiece");
let galleryDisplay = document.getElementById("focusedDisplay");

let galleryIsOpen = false;
// new Draggable(galleryContainer, galleryMask, 4);

let displayInFrames = [
	{
		transform: "translateX(128px)",
		opacity: "0",
	},
	{
		transform: "translateX(0px)",
		opacity: "1",
	},
];
let displayOutFrames = [
	{
		transform: "translateX(0px)",
		opacity: "1",
	},
	{
		transform: "translateX(-128px)",
		opacity: "0",
	},
];
let focusFadeIn = [
	{
		transform: "scale(0.9)",
		opacity: "0",
		zIndex: "1"
	},
	{
		transform: "scale(1)",
		opacity: "1",
		zIndex: "1"
	}
]
let focusFadeOut = [
	{
		transform: "scale(1)",
		opacity: "1"
	},
	{
		transform: "scale(0.9)",
		opacity: "0",
		zIndex: "-1"
	}
]

let galleryTiming = {
	duration: 150,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};
let galleryDisplayTiming = {
	delay: 100,
	duration: 150,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};

function ShowGallery(file = "")
{
	document.getElementById("piece").getElementsByTagName("img")[0].src = `./Graphics/Templates/${file}`;
	
	if(!galleryIsOpen)
	{
		galleryExpansion.animate(focusFadeIn, galleryTiming);
		galleryDisplay.animate(displayInFrames, galleryDisplayTiming);
	}
	else
	{
		galleryExpansion.animate(focusFadeOut, galleryDisplayTiming);
		galleryDisplay.animate(displayOutFrames, galleryTiming);
	}

	galleryIsOpen = !galleryIsOpen;
	// galleryExpansion.style.setProperty("z-index", galleryIsOpen ? 1 : 0);
}