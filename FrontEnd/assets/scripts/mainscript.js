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
  //For each work in artworks array
  for (let artwork of artworks) {
    //Selects the  first element with classname gallery
      const galleryElement = document.getElementsByClassName("gallery").item(0);
      //Figure element is created to for each artwork
      const figureElement = document.createElement("figure");
      //Img element is created for each artwork
      const imageElement = document.createElement("img");
      imageElement.setAttribute("crossorigin", "anonymous");
      //Src set to image url property
      imageElement.setAttribute("src", artwork.imageUrl);
      // Alt attribute set to the name property
      imageElement.alt = artwork.name;
      //Figcaption is created to display the name of artwork
      const captionElement = document.createElement("figcaption");
      //Textcontent property is set to the name property
      captionElement.textContent = artwork.name;
        //Figureelement is added as child element to gallery
      galleryElement.appendChild(figureElement);
      //Img and caption element is added as child to figureelement
      figureElement.append(imageElement, captionElement);
  }
}

async function generateFilterButtons(artworksset) {
  // Extract unique categories from artworks
  const categoriesList = ['Tous', ...new Set(artworksset.map(work => work.category.name))];
  
  // Create a container for filter buttons
  const filterWrapper = document.createElement('div');
  filterWrapper.id = 'container-filters';

  // Create a button for each category
  categoriesList.forEach(category => {
    const buttonNode = createFilterButton(category, artworksset);
    filterWrapper.appendChild(buttonNode);
  });

  // Insert filter buttons before the gallery in the portfolio
  const portfolioRef = document.getElementById('portfolio');
  const galleryRef = document.querySelector('.gallery');
  portfolioRef.insertBefore(filterWrapper, galleryRef);
}

// Function to create  filter button which takes two parameters catergory and artworksset
function createFilterButton(category, artworksset) {
  //Creating a button
  const buttonNode = document.createElement('button');
  //Giving button a classname
  buttonNode.classList.add('button-filter');
  //The textcontent is set to category name
  buttonNode.textContent = category;
  //Event listener is added to the button for click event
  buttonNode.addEventListener('click', (evt) => applyWorkFilter(evt,artworksset));
  return buttonNode;
}

 function applyWorkFilter(evt,artworksset ) {
  // Get the category selected by the user
  const selectedCategory = evt.target.textContent;

  // Filter works based on the selected category
  const worksFiltered = artworksset.filter(work => {
    // If 'Tous' (All) is selected, show all works
    if (selectedCategory === 'Tous') {
      return true;
    }
    // Otherwise, filter works by category name
    return work.category.name === selectedCategory;
  });

  // Display the filtered works
  showFilteredWorks(worksFiltered);

}
//Showing Filtered works In the gallery
function showFilteredWorks(filteredWorks) {
  const galleryRef = document.querySelector('.gallery');
  galleryRef.innerHTML = ''; // Clear existing content

  filteredWorks.forEach(work => {
    //Figure and Img element is created for each work
      const figureNode = document.createElement('figure');
      const imgNode = document.createElement('img');
      //Src set to imageurl property
      imgNode.setAttribute('src', work.imageUrl);
      //alt set to title property
      imgNode.setAttribute('alt', work.title);
      //Creating figcaption element to dipplay title of work
      const captionNode = document.createElement('figcaption');
      captionNode.textContent = work.title;
      //Img node and captionnode are apprended as child nodes to figurenode
      figureNode.appendChild(imgNode);
      figureNode.appendChild(captionNode);
      //Figurenode is apprended as childnode to the gallery
      galleryRef.appendChild(figureNode);
  });
}

 





//Trigger function on page load
async function init(){
  await displayWorks();
  //If there are is no token then it generatesfilterbuttons
  if (!sessionStorage.getItem("token")) {
    await generateFilterButtons(artworks);
}

}

init();
