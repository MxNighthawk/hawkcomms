//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//


let estimator = document.getElementById("editor");
let matrix = document.getElementById("editorView");
let counter = document.getElementById("cellCounter");

let typeName = document.getElementById("typeName");
let price = document.getElementById("estimatePrice");

let characterType = document.getElementById("charCount");
let lightingType = document.getElementById("lighting");
let outlineType = document.getElementById("rimStyle");

let addCells = document.getElementById("addCell");
let deleteCells = document.getElementById("deleteCell");
let selectAll = document.getElementById("selectCell");
let deselectAll = document.getElementById("deselectCell");

let checkoutTitle = document.getElementById("estimateTotal");
let checkoutList = document.getElementById("commissionList");
let checkoutAdd = document.getElementById("addToTotal");
let checkoutClear = document.getElementById("clearEstimate");

let range = checkoutTitle.getElementsByTagName("h2")[0];
let checkoutCounter = document.getElementById("listCounter");

let typeID = 0;
let cells = [];
let selectedCells = [];

let limits = [
	9,
	4,
];

let estimate = 0;
let baseCell = [
	2.75,
	2.75,
	2.75,
	2.5,
	2.5,
	2.5,
	2.25,
	2.25,
	2.25,
];
let baseEvent = [
	5,
	5,
	4,
	4,
];

let totalRange = 0;
let totalParts = [];

let addFrames = [
	{
		transform: "scale(0.9)",
		opacity: "0.5"
	},
	{
		transform: "scale(1.02)",
		opacity: "0.5"
	},
	{
		transform: "scale(1)",
		opacity: "1"
	},
];
let deleteFrames = [
	{
		transform: "scale(1)",
		opacity: "1"
	},
	{
		transform: "scale(0.5)",
		opacity: "0"
	},
];
let bounceFrames = [
	{
		transform: "scale(0.9)"
	},
	{
		transform: "scale(1)"
	},
];

let cellTiming =
{
	duration: 250,
	iterations: 1,
	easing: "ease-out"
};
let deleteTime =
{
	duration: 200,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};

class Sticker
{
	lightingType;
	outlineStyle;
	charactersPresent;

	cell;
	#light;
	#outline;
	#location;

	stopCheck;
	metaData;

	constructor()
	{
		this.lightingType = 0;
		this.outlineStyle = 0;
		this.charactersPresent = 0;

		this.cell = document.createElement('div');
		this.#light = document.createElement('img');
		this.#outline = document.createElement('img');
		
		this.#light.src = "./Graphics/Templates/Stickers/1char/lit.png";
		this.#light.alt = "sticker";
		this.#light.classList.add("templatePart");

		this.#outline.src = "./Graphics/Templates/Stickers/1char/solid.png";
		this.#outline.alt = "outline";
		this.#outline.classList.add("templatePart");

		this.cell.classList.add("stickerCell");
		this.cell.append(this.#outline);
		this.cell.append(this.#light);

		this.cell.addEventListener("click", () =>
		{
			this.SetCellSelection();
		});

		if(selectedCells.length > 0)
			this.cell.style.setProperty("opacity", 0.4);

		matrix.append(this.cell);
		this.ReadMetadata();
	}

	Destroy()
	{
		this.cell.animate(deleteFrames, deleteTime);

		setTimeout(() => {
			this.cell.remove();
		}, 150);
	}

	SetCellSelection()
	{
		if(this.stopCheck)
			return;

		this.cell.animate(bounceFrames, cellTiming);

		if(!this.cell.classList.contains("selectedCell"))
		{
			this.cell.classList.add("selectedCell");
			selectedCells.push(this);
		}
		else
		{
			this.cell.classList.remove("selectedCell");
			selectedCells.splice(selectedCells.indexOf(this), 1);
		}

		if(selectedCells.length == 1)
			ReadFirstCell();

		this.cell.style.setProperty("opacity", this.cell.classList.contains("selectedCell") ? 1 : 0.4);

		if(selectedCells.length <= 1)
			SetHighlightingMap();

		SetEditorStyles();
	}
	PriceFromSticker(index)
	{
		let basePrice = typeID == 0 ? baseCell[index] : baseEvent[index];
		let lDisc = basePrice - basePrice * this.lightingType * 0.15;
		let customOut = lDisc + lDisc * (this.charactersPresent * 0.2);
		
		return customOut + customOut * (this.outlineStyle == 5 ? 0.02 : 0);
	}

	ReadMetadata()
	{
		this.metaData = `
			${characterType[this.charactersPresent].value}, ${lightingType[this.lightingType].value}, ${outlineType[this.outlineStyle].value}
		`;
	}
	SetLightLayer()
	{
		this.#location = characterType.selectedIndex == 0 ? "1char" : "2chars";
		
		this.#light.src = `./Graphics/Templates/Stickers/${this.#location}/${lightingType.selectedIndex == 0 ? "lit" : "unlit"}.png`;
	}
	SetOutlineLayer()
	{
		this.#location = characterType.selectedIndex == 0 ? "1char" : "2chars";
		let fileName = "";

		switch(outlineType.selectedIndex)
		{
			case 0:
				fileName = "solid";
				break;
			case 1:
				fileName = "distortion";
				break;
			case 2:
				fileName = "fluid";
				break;
			case 3:
				fileName = "fire";
				break;
			case 4:
				fileName = "magic";
				break;
		}
		
		this.#outline.src = `./Graphics/Templates/Stickers/${this.#location}/${fileName}.png`;
	}
}
class SAC extends Sticker
{
	description;
	descBox;

	boxIsSelected;
	boxMeta;

	constructor(information)
	{
		super();
		this.description = information;

		let descBox = document.createElement('input');
		descBox.type = "text";
		descBox.autocomplete = "off";
		descBox.placeholder = "Describe the event in the sticker.";
		descBox.classList.add("descriptionBox");

		this.cell.appendChild(descBox);
		this.boxMeta = `EVENT: <u>No Description Given</u>`;

		descBox.addEventListener("focus", () =>
		{
			if(this.cell.classList.contains("selectedCell"))
			{
				this.stopCheck = true;
				this.IsolateCell();
				return;
			}

			this.SetCellSelection();
			this.IsolateCell();
			this.stopCheck = true;
		});
		descBox.addEventListener("blur", () =>
		{
			this.boxMeta = `EVENT: <u>No Description Given</u>`;

			if(this.boxMeta == "")
				this.boxMeta = `EVENT: <u>${descBox.value}</u>`;

			this.stopCheck = false;
		});
		descBox.addEventListener("keypress", (e) =>
		{
			if(e.key == "Enter")
			{
				descBox.blur();
				this.stopCheck = false;
				this.SetCellSelection();
			}
		});
	}

	IsolateCell()
	{
		if(selectedCells.length > 1)
		{
			for (let i = 0; i < selectedCells.length; i++) {
				const element = selectedCells[i];

				if(element.cell != this.cell)
				{
					element.cell.classList.remove("selectedCell");
					element.cell.style.setProperty("opacity", element.cell.classList.contains("selectedCell") ? 1 : 0.4);
				}
			}

			selectedCells = [this];
			this.cell.animate(bounceFrames, cellTiming);
			SetHighlightingMap();
			ReadFirstCell();
			SetEditorStyles();
		}
	}
}
class Change
{
	instance;
	estimate;

	constructor()
	{
		this.instance = document.createElement('details');
		this.instance.classList.add("editorChange");
		this.estimate = estimate;

		let buttonPurge = document.createElement('button');
		buttonPurge.classList.add("purgeChange");
		buttonPurge.innerText = "x";
		buttonPurge.addEventListener("click", () =>
		{
			this.instance.animate(deleteFrames, deleteTime);

			setTimeout(() => {
				this.instance.remove();
				totalParts.splice(totalParts.indexOf(this), 1);

				SetRangeStyles();
				CalculateRange();
			}, 200);
		});

		let partSummary = document.createElement('summary');
		partSummary.innerText += `${typeName.innerText} - $${estimate.toFixed(2)}`;
		partSummary.append(buttonPurge);

		totalParts.push(this);

		let descriptors = document.createElement('article');
		let header = document.createElement('h3');
		let changes = document.createElement('ul');

		header.innerText = `${cells[0].constructor.name} x${cells.length}`;
		for (let i = 0; i < cells.length; i++) {
			const element = cells[i];

			if(typeID)
				changes.innerHTML += `<li>${element.boxMeta}<br>${element.metaData}</li>`;
			else
				changes.innerHTML += `<li>${element.metaData}</li>`;
		}

		descriptors.append(header);
		descriptors.append(changes);

		this.instance.append(partSummary);
		this.instance.append(descriptors);
		this.instance.animate(addFrames, cellTiming);
		CalculateRange();
	}
}

function SetParameters(l, o, c)
{
	for(let i = 0; l == true && i < selectedCells.length; i++)
	{
		selectedCells[i].lightingType = lightingType.selectedIndex;
		selectedCells[i].SetLightLayer();
	}

	for(let i = 0; o == true && i < selectedCells.length; i++)
	{
		selectedCells[i].outlineStyle = outlineType.selectedIndex;
		selectedCells[i].SetOutlineLayer();
	}

	for(let i = 0; c == true && i < selectedCells.length; i++)
	{
		selectedCells[i].charactersPresent = characterType.selectedIndex;
		selectedCells[i].SetLightLayer();
		selectedCells[i].SetOutlineLayer();
	}

	for (let i = 0; i < selectedCells.length; i++) {
		const element = selectedCells[i];

		element.ReadMetadata();
	}

	UpdateCells();
}
function SetEditorStyles()
{
	lightingType.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);
	outlineType.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);
	characterType.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);

	estimator.style.setProperty("--selectStates", selectedCells.length == 0 ? "none" : "initial");

	addCells.style.setProperty("opacity", cells.length == limits[typeID] ? 0.25 : 1);
	deleteCells.style.setProperty("opacity", cells.length == 1 ? 0.25 : 1);

	selectAll.style.setProperty("opacity", selectedCells.length == cells.length ? 0.25 : 1);
	deselectAll.style.setProperty("opacity", selectedCells.length == 0 ? 0.25 : 1);
}

