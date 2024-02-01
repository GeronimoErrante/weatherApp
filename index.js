document.addEventListener("DOMContentLoaded", () => {
  let inputCity = document.getElementById("city");
  let buscar = document.getElementById("botonBuscar");
  let saveCity = document.getElementById("guardar")

  buscar.addEventListener("click", () => {
    if (inputCity.value === "") {
      alert("Debe ingresar una ciudad")
    }
    else {
      fetchData(inputCity.value).then((data) => {
        saveCity.addEventListener("click", () => {
          guardarCiudad(data);
          data = null;
        });
      })
    }
  })


})

export function cargarTiempo() {
  const tiempo = {
    dia: {
      Clear: "./logos/sol.png",
      Clouds: "./logos/parcialmente nublado.png",
      Rain: "./logos/lluvia.png"
    },
    noche: {
      Clear: "./logos/despejado noche.png",
      Clouds: "./logos/parc nublado noche.png",
      Rain: "./logos/lluvia.png"
    }
  };
  return tiempo;
}

export async function fetchData(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=4ae2636d8dfbdc3044bede63951a019b&units=metric`
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ciudad no encontrada. status: ${response.status}`);
    }
    const data = await response.json();
    mostrarCiudad(data);
    return data;
  }
  catch (error) {
    console.error(error)
  }

}

export function guardarCiudad(city) {
  const list = document.getElementById("list-cities")
  const $li = document.createElement("li");
  $li.textContent = city.name;
  list.appendChild($li);
}

export function mostrarCiudad(data) {
  cargarLogo(data);
  let parrafo0 = document.getElementById("t0");
  let parrafo1 = document.getElementById("t1")
  let parrafo2 = document.getElementById("t2")
  let parrafo3 = document.getElementById("t3")
  let parrafo4 = document.getElementById("t4")

  parrafo0.textContent = "Ciudad: " + data.name;
  parrafo1.textContent = "Temperatura actual: " + data.main.temp + " °C";
  parrafo2.textContent = "Temperatura mínima: " + data.main.temp_min + " °C";
  parrafo3.textContent = "Temperatura máxima: " + data.main.temp_max + " °C";
  parrafo4.textContent = "Sensación térmica: " + data.main.feels_like + " °C";


  let boton_guardar = document.getElementById("guardar")
  boton_guardar.disabled = false;
  boton_guardar.textContent = "Guardar ciudad"
}

export function obtenerHorario(city) {
  const fechaActual = new Date();
  const dif = city.timezone;
  fechaActual.setMilliseconds(fechaActual.getMilliseconds() + dif * 1000);
  const horaActual = fechaActual.toLocaleTimeString();
  return horaActual;

}

export function cargarLogo(city) {
  let clima = city.weather[0].main;
  console.log(clima);
  const hora = obtenerHorario(city);
  const horaAux = new Date(`01 ${hora}`)
  let act = "dia";
  console.log(horaAux.getHours())
  if (horaAux.getHours() >= 22 || horaAux.getHours() <= 9)
    act = "noche";
  console.log(act);
  elegirLogo(clima, act);
}

export function elegirLogo(clima, act) {
  let logo = document.getElementById("logo-ciudad");
  const tiempo = cargarTiempo();
  logo.setAttribute("src", tiempo[act][clima])

}

