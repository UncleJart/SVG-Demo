//Main function========================================================
	function startGame(){
		var svgWidth = 800,
			svgHeight = svgWidth,
			numOfCells = 10,
			svg = createSVGElement(svgWidth,svgHeight),
			dimensions = calculateDimensions(svg,numOfCells),
			gridPoints = generateGridPoints(dimensions,svgWidth,svgHeight),
			snake = [],
			snakeHeadElement = createSnakeHead(gridPoints,dimensions),
			rotatePoints = [],
			food = [new Rectangle(0,0,dimensions.cellSideX,dimensions.cellSideY,"green","white")],
			timerFunction = null,
			speed = 600;

		function getDirection(event){
			var keyCode = event.keyCode,
				snakeHead = snake[0],
				direction;

			function changeSnakeDirection(direction){
				snakeHead = changeDirection(snakeHead,direction);
				rotatePoints.push(saveRotatePoint(snakeHead,direction));
			}

			event.preventDefault();

			switch(keyCode){
				case 38:{
					direction = "up";
					if(checkDirection(snakeHead,direction)){
						changeSnakeDirection(direction);
					}
					break;
				}
				case 40:{
					direction = "down";
					if(checkDirection(snakeHead,direction)){
						changeSnakeDirection(direction);
					}
					break;
				}
				case 37:{
					direction = "left";
					if(checkDirection(snakeHead,direction)){
						changeSnakeDirection(direction);
					}
					break;
				}
				case 39:{
					direction = "right";
					if(checkDirection(snakeHead,direction)){
						changeSnakeDirection(direction);
					}
					break;
				}
			}
		}

//Draw Snake Head
		function drawSnakeHead(svg,snakeHeadElement){
			var snakeRect = svgCreateRectangle(snakeHeadElement),
				snakeSection = {};

			svg.appendChild(snakeRect);
			snakeSection.rect = snakeRect;
			snakeSection.direction = generateDirection();

			snake.push(snakeSection);
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
			moveSnake(snake,dimensions,svgWidth,svgHeight);
		//If there is rotate point
			rotatePoints.forEach(function(item,i,array){
				var currSnakeEl = snake[item.num];

				//Function which changes direction at rotate point
				function rotateSnake(){
					var currSnakeElX = Number(currSnakeEl.rect.getAttribute("x")),
					currSnakeElY = Number(currSnakeEl.rect.getAttribute("y"));

					if((currSnakeElX == item.x)&&(currSnakeElY == item.y)){
						currSnakeEl = changeDirection(currSnakeEl,item.newDirection);
						/*console.log(item.num,currSnakeEl.direction);*/
					}
					/*console.log(currSnakeElX,item.x,currSnakeElY,item.y,i);*/
					item.num++;
				}

				if (array.length !== 0){
					if(item.num === snake.length){
						array.shift();
						item = array[i];
						if(item){
							if(item.num === snake.length) {
								array.shift();
							}else{
								currSnakeEl = snake[item.num];
								rotateSnake();
							}
						}
					}else{
						rotateSnake();
					}
				}
			});

		}

		document.addEventListener("keydown",getDirection);

		svgCreateGrid(svg,dimensions);

		snake = [
			{rect: svgCreateRectangle(new Rectangle(400,0,dimensions.cellSideX,dimensions.cellSideY,"black","white")),
			direction: "right"},
			{rect: svgCreateRectangle(new Rectangle(320,0,dimensions.cellSideX,dimensions.cellSideY,"black","white")),
				direction: "right"},
			{rect: svgCreateRectangle(new Rectangle(240,0,dimensions.cellSideX,dimensions.cellSideY,"black","white")),
				direction: "right"},
			{rect: svgCreateRectangle(new Rectangle(160,0,dimensions.cellSideX,dimensions.cellSideY,"black","white")),
				direction: "right"},
			{rect: svgCreateRectangle(new Rectangle(80,0,dimensions.cellSideX,dimensions.cellSideY,"black","white")),
				direction: "right"}
		];

		snake.forEach(function(item){
			svg.appendChild(item.rect);
		});
		/*drawSnakeHead(svg,snakeHeadElement); //goes to animate*/

		appendToDocumentFragment(createDocumentFragment(svg));

		startAnimation();
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
			rect = document.createElementNS(NS,"rect");

		rect.setAttribute("x",options.x);
		rect.setAttribute("y",options.y);
		rect.setAttribute("width",options.width);
		rect.setAttribute("height",options.height);
		rect.setAttribute("fill",options.fillColor);
		rect.setAttribute("stroke",options.strokeColor);
		rect.setAttribute("stroke-width",options.strokeWidth);

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
//Create Snake
	function createSnakeHead(gridPoints,dimensions){
		var snakeHead,
			xVals = gridPoints.x.length - 1,
			yVals = gridPoints.y.length - 1,
			x = gridPoints.x[getRoundedRandom(0,xVals,true)],
			y = gridPoints.y[getRoundedRandom(0,yVals,true)];

		snakeHead = new Rectangle(x,y,dimensions.cellSideX,dimensions.cellSideY,"#000000","#FFFFFF");

		return snakeHead;
	}

	function generateGridPoints(dimensions,svgWidth,svgHeight){
		var xGradePoints = [],
			yGradePoints = [],
			x = 0,
			y = 0;

		while (x < svgWidth){
			xGradePoints.push(x);
			x += dimensions.cellSideX;
		}

		while (y < svgHeight){
			yGradePoints.push(y);
			y += dimensions.cellSideY;
		}

		return {
			x : xGradePoints,
			y : yGradePoints
		}
	}

	function generateDirection(){
		var directions = ["up","down","right","left"];
		return directions[getRoundedRandom(0,3,true)];
	}

//set Snake Element Direction
	function setDirection(snakeRect,direction,dimensions,svgWidth,svgHeight){
		switch (direction){
			case "up": moveUp(snakeRect,dimensions,svgWidth);
				break;
			case "down": moveDown(snakeRect,dimensions,svgWidth);
				break;
			case "left": moveLeft(snakeRect,dimensions,svgHeight);
				break;
			case "right": moveRight(snakeRect,dimensions,svgHeight);
				break;
		}
	}
//Move Snake Element direction
	function moveRight(element,dimensions,svgWidth){
		var currentX = Number(element.getAttribute("x"));
		currentX += dimensions.cellSideX;
		if (currentX === svgWidth){
			currentX = 0;
		}
		element.setAttribute("x",currentX);
	}

	function moveLeft(element,dimensions,svgWidth){
		var currentX = Number(element.getAttribute("x"));
		currentX -= dimensions.cellSideX;
		if (currentX < 0){
			currentX = svgWidth - dimensions.cellSideX;
		}
		element.setAttribute("x",currentX);
	}

	function moveUp(element,dimensions,svgHeight){
		var currentY = Number(element.getAttribute("y"));
		currentY -= dimensions.cellSideY;
		if (currentY < 0){
			currentY = svgHeight - dimensions.cellSideY;
		}
		element.setAttribute("y",currentY);
	}

	function moveDown(element,dimensions,svgHeight){
		var currentY = Number(element.getAttribute("y"));
		currentY += dimensions.cellSideY;
		if (currentY == svgHeight){
			currentY = 0;
		}
		element.setAttribute("y",currentY);
	}
//Move All Snake Elements
	function moveSnake(snake,dimensions,svgWidth,svgHeight){
		snake.forEach(function(item){
			setDirection(item.rect,item.direction,dimensions,svgWidth,svgHeight);
		})
	}

	function checkDirection(snakeElement,direction){
		var oppositeDirection;

		switch (snakeElement.direction){
			case "up":{
				oppositeDirection = "down";
				break;
			}
			case "down":{
				oppositeDirection = "up";
				break;
			}
			case "left":{
				oppositeDirection = "right";
				break;
			}
			case "right":{
				oppositeDirection = "left";
				break;
			}
		}
		return (snakeElement.direction !== direction) && (oppositeDirection !== direction)
	}

	function saveRotatePoint(snakeHead,direction){

		return {
			x : Number(snakeHead.rect.getAttribute("x")),
			y : Number(snakeHead.rect.getAttribute("y")),
			num : 1,
			newDirection : direction
		};
	}

	function changeDirection(snakeElement,newDirection){
		if (snakeElement.direction !== newDirection){
			snakeElement.direction = newDirection;
		}
		return snakeElement;
	}
//Utils ===========================================================================
	function getMin(num1,num2){
		if(num1 instanceof Array){
			return Math.min.apply(null,num1);
		}else{
			return Math.min(num1,num2);
		}
	}

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}

	function getRoundedRandom(min,max,rounded){
		return rounded ?
				Math.round(getRandom(min,max)) :
				Math.floor(getRandom(min,max))
	}
//Start game========================
startGame();