function ReadFirstCell()
{
	lightingType.selectedIndex = selectedCells[0].lightingType;
	outlineType.selectedIndex = selectedCells[0].outlineStyle;
	characterType.selectedIndex = selectedCells[0].charactersPresent;
}
function AddCell()
{
	if(cells.length == limits[typeID])
		return;

	let type = null;
	switch(typeID)
	{
		case 0: type = new Sticker();
		break;
		case 1: type = new SAC("");
		break;
	}

	cells.push(type);
	type.cell.animate(addFrames, cellTiming);
	estimate += cells[cells.length - 1].PriceFromSticker(cells.length - 1);
	UpdateCells();
}
function DeleteCells()
{
	if(cells.length == 1)
		return;

	if(selectedCells.length > 0)
	{
		let allPicked = selectedCells.length == cells.length;

		for (let i = 0; i < selectedCells.length; i++) {
			const element = selectedCells[i];
			element.Destroy();

			cells.splice(cells.indexOf(element), 1);
		}
		
		lightingType.selectedIndex = outlineType.selectedIndex = characterType.selectedIndex = 0;
		selectedCells = [];

		if(allPicked)
			setTimeout(() => {
				AddCell();
			}, 200);
	}
	else
	{
		cells[cells.length - 1].Destroy();
		cells.pop();
	}

	estimate = 0;

	for (let i = 0; i < cells.length; i++) {
		estimate += cells[i].PriceFromSticker(i);
	}

	setTimeout(() => {
		UpdateCells();
	}, 200);
	SetHighlightingMap();
}
function DeselectAll()
{
	if(selectedCells.length == 0)
		return;

	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];
		element.cell.classList.remove("selectedCell");
		element.cell.style.setProperty("opacity", 1);
		element.cell.animate(bounceFrames, cellTiming);
	}

	selectedCells = [];
	SetEditorStyles();
}
function SelectAll()
{
	if(selectedCells.length == cells.length)
		return;

	selectedCells = [];
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];

		if(!element.cell.classList.contains("selectedCell"))
		{
			element.cell.classList.add("selectedCell");
			element.cell.style.setProperty("opacity", 1);
			element.cell.animate(bounceFrames, cellTiming);
		}

		selectedCells.push(element);
	}

	SetEditorStyles();
}

