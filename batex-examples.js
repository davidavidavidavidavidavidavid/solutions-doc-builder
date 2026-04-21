// BaTeX demo strings (loaded before the inline CanvasMath render script in index.html)
var BATEX_DEMO_MATH = "$\\balancescale{a}{5;23}$";
var BATEX_DEMO_DIAGRAM = `\\begin{diagram}
// Longform; see below for shorthand version
ctx.setSize(200,200); //sets the size of the diagram 
ctx.beginPath(); //begins the line you want to draw
ctx.strokeStyle = colors.pink; //sets the color of your pen
ctx.moveTo(10,10); //moves pen to the point (10,10)
ctx.lineTo(100,100); //makes a line to point (100,100)
ctx.stroke(); //draws the line and ends the line path
ctx.beginPath();
ctx.strokeStyle = colors.defaultblack; //sets the color of your pen back to black
ctx.lineWidth = 4; //sets the thickness of your line higher
ctx.moveTo(20,50); 
ctx.lineTo(100,200); 
ctx.stroke();
ctx.beginPath();
ctx.lineWidth = 1;
ctx.setLineDash([8,5]); //Sets a line dash to have 8 pixels of line then 5 pixels of space
ctx.moveTo(100,20);
ctx.lineTo(100, 80);
ctx.stroke();
\\end{diagram}`;
