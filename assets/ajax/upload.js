class Parser{
  constructor(file) { //v lines je vystup z AJAX-> parser.php
		this.file = file;
    pole_border_temp = [];
    pole_border = [];
	}

	rozprasovanie(){
    data_coordinates = [[[]]];

		var temp_j;
		var pole_bezier;
		var pole_vrstevnica;
		var xx,yy,flags;
		for(var i = 0; i < this.file[0].length; i++){
			pole_vrstevnica = [];
			for(var j = 0; j < this.file[0][i].coords.length - 3; j+=3){
				pole_bezier = [];
				for(var k = 0; k < 4; k++){
						xx = parseInt(this.file[0][i].coords[j+k].x);
						yy = parseInt(this.file[0][i].coords[j+k].y);
						flags = parseInt(this.file[0][i].coords[j+k].flags);
						pole_bezier.push([xx, yy, flags]);
						this.minmax(xx, yy);
				}

				pole_vrstevnica.push(pole_bezier);
			}
			data_coordinates.push(pole_vrstevnica);
		}
		data_coordinates = data_coordinates.splice(1,data_coordinates.length);
    console.log("end parse Vrstevnice");

    console.log("start parse Border");

    for (var m = 0; m < this.file[1][0].coords.length; m++) {
      pole_border_temp.push([this.file[1][0].coords[m].x, this.file[1][0].coords[m].y]);
    }
    // console.log(this.file[1][0].coords.length);

    console.log("end parse Border");
	}

minmax(x, y) {
  if(max_x < x){
    max_x = x;
  }
  if(max_y < y){
    max_y = y;
  }
  if(min_y > y){
    min_y = y;
  }
  if(min_x > x){
    min_x = x;
  }
 }

  preratanie(){
    console.log("start preratanie Vrstevnic");

    for (var i = 0; i < data_coordinates.length; i++) {
       for (var j = 0; j < data_coordinates[i].length; j++) {
          for (var k = 0; k < data_coordinates[i][j].length; k++) {
              data_coordinates[i][j][k][0] = this.resize_me(data_coordinates[i][j][k][0], "x");
              data_coordinates[i][j][k][1] = this.resize_me(data_coordinates[i][j][k][1], "y");
              // console.log(pole[i][j][k]);
          }
       }
    }

    console.log("end preratanie Vrstevnic");

    console.log("start preratanie Border");

    for (var m = 0; m < pole_border_temp.length; m++) {
        pole_border_temp[m][0] = this.resize_me(pole_border_temp[m][0], "x") < 0 ? 0 : this.resize_me(pole_border_temp[m][0], "x");
        pole_border_temp[m][1] = this.resize_me(pole_border_temp[m][1], "y") < 0 ? 0 : this.resize_me(pole_border_temp[m][1], "y");
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


  resize_me(i,os){
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


}



document.getElementById('file').onchange = function(){
  console.log('start load file');
  var formData = new FormData();
  formData.append('file', $('#file')[0].files[0]);

  $.ajax({
         url : '/assets/ajax/parser.php',
         type : 'POST',
         data : formData,
         processData: false,  // tell jQuery not to process the data
         contentType: false,  // tell jQuery not to set contentType
         success : function(data) {
             subor = jQuery.parseJSON(data);
             parser = new Parser(subor);
             parser.rozprasovanie();
             parser.preratanie();
         }
  });
};