function SetHighlightingMap()
{
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];

		if(selectedCells.length == 1 && !element.cell.classList.contains("selectedCell"))
			element.cell.style.setProperty("opacity", 0.4);
		else
			element.cell.style.setProperty("opacity", 1);
	}
}
function SetPrice()
{
	estimate = 0;

	for (let i = 0; i < cells.length; i++) {
		estimate += cells[i].PriceFromSticker(i);
	}

	counter.innerText = `${cells.length} / ${limits[typeID]}`;
	price.innerText = `ESTIMATE: $${estimate.toFixed(2)}`;
}
function UpdateCells()
{
	SetPrice();
	SetEditorStyles();

	if(typeID != 0)
		return;

	let maxWidth = "none";

	switch(parseInt(cells.length / 3))
	{
		case 1:
			maxWidth = "64%";
		break;
		case 2:
			maxWidth = "31%";
		break;
	}

	matrix.style.setProperty("--cellMaxWidth", maxWidth);
}

function SwapModes()
{
	selectedCells = [];
	for (let i = 0; i < cells.length; i++) {
		const element = cells[i];
		element.cell.remove();
	}

	switch (typeID) {
		case 0:
			typeID = 1;
			typeName.innerText = "STICKERS AS COMICS";
		break;

		case 1:
			typeID = 0;
			typeName.innerText = "STICKER SET";
		break;
	}

	cells = [];
	estimator.classList = [];
	estimator.classList.add(typeID == 0 ? "MatrixMode" : "ColumnMode");

	AddCell();
	SetEditorStyles();
}

function SetRangeStyles()
{
	checkoutAdd.style.setProperty("opacity", totalParts.length < 4 ? 1 : 0.25);
	checkoutClear.style.setProperty("opacity", totalParts.length > 0 ? 1 : 0.25);
}
function AddToReceipt()
{
	if(checkoutList.children.length == 4)
		return;

	checkoutList.append(new Change().instance);
	SetRangeStyles();
}
function ClearReceipt()
{
	for (let i = checkoutList.children.length - 1; i >= 0; i--) {
		const element = checkoutList.children[i];
		element.animate(deleteFrames, deleteTime);
	}

	setTimeout(() => {
		for (let i = checkoutList.children.length - 1; i >= 0; i--) {
			const element = checkoutList.children[i];
			checkoutList.removeChild(element);
		}

		totalParts = [];
		totalRange = 0;
	
		range.innerText = "ESTIMATE RANGE: $00.00 - $00.00";
		checkoutCounter.innerText = "0 / 4";
		SetRangeStyles();
	}, 200);
}
function CalculateRange()
{
	totalRange = 0;

	for (let i = 0; i < totalParts.length; i++) {
		const element = totalParts[i].estimate;
		totalRange += element;
	}

	range.innerText = `ESTIMATE RANGE: $${totalRange.toFixed(2)} - $${(totalRange + (totalRange * 0.2)).toFixed(2)}`;

	checkoutCounter.innerText = `${totalParts.length} / 4`;
}