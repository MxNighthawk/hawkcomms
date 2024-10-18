let ticketHolder = document.getElementById("blockArea");
let ticketDrag = document.getElementById("blockContainer");
let ticketCounter = document.getElementById("ticketCounter");

let previousTicket = document.getElementById("previousTicket");
let nextTicket = document.getElementById("nextTicket");

let products = [];
let ticketIndex = 0;

class Product {
	count = [];
	block = null;
	selfIndex = 0;

	totalPrice = 0;
	bundleCost = 0;
	styleCost = 0;
	backgroundCost = 0;
	lightingCost = 0;
	
	selectedType;
	selectedStyle;

	constructor(index)
	{
		this.selfIndex = index;
		this.block = document.createElement("div");
		this.block.setAttribute("class", "quotaBlock");
		this.block.innerHTML +=
		`
			<div class="estimationBody">
				<h2 class="totalDisplay">REQUEST TOTAL: <b>$${this.totalPrice}</b></h2>
			</div>
			<hr>
			
			<div class="estimationBody">
				<label>Product Type:</label>
				<select class="productType" onchange="javascript:products[${this.selfIndex}].SetParameterChanges();">
					<option>Stickers</option>
					<option>Piece</option>
				</select>

				<label>Bundles:</label>
				<select class="bundles" oninput="javascript:products[${this.selfIndex}].CalculatePriceTotal();">
					<option>$4 - Single</option>
					<option>$8 - x2 Bundle</option>
					<option>$12 - x4 Bundle</option>
					<option>$16 - x8 Bundle</option>
					<option>$24 - x16 Bundle</option>
				</select>
				
				<select class="bundles" oninput="javascript:products[${this.selfIndex}].CalculatePriceTotal();">
					<option>$12 - Headbust</option>
					<option>$24 - Half Body</option>
					<option>$36 - Full Body</option>
				</select>

				<br>
				<div class="scrolledParameters">				
					<div class="characters">
					
					</div>
					<div class="characterButtons">
						<input type="button" class="addCharacterButton" onclick="javascript:products[${this.selfIndex}].AddCharacter();" value="+">
						<input type="button" class="popCharacterButton" onclick="" value="-">
					</div>
				</div>

				<div class="styleParameters">
					<label>Style Type:</label>
					<select class="pieceStyle" oninput="javascript:products[${this.selfIndex}].CalculatePriceTotal();products[${this.selfIndex}].SetParameterChanges();">
						<option>Cost -0%, Full Color</option>
						<option>Cost -6%, Lineart Only</option>
						<option>Cost -12%, Sketch Only</option>
					</select>

					<label class="display">Background Detail: $0</label>
					<input class="backgroundDetail" oninput="javascript:products[${this.selfIndex}].SetBackgroundDetail();" type="range" step="0.1" min="0" max="1" value="0">

					<label class="display">Lighting Detail: $0</label>
					<input class="lightingDetail" oninput="javascript:products[${this.selfIndex}].SetLightingDetail();" type="range" step="0.1" min="0" max="1" value="0">
				</div>
			</div>

			<hr>
			<div class="estimationBody">
				<input type="button" class="deleteBlock" onclick="javascript:products[${this.selfIndex}].DeleteBlock();" value="DELETE ESTIMATION">
			</div>
		`;
		
		ticketDrag.append(this.block);
		
		this.selectedType = this.block.getElementsByClassName("productType")[0];
		this.selectedStyle = this.block.getElementsByClassName("pieceStyle")[0];

		this.count.push(new Character(this.block, this.selfIndex, 0, 0));
		this.SetParameterChanges();
		this.CalculatePriceTotal();
	}
	
	DeleteBlock()
	{
		if(this.selfIndex == products.length - 1)
			products.pop();
		else
			products.splice(this.selfIndex, 1);

		this.block.remove();

		for (let i = 0; i < products.length; i++) {
			const element = products[i];
			element.selfIndex = i;
			
			element.block.getElementsByClassName("productType")[0].setAttribute("onchange", `javascript:products[${i}].SetParameterChanges();`);

			for (let b = 0; b < element.block.length; b++) {
				const element = element.getElementsByClassName("bundles")[b];
				
				element.setAttribute("onchange", `javascript:products[${i}].CalculatePriceTotal();`);
			}

			element.block.getElementsByClassName("deleteBlock")[0].setAttribute("onclick", `javascript:products[${i}].DeleteBlock();`);
			element.block.getElementsByClassName("backgroundDetail")[0].setAttribute("oninput", `javascript:products[${i}].SetBackgroundDetail();`);
			element.block.getElementsByClassName("lightingDetail")[0].setAttribute("oninput", `javascript:products[${i}].SetLightingDetail();`);
			element.CheckButtons();

			for (let c = 0; c < element.count.length; c++) {
				const counter = element.count[c];
				
				counter.parameters.getElementsByClassName("topHair")[0].setAttribute("oninput", `products[${i}].count[${[c]}].SetHairFee();products[${i}].CalculatePriceTotal();`);
				counter.parameters.getElementsByClassName("bodyHair")[0].setAttribute("oninput", `products[${i}].count[${[c]}].SetBodyHairFee();products[${i}].CalculatePriceTotal();`);
				counter.parameters.getElementsByClassName("bodyBuild")[0].setAttribute("oninput", `products[${i}].count[${[c]}].SetBodyShape();products[${i}].CalculatePriceTotal();`);
			}
		}

		for (let i = 0; i < products.length; i++) {
			const element = products[i].block;
			element.style.setProperty("display", "none");
		}

		ticketIndex--;

		if(ticketIndex < 0)
			ticketIndex = 0;
		
		if(products.length > 0)
			products[ticketIndex].block.style.setProperty("display", "block");

		CheckSwapButtons();
		UpdateCounter();
	}
	
