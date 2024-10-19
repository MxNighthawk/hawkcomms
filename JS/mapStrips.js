class Interpolations
{
	Lerp(a, b, t)
	{
		if(t > 1)
			t = 0;
		else if(t < 0)
			t = 0;
		
		return a + (b - a) * t;
	}
}

class Task extends Interpolations
{
	priceTag;
	pieceType;
	quantity;
	fillPercent;

	constructor(orderTiles, price, type, quantity, details, makeRow, includedInRow, completion)
	{
		super();
		this.priceTag = price;
		this.pieceType = type;
		this.quantity = quantity;
		this.fillPercent = completion;

		let tileContainer = orderTiles.getElementsByClassName("orderTiles")[0];
		let destiation = tileContainer;
		let colorPart = 200 + 55 * Math.pow(completion / 100, 2);

		if(makeRow)
			tileContainer.innerHTML += "<div class='tileRow'>";
		
		if(includedInRow != undefined)
			destiation = tileContainer.getElementsByClassName("tileRow")[includedInRow];

		destiation.innerHTML +=
		`<div class="orderTile" style="color: ">
			<div class="fill" style="width: ${100 - completion}%"></div>
			<p style="color: rgb(${colorPart}, ${colorPart}, ${colorPart})">
				$${this.priceTag}, ${this.pieceType} x${this.quantity}
				${details}
			</p>
		</div>`;
	}
}
class Strip extends Interpolations
{
	name;
	tag;
	
	#self;
	#target = 0;
	#orignalHeight;
	#canBeClicked;

	#totalPrice = 0;
	#totalProgress = 0;

	orders = [];

	constructor(element, dateShift, metaData)
	{
		super();
		this.#self = element;
		this.name = metaData[0];
		this.tag = metaData[3];
		this.orders = metaData[4];

		const eta = this.#self.getElementsByClassName("userETA")[0];
		eta.getElementsByClassName("username")[0].innerText = this.name;
		eta.getElementsByClassName("eta")[0].innerText = `ETA: ${metaData[1]} ${metaData[2]}`;
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$999`;

		this.SetClickableState(true);
		this.#self.addEventListener("click", () =>
		{
			if(!this.#canBeClicked)
				return;

			if(this.#target == 0)
			{
				this.#target = 1;
				this.#self.style.borderRadius = "2px 2px 0px 0px";
			}
			else
			{
				this.#target = 0;
				this.#self.style.borderRadius = "2px";
			}
			
			this.#self.style.height = `${this.Lerp(35, this.#orignalHeight, this.#target)}px`;
		});

		for (let i = 0; i < this.orders.length; i++) {
			const element = this.orders[i];

			this.#totalPrice += element.priceTag;
			this.#totalProgress += element.fillPercent;
		}
		
		eta.getElementsByClassName("fill")[0].style.setProperty("width", `${100 - this.#totalProgress / this.orders.length}%`);
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$${this.#totalPrice}`;
		this.#self.style.width = `${316 + (164 * (metaData[2] == "Hours" || metaData[2] == "Hour" ? 0 : metaData[1] - 1))}px`;
		this.#self.style.setProperty("--leftShift", dateShift);

		let col = 0;
		switch (this.tag) {
			case "focused":
				col = 104;
				break;
			case "delayed":
				col = 15;
				break;
			default:
				col = 220;
				break;
		}

		this.#self.style.setProperty("--colorRotation", col);
	}

	Minimize()
	{
		this.#orignalHeight = this.#self.clientHeight;
		this.#self.style.height = `${this.Lerp(35, this.#orignalHeight, 0)}px`;
	}

	SetClickableState(state)
	{
		this.#canBeClicked = state;
		this.#self.style.opacity = state ? "1" : "0.25";
		this.#self.style.cursor = this.#canBeClicked ? "pointer" : "default";
	}
}

let order = document.getElementsByClassName("order");
let stripParent = document.getElementsByClassName("orderStrips")[0];

stripParent.style.setProperty("--leftShift", 4);

let orderStrips =
[
	// constructor(orderTiles, price, type, quantity, details, makeRow, includedInRow, completion)
	new Strip(order[0], 1,
	["Axelorca", 2, "Days", "focused", 
		[
			new Task(order[0], 25, "Stickers", 5, "<br> + 2 Characters<br> + Sketch", true, 0, 20),
			new Task(order[0], 50, "Still", 1, "<br> + Background<br> + Basic Lighting", false, 0, 40),
			new Task(order[0], 80, "Ref Sheet", 1, "<br> + Front, Side, Back Angles<br> + Unlit", false, undefined, 0),
		]
	]),
	new Strip(order[1], 4,
	["Will Ott", 7, "Days", "delayed", 
		[
			new Task(order[1], 45, "Stickers", 15, "<br> + Sketch", false, undefined, 50),
		]
	]),
	new Strip(order[2], 4,
	["Axelorca", 3, "Days", "", 
		[
			new Task(order[2], 25, "Stickers", 5, "<br> + 2 Characters<br> + Sketch", true, 0, 50),
			new Task(order[2], 50, "Still", 1, "<br> + Background<br> + Basic Lighting", false, 0, 30),
			new Task(order[2], 80, "Ref Sheet", 1, "<br> + Front, Side, Back Angles<br> + Unlit", false, undefined, 50),
		]
	]),
	new Strip(order[3], 6,
	["Axelorca", 4, "Days", "", 
		[
			new Task(order[3], 25, "Stickers", 5, "<br> + 2 Characters<br> + Sketch", true, 0, 30),
			new Task(order[3], 50, "Still", 1, "<br> + Background<br> + Basic Lighting", false, 0, 80),
			new Task(order[3], 80, "Ref Sheet", 1, "<br> + Front, Side, Back Angles<br> + Unlit", false, undefined, 0),
		]
	]),
	new Strip(order[4], 0,
	["Orion Vance", 5, "Days", "focused", 
		[
			new Task(order[4], 25, "Stickers", 5, "<br> + 2 Characters<br> + Sketch", true, 0, 40),
			new Task(order[4], 50, "Still", 1, "<br> + Background<br> + Basic Lighting", false, 0, 60),
		]
	]),
];
let focused = [], delayed = [], queued = [];