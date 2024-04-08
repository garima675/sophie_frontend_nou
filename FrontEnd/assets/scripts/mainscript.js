let artworks = [];
//Clearing the gallery
function clearGallery() {
    // Retrieve the gallery container element from index.html
    const galleryContainer = document.querySelector(".gallery");
    // Remove all child elements from the gallery container
    while (galleryContainer.firstChild) {
      galleryContainer.removeChild(galleryContainer.firstChild);
    }
  }
// Displaying the works in gallery
  async function displayWorks() {
    //Waiting for fetchworkdataapicall to assign the value to worksdata
    artworks = await fetchWorksDataAPICall();
    //Calling the WorksAPI
    async function fetchWorksDataAPICall() {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error('Failed to retrieve data from the server');
        }
        return response.json();
    }
    
clearGallery();
    populateGallery(artworks);
}
//Populate the gallery with images and Titles
function populateGallery(artworks) {
  for (let artwork of artworks) {
      const galleryElement = document.getElementsByClassName("gallery").item(0);
      const figureElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      imageElement.setAttribute("crossorigin", "anonymous");
      imageElement.setAttribute("src", artwork.image);
      imageElement.alt = artwork.name;
      const captionElement = document.createElement("figcaption");
      captionElement.textContent = artwork.name;
      galleryElement.appendChild(figureElement);
      figureElement.append(imageElement, captionElement);
  }
}
//trigger function on page load
async function init(){
  await displayWorks();

}

init();
