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
      //Creating figcaption element to display title of work
      const captionNode = document.createElement('figcaption');
      captionNode.textContent = work.title;
      //Img node and captionnode are apprended as child nodes to figurenode
      figureNode.appendChild(imgNode);
      figureNode.appendChild(captionNode);
      //Figurenode is apprended as childnode to the gallery
      galleryRef.appendChild(figureNode);
  });
}

// Function to display admin mode UI elements if user is logged in
function adminPageAfterLogin(){
  if(sessionStorage.getItem("token")){
    displayAdminUI();
    setupAdminActions();
    
  }
}

// Function to display admin UI elements
function displayAdminUI() {
  // Changing the text from login to logout
  const loginElement = document.querySelector("#login");
  loginElement.textContent = "Log out";
// Adding a mordifier link and icon to edit the gallery
  const editButtonTemplateHTML = `
  <a href="#" class="edition-link"><i class="fa-regular fa-pen-to-square">
  </i> Modifier</a>`;
  const introSophieElement = document.querySelector("#introduction h2");
   const galleryTitleElement = document.querySelector("#portfolio h2");
   //Inserting the edit gallery link afrer the title of the gallery
  galleryTitleElement.insertAdjacentHTML("afterend", editButtonTemplateHTML);
  const editButtonGalleryElement = document.querySelector("#portfolio a");
  //Adding classname to the edit gallery link
  editButtonGalleryElement.classList.add("open-modal-link");

//Adding a special black header to admin page
  const adminHeader = `
  <div class="edition_mode"><i class="fas fa-regular fa-pen-to-square fa-lg"></i>
  <p>Mode édition</p></div>`;
  const header = document.querySelector("header");
  //Leaving a margin at the top of page for admin page header
  header.style.marginTop = "6rem";
  header.insertAdjacentHTML("beforebegin", adminHeader);
}
 function setupAdminActions(){

// Adding event listner to the edit gallery link
  const editButtonGallery = document.querySelector("#portfolio a");
  editButtonGallery.addEventListener("click", function (event) {
    clearModalContent();
    modalDeleteWorksView();
    displayWorksModal();
    modal.showModal();


})} 
// function to clear the modal gallery
function clearModalContent() {
  const deleteWrapper = document.querySelector(".modal-wrapper-delete");
  const addWrapper = document.querySelector(".modal-wrapper-add");
  if (deleteWrapper) {
      while (deleteWrapper.firstChild) {
          deleteWrapper.removeChild(deleteWrapper.firstChild);
      }
  }
  if (addWrapper) {
      while (addWrapper.firstChild) {
          addWrapper.removeChild(addWrapper.firstChild);
      }
  }
}


 

 // Function to display delete works modal
 function modalDeleteWorksView() {
  
  // Selecting element from the dom and storing in const modal container
  const modalContainer = document.querySelector(".modal-wrapper-delete");

//Making container for close button
 const modalNavigation = document.createElement("div");
  modalNavigation.classList.add(
      "modal-nav"
  );
//Creating close modal button and its symbol
  const closeButton = document.createElement("i");
  closeButton.classList.add(
      "fa-solid",
      "fa-xmark",
      "modal-close-button"
  );
//Creating headline for thr gallery of the modal 
  const modalTitle = document.createElement("h3");
  modalTitle.textContent = "Gallerie Photo";

  //Creating a container for the gallery
  const galleryContainer = document.createElement("div");
  galleryContainer.id = "gallery-modal";

  //Creating a button to go to the addition mode
  const addButton = document.createElement("button");
  addButton.classList.add(
      "link-modal-add"
  );
  addButton.textContent = "Ajouter une photo";
  //Append close button as child to the modal navigation(its container)
 modalNavigation.appendChild(closeButton);
 //Append the elements to the modal container
  modalContainer.append(
      modalNavigation,
      modalTitle,
      galleryContainer,
      addButton
  );
}


 
 //Function to display works in delete works modal
 async function displayWorksModal() {
  // clearing the gallery
    const modalGallery = document.getElementById("gallery-modal");
    while (modalGallery.firstChild) {
        modalGallery.removeChild(modalGallery.firstChild);
    }
    // Waiting for function displayworks (fetch works api and assining the value to artworks array)
    await displayWorks();
    //Populating the modal gallery with works
    //iterating over each item in array artworks
    for (let modalWork of artworks) {
      //Creating figure element and giving it a classname
        const modalFigure = document.createElement("figure");
        modalFigure.classList.add
        ("modal-figure");
        //creating a delete button
        const modalDeleteButton = document.createElement("i");
        // setting the id attribute to modalwork.id
        modalDeleteButton.setAttribute("id", modalWork.id);
        modalDeleteButton.classList.add
        ("fa-solid", "fa-trash-can", "delete-work");
        //Creating the element image
        const modalImage = document.createElement("img");
        //sets crossorigine attribute to anonymus
        modalImage.setAttribute("crossorigin", "anonymous");
        //set src attribute to imageurl
        modalImage.setAttribute("src", modalWork.imageUrl);
        //Set alt attribute to title of artswork
        modalImage.alt = modalWork.title;
        //Apprend modal figure as child of modalgallery
        modalGallery.appendChild(modalFigure);
        //Apprend deletebutton and modalimage as child of figure element
        modalFigure.append(modalDeleteButton, modalImage);
    }

  }
  
