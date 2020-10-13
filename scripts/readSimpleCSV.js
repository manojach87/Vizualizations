  var St="";
  var idx = [];
  var itr = [];
  var data=d3.csv("./us_cities_states_counties1.csv", function(d){ 
  
        if(isNaN(itr[St])) {
        		itr[St]=0
        }
        if(St!=d.St) { 
        	console.log(d.St);
        }
        else {
        	itr[St]+= 1;
        }
        St=d.St;
        //return d;
  });
console.log(itr);
