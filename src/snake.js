	var svg = createSVGElement(800,800);

	function getMin(num1,num2){
		if (typeof num1 === "number"){
			if (num1 < num2){
				return num1;
			}else{
				return num2;
			}
		}else if(num1 instanceof Array){
			return Math.min.apply(null,num1);
		}else{
			return null;
		}
	}

	function createSVGNS(){
		return "http://www.w3.org/2000/svg";
	}

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
//Rectangle
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

	function appendElement(parentNode,element){
		parentNode.appendChild(element);
	}

	function svgCreateGrid(svgEl,cellNum){
		var width = svgEl.getAttribute("width"),
			height = svgEl.getAttribute("height"),
			startX = 0,
			startY = 0,
			cellSideX,cellSideY,squareNum,square;

		if(width >= height){
			cellSideX = width / cellNum;
			cellSideY = height / cellNum;
		}else{
			cellSideX = width / cellNum;
			cellSideY = height / cellNum;
		}

		squareNum = (width * height)/(cellSideX * cellSideY);

		for(var count = 1; count <= squareNum; count++){
			square = new Rectangle(startX,startY,cellSideX,cellSideY);
			svgEl.appendChild(svgCreateRectangle(square));
			startX += cellSideX;
			if(startX == width){
				startX = 0;
				startY += cellSideY;
			}
		}
	}

	svgCreateGrid(svg,10);

	appendToDocumentFragment(createDocumentFragment(svg));

	document.addEventListener("keydown",function(event){
		var keyCode = event.keyCode;
		switch(keyCode){
			case 38: console.log("Up");
				break;
			case 40: console.log("Down");
				break;
			case 37: console.log("Left");
				break;
			case 39: console.log("Right");
				break;
		}
	});