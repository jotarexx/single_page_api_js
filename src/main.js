
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=2'; // usamos QUERY PARAMETERS
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?api_key=d0bb4eed-2aec-4eaa-8ad7-2639796348e8'; 
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=d0bb4eed-2aec-4eaa-8ad7-2639796348e8`; 
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'

const spanError = document.getElementById('error')

async function loadRandomCats(){
  const res = await fetch(API_URL); 
  const data = await res.json(); 
  console.log("random cats")
  console.log(data) 
 
 if (res.status !== 200) {
  spanError.innerHTML = "Hubo un error" + res.status;
 } else {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const but1 = document.getElementById('but1');
  const but2 = document.getElementById('but2');
    
  img1.src = data[0].url;
  img2.src = data[1].url;

  but1.onclick = () => saveFavoritesCats(data[0].id);
  but2.onclick = () => saveFavoritesCats(data[1].id);
  }
}
loadRandomCats();

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
    const h2Text = document.createTextNode('Tus fotos favoritas');
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(cat => { 
      
      const article = document.createElement('article');
      const img = document.createElement('img');
      const button = document.createElement('button'); 
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
    console.log('Foto de gato subida :)')
    console.log({data})
    console.log(data.url)
    saveFavoritesCats(data.id);
  }
}

loadRandomCats();
loadFavoritesCats();
 
