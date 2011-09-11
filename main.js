/*
* - Wall
. - Pill
g - Ghost
p - Players
o - Hunter Pill
*/


var directions=["Top","Bottom","Left","Right"],


initialise=function(){
var maze= [
	"*********************",
	"*.........*.........*",
	"*.***.***.*.***.***.*",
	"*.***.***.*.***.***.*",
	"*.***.***.*.***.***.*",
	"*...................*",
	"*.***.*.*****.*.***.*",
	"*.***.*.*****.*.***.*",
	"*.....*...*...*.....*",
	"*****.*** * ***.*****",
	"    *.*       *.*    ",
	"    *.* ** ** *.*    ",
	"*****.* * g * *.*****",
	"     .  *ggg*  .     ",
	"*****.* ***** *.*****",
	"    *.*       *.*    ",
	"    *.* ***** *.*    ",
	"*****.* ***** *.*****",
	"*.........*.........*",
	"*.***.***.*.***.***.*",
	"*...*.....p.....*...*",
	"***.*.*.*****.*.*.***",
	"***.*.*.*****.*.*.***",
	"*.....*...*...*.....*",
	"*.*******.*.*******.*",
	"*...................*",
	"*********************",
	
	];
	
	var playerDefaultSpeed = 100, ghostDefaultSpeed = 125;
	var container = document.body.appendChild(document.createElement("DIV"));
	container.className = "Container";
	
	var board = container.appendChild(createBoard(maze));
	
	var keyboard=new Keyboard(playerDefaultSpeed);
	keyboard.setListener("Up",function() {board.movePlayer("Top");});
	keyboard.setListener("Down",function() {board.movePlayer("Bottom");});
	keyboard.setListener("Right",function() {board.movePlayer("Right");});
	keyboard.setListener("Left",function() {board.movePlayer("Left");});
	
	var ghostTimer = undefined, ghostHardness = ghostDefaultSpeed;
	var resetGhostTimer = function(hardness) {
		if (ghostTimer!==0) window.clearInterval(ghostTimer);
		ghostSpeed.innerHTML = (ghostHardness=hardness);
		ghostTimer=window.setInterval( function(){ board.moveGhosts(); },hardness);
	}
	
	var resetPlayer = function(s) {
		keyboard.stop();
		keyboard.start(s);
		speed.innerHTML = s;
	}
	
	var toolbox = container.appendChild(document.createElement("DIV"));
	toolbox.className = "Toolbox";
	
	var buttons = toolbox.appendChild(document.createElement("DIV"));
	buttons.className = "Tool Buttons";
	
	var restartButton = buttons.appendChild(document.createElement("BUTTON"));
	restartButton.innerHTML = "Restart";
	restartButton.onclick = function(e) {
		keyboard.stop();
		window.clearInterval(ghostTimer);
		ghostTimer = 0;
		container.removeChild(board);
		board = container.insertBefore(createBoard(maze),container.lastChild);
		resetGhostTimer(ghostHardness);
		resetPlayer(playerDefaultSpeed);
		return false;
	}
	
	var easyButton = buttons.appendChild(document.createElement("BUTTON"));
		easyButton.innerHTML = "Easy";
		easyButton.onclick = function() {
			resetGhostTimer(200);
			restartButton.click();
		}
	var mediumButton = buttons.appendChild(document.createElement("BUTTON"));
		mediumButton.innerHTML = "Medium";
		mediumButton.onclick = function() {
			resetGhostTimer(150);
		restartButton.click();
		}
	var hardButton = buttons.appendChild(document.createElement("BUTTON"));
		hardButton.innerHTML = "Hard";
		hardButton.onclick = function() {
			resetGhostTimer(110);
		restartButton.click();
		}
	var expertButton = buttons.appendChild(document.createElement("BUTTON"));
		expertButton.innerHTML = "Expert";
		expertButton.onclick = function() {
			resetGhostTimer(50);
		restartButton.click();
		}
	
	var speedContainer = toolbox.appendChild(document.createElement("DIV"));
	speedContainer.className = "Tool Speed";
	speedContainer.appendChild(document.createElement("SPAN")).innerHTML="PacMan speed: ";
	var speed = speedContainer.appendChild(document.createElement("SPAN"));
	
	var ghostSpeedContainer = toolbox.appendChild(document.createElement("DIV"));
	ghostSpeedContainer.className = "Tool GhostSpeed";
	ghostSpeedContainer.appendChild(document.createElement("SPAN")).innerHTML="Ghost speed: ";
	var ghostSpeed = ghostSpeedContainer.appendChild(document.createElement("SPAN"));
	
	
	board.endGame = function(g) {
		window.clearInterval(ghostTimer);
		var p = this.getPlayer();
		p.parentNode.removeChild(p);
		if (confirm("Game Over"))
			restartButton.click();
		else 
			if (confirm ("Tag lige et spil mere!"))
				restartButton.click();
	}
	toolbox.style.height = board.offsetHeight+"px";
	
	resetGhostTimer(ghostDefaultSpeed);
	resetPlayer(playerDefaultSpeed);
}
var createBoard=function(maze){
	var board=document.createElement("table");
	board.className="Board";
	
	var rows=maze.length;
	var cols=maze[0].length;
	var player=undefined;
	var ghosts=[];
	
	board.getPlayer = function() {
		return player;
	}
	
	var boardBody=board.appendChild(document.createElement("tbody"));
	for (var y=0; y<rows;++y){
		var row=boardBody.appendChild(document.createElement("tr"));
		for (var x=0; x<cols; ++x){
			var cell=row.appendChild(document.createElement("td"));
			cell.getNeighbor=function(direction){
				switch(direction){
					case "Left":
						return this.previousSibling; break;
					case "Right":
						return this.nextSibling; break;
					case "Top":
						var p=this.parentNode.previousSibling;
						if (!p) return undefined;
						return p.cells[this.cellIndex];
						break;
					case "Bottom":
						var p=this.parentNode.nextSibling;
						if (!p) return undefined;
						return p.cells[this.cellIndex];
						break;
				}
			}	
					
			var type=maze[y].charAt(x);
		/*	if (type=="u")
				cell.appendChild(createImage("pacpix/wallhen.gif","Wall"));
			if (type=="w")
				cell.appendChild(createImage("pacpix/wallop.gif","Wall"));
			if (type=="i")
				cell.appendChild(createImage("pacpix/wallnedright.gif","Wall"));
			if (type=="t")
				cell.appendChild(createImage("pacpix/wallnedleft.gif","Wall"));
			if (type=="r")
				cell.appendChild(createImage("pacpix/wallopright.gif","Wall"));
			if (type=="q")
				cell.appendChild(createImage("pacpix/wallopleft.gif","Wall")); */
			if (type=='*') 
				cell.className="Wall";
			if (type==".")
				cell.appendChild(createImage("pacpix/Pills.gif","Pill"));
			if (type=="g") {
				var g=cell.appendChild(createImage("pacpix/GhostRight.gif","Ghost"));
				ghosts.push(g); 
				g.moveTo=function (c,direction) {
					if (this.pill) this.parentNode.appendChild(this.pill);
					this.parentNode.removeChild(this);
					this.pill = c.firstChild;
					c.appendChild(this);
					if (this.pill && this.pill.className!="Pill") this.pill = undefined;
					if (this.pill) c.removeChild(this.pill);
					this.src="pacpix/Ghost"+direction+".gif";
										
					if (player.parentNode==this.parentNode) board.endGame(this);					
				}
								
			}	
			if (type=="p") {
				player=cell.appendChild(createImage("pacpix/PacManLeft.gif","Player"));
				player.moveTo=function (c){
					this.parentNode.removeChild(this);
					c.appendChild(this);
					for (var i=0;i<ghosts.length;++i)
						if (ghosts[i].parentNode==c) {
							board.endGame(ghosts[i]);
							break;
							
						}
				}
			}
		}
	}
	board.movePlayer=function(direction){
		var currentCell=player.parentNode;
		var nextCell=currentCell.getNeighbor (direction);
		if (!nextCell) return;
		if (nextCell.className=="Wall") return;

		if (nextCell.firstChild) nextCell.removeChild(nextCell.firstChild);
		player.src="pacpix/PacMan"+direction+".gif";
		player.moveTo(nextCell);	
	}
	board.moveGhosts=function() {
		for (var i=0; i<ghosts.length;++i){
			var g=ghosts[i];
			var newDirection=this.calcDirection(g,player);
			if (newDirection) {
				var newCell=g.parentNode.getNeighbor(newDirection);
				g.moveTo(newCell,newDirection);
			}
		}
	}
	board.calcDirection = function(g,p) {

	var gC=g.parentNode;
	var gT=gC.getNeighbor("Top")
	var gB=gC.getNeighbor("Bottom")
	var gL=gC.getNeighbor("Left")
	var gR=gC.getNeighbor("Right")
	
	if (gT && (gT.className=="Wall" || (gT.firstChild && gT.firstChild.className=="Ghost"))) gT=undefined;
	if (gB && (gB.className=="Wall" || (gB.firstChild && gB.firstChild.className=="Ghost"))) gB=undefined;
	if (gL && (gL.className=="Wall" || (gL.firstChild && gL.firstChild.className=="Ghost"))) gL=undefined;
	if (gR && (gR.className=="Wall" || (gR.firstChild && gR.firstChild.className=="Ghost"))) gR=undefined;
	
	if (!gT && !gB && !gL && !gR) return undefined;
	
	var pX=p.parentNode.cellIndex;
	var pY=p.parentNode.parentNode.rowIndex;
	var dT=1000000000, dB=1000000000, dL=1000000000, dR=1000000000, dC=1000000000;
	
	if (gT) {
	var gX=gT.cellIndex-pX;
	var gY=gT.parentNode.rowIndex-pY;
	dT=gX*gX+gY*gY;
	}
	
	if (gB) {
	var gX=gB.cellIndex-pX;
	var gY=gB.parentNode.rowIndex-pY;
	dB=gX*gX+gY*gY;
	}
	
	if (gL) {
	var gX=gL.cellIndex-pX;
	var gY=gL.parentNode.rowIndex-pY;
	dL=gX*gX+gY*gY;
	}
	
	if (gR) {
	var gX=gR.cellIndex-pX;
	var gY=gR.parentNode.rowIndex-pY;
	dR=gX*gX+gY*gY;
	}
	var dir;
	if (dT<dB && dT<dL && dT<dR){
	dir="Top";
	}
	else if (dL && dB<dR)  {
	dir="Bottom";
	}
	else if (dR<dL) {
	dir="Right";
	}
	else dir="Left";
	
	
	return dir;
	}

	board.endGame = function(g) {}
	return board;
}

var createImage=function(src,className){
	var img=document.createElement("img");
	img.className=className;
	img.src=src;
	return img;
}