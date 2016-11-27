class Parser{
  constructor(file) { //v lines je vystup z AJAX-> parser.php
		this.file = file;
		pole = [[[]]];
	}

	rozprasovanie(){

		var temp_j;
		var pole_bezier;
		var pole_vrstevnica;
		var xx,yy,flags;
		for(var i = 0; i < this.file.length; i++){
			pole_vrstevnica = [];
			for(var j = 0; j < this.file[i].coords.length - 3; j+=3){
				pole_bezier = [];
				for(var k = 0; k < 4; k++){
						xx = parseInt(this.file[i].coords[j+k].x);
						yy = parseInt(this.file[i].coords[j+k].y);
						flags = parseInt(this.file[i].coords[j+k].flags);
						pole_bezier.push([xx, yy, flags]);
						this.minmax(xx, yy);
				}

				pole_vrstevnica.push(pole_bezier);
			}
			pole.push(pole_vrstevnica);
		}
		pole = pole.splice(1,pole.length);
    console.log("end parse");
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
  console.log('start load file');
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
