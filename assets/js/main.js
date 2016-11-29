var max_x = -9999999;
var max_y = -9999999;
var min_x = +9999999;
var min_y = +9999999;
//data from heightmap for download screenshot and for rendering 3d
var img;
var data_coordinates = [[[]]];
var rovnica;
var size;


function makeMaps(){
	//Automatically starts after processing the input files.
	//Portray 2D map and heightmaps	
	rovnica = (max_x - min_x)/(max_y - min_y);  
	makeHeightMap();
	make2dMap();	
	//add render and download button	
 	var add_downloadr= $('<input type="button" onclick="location.href=\''+img+'\' "   value="Stiahnúť mapu"/>');
  	var add_render= $('<input type="button" onclick="initMap()" value="Renderovať"/>');
  	$("#btn").append(add_downloadr);
  	$("#btn").append(add_render);	
}


function makeHeightMap(){
	//make hidden Heightmap in canvas in index.html for rendering 3Dmodel

	//Catch  hidden  canvas element of heightmap by id in the DOM in index.html
	var heightmap = document.getElementById("heightmap");
	var canvas_heigtmap = heightmap.getContext("2d");
	//Resize heightmap for setting width and height in input(text-size)
	resizeCanvasHeightmap();
	//Clear all objects from previous rendering
	canvas_heigtmap.clearRect(0, 0, heightmap.width, heightmap.height); 
	//Black backgroundto heightmap
	let size = document.getElementById("text-size").value;
	var bg = heightmap.getContext("2d");	
	bg.rect(0,0,size,size);
	bg.fillStyle = "#000000";
	bg.fill();	
	bg.stroke();
	//Start process and render data
	for (i = 0;  i < data_coordinates.length; i++) {  		 		
		canvas_heigtmap.beginPath();
		for(n = 0; n < data_coordinates[i].length; n++){			
			if(data_coordinates[i][n].length == 4){
				let a = data_coordinates[i][n][0];
				let b = data_coordinates[i][n][1];
				let c = data_coordinates[i][n][2];
				let d = data_coordinates[i][n][3];
				//Frst line need moveTo parameter to start draw
				if(n === 0){
					canvas_heigtmap.moveTo(resize(a[0],"x"),resize(a[1],"y"));
					canvas_heigtmap.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
				else{
					canvas_heigtmap.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
			}
			else{
				console.log("chyba pri vykreslovani"); //If the object has an unexpected number of vertices
				console.log(i,n);
			}			
		}

		//filter for more realistic view
		canvas_heigtmap.filter = "blur(6px)";
		canvas_heigtmap.closePath();
		canvas_heigtmap.lineWidth = 0;
		color_fill = "rgba(255,255, 255, [[opacity]])";
		canvas_heigtmap.fillStyle = color_fill.replace("[[opacity]]", "0.5");
		canvas_heigtmap.fill();    
		canvas_heigtmap.stroke();
	}
	canvas_heigtmap.filter = "blur(0px)";
	//Data for screenshot and for rendering 3D
	img = heightmap.toDataURL("image/png");
}

function make2dMap(){
	//Make 2d map in canvas in index	

	//Catch    canvas element of 2Dmap by id in the DOM in index.html
	var map_2d = document.getElementById("map_2d");
	var canvas_map = map_2d.getContext("2d");
	//Clear all objects from previous rendering
	canvas_map.clearRect(0, 0, map_2d.width, map_2d.height); 	
	//before start resize canvas
	resizeCanvas2d();
	//Start process and render data
	for (i = 0;  i < data_coordinates.length; i++) {   	
		for(n = 0; n < data_coordinates[i].length; n++){			
			if(data_coordinates[i][n].length == 4){
				let a = data_coordinates[i][n][0];
				let b = data_coordinates[i][n][1];
				let c = data_coordinates[i][n][2];
				let d = data_coordinates[i][n][3];         
				if(n === 0){
					canvas_map.moveTo(resize(a[0],"x"),resize(a[1],"y"));
					canvas_map.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
				else{
					canvas_map.bezierCurveTo(resize(b[0],"x"), resize(b[1],"y"), resize(c[0],"x"), resize(c[1],"y"), resize(d[0],"x"), resize(d[1],"y"));
				}
			}
			else{
				console.log("chyba pri vykreslovani");
				console.log(i,n);
			}			
		}
		
		canvas_map.strokeStyle="#654321";
		canvas_map.lineWidth = 1;			 
		canvas_map.stroke();
	}
}


function resizeCanvasHeightmap(){  
	size = document.getElementById("text-size").value;
  	heightmap.width = size;
	heightmap.height = size;
}

function resizeCanvas2d(){  
	size = document.getElementById("text-size").value;
  	map_2d.width = size;
  	map_2d.height = size;
}

function resize(i,os){		
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
