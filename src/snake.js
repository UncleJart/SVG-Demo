//Global Variables ================================================================
	var svg = createSVGElement(800,800),
		dimensions = calculateDimensions(svg,10),
		square = new Rectangle(0,0,dimensions.cellSideX,dimensions.cellSideY,"black","white"),
		eat = [new Rectangle(0,0,dimensions.cellSideX,dimensions.cellSideY,"green","white")],
		timerFunction = null,
		speed = 300,
		direction;
//Utils ===========================================================================
	function getMin(num1,num2){
		if(num1 instanceof Array){
			return Math.min.apply(null,num1);
		}else{
			return Math.min(num1,num2);
		}
	}
//Create SVG Element ==============================================================
	function createSVGElement(width,height){
		var NS = createSVGNS(),
			svg = document.createElementNS(NS,"svg");

		width = width || 100;
		height = height || 100;

		svg.setAttribute("width",width);
		svg.setAttribute("height",height);
		svg.setAttribute("viewport","0 0 " + width + " " + height);

		return svg;
	}

	function createSVGNS(){
		return "http://www.w3.org/2000/svg";
	}
//Work with DOM ===================================================================
	function createDocumentFragment(element){
		var fragment = document.createDocumentFragment(); //rewrite for multiple elements

		fragment.appendChild(element);
		return fragment;
	}

	function appendToDocumentFragment(fragment,parentNode){
		parentNode = parentNode || document.body;

		if (parentNode == document.body){
			parentNode.insertBefore(fragment,parentNode.lastChild);
		}else{
			parentNode.appendChild(fragment);
		}
	}
//SVG Draw Figures ===============================================================
//Rectangle constructor  =========================================================
	function Rectangle(x,y,width,height,fillColor,strokeColor,strokeWidth){
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 10;
		this.height = height || 10;
		this.fillColor = fillColor || "white";
		this.strokeColor = strokeColor || "black";
		this.strokeWidth = strokeWidth || 1;
	}
//Make Rectangle
	function svgCreateRectangle(options){
		var NS = createSVGNS(),
			rect = document.createElementNS(NS,"rect"),
			x,y,width,height,fillColor,strokeColor,strokeWidth;

			x = options.x;
			y = options.y;
			width = options.width;
			height = options.height;
			fillColor = options.fillColor;
			strokeColor = options.strokeColor;
			strokeWidth = options.strokeWidth;

		rect.setAttribute("x",x);
		rect.setAttribute("y",y);
		rect.setAttribute("width",width);
		rect.setAttribute("height",height);
		rect.setAttribute("fill",fillColor);
		rect.setAttribute("stroke",strokeColor);
		rect.setAttribute("stroke-width",strokeWidth);

		return rect;
	}
//Calculate minWidth and minHeight ============================
	function calculateDimensions(svgEl,cellNum){
		var width = svgEl.getAttribute("width"),
			height = svgEl.getAttribute("height"),
			cellSideX,cellSideY;

		if(width >= height){
			cellSideX = width / cellNum;
			cellSideY = height / cellNum;
		}else{
			cellSideX = width / cellNum;
			cellSideY = height / cellNum;
		}

		return {
			cellSideX : cellSideX,
			cellSideY : cellSideY
		}
	}
//Create SVG Grid
	function svgCreateGrid(svgEl,dim){ //change to Lines
		var width = svgEl.getAttribute("width"),
			height = svgEl.getAttribute("height"),
			startX = 0,
			startY = 0,
			squareNum,square;

		squareNum = (width * height)/(dim.cellSideX * dim.cellSideY);

		for(var count = 1; count <= squareNum; count++){
			square = new Rectangle(startX,startY,dim.cellSideX,dim.cellSideY);
			svgEl.appendChild(svgCreateRectangle(square));
			startX += dim.cellSideX;
			if(startX == width){

				startX = 0;
				startY += dim.cellSideY;
			}
		}
	}
//checkDirection
	function setDirection(direction){
		switch (direction){
			case "up": moveUp(svg,someVal);
				break;
			case "down": moveDown(svg,someVal);
				break;
			case "left": moveLeft(svg,someVal);
				break;
			case "right": moveRight(svg,someVal);
				break;
		}
	}

	function moveRight(svgEl,element){
		var currentX = Number(element.getAttribute("x"));
		currentX += dimensions.cellSideX;
		if (currentX == svgEl.getAttribute("width")){
			currentX = 0;
		}
		element.setAttribute("x",currentX);
	}

	function moveLeft(svgEl,element){
		var currentX = Number(element.getAttribute("x"));
		currentX -= dimensions.cellSideX;
		if (currentX < 0){
			currentX = svgEl.getAttribute("width") - dimensions.cellSideX;
		}
		element.setAttribute("x",currentX);
	}

	function moveUp(svgEl,element){
		var currentY = Number(element.getAttribute("y"));
		currentY -= dimensions.cellSideY;
		if (currentY < 0){
			currentY = svgEl.getAttribute("height") - dimensions.cellSideY;
		}
		element.setAttribute("y",currentY);
	}

	function moveDown(svgEl,element){
		var currentY = Number(element.getAttribute("y"));
		currentY += dimensions.cellSideY;
		if (currentY == svgEl.getAttribute("height")){
			currentY = 0;
		}
		element.setAttribute("y",currentY);
	}

//Animations ===============================
	function startAnimation() {
		if(timerFunction == null) {
			timerFunction = setInterval(animate, speed);
		}
	}

	function stopAnimation() {
		if(timerFunction != null){
			clearInterval(timerFunction);
			timerFunction = null;
		}
	}

	function animate() {
		switch (direction){
			case "up": moveUp(svg,someVal);
				break;
			case "down": moveDown(svg,someVal);
				break;
			case "left": moveLeft(svg,someVal);
				break;
			case "right": moveRight(svg,someVal);
				break;
			default: moveRight(svg,someVal);
		}
	}

	document.addEventListener("keydown",function(event){
		var keyCode = event.keyCode;
		switch(keyCode){
			case 38:
				direction = "up";
				break;
			case 40:
				direction = "down";
				break;
			case 37:
				direction = "left";
				break;
			case 39:
				direction = "right";
				break;
		}
	});

	svgCreateGrid(svg,dimensions);
	var someVal = svgCreateRectangle(square);
	svg.appendChild(someVal);

	startAnimation();

	appendToDocumentFragment(createDocumentFragment(svg));
