let matrix = document.getElementById("stickerMatrix");
let selectedCells = [];

class Sticker
{
	lightingType;
	outlineStyle;

	cell;

	constructor(lightType, outlineType)
	{
		this.lightingType = lightType;
		this.outlineStyle = outlineType;

		this.cell = document.createElement('div');
		let sticker = document.createElement('img');
		sticker.src = "./Graphics/Orion Programming.png";
		sticker.alt = "sticker";
		sticker.classList.add("exampleSticker");

		this.cell.classList.add("stickerCell");
		this.cell.append(sticker);

		this.cell.addEventListener("click", () => 
		{
			if(this.cell.classList.contains("selectedCell"))
			{
				this.cell.classList.remove("selectedCell");
				selectedCells.splice(selectedCells.indexOf(this), 1);
			}
			else
			{
				this.cell.classList.add("selectedCell");
				selectedCells.push(this);
			}
			
			this.cell.style.setProperty("opacity", this.cell.classList.contains("selectedCell") ? 1 : 0.4);

			if(selectedCells.length == 1 || selectedCells.length == 0)
				SetHighlightingMap();
		});

		matrix.append(this.cell);
	}

	Destroy()
	{
		this.cell.remove();
	}
}

class SAC extends Sticker
{
	description;

	constructor(lightType, outlineType, information)
	{
		super(lightType, outlineType);
		this.description = information;
	}
}

let stickerCells = 
[
	new Sticker(0, 0)
];
let typeID = 0;

function AddCell(list)
{
	if(list.length == 9)
		return;

	SetMaximumSizes();

	let type = null;
	switch(typeID)
	{
		case 0: type = new Sticker(0, 0);
		break;
		case 1: type = new SAC(0, 0, "");
		break;
	}
	list.push(type);
	console.log(list);
}

function DeleteCells(list)
{
	if(list.length == 1)
		return;

	if(selectedCells.length > 0)
	{
		for (let i = 0; i < selectedCells.length; i++) {
			const element = selectedCells[i];
			element.Destroy();

			list.splice(list.indexOf(element), 1);

			if(list.length == 1)
				break;
		}
		
		selectedCells = [];
	}
	else
	{
		list[list.length - 1].Destroy();
		list.pop();
	}

	SetMaximumSizes();
	SetHighlightingMap();
}

function SetHighlightingMap()
{
	for (let i = 0; i < stickerCells.length; i++) {
		const element = stickerCells[i];
		
		if(selectedCells.length == 1 && !element.cell.classList.contains("selectedCell"))
			element.cell.style.setProperty("opacity", 0.4);
		else
			element.cell.style.setProperty("opacity", 1);
	}
}

function DeselectAll()
{
	for (let i = 0; i < stickerCells.length; i++) {
		const element = stickerCells[i];
		element.cell.classList.remove("selectedCell");
		element.cell.style.setProperty("opacity", 1);
	}

	selectedCells = [];
}
function SelectAll()
{
	selectedCells = [];
	for (let i = 0; i < stickerCells.length; i++) {
		const element = stickerCells[i];
		element.cell.classList.add("selectedCell");
		element.cell.style.setProperty("opacity", 1);

		selectedCells.push(element);
	}
}

function SetMaximumSizes()
{
	let maxWidth = "none";

	if(screen.width < 375)
		maxWidth = "88px";
	else
	{
		switch(Math.round(stickerCells.length / 3))
		{
			case 1:
				maxWidth = "320px";
			break;
			case 2:
				maxWidth = "160px";
			break;
		}
	}
	
	document.styleSheets[2].cssRules[0].style.maxWidth = maxWidth;
}