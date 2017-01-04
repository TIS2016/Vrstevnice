var pole = [[[]]];
var max_x = -9999999;
var max_y = -9999999;
var min_x = +9999999;
var min_y = +9999999;
var img;



function start(){

	//start create heightmap
	var heightmap = document.getElementById("heightmap");
	var ctx = heightmap.getContext("2d");
	ctx.clearRect(0, 0, heightmap.width, heightmap.height); //clean old canvas
	size = document.getElementById("text-size").value;
	//before start resize canvas
	resizecanvas_heightmap();
	//black bg to heightmap
	var bg = heightmap.getContext("2d");
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
	//end create heightmap

	//start 2d map

	var map_2d = document.getElementById("map_2d");
	var map = map_2d.getContext("2d");
	map.clearRect(0, 0, map_2d.width, map_2d.height); //clean old canvas
	size = document.getElementById("text-size").value;
	//before start resize canvas
	resizecanvas_2d();
	map.filter = "blur(0px)"

	for (i = 0;  i < pole.length; i++) {
		map.beginPath();
		let a,b,c,d;
		for(n = 0; n < pole[i].length; n++){
			if(pole[i][n].length == 4){
				a = pole[i][n][0];
				b = pole[i][n][1];
				c = pole[i][n][2];
				d = pole[i][n][3];
				if(n === 0){
					map.moveTo(resize(a[0],"x"),resize(a[1],"y"));
					map.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
				else{
					map.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
			}
			else{
				console.log("chyba pri vykreslovani");
				console.log(i,n);
			}
		}

		if(d[2] == 1 || isNaN(d[2])){
		map.strokeStyle="#654321";
		map.lineWidth = 1;
		map.stroke();
	}else{
		map.strokeStyle="#ff0000";
		map.lineWidth = 1;
		map.stroke();
	}
	}
	//end create heightmap


	//add render and download button
	img    = heightmap.toDataURL("image/png");
 	var add_downloadr= $('<input type="button" onclick="location.href=\''+img+'\' "   value="Stiahnúť mapu"/>');
  	var add_render= $('<input type="button" onclick="initMap()" value="Renderovať"/>');
  	$("#btn").append(add_downloadr);
  	$("#btn").append(add_render);
}


function resizecanvas_heightmap(){
	let size = document.getElementById("text-size").value;
  	heightmap.width = size;
		heightmap.height = size;
}

function resizecanvas_2d(){
	let size = document.getElementById("text-size").value;
  map_2d.width = size;
  map_2d.height = size;
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
