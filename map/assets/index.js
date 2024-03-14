const mapDiv = document.getElementById("map");
let map;
function initMap() {
navigator.geolocation.getCurrentPosition(function(position){    
    var ip = position.coords.latitude;
    var ip2 = position.coords.longitude;
    console.log(`<p> Your latitude is : ${ip}</p>`);
    console.log(`<p> Your longitude is : ${ip2}</p>`);
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