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
        console.log(data);
        localStorage.setItem("ciudad", data.name);
        mostrarCiudad(data);
        saveCity.disabled = false;
      })
    }
  });

  saveCity.addEventListener("click", () => {
    guardarCiudad();
  });

});

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

export function guardarCiudad() {
  const list = document.getElementById("list-cities");
  const cityName = localStorage.getItem("ciudad");

  if (!elementoExisteEnLista(cityName)) {
    // Crear un contenedor de fila
    const $filaBotones = document.createElement("div");
    $filaBotones.classList.add("fila-botones");

    // Crear botón principal
    const $button = document.createElement("button");
    $button.setAttribute("class", "btn-style");
    $button.textContent = cityName[0].toUpperCase() + cityName.substring(1).toLowerCase();

    // Crear botón de eliminación
    const $deleteButton = document.createElement("button");
    $deleteButton.setAttribute("class", "dlt-button");
    const $img = document.createElement("img");
    $img.setAttribute("src", "./logos/basura.png");
    $img.setAttribute("class", "delete-img");
    $deleteButton.appendChild($img);

    // Agregar botones al contenedor de fila
    $filaBotones.appendChild($button);
    $filaBotones.appendChild($deleteButton);

    // Agregar la fila al contenedor principal
    list.appendChild($filaBotones);

    $deleteButton.addEventListener("click", () => {
      list.removeChild($filaBotones)
    })

    // Agregar evento al botón principal
    $button.addEventListener("click", () => {
      fetchData($button.textContent);
    });
  } else {
    alert("La ciudad ya se encuentra guardada");
  }
}

function elementoExisteEnLista(nombreCiudad) {
  const lista = document.getElementById("list-cities");
  if (lista.childElementCount > 0) {
    const elementosLi = lista.getElementsByTagName("button");
    for (let i = 0; i < elementosLi.length; i++) {
      if (elementosLi[i].textContent.toLowerCase() === nombreCiudad.toLowerCase()) {
        return true;
      }
    }
  }
  console.log(lista.childElementCount)

  return false;
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
  fechaActual.setMilliseconds(fechaActual.getMilliseconds() + dif * 1000 + (10800000));
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
  if (horaAux.getHours() > 19 || horaAux.getHours() <= 6)
    act = "noche";
  console.log(act);
  elegirLogo(clima, act);
}

export function elegirLogo(clima, act) {
  let logo = document.getElementById("logo-ciudad");
  const tiempo = cargarTiempo();
  logo.setAttribute("src", tiempo[act][clima])
}