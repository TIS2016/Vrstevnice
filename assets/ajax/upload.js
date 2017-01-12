class Parser{
  constructor(file) { //v lines je vystup z AJAX-> parser.php
		this.file = file;
    pole_border_temp = [];
    BorderCoords = [];
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
    // console.log("end parse Vrstevnice");

    // console.log("start parse Border");

    for (var m = 0; m < this.file[1][0].coords.length; m++) {
      pole_border_temp.push([this.file[1][0].coords[m].x, this.file[1][0].coords[m].y]);
    }
    // console.log(this.file[1][0].coords.length);

    $("#status_text").html("<i class='fa fa-check'></i> Súbor načítaný");

    // console.log("end parse Border");

    $("#kresli").prop('disabled', false);
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

}



document.getElementById('file').onchange = function(){
  // console.log('start load file');
  var formData = new FormData();
  formData.append('file', $('#file')[0].files[0]);

  $.ajax({
         url : 'assets/ajax/parser.php',
         type : 'POST',
         data : formData,
         processData: false,  // tell jQuery not to process the data
         contentType: false,  // tell jQuery not to set contentType
         success : function(data) {
             subor = jQuery.parseJSON(data);
             parser = new Parser(subor);
             parser.rozprasovanie();
         }
  });
};
