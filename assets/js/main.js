var max_x = -9999999;
var max_y = -9999999;
var min_x = +9999999;
var min_y = +9999999;
//data from heightmap for download screenshot and for rendering 3d
var img;
var data_coordinates = [[[]]];
var pole_border = [];
var pole_border_temp = [];
var rovnica;
var size;


function makeMaps(){
	//Automatically starts after processing the input files.
	//Portray 2D map and heightmaps
	// rovnica = (max_x - min_x)/(max_y - min_y);
  makeCanvasCoordinates();
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
  let vr1, vr2, vr3, vr4;
	for (i = 0;  i < data_coordinates.length; i++) {
		canvas_heigtmap.beginPath();
		for(n = 0; n < data_coordinates[i].length; n++){
			if(data_coordinates[i][n].length == 4){
        vr1 = data_coordinates[i][n][0];
        vr2 = data_coordinates[i][n][1];
        vr3 = data_coordinates[i][n][2];
        vr4 = data_coordinates[i][n][3];
				//Frst line need moveTo parameter to start draw
				if(n === 0){
					canvas_heigtmap.moveTo(vr1[0], vr1[1]);
					canvas_heigtmap.bezierCurveTo(vr2[0] , vr2[1], vr3[0], vr3[1], vr4[0], vr4[1]);
				}
				else{
					canvas_heigtmap.bezierCurveTo(vr2[0] , vr2[1], vr3[0], vr3[1], vr4[0], vr4[1]);
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
  let vr1, vr2, vr3, vr4;
	for (i = 0;  i < data_coordinates.length; i++) {
		for(n = 0; n < data_coordinates[i].length; n++){
			if(data_coordinates[i][n].length == 4){
				vr1 = data_coordinates[i][n][0];
				vr2 = data_coordinates[i][n][1];
				vr3 = data_coordinates[i][n][2];
				vr4 = data_coordinates[i][n][3];
				if(n === 0){
					canvas_map.moveTo(vr1[0], vr1[1]);
					canvas_map.bezierCurveTo(vr2[0] , vr2[1], vr3[0], vr3[1], vr4[0], vr4[1]);
				}
				else{
					canvas_map.bezierCurveTo(vr2[0] , vr2[1], vr3[0], vr3[1], vr4[0], vr4[1]);
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

function makeCanvasCoordinates(){
  console.log("start preratanie Vrstevnic");

  for (var i = 0; i < data_coordinates.length; i++) {
     for (var j = 0; j < data_coordinates[i].length; j++) {
        for (var k = 0; k < data_coordinates[i][j].length; k++) {
            data_coordinates[i][j][k][0] = this.resizresizeToCanvasCoordinatese_me(data_coordinates[i][j][k][0], "x");
            data_coordinates[i][j][k][1] = this.resizeToCanvasCoordinates(data_coordinates[i][j][k][1], "y");
            // console.log(pole[i][j][k]);
        }
     }
  }

  console.log("end preratanie Vrstevnic");

  console.log("start preratanie Border");

  for (var m = 0; m < pole_border_temp.length; m++) {
      pole_border_temp[m][0] = resizeToCanvasCoordinates(pole_border_temp[m][0], "x") < 0 ? 0 : resizeToCanvasCoordinates(pole_border_temp[m][0], "x");
      pole_border_temp[m][1] = resizeToCanvasCoordinates(pole_border_temp[m][1], "y") < 0 ? 0 : resizeToCanvasCoordinates(pole_border_temp[m][1], "y");
  }

  var b_min = +999999;
  var b_max = -999999;

  var x_min, y_min, x_max, y_max;

  for (var x = 0; x < pole_border_temp.length; x++) {
      var plus = pole_border_temp[x][0] + pole_border_temp[x][1];

      if (plus < b_min) {
          b_min = plus;
          x_min = pole_border_temp[x][0];
          y_min = pole_border_temp[x][1];
      }

      if (plus > b_max) {
          b_max = plus;
          x_max = pole_border_temp[x][0];
          y_max = pole_border_temp[x][1];
      }
  }

  pole_border.push(x_min, y_min);
  pole_border.push(x_max, y_max);
  // console.log(x_min, y_min, x_max, y_max);

  console.log("end preratanie Border");
}


function resizeToCanvasCoordinates(i,os){
  var rovnica = (max_x - min_x)/(max_y - min_y);
  if(rovnica == 1){
      if(os == "x"){
        return 800 * (i - min_x)/(max_x - min_x);
      }
      return  800 * (i - min_y)/(max_y - min_y);

  }
  else if(rovnica > 1){
      if(os == "x"){
        return 800 * (i - min_x)/(max_x - min_x);
      }
      return 800 * (i - min_y)/(max_x - min_x);
  }
  else{
    if(os == "x"){
      return  800 * (i - min_x)/(max_y - min_y);
    }
    return  800 * (i - min_y)/(max_y - min_y);
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
