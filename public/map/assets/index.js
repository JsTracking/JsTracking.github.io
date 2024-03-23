/*const mapDiv = document.getElementById("map");
let map;
function initMap() {
navigator.geolocation.getCurrentPosition(function(position){    
    //get the ip address
    var ip = position.coords.latitude;
    var ip2 = position.coords.longitude;
    var ip3 = position.coords.altitude; 
    console.log('Latitud: ' + ip);
    console.log('Longitud: '+ip2);
    console.log('Altitud: '+ip3);
    map = new google.maps.Map(mapDiv, {
    center: {lat: ip, lng: ip2},
    zoom: 15,
  });
  marker = new google.maps.Marker({
      position:{
          lat: ip,
          lng: ip2
      },
      map: map,
      title:"You are here!"
  })    
    });
  
}
initMap();
*/

