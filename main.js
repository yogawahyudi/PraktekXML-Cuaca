$(document).ready(function() {
let keyWheaterMapAPi = "be7d43d3958efbc9155a37bd9fac66ce" 


function showPosition(position) {
  var res;
  lat = position.coords.latitude
  lon = position.coords.longitude;
  $.ajax({
    type: "get",
    url: "http://api.positionstack.com/v1/reverse?access_key=9b5eb15ff171fc14d7a325882210e384&query="+lat+","+lon+"",
    success: function(data) {
      console.log(data);
      $.each(data, function(key, value){
        console.log(value[0])
        lat = value[0].latitude
        lng = value[0].longitude
        country = value[0].country
        namee = value[0].name
        region = value[0].region
        console.log(lat+","+lng)
        $.ajax({
        type: "get",
        url: "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=metric&appid="+keyWheaterMapAPi+"",
        success: function(data){
          console.log(data)
          $('h5#city').text("")
          $('h5#city').append(region +"<br> "+ namee +"<br> "+ country)
          $('#feels').text("feels like "+data.main.feels_like + " °C")
          $('#humidity').text("humidty : " + data.main.humidity + " %")
          $('#temperature').text(data.main.temp + " °C")
          $('#cuaca').text(data.weather[0].main)
          $('#wind').text("wind : " +data.wind.speed + " m/s")
          $('img').attr('src', "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
        }
      })
      })
    }
  })
}

function error(err) {
   console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getProvinsi()
{
  $.ajax({
    type: "get",
    url: "https://dev.farizdotid.com/api/daerahindonesia/provinsi",
    success: function(data){
      console.log(data);
      $.each(data.provinsi, function(key, value) {
        $('select#prov').append(
          '<option id="list-prov" value="'+value.id+'" data-nama="'+value.nama+'">'+value.nama+'</option>'
        )
      })
    }
  })
}

$('select#prov').on('change', function() {
  idprov = $('select#prov').val()
  console.log(idprov)
  $.ajax({
    type: "get",
    url: "https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi="+idprov,
    success: function(data){
      $('option#list-kota').remove()
      $('option#list-kec').remove()
      $('option#list-kel').remove()


      $.each(data.kota_kabupaten,  function(key, value) {
  $('select#kota').append(
          '<option id="list-kota" value="'+value.id+'" data-nama="'+value.nama+'">'+value.nama+'</option>'
        )
      })
    }
  })
})

$('select#kota').on('change', function() {
  navigator.geolocation.clearWatch(id);
  $('button#lokasi_sekarang').removeClass("d-none");
  var lat ;
  var lng ;
  prov = $('select#prov option:selected').data("nama")
  kota = $('select#kota option:selected').data("nama")
  kota = kota.replace("Kota", "");
  kota = kota.replace("Kabupaten", "");
  alamat = kota+","+prov+",Indonesia"
  console.log(alamat)

  $.ajax({
    type: "get",
    url: "http://api.positionstack.com/v1/forward?access_key=9b5eb15ff171fc14d7a325882210e384&query="+alamat+"",
    success: function(data) {
      console.log(data);
      $.each(data, function(key, value){
        console.log(value[0])
        lat = value[0].latitude
        lng = value[0].longitude
        country = value[0].country
        namee = value[0].name
        region = value[0].region
        console.log(lat+","+lng)
        $.ajax({
        type: "get",
        url: "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=metric&appid="+keyWheaterMapAPi+"",
        success: function(data){
          console.log(data)
          $('h5#city').text("")
          $('h5#city').append(region +"<br> "+ namee +"<br> "+ country)
          $('#feels').text("feels like "+data.main.feels_like + " °C")
          $('#humidity').text("humidty : " + data.main.humidity + " %")
          $('#temperature').text(data.main.temp + " °C")
          $('#cuaca').text(data.weather[0].main)
          $('#wind').text("wind : " +data.wind.speed + " m/s")
          $('img').attr('src', "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
        }
      })
      })
    }
  })

})


  if (navigator.geolocation) {
   id = navigator.geolocation.watchPosition(showPosition,error, {enableHighAccuracy: true});
  } else { 
    $('p#status') = "Geolocation is not supported by this browser.";
  }

  getProvinsi();

  $('button#lokasi_sekarang').on('click', function() {
    id = navigator.geolocation.watchPosition(showPosition,error, {enableHighAccuracy: true});
    $(this).addClass("d-none")
  })
})