	AddCharacter()
	{
		if(this.count.length == 3)
			return;
		else
		{
			this.count.push(new Character(this.block, this.selfIndex, this.count.length, this.count.length * 5));
			this.CalculatePriceTotal();
		}

		this.CheckButtons();
	}
	DeleteCharacter()
	{		
		if(this.count.length == 1)
			return;
		
		this.count[this.count.length - 1].parameters.remove();
		this.count.splice(this.count.length - 1, 1);
		this.CalculatePriceTotal();
		
		this.CheckButtons();
	}
	
	CheckButtons()
	{
		this.block.getElementsByClassName("addCharacterButton")[0].setAttribute("onclick", this.count.length == 3 ? "" : `javascript:products[${this.selfIndex}].AddCharacter();`);
		this.block.getElementsByClassName("addCharacterButton")[0].style.opacity = this.count.length == 3 ? 0.25 : 1;
		
		this.block.getElementsByClassName("popCharacterButton")[0].setAttribute("onclick", this.count.length == 1 ? "" : `javascript:products[${this.selfIndex}].DeleteCharacter();`);
		this.block.getElementsByClassName("popCharacterButton")[0].style.opacity = this.count.length == 1 ? 0.25 : 1;
	}
	CalculatePriceTotal()
	{
		this.bundleCost = parseFloat(this.block.getElementsByClassName("bundles")[this.selectedType.selectedIndex].value.match(/[\d\.]+/));
		this.styleCost = parseFloat(this.selectedStyle.value.match(/[\d\.]+/));
		
		this.totalPrice = this.bundleCost;

		if(this.selectedType.selectedIndex == 1)
			this.totalPrice += this.backgroundCost;
		
		if(this.selectedStyle.selectedIndex == 0)
			this.totalPrice += this.lightingCost;

		for (let i = 0; i < this.count.length; i++) {
			const element = this.count[i];
			this.totalPrice += element.totalFee;
		}

		this.totalPrice *= 1 - this.styleCost / 100.0;
		this.totalPrice *= 100;
		this.totalPrice = Math.round(this.totalPrice);
		this.totalPrice /= 100;

		this.block.getElementsByClassName("totalDisplay")[0].innerHTML = `REQUEST TOTAL: <b>$${this.totalPrice}</b>`;
	}
	
	SetParameterChanges()
	{
		for (let i = 0; i < this.block.getElementsByClassName("bundles").length; i++) {
			const element = this.block.getElementsByClassName("bundles")[i];
			
			element.style.setProperty("display", "none");
		}
		this.block.getElementsByClassName("bundles")[this.selectedType.selectedIndex].style.setProperty("display", "inline-block");
		this.block.getElementsByClassName("styleParameters")[0].getElementsByClassName("display")[0].style.setProperty("display", this.selectedType.selectedIndex == 1 ? "inline-block" : "none");
		this.block.getElementsByClassName("backgroundDetail")[0].style.setProperty("display", this.selectedType.selectedIndex == 1 ? "inline-block" : "none");

		this.block.getElementsByClassName("styleParameters")[0].getElementsByClassName("display")[1].style.setProperty("display", this.selectedStyle.selectedIndex == 0 ? "inline-block" : "none");
		this.block.getElementsByClassName("lightingDetail")[0].style.setProperty("display", this.selectedStyle.selectedIndex == 0 ? "inline-block" : "none");

		this.CalculatePriceTotal();
	}
	SetBackgroundDetail()
	{
		let slider = this.block.getElementsByClassName("backgroundDetail")[0];
		this.backgroundCost = Math.pow(slider.value, 3) * 6;
		this.block.getElementsByClassName("styleParameters")[0].getElementsByClassName("display")[0].innerHTML = `Background Detail: $${Math.round(this.backgroundCost)}`;

		this.CalculatePriceTotal();
	}
	SetLightingDetail()
	{
		let slider = this.block.getElementsByClassName("lightingDetail")[0];
		this.lightingCost = Math.pow(slider.value, 3) * 6;
		this.block.getElementsByClassName("styleParameters")[0].getElementsByClassName("display")[1].innerHTML = `Lighting Detail: $${Math.round(this.lightingCost)}`;

		this.CalculatePriceTotal();
	}
}
class Character {
	baseFee = 0;
	totalFee = 0;
	parameters;
	index;
	
