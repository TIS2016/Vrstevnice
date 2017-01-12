var max_x = -9999999;
var max_y = -9999999;
var min_x = +9999999;
var min_y = +9999999;
//data from heightmap for download screenshot and for rendering 3d
var img;
var data_coordinates = [[[]]];
var BorderCoords = [];
var pole_border_temp = [];
var rovnica;
var size = 1024;

var data = [];
var OpenCurves = [];
var ClosedCurves = [];


function makeMaps(){
	//Automatically starts after processing the input files.
	//Portray 2D map and heightmaps
	// rovnica = (max_x - min_x)/(max_y - min_y);
  makeCanvasCoordinates();

  cleanArrayFromEmptyArrays();

  findOpenCurves();

  curvesJoinStarts();

  curvesJoinEnds();

  curvesJoinBorders();

	makeHeightMap();
	make2dMap();
  makeBorder();
	//add render and download button
 	$("#download").prop('disabled', false);
  $("#render").prop('disabled', false);
}

function cleanArrayFromEmptyArrays() {

  for (var i = 0; i < data_coordinates.length; i++) {
    if (data_coordinates[i].length !== 0) {
      data.push(data_coordinates[i]);
    }
  }

}

function curvesJoinEnds() {

  var change = true;
  while (change) {
    change = false;

    var index; // Index Vrstevnice v data_coordinates
    var dlzka; // Dlzka daneho pola Vrstevnice
    var start_x, start_y, end_x, end_y;
    var min_vzdialenost;
    var min_index; // Index Vrstevnice s najmensou vzdialenostou
    var piznak; // Priznak pridavania pola podla start / end

    for (var i = 0; i < OpenCurves.length; i++) {
      min_vzdialenost = +999999;
      index = i;
      dlzka = OpenCurves[i].length - 1;

      start_x = OpenCurves[i][0][0][0];
      start_y = OpenCurves[i][0][0][1];
      end_x = OpenCurves[i][dlzka][3][0];
      end_y = OpenCurves[i][dlzka][3][1];

      if (beyondBorder(end_x, end_y)) { // Pokial je start za koncom
        continue;
      }

      for (var j = 0; j < OpenCurves.length; j++) {
        var vzdialenost;
        if (i == j) { // Ta ista vrstevnica

          if (!beyondBorder(start_x, start_y)){

            vzdialenost = pointsDistance(start_x, start_y, end_x, end_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "same";
            } // End vzdialenost compare

          }  // End beyondBorder compare

        }else{ // Ina vrstevnica
          // var cmp_index = OpenCurves[j];
          var cmp_dlzka = OpenCurves[j].length - 1;

          var cmp_start_x = OpenCurves[j][0][0][0];
          var cmp_start_y = OpenCurves[j][0][0][1];
          var cmp_end_x = OpenCurves[j][cmp_dlzka][3][0];
          var cmp_end_y = OpenCurves[j][cmp_dlzka][3][1];

          if (!beyondBorder(cmp_start_x, cmp_start_y)) {

            vzdialenost = pointsDistance(end_x, end_y, cmp_start_x, cmp_start_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "end";
            } // End vzdialenost compare

          } // End beyondBorder compare

          if (!beyondBorder(cmp_end_x, cmp_end_y)) {

            vzdialenost = pointsDistance(end_x, end_y, cmp_end_x, cmp_end_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "start";
            } // End vzdialenost compare

          } // End beyondBorder compare

        } // Koniec elsu - Ina Vrstevnica

      } // Koniec for-cyklu druheho prechadzania

      if (priznak == "same") {
        OpenCurves[i][0][0][0] = end_x;
        OpenCurves[i][0][0][1] = end_y;

        ClosedCurves.push(OpenCurves[i]);
        OpenCurves.splice(i, 1);
        change = true;
      }else{

        if (priznak == "start") {
          connectArrays(index, min_index, "start");

          if (isCurveClosed(OpenCurves.length - 1)) {
            ClosedCurves.push(OpenCurves[OpenCurves.length - 1]);
            OpenCurves.pop();
            change = true;
          }
        }else{ // priznak = end
          connectArrays(index, min_index, "end");
          // ("priznak end");

          if (isCurveClosed(OpenCurves.length - 1)) {
            ClosedCurves.push(OpenCurves[OpenCurves.length - 1]);
            OpenCurves.pop();
            change = true;
          }
        }

      }

    } // Koniec for-cyklu prveho prechadzania
  stop++;
  } // Koniec while-cyklu

}

