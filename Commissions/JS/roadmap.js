let map = document.getElementById("roadMap");
let mapDrag = document.getElementById("mapDrag");
let dateStamps = document.getElementsByClassName("dateStamp");
let colorFilters = document.getElementsByClassName("state");

let H_shift = 0, H_lastX = 0;
let V_shift = 0, V_lastY;
let H_lastShift = 0, V_lastShift = 0;

let today = new Date();
let resize;

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
	
	var d = new Date("October 8, 2024");
	d.setDate(d.getDate() + i);
	d.setUTCHours(d.getUTCHours() + 10);
	
	element.innerHTML = `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`;
	if(today.getDate() == d.getDate() && today.getMonth() == d.getMonth())
	{
		element.style.setProperty("background-color", "#773374");
		document.getElementsByClassName("roadColumn")[i].style.setProperty("background", "#b181af");
	}
}

function PrepSizes()
{
	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];
		element.Minimize();

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
	colorFilters[id].style.setProperty("opacity", getComputedStyle(colorFilters[id]).opacity == 1 ? 0.25 : 1);

	for (let i = 0; i < stack.length; i++) {
		const element = stack[i];
		element.SetClickableState(getComputedStyle(colorFilters[id]).opacity == 1 && (filterName == "" || element.name == filterName));
	}
}
function FilterByName(value)
{
	filterName = value;

	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];

		let toggleID = element.tag == "focused" ? 0 : element.tag == "delayed" ? 1 : 2;

		element.SetClickableState((filterName == "" || element.name == filterName) && getComputedStyle(colorFilters[toggleID]).opacity == 1);
	}
}
function ResizeBottom()
{
	resize = setInterval(() => {
		if(mapDrag.getBoundingClientRect().bottom < map.getBoundingClientRect().bottom)
		{
			V_lastShift = map.clientHeight - mapDrag.scrollHeight;
			mapDrag.style.top = `${V_lastShift}px`;
		}
		else
			clearInterval(resize);
	}, 25);
}