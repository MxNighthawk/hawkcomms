let tools = [
	"portfolio",
	"commissionEditor",
	"roadMap",
	"qNa"
];
let selectedIndex = 0;

let nav = document.getElementsByTagName("nav")[0];
let menu = nav.getElementsByTagName("button");
let selectedTool = document.getElementById(tools[0]);
let showMenu = false;

selectedTool.style.setProperty("display", "block");
menu[0].classList.add("selectedTool");

window.onresize = () =>
{
	if(window.innerWidth > 500)
	{
		nav.style.setProperty("display", "flex");
		showMenu = false;
	}
	else
		nav.style.setProperty("display", "none");
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

function ShowMobileNav()
{
	if(window.innerWidth > 500)
		return;

	showMenu = !showMenu;
	nav.style.setProperty("display", showMenu ? "flex" : "none");
}