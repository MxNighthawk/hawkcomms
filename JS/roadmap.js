//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

let map = document.getElementById("roadMap");
let mapDrag = document.getElementById("mapDrag");
let dateStamps = document.getElementsByClassName("dateStamp");

let colorTags = document.getElementsByClassName("state");
let nameSearch = document.getElementById("nameSearch");
let pacificTime = document.getElementById("localTime");

let H_shift = 0, H_lastX = 0;
let V_shift = 0, V_lastY;
let H_lastShift = 0, V_lastShift = 0;

let today = new Date();
today.setUTCHours(today.getUTCHours() - 8);

let resize;
let use12HourCycle = true;

function Clamp(f, min, max)
{
	if(f < min)
		f = min;
	else if(f > max)
		f = max;

	return f;
}
let filterName = "";

for (let i = 0; i < dateStamps.length; i++) {
	const element = dateStamps[i];
	
	var d = new Date("October 25, 2024");
	d.setUTCDate(d.getUTCDate() + i);
	d.setUTCHours(today.getUTCHours());
	
	element.innerHTML = `${d.getUTCMonth() + 1} / ${d.getUTCDate()} / ${d.getUTCFullYear()}`;
	if(today.getUTCDate() == d.getUTCDate() && today.getUTCMonth() == d.getUTCMonth())
		element.parentElement.classList.add("currentDay");
}

function DisplayPacificTime()
{
	let pacific = new Date();
	pacific.setUTCHours(today.getUTCHours());
	
	let hour = pacific.getUTCHours();
	let minutes = pacific.getUTCMinutes();
	let seconds = pacific.getUTCSeconds();

	if(!use12HourCycle)
		pacificTime.innerText = `Pacific Time - ${hour}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	else
		pacificTime.innerText = `Pacific Time - ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds} ${parseInt(hour / 12) == 1 ? "PM" : "AM"}`;		
}

setInterval(() => {
	DisplayPacificTime();
}, 500);

function SwapTimeFormat()
{
	use12HourCycle = !use12HourCycle;
	DisplayPacificTime();
}

function PrepSizes()
{
	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];
		element.MinimizePrep();

		switch (element.tag) {
			case "focused":
				focused.push(element);
				break;
			case "delayed":
				delayed.push(element);
				break;
			default:
				queued.push(element);
				break;
		}
	}
}

GenerateDrag(map, mapDrag, H_shift, H_lastX, V_shift, V_lastY, H_lastShift, V_lastShift);
map.addEventListener("click", (e) => 
{
	clearInterval(resize);
	ResizeBottom();
});
map.addEventListener("touchend", (e) => 
{
	clearInterval(resize);
	ResizeBottom();
});

function FilterByColor(id)
{
	let stack = id == 0 ? focused : id == 1 ? delayed : queued;
	colorTags[id].style.setProperty("opacity", getComputedStyle(colorTags[id]).opacity == 1 ? 0.25 : 1);

	for (let i = 0; i < stack.length; i++) {
		const element = stack[i];
		element.SetClickableState(getComputedStyle(colorTags[id]).opacity == 1 && (filterName == "" || element.name == filterName));
	}
}
function FilterByName()
{
	filterName = nameSearch.value;

	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];

		let toggleID = element.tag == "focused" ? 0 : element.tag == "delayed" ? 1 : 2;

		element.SetClickableState((filterName == "" || element.name == filterName) && getComputedStyle(colorTags[toggleID]).opacity == 1);
	}
}
function ResizeBottom()
{
	resize = setInterval(() => {
		if(mapDrag.getBoundingClientRect().bottom < map.getBoundingClientRect().bottom)
		{
			V_lastShift = map.clientHeight - mapDrag.scrollHeight;
			mapDrag.style.setProperty("top", `${V_lastShift}px`);
		}
		else
			clearInterval(resize);
	}, 25);
}