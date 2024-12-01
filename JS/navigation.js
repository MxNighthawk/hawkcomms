let tools = [
	"portfolio",
	"commissionEditor",
	"roadMap",
	"qNa"
];
let selectedIndex = 0;

let nav = document.getElementsByTagName("nav")[0];
let menu = nav.getElementsByTagName("button");
let mini = document.getElementById("mobileMenuToggle");

let selectedTool = document.getElementById(tools[0]);
let showMenu = false, showMini = false;

selectedTool.style.setProperty("display", "block");
menu[0].classList.add("selectedTool");

window.onresize = () =>
{
	if(window.innerWidth > 500)
	{
		nav.style.setProperty("display", "flex");
		showMini = showMenu = false;
	}
	else
	{
		nav.style.setProperty("display", "none");
		showMini = showMenu = true;
	}
};

function SetToolVisiblitiy(id)
{
	selectedTool.style.setProperty("display", "none");
	menu[selectedIndex].classList.remove("selectedTool");
	
	selectedIndex = id;
	selectedTool = document.getElementById(tools[id]);

	selectedTool.style.setProperty("display", "block");
	menu[selectedIndex].classList.add("selectedTool");
}

function HideMiniMenu()
{
	if(needsAWarning)
		mini.style.setProperty("display", "none");
	
	if(window.innerWidth > 500)
		return;

	mini.style.setProperty("display", showMini ? "block" : "none");
	showMini = !showMini;
}

function ShowMobileNav()
{
	if(window.innerWidth > 500)
		return;

	showMenu = !showMenu;
	nav.style.setProperty("display", showMenu ? "flex" : "none");
}

function HideAllParts()
{
	for (let i = 1; i < tools.length; i++) {
		const element = tools[i];
		
		document.getElementById(element).style.setProperty("display", "none");
	}
}