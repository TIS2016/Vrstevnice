var pole = [[[]]];
var max_x = -9999999;
var max_y = -9999999;
var min_x = +9999999;
var min_y = +9999999;
var img;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function start(){
	ctx.clearRect(0, 0, c.width, c.height); //clean old canvas
	size = document.getElementById("text-size").value;	
	//before start resize canvas
	resizecanvas();
	//black bg to heightmap
	var bg = c.getContext("2d");	
	bg.rect(0,0,size,size);
	bg.fillStyle = "#000000";
	bg.fill();
	ctx.filter = "blur(6px)";
	bg.stroke();
	
	for (i = 0;  i < pole.length; i++) {   		
		ctx.beginPath();       
		for(n = 0; n < pole[i].length; n++){			
			if(pole[i][n].length == 4){
				let a = pole[i][n][0];
				let b = pole[i][n][1];
				let c = pole[i][n][2];
				let d = pole[i][n][3];         
				if(n === 0){
					ctx.moveTo(resize(a[0],"x"),resize(a[1],"y"));
					ctx.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
				else{
					ctx.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
			}
			else{
				console.log("chyba pri vykreslovani");
				console.log(i,n);
			}			
		}
		ctx.closePath();
		ctx.lineWidth = 0;
		colurfill = "rgba(255,255, 255, [[opacity]])";
		ctx.fillStyle = colurfill.replace("[[opacity]]", "0.5");
		ctx.fill();    
		ctx.stroke();
	}
	//add render and download button
	img    = c.toDataURL("image/png");
 	var add_downloadr= $('<input type="button" onclick="location.href=\''+img+'\' "   value="Stiahnúť mapu"/>');
  var add_render= $('<input type="button" onclick="initMap()" value="Renderovať"/>');
  $("#btn").append(add_downloadr);
  $("#btn").append(add_render);	
}


function resizecanvas(){  
	let size = document.getElementById("text-size").value;
  document.getElementById('myCanvas').width = size;
	document.getElementById('myCanvas').height = size;
}

function resize(i,os){
	var rovnica = (max_x - min_x)/(max_y - min_y);	
  if(rovnica == 1){
			if(os == "x"){
				return size * (i - min_x)/(max_x - min_x);
			}
			return  size * (i - min_y)/(max_y - min_y);

  }
	else if(rovnica > 1){
			if(os == "x"){
				return size * (i - min_x)/(max_x - min_x);
			}
			return size * (i - min_y)/(max_x - min_x);
  }
	else{
		if(os == "x"){
			return  size * (i - min_x)/(max_y - min_y);
		}
		return  size * (i - min_y)/(max_y - min_y);
	}
}







