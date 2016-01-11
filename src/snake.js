//Main function========================================================
	function startGame(){
		var svgWidth = 800,
			svgHeight = svgWidth,
			svg = createSVGElement(svgWidth,svgHeight),
			numOfCells = 10,
			dimensions = calculateDimensions(svg,numOfCells),
			gridPoints = generateGridPoints(dimensions,svgWidth,svgHeight),
			snake = [],
			snakeHeadElement = createSnakeElement(gridPoints,dimensions),
			rotatePoints = [],
			food,
			timerFunction = null,
			speed = 600,
			speedUp = 20,
			maxSpeed = 180,
			score = 0,
			scoreUp = 10,
			timeout;

		function getDirection(event){
			var keyCode = event.keyCode,
				snakeHead = snake[0],
				direction;

			function changeSnakeDirection(direction){
				snakeHead = changeDirection(snakeHead,direction);
				rotatePoints.push(saveRotatePoint(snakeHead,direction));
			}

			function setDirection(snakeHead,direction){
				if(checkDirection(snakeHead,direction)){
					changeSnakeDirection(direction);
				}
			}

			event.preventDefault();

			clearTimeout(timeout);
			timeout = setTimeout(function(){
				switch(keyCode){
					case 38:{
						direction = "up";
						setDirection(snakeHead,direction);
						break;
					}
					case 40:{
						direction = "down";
						setDirection(snakeHead,direction);
						break;
					}
					case 37:{
						direction = "left";
						setDirection(snakeHead,direction);
						break;
					}
					case 39:{
						direction = "right";
						setDirection(snakeHead,direction);
						break;
					}
				}
			},maxSpeed);

		}

//Draw Snake Head
		function drawElement(svg,element){
			var drawEl = svgCreateRectangle(element);

			svg.appendChild(drawEl);

			return drawEl;
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
			var snakeHead = snake[0];


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
					}
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


			if(checkHeadAndFoodMerge(snake,food,dimensions,svgWidth,svgHeight)){
				setPredictablePosition(snakeHead,food,dimensions,svgWidth,svgHeight);
				food.setAttribute("fill","#000000");
				addSnakeElement(snake,food,snakeHead.direction);
				food = drawElement(svg,generateFoodElement(gridPoints,dimensions,snake));

				rotatePoints.forEach(function(item){
					item.num++;
				});

				score += scoreUp;
				if(speed > maxSpeed){
					speed -= speedUp;

					/*stopAnimation();startAnimation();*/
				}
			}

			if(checkCollision(snake)){
				/*while (svg.firstChild){
					svg.removeChild(svg.firstChild);
				}
				startGame(svg);*/
				console.log("collision");
			}
		}

		/*while (svg.firstChild){
			svg.removeChild(svg.firstChild);
		}*/

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

		appendToDocumentFragment(createDocumentFragment(svg));
		startAnimation();

		/*addSnakeElement(snake,drawElement(svg,snakeHeadElement)); //goes to animate??*/

		food = drawElement(svg,generateFoodElement(gridPoints,dimensions,snake));

		document.addEventListener("keydown",getDirection);
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
	function svgCreateGrid(svgEl,dim){ //reWrite to Lines           ===>!!!!!!!!!!!!!!!!!!!!!!!!
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
	function createSnakeElement(gridPoints,dimensions,fillColor,strokeColor){
		var snakeElement,
			xVals = gridPoints.x.length - 1,
			yVals = gridPoints.y.length - 1,
			x = gridPoints.x[getRoundedRandom(0,xVals,true)],
			y = gridPoints.y[getRoundedRandom(0,yVals,true)];

		fillColor = fillColor || "#000000";
		strokeColor = strokeColor || "#FFFFFF";

		snakeElement = new Rectangle(x,y,dimensions.cellSideX,dimensions.cellSideY,fillColor,strokeColor);

		return snakeElement;
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

	function addSnakeElement(snakeArray,snakeElement,direction){
		var snakeSection = {},
			length = snakeArray.length;

		direction = direction || "";

		snakeSection.rect = snakeElement;
		if (length === 0){
			snakeSection.direction = generateDirection();
		}else{
			snakeSection.direction = direction;
		}
		snakeArray.unshift(snakeSection);
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
//Step functions
	function stepRight(element,dimensions,svgWidth){
		var currentX = Number(element.getAttribute("x"));
		currentX += dimensions.cellSideX;
		if (currentX === svgWidth){
			currentX = 0;
		}
		return currentX;
	}

	function stepLeft(element,dimensions,svgWidth){
		var currentX = Number(element.getAttribute("x"));
		currentX -= dimensions.cellSideX;
		if (currentX < 0){
			currentX = svgWidth - dimensions.cellSideX;
		}
		return currentX;
	}

	function stepUp(element,dimensions,svgHeight){
		var currentY = Number(element.getAttribute("y"));
		currentY -= dimensions.cellSideY;
		if (currentY < 0){
			currentY = svgHeight - dimensions.cellSideY;
		}
		return currentY;
	}

	function stepDown(element,dimensions,svgHeight) {
		var currentY = Number(element.getAttribute("y"));
		currentY += dimensions.cellSideY;
		if (currentY == svgHeight) {
			currentY = 0;
		}
		return currentY;
	}
//Move Snake Element direction
	function moveRight(element,dimensions,svgWidth){
		element.setAttribute("x",stepRight(element,dimensions,svgWidth));
	}

	function moveLeft(element,dimensions,svgWidth){
		element.setAttribute("x",stepLeft(element,dimensions,svgWidth));
	}

	function moveUp(element,dimensions,svgHeight){
		element.setAttribute("y",stepUp(element,dimensions,svgHeight));
	}

	function moveDown(element,dimensions,svgHeight){
		element.setAttribute("y",stepDown(element,dimensions,svgHeight));
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
//Generate food element
	function generateFoodElement(gridPoints,dimensions,snake){
		var food;

		function checkCoordinates(item){
			var currSnakeElX = Number(item.rect.getAttribute("x")),
				currSnakeElY = Number(item.rect.getAttribute("y")),
				foodX = Number(food.x),
				foodY = Number(food.y);

			return currSnakeElX === foodX && currSnakeElY == foodY
		}

		do {
			food = createSnakeElement(gridPoints,dimensions,"green");
		} while (snake.some(checkCoordinates));

		return food;
	}
//Check Head and Food position
	function checkHeadAndFoodMerge(snake,food,dimensions,svgWidth,svgHeight){
		var snakeHead = snake[0],
			snakeHeadCoords = {},
			foodCoords = {};

		foodCoords.x = Number(food.getAttribute("x"));
		foodCoords.y = Number(food.getAttribute("y"));
		snakeHeadCoords.x = Number(snakeHead.rect.getAttribute("x"));
		snakeHeadCoords.y = Number(snakeHead.rect.getAttribute("y"));

		/*snakeHeadCoords = getPredictablePosition(snakeHead,dimensions,svgWidth,svgHeight);*/

		return foodCoords.x === snakeHeadCoords.x && foodCoords.y === snakeHeadCoords.y;
	}
//Check Head position + 1 rectangle
	function setPredictablePosition(snakeElement,food,dimensions,svgWidth,svgHeight){
		var snakeRect = snakeElement.rect,
			direction = snakeElement.direction;

		switch (direction){
			case "up":{
				food.setAttribute("y",stepUp(snakeRect,dimensions,svgHeight));
				break;
			}
			case "down":{
				food.setAttribute("y",stepDown(snakeRect,dimensions,svgHeight));
				break;
			}
			case "left":{
				food.setAttribute("x",stepLeft(snakeRect,dimensions,svgWidth));
				break;
			}
			case "right":{
				food.setAttribute("x",stepRight(snakeRect,dimensions,svgWidth));
				break;
			}
		}
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

	function checkCollision(snake){
		return snake.some(function(item,i,array){
			var headCoordX = array[0].rect.getAttribute("x"),
				headCoordY = array[0].rect.getAttribute("y"),
					snakeElCoordX = item.rect.getAttribute("x"),
					snakeElCoordY = item.rect.getAttribute("y");

			return i !== 0 && headCoordX === snakeElCoordX && headCoordY === snakeElCoordY;
		});
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