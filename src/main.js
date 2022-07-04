
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=2'; // usamos QUERY PARAMETERS
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?api_key=d0bb4eed-2aec-4eaa-8ad7-2639796348e8'; 
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=d0bb4eed-2aec-4eaa-8ad7-2639796348e8`; 
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'

const spanError = document.getElementById('error')

async function loadRandomCats(){
  const res = await fetch(API_URL); // llamamos a la API, el RES nos dice de cómo quedó nuestra solicitud, antes de darnos los datos
  const data = await res.json(); // lo convertimos para q js lo entienda con json
  console.log("random cats")
  console.log(data) 
 


 if (res.status !== 200) {
  spanError.innerHTML = "Hubo un error" + res.status;
 } else {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const but1 = document.getElementById('but1');
  const but2 = document.getElementById('but2');
    // le cambiamos el atributo src para ponerles la url q nos esta poniendo la API
  img1.src = data[0].url;
  img2.src = data[1].url;

  but1.onclick = () => saveFavoritesCats(data[0].id);
  but2.onclick = () => saveFavoritesCats(data[1].id);
  }
}
loadRandomCats();

//----- favorites --------------

async function loadFavoritesCats(){
  const res = await fetch(API_URL_FAVORITES);  
  const data = await res.json();  
  console.log("favorites")
  console.log(data) 

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    const section = document.getElementById('favoritesCats')
    section.innerHTML = "";
    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Michis favoritos');
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(cat => { // CREAMOS NODOS HTML
      
      const article = document.createElement('article');
      const img = document.createElement('img');
      const button = document.createElement('button'); // funcion crear elemento
      const buttonText = document.createTextNode('Sacar foto de Favoritos'); // funcion crear texto para nodos HTML
      
      img.src = cat.image.url
      img.width = 150;
      button.appendChild(buttonText);
      button.onclick = () => deleteFavoritesCats(cat.id)
      article.appendChild(img);
      article.appendChild(button); 

      section.appendChild(article);
    });
  }
}

//--- save favorites (usando POST) ----

// cuando llamamos a fetch y queremos especificarle un metodo distinto al por defeecto q es get , en este caso queremos un POST  tenemos que especificar con un argumento que sea el 2do argumento de nuestra funcion en este caso puede ser un obj, y este obj puede tener la info q tengamos q enviarle a nuesta API , el metodo q en este caso q es de tipo POST 

async function saveFavoritesCats(id){
  const res = await fetch(API_URL_FAVORITES,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'd0bb4eed-2aec-4eaa-8ad7-2639796348e8',

    },
    body: JSON.stringify({
      image_id: id
    }),
  });

  const data = await res.json();

  console.log('save')
  console.log(res)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    console.log('gato guardado en favoritos')
    loadFavoritesCats();
  }
}

async function deleteFavoritesCats(id){
  const res = await fetch(API_URL_FAVORITES_DELETE(id),{
    method: 'DELETE',
    headers:{
      'X-API-KEY': 'd0bb4eed-2aec-4eaa-8ad7-2639796348e8',
    }
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error" + res.status + data.message;
  } else {
    console.log('gato eliminado en favoritos')
    loadFavoritesCats()
  }
}

async function uploadPhotoCat(){
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form);

  console.log(formData.get('file'));

  const res = await fetch(API_URL_UPLOAD, {
    method:'POST',
    headers:{
      'X-API-KEY': 'd0bb4eed-2aec-4eaa-8ad7-2639796348e8',
    },
    body:formData,
  })
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({data})
  } else {
    console.log('Foto de michi subida :)')
    console.log({data})
    console.log(data.url)
    saveFavoritesCats(data.id);
  }
}



loadRandomCats();
loadFavoritesCats();
 