function curvesJoinStarts(){
  var stop = 0;
  var change = true;
  while (change) {
    change = false;
    (stop);

    var index; // Index Vrstevnice v data_coordinates
    var dlzka; // Dlzka daneho pola Vrstevnice
    var start_x, start_y, end_x, end_y;
    var min_vzdialenost;
    var min_index; // Index Vrstevnice s najmensou vzdialenostou
    var piznak; // Priznak pridavania pola podla start / end

    for (var i = 0; i < OpenCurves.length; i++) {
      min_vzdialenost = +999999;
      index = i;
      dlzka = OpenCurves[i].length - 1;

      start_x = OpenCurves[i][0][0][0];
      start_y = OpenCurves[i][0][0][1];
      end_x = OpenCurves[i][dlzka][3][0];
      end_y = OpenCurves[i][dlzka][3][1];

      if (beyondBorder(start_x, start_y)) { // Pokial je start za koncom
        continue;
      }

      for (var j = 0; j < OpenCurves.length; j++) {
        var vzdialenost;
        if (i == j) { // Ta ista vrstevnica

          if (!beyondBorder(end_x, end_y)){

            vzdialenost = pointsDistance(start_x, start_y, end_x, end_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "same";
            } // End vzdialenost compare

          }  // End beyondBorder compare

        }else{ // Ina vrstevnica
          // var cmp_index = OpenCurves[j];
          var cmp_dlzka = OpenCurves[j].length - 1;

          var cmp_start_x = OpenCurves[j][0][0][0];
          var cmp_start_y = OpenCurves[j][0][0][1];
          var cmp_end_x = OpenCurves[j][cmp_dlzka][3][0];
          var cmp_end_y = OpenCurves[j][cmp_dlzka][3][1];

          if (!beyondBorder(cmp_start_x, cmp_start_y)) {

            vzdialenost = pointsDistance(start_x, start_y, cmp_start_x, cmp_start_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "start";
            } // End vzdialenost compare

          } // End beyondBorder compare

          if (!beyondBorder(cmp_end_x, cmp_end_y)) {

            vzdialenost = pointsDistance(start_x, start_y, cmp_end_x, cmp_end_y);

            if(vzdialenost < min_vzdialenost){
              min_vzdialenost = vzdialenost;
              min_index = j;
              priznak = "end";
            } // End vzdialenost compare

          } // End beyondBorder compare

        } // Koniec elsu - Ina Vrstevnica

      } // Koniec for-cyklu druheho prechadzania

      if (priznak == "same") {
        OpenCurves[i][0][0][0] = end_x;
        OpenCurves[i][0][0][1] = end_y;

        ClosedCurves.push(OpenCurves[i]);
        OpenCurves.splice(i, 1);
        change = true;
      }else{

        if (priznak == "start") {
          connectArrays(index, min_index, "start");

          if (isCurveClosed(OpenCurves.length - 1)) {
            ClosedCurves.push(OpenCurves[OpenCurves.length - 1]);
            OpenCurves.pop();
            change = true;
          }
        }else{ // priznak = end
          connectArrays(index, min_index, "end");

          if (isCurveClosed(OpenCurves.length - 1)) {
            ClosedCurves.push(OpenCurves[OpenCurves.length - 1]);
            OpenCurves.pop();
            change = true;
          }
        }

      }

    } // Koniec for-cyklu prveho prechadzania
  stop++;
  } // Koniec while-cyklu

}

function curvesJoinBorders() {

  while (OpenCurves.length !== 0) {

      var dlzka = OpenCurves[0].length - 1;

      var end_x = OpenCurves[0][dlzka][3][0];
      var end_y = OpenCurves[0][dlzka][3][1];

      OpenCurves[0][0][0][0] = end_x;
      OpenCurves[0][0][0][1] = end_y;

      ClosedCurves.push(OpenCurves[0]);
      OpenCurves.splice(0, 1);

  }

}

function reverseArray(array) {

  var returnArray = [];

  var array_temp;

  for (var i = array.length - 1; i >= 0; i--) {
    array_temp = [];
    for (var j = array[i].length - 1; j >= 0; j--) {
      array_temp.push(array[i][j]);
    }
    returnArray.push(array_temp);
  }

  return returnArray;

}

function connectArrays(index, min_index, priznak) {

  var connectedArray;

  if (priznak == "start") {
    var flippedArray = reverseArray(OpenCurves[min_index]);
    flippedArray[flippedArray.length - 1][3][0] = OpenCurves[index][0][0][0];
    flippedArray[flippedArray.length - 1][3][1] = OpenCurves[index][0][0][1];
    connectedArray = flippedArray.concat(OpenCurves[index]);
  }else{
    OpenCurves[min_index][OpenCurves[min_index].length - 1][3][0] = OpenCurves[index][0][0][0];
    OpenCurves[min_index][OpenCurves[min_index].length - 1][3][1] = OpenCurves[index][0][0][1];
    connectedArray = OpenCurves[min_index].concat(OpenCurves[index]);
  }

  OpenCurves.splice(index, 1);

  if (index < min_index) {
    OpenCurves.splice(min_index - 1, 1);
  }else{
    OpenCurves.splice(min_index, 1);
  }

  OpenCurves.push(connectedArray);

}

function beyondBorder(x, y){

  if(x <= BorderCoords[0] || x >= BorderCoords[2] || y <= BorderCoords[1] || y >= BorderCoords[3]){
    return true;
  }

  return false;

}

function pointsDistance(nas_bod_x, nas_bod_y, vrstevnica_x, vrstevnica_y){

  var distance;

  var x = Math.abs(vrstevnica_x - nas_bod_x);
  var y = Math.abs(vrstevnica_y - nas_bod_y);

  distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  return distance;

}

function isCurveClosed(array_index){

  var start_x = OpenCurves[array_index][0][0][0];
  var start_y = OpenCurves[array_index][0][0][1];
  var end_x = OpenCurves[array_index][OpenCurves[array_index].length - 1][3][0];
  var end_y = OpenCurves[array_index][OpenCurves[array_index].length - 1][3][1];

  if (start_x == end_x && start_y == end_y) {
      return true;
  }

  return false;

}

function findOpenCurves(){

  var start_x, start_y, end_x, end_y;

  for (var i = 0; i < data.length; i++) { // Cez kazdu Vrstevnicu
    start_x = data[i][0][0][0];
    start_y = data[i][0][0][1];
    end_x = data[i][data[i].length - 1][3][0];
    end_y = data[i][data[i].length - 1][3][1];

    if(start_x != end_x || start_y != end_y){
      OpenCurves.push(data[i]);
    }else{
      ClosedCurves.push(data[i]);
    }
  }

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
	var bg = heightmap.getContext("2d");
	bg.rect(0,0,size,size);
	bg.fillStyle = "#000000";
	bg.fill();
	bg.stroke();
	//Start process and render data
  let vr1, vr2, vr3, vr4;
	for (i = 0;  i < ClosedCurves.length; i++) {
		canvas_heigtmap.beginPath();
		for(n = 0; n < ClosedCurves[i].length; n++){
			if(ClosedCurves[i][n].length == 4){
        vr1 = ClosedCurves[i][n][0];
        vr2 = ClosedCurves[i][n][1];
        vr3 = ClosedCurves[i][n][2];
        vr4 = ClosedCurves[i][n][3];
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
		canvas_heigtmap.filter = "blur(2px)";
		canvas_heigtmap.closePath();
		canvas_heigtmap.lineWidth = 0;
		color_fill = "rgba(255,255, 255, [[opacity]])";
		canvas_heigtmap.fillStyle = color_fill.replace("[[opacity]]", "0.1");
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
	for (i = 0;  i < ClosedCurves.length; i++) {
		for(n = 0; n < ClosedCurves[i].length; n++){
			if(ClosedCurves[i][n].length == 4){
				vr1 = ClosedCurves[i][n][0];
				vr2 = ClosedCurves[i][n][1];
				vr3 = ClosedCurves[i][n][2];
				vr4 = ClosedCurves[i][n][3];
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

function makeBorder(){

  var map_2d = document.getElementById("map_2d");
  var map_border = map_2d.getContext("2d");

  // map_border.strokeStyle = "#551A8B";
  // map_border.lineWidth = 5;
  map_border.strokeRect(BorderCoords[0], BorderCoords[1], BorderCoords[2], BorderCoords[3]);
  map_border.stroke();

}

function makeCanvasCoordinates(){
  $("#alert_place").append("<div class='alert alert-info text-center' id='alert_message3' role='alert'>Prerátavam Vrstevnice</div>");

  window.setTimeout(function() {
    $("#alert_message3").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 3000);
  // console.log("start preratanie Vrstevnic");

  for (var i = 0; i < data_coordinates.length; i++) {
     for (var j = 0; j < data_coordinates[i].length; j++) {
        for (var k = 0; k < data_coordinates[i][j].length; k++) {
            data_coordinates[i][j][k][0] = resizeToCanvasCoordinates(data_coordinates[i][j][k][0], "x");
            data_coordinates[i][j][k][1] = resizeToCanvasCoordinates(data_coordinates[i][j][k][1], "y");
        }
     }
  }

  // console.log("end preratanie Vrstevnic");

  // console.log("start preratanie Border");

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

  BorderCoords.push(x_min, y_min);
  BorderCoords.push(x_max, y_max);

  // console.log("end preratanie Border");
  $("#alert_place").append("<div class='alert alert-info text-center' id='alert_message4' role='alert'>Koniec prerátavania Vrstevníc</div>");

  window.setTimeout(function() {
    $("#alert_message4").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 3000);
}


function resizeToCanvasCoordinates(i,os){
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


function resizeCanvasHeightmap(){
  heightmap.width = size;
	heightmap.height = size;
}

function resizeCanvas2d(){
  map_2d.width = size;
  map_2d.height = size;
}