	topHair = 0;
	bodyHair = 0;
	shapeType = 0;

	constructor(parentBlock, parentIndex, controlIndex, startingFee)
	{
		this.index = `products[${parentIndex}].count[${controlIndex}]`;
		this.baseFee = startingFee;

		this.parameters = document.createElement("form");
		this.parameters.setAttribute("class", "characterBlock");
		this.parameters.innerHTML +=
		`
			<h2 class="totalDisplay">CHARACTER FEE: <b>$${this.baseFee}</b></h2>
			<label>Character Type:</label>
			<select>
				<option>Humanoid</option>
				<option>Anthro</option>
				<option>Other</option>
			</select>
			
			<label class="display">Top Hair Detail: $0</label>
			<input class="topHair" oninput="${this.index}.SetHairFee();products[${parentIndex}].CalculatePriceTotal();" type="range" step="0.1" min="0" max="1" value="0">

			<label class="display">Body Hair Detail: $0</label>
			<input class="bodyHair" oninput="${this.index}.SetBodyHairFee();products[${parentIndex}].CalculatePriceTotal();" type="range" step="0.1" min="0" max="1" value="0">
			
			<label class="display">Body Shape: 5</label>
			<input class="bodyBuild" oninput="${this.index}.SetBodyShape();products[${parentIndex}].CalculatePriceTotal();" type="range" step="0.1" min="0" max="1" value="0.5">
		`;
		
		parentBlock.getElementsByClassName("characters")[0].append(this.parameters);
		this.CalculateTotalFee();
	}

	SetHairFee()
	{
		let slider = this.parameters.getElementsByClassName("topHair")[0];
		this.topHair = Math.pow(slider.value, 2) * 5;
		this.parameters.getElementsByClassName("display")[0].innerText = `Top Hair Detail: $${Math.round(this.topHair)}`;

		this.CalculateTotalFee();
	}

	SetBodyHairFee()
	{
		let slider = this.parameters.getElementsByClassName("bodyHair")[0];
		this.bodyHair = Math.pow(slider.value, 2) * 5;
		this.parameters.getElementsByClassName("display")[1].innerText = `Body Hair Detail: $${Math.round(this.bodyHair)}`;

		this.CalculateTotalFee();
	}

	SetBodyShape()
	{
		let slider = this.parameters.getElementsByClassName("bodyBuild")[0];
		this.shapeType = slider.value * 10;
		this.parameters.getElementsByClassName("display")[2].innerText = `Body Shape: ${Math.round(this.shapeType)}`;

		this.CalculateTotalFee();
	}
	
	CalculateTotalFee()
	{
		this.totalFee = this.baseFee + this.topHair + this.bodyHair;
		this.totalFee = Math.round(this.totalFee);

		this.parameters.getElementsByClassName("totalDisplay")[0].innerHTML = `CHARACTER FEE: <b>$${this.totalFee}</b>`;
	}
}

function AddBlock()
{	
	if(products.length == 4)
		return;
	
	if(products.length > 0)
	{
		for (let t = 0; t < products.length; t++) {
			const element = products[t].block;
			
			element.style.setProperty("display", "none");
		}
		ticketIndex++;
	}

	products.push(new Product(products.length));
	UpdateCounter();
	CheckSwapButtons();
}

function SwapToNext()
{
	if(ticketIndex + 1 > products.length - 1)
		return;

	products[ticketIndex].block.style.setProperty("display", "none");
	
	ticketIndex++;
	products[ticketIndex].block.style.setProperty("display", "block");

	UpdateCounter();
	CheckSwapButtons();
}
function SwapToPrevious()
{
	if(ticketIndex - 1 < 0)
		return;
	
	previousTicket.style.setProperty("opacity", 1);
	products[ticketIndex].block.style.setProperty("display", "none");
	
	ticketIndex--;
	products[ticketIndex].block.style.setProperty("display", "block");
	
	UpdateCounter();
	CheckSwapButtons();
}

function CheckSwapButtons()
{
	previousTicket.style.setProperty("opacity", ticketIndex == 0 ? 0.25 : 1);
	nextTicket.style.setProperty("opacity", ticketIndex == products.length - 1 || products.length == 0 ? 0.25 : 1);	
}
function UpdateCounter()
{
	if(products.length == 0)
		ticketCounter.innerText = `0 / 0`;
	else
		ticketCounter.innerText = `${ticketIndex + 1} / ${products.length}`;
}