//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

function GenerateDrag(elmement, draggable, xShift, lastX, yShift, lastY, lastXShift, lastYShift, focusBlock = null)
{
	elmement.addEventListener("mousemove", (e) =>
	{
		DragRoadmap(e, false);
	});
	elmement.addEventListener("touchstart", (e) =>
	{
		xShift = lastX = e.touches[0].pageX;
		yShift = lastY = e.touches[0].pageY;
	});
	elmement.addEventListener("touchmove", (e) =>
	{
		e.preventDefault();
		DragRoadmap(e, true);
	});
	
	function DragRoadmap(e, isTouch)
	{
		if(focusBlock != null && focusBlock.state)
			return;

		let x = isTouch ? e.touches[0].pageX : e.pageX;
		let y = isTouch ? e.touches[0].pageY : e.pageY;
		
		if(!isTouch && e.buttons != 1)
		{
			xShift = lastX = x;
			yShift = lastY = y;
			return;
		}
		
		if(draggable.scrollWidth > elmement.clientWidth)
		{
			xShift = x - lastX;
			lastX = x;
			lastXShift += xShift;
			lastXShift = Clamp(lastXShift, elmement.clientWidth - draggable.scrollWidth, 0);
			draggable.style.setProperty("left", `${lastXShift}px`);
		}
		else if(draggable.clientWidth < elmement.clientWidth)
			draggable.style.setProperty("left", `0px`);

		if(draggable.scrollHeight > elmement.clientHeight)
		{
			yShift = y - lastY;
			lastY = y;
			lastYShift += yShift;
			lastYShift = Clamp(lastYShift, elmement.clientHeight - draggable.scrollHeight, 0);
			draggable.style.setProperty("top", `${lastYShift}px`);
		}
		else if(draggable.clientHeight < elmement.clientHeight)
			draggable.style.setProperty("top", `0px`);
	}
}