/**event-delete works on model when clicking on trash can */

document.addEventListener("click", (event) => {
  //checks if the event matches
  if (event.target.matches(".delete-work")) {
    event.preventDefault();
    // Calls the api
    deleteWorksByIdAPICall(event.target.id);
     event.preventDefault();
    refreshGallery();
  }
});
//function for refeshing the gallery
async function refreshGallery() {
  await displayWorks();
  displayWorksModal();
}
//api call to delete work
function deleteWorksByIdAPICall(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
          "content-type": "application/Json",
          authorization: "Bearer " + sessionStorage.getItem("token"),
      },
  }).then((fetchResponse) => {
      if (fetchResponse.status === 200) {
          const targetElement = document.getElementById(workId);
          if (targetElement) {
              targetElement.parentNode.removeChild(targetElement);
          }
      }
  });
}


//event:when clicking on close button the modal closes
document.addEventListener("click", function(event) {
  if (event.target.matches(".modal-close-button")) {
    modal.close();
    
  }
});





//Event:when click on link modal button which links to additon modal
document.addEventListener("click", function(event) {
  if (event.target.matches(".link-modal-add")) {
    event.preventDefault();
    const modalWrapper = document.querySelector(".modal-wrapper-delete");
    //Make delete modal ivisible
    modalWrapper.style.display = "none";
    //calls function to display and create additon modal form
    createaddmodelAnddisplayform();
    
  }
});

 function createaddmodelAnddisplayform(){
  const modalContainer = document.querySelector(".modal-wrapper-add");
    modalContainer.style.display = null;
    createModalHeader();
    
    
}

function createModalHeader() {
  const modalContainer = document.querySelector(".modal-wrapper-add");
  const headerContainer = document.createElement("div");
  headerContainer.classList.add("modal-nav");
  
  const closeBtn = document.createElement("i");
  closeBtn.classList.add
  ("fa-solid", "fa-xmark", "close-modal-button");
  const backButton = document.createElement("i");
  backButton.classList.add
  ("fa-solid", "fa-arrow-left", "go-back-button-addmodal");
  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Ajout photo";
  headerContainer.append(backButton, closeBtn);
  modalContainer.append(headerContainer, headerTitle);
}

 
//Trigger function on page load
async function init(){
  await displayWorks();
  //If there are is no token then it generatesfilterbuttons
  if (!sessionStorage.getItem("token")) {
    await generateFilterButtons(artworks);

}
adminPageAfterLogin();
}

init();
