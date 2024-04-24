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

    displayAdminUI();
    setupAdminActions();

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
// function to clear the modal 
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
     displayAlertModal("photo supprimée avec succès");
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


//event:when clicking on close button  ofthe modal closes
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
// function to create and display addition form
 function createaddmodelAnddisplayform(){
  const modalContainer = document.querySelector(".modal-wrapper-add");
    modalContainer.style.display = null;
    createModalHeader();
    addWorkFormCreationAndVerify();
    
    
}
//function to create header elements of add modal
function createModalHeader() {
  const modalContainer = document.querySelector(".modal-wrapper-add");
  //create container for go bcak and close button(for header)
  const headerContainer = document.createElement("div");
  headerContainer.classList.add("modal-nav");
  //Create close button using font awusm
  
  const closeBtn = document.createElement("i");
  //Giving classname to the close button
  closeBtn.classList.add
  ("fa-solid", "fa-xmark", "modal-close-button");
  // Create go back button for going back to delete modal
  const backButton = document.createElement("i");
  //Giving classname to the go back button
  backButton.classList.add
  ("fa-solid", "fa-arrow-left", "go-back-button-addmodal");
  //Creating headline for addition modal
  const headerTitle = document.createElement("h3");
  headerTitle.textContent = "Ajout photo";
//aprend backbutton and closebutton to container
  headerContainer.append(backButton, closeBtn);
  //aprend header container and title to modal conatiner
  modalContainer.append(headerContainer, headerTitle);
}
// function to display form  for adding a work
 function addWorkFormCreationAndVerify(){
  const modalContainer = document.querySelector(".modal-wrapper-add");
  //Creating form element for addition modal
    const formElement = document.createElement("form");
    //Giving a classname to the form element
    formElement.classList.add("add-photo-information");
    //calling a function to create form elements
    createFormElements(formElement);
    modalContainer.appendChild(formElement);
    //calling a function to verify form element 
    verifyFormInputs(formElement);
    
 }

 // Function to create form elements
function createFormElements(workForm) {
  // Create a container for image input
  const imgInputContainer = document.createElement("div");
  imgInputContainer.classList.add("container-add-img");

  // Create a container for information input
  const infoInputContainer = document.createElement("div");
  infoInputContainer.classList.add("container-form-information");

  // Call functions to create image input and text input
  createImageInput(imgInputContainer);
  createTextInput(infoInputContainer);
  
  // Append created elements to the work form
  workForm.append(imgInputContainer, infoInputContainer, createSubmitButton());
}

// Function to create image input
function createImageInput(imageContainer) {
  // Create icon preview element
  const iconPreview = document.createElement("i");
  iconPreview.classList.add("fa", "fa-regular", "fa-image");

  // Create image preview element
  const previewImage = document.createElement("img");
  previewImage.classList.add("img-preview");
  previewImage.style.display = "none";

  // Create label for image input
  const imageLabel = document.createElement("label");
  imageLabel.setAttribute("for", "file");
  imageLabel.classList.add("labelAddImage");
  imageLabel.textContent = "+ Ajouter photo";

  // Create file input element for image
  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.setAttribute("id", "file");
  inputFile.setAttribute("accept", "image/png, image/jpeg");
  inputFile.classList.add("input-img", "verify-form");
  inputFile.required = true;

  // Create information text element
  const infoText = document.createElement("p");
  infoText.classList.add("infor-addImage");
  infoText.textContent = "jpg, png: max 4MB";

  // Append created elements to the image container
  imageContainer.append(
      iconPreview,
      previewImage,
      imageLabel,
      inputFile,
      infoText
  );
}
 
// Function to create text input for title and category
function createTextInput(infoContainer) {
  // Create label for title input
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Titre";

  // Create text input element for title
  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("name", "title");
  titleInput.setAttribute("id", "title");
  titleInput.classList.add("verif-form");
  titleInput.required = true;

  // Create label for category select
  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.textContent = "Catégorie";

  // Create select element for category
  const categorySelect = document.createElement("select");
  categorySelect.setAttribute("id", "selectCategory");
  categorySelect.classList.add("verif-form");
  categorySelect.required = true;

  // Call function to set up category options
  setupCategoryOptions(categorySelect);

  // Append created elements to the information container
  infoContainer.append(
      titleLabel,
      titleInput,
      categoryLabel,
      categorySelect
  );
}


  
// Function to set options for category select in addition form
function setupCategoryOptions(categoryDropdown) {
  fetchCategoriesAPICall()
      .then(data => {
          // Optionally add a default or placeholder category
          data.unshift({
              id: 0,
              name: "",
          });
          // Populate the dropdown with categories
          for (let optionItem of data) {
              const option = document.createElement("option");
              option.classList.add("cat-option");
              option.setAttribute("id", optionItem.id.toString()); // Ensure ID is a string
              option.setAttribute("name", optionItem.name);
              option.textContent = optionItem.name;
              categoryDropdown.append(option);
          }
      })
      .catch(error => {
          console.error("Error fetching categories:", error);
          // Handle error (e.g., display an error message)
      });
}


// Fetch Categories api call
 async function fetchCategoriesAPICall() {
  const response = await fetch("http://localhost:5678/api/categories");
  if (!response.ok) {
      throw new Error('Failed to fetch categories: ' + response.statusText);
  }
  return response.json();
}



// Function to create submit button
function createSubmitButton() {
  const submitButtonLabel = document.createElement("label");
  submitButtonLabel.getAttribute("for", "js-validForm-btn");
  submitButtonLabel.classList.add("js-add-works");
  submitButtonLabel.textContent = "Valider";
  submitButtonLabel.style.backgroundColor = "#A7A7A7";
  const submitButton = document.createElement("input");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("id", "js-validForm-btn");
  submitButton.style.display = "none";
  submitButtonLabel.appendChild(submitButton);
  return submitButtonLabel;
}

// Function to verify form input and to  show that the form is reday to submit
function verifyFormInputs(workForm) {
  //selecting the add works button
  const submitControl = workForm.querySelector(".js-add-works");
  //Selecting all the inputs which are required to verify the form
  const requiredInputs = workForm.querySelectorAll(".verif-form[required]");
  //For each input it adds event listner
  requiredInputs.forEach(input => {
      input.addEventListener("input", function () {
        //whenever we fill the input it check if all the inputs are valid
          if (workForm.checkValidity()) {
            //if valid it changes the color of button(means it is ready for submission)
              submitControl.style.backgroundColor = "#1D6154";
              //otherwise it does not change
          } else {
              submitControl.style.backgroundColor = "#A7A7A7";
          }
      });
  });
}


// Adding event listener whenever a change happens (value of input element changes)
document.addEventListener("change", handleFileSelectionChange);

// Function to handle file selection change
function handleFileSelectionChange(changeEvent) {
//if target value matches input for uploading images
    if (changeEvent.target.matches(".input-img")) {
      //it selects the first file
        const selectedFile = changeEvent.target.files[0];
        //selecting elements for manipulation
        const imageUploadContainer = document.querySelector(".container-add-img");
        const previewImageElement = imageUploadContainer.querySelector("img.img-preview");
        const iconImagePreview = imageUploadContainer.querySelector("i.fa-image");
        const vectorImagePreview = imageUploadContainer.querySelector("svg.svg-inline--fa.fa-image");
        const addImageButtonLabel = document.querySelector(".labelAddImage");
        const imageInfoParagraph = document.querySelector(".infor-addImage");
        const validFormats = ["image/jpeg", "image/png"];
//if selected file is less then or equal to 4 mb
        if (selectedFile.size <= 4 * 1024 * 1024) {
            showImagePreview(selectedFile, previewImageElement, iconImagePreview, vectorImagePreview, addImageButtonLabel, imageInfoParagraph);
            readFile(selectedFile, previewImageElement);
            verifyImageFormat(selectedFile, validFormats);
        } else {
          //if not
          displayAlertModal("La taille maximale autorisée est de 4 Mo pour chaque fichier.");
        }
    }
}

function showImagePreview(selectedFile, previewElement, iconPreview, vectorPreview, buttonLabel, infoText) {
  //Makes iconpreview,vectorview,previewelement invisible
  if (iconPreview) iconPreview.style.display = "none";
  if (vectorPreview) vectorPreview.style.display = "none";
  if (previewElement) {
      previewElement.style.display = "block";
      //set the path of preview element to url of selected image
      previewElement.src = URL.createObjectURL(selectedFile);
      //make buttonlabel,indotext invisible
      buttonLabel.style.display = "none";
      infoText.style.display = "none";
  }
}
//verifiles the format of the selected file
function verifyImageFormat(fileData, permittedFormats) {
  //if the format is wrong
  if (!permittedFormats.includes(fileData.type)) {
    
      displayModalAlert("SEULES LES IMAGES AUX FORMATS .JPG OU .PNG SONT ADMISES");
  }
}

// function reads the content of the selected file and displays it as a preview in the specified previewElement.
function readFile(fileData, previewElement) { //fileData: The file object representing the selected image file.
  const fileReader = new FileReader();
  //Read the content of filedata(selected image file)
  fileReader.readAsDataURL(fileData);
  //when reading is completed
  fileReader.onload = function () {
    //sets the result in previewevent to show
      previewElement.src = fileReader.result;
  };
}



//event:when clicking on add-works buttton
document.addEventListener("click", function(event) {
  if (event.target.matches(".js-add-works")) {
    event.preventDefault();
    processFormSubmit();
    
  }
});

function processFormSubmit() {
  const worksFormElement = document.querySelector(".add-photo-information");
  //checks if the form elements are valid
  if (worksFormElement.checkValidity()) {
      postNewWork();
      goBacktodeletemodal();
      refreshGallery();
  }
}


// Function to send data to add a work
function postNewWork() {
  //Get the value of title from the form
  const workTitle = document.getElementById("title").value;
  const categoryDropdown = document.getElementById("selectCategory");
  //Get the value of selected category
  const selectedOption = categoryDropdown.selectedIndex;
  const chosenCategory = categoryDropdown.options[selectedOption].id;
  //getting the selected image
  const imageFile = document.getElementById("file").files[0];
  //making an object for image,selected category and title
  const workData = new FormData();
  workData.append("image", imageFile);
  workData.append("title", workTitle);
  workData.append("category", chosenCategory);
  //retrieving token
  const userToken = sessionStorage.getItem("token");
//calling  post api for adding new work
  addWorkAPICall(workData, userToken)
      .then(response => {
          if (response.ok) {
              displayAlertModal("Photo ajoutée avec succès");
          } else {
              console.error("Error sending data: ", response.status);
          }
      })
      .catch(error => console.error("Error sending data: ", error));
}

//Add work api call
 async function addWorkAPICall(workData, userToken) {
  const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
      },
      body: workData,
  });

  return response; // Return the fetch response for further processing.
}

// Function to go back from add work modal to delete works modal
 function goBacktodeletemodal() {
  const addModalContainer = document.querySelector(".modal-wrapper-add");
  addModalContainer.style.display = "none";
  while (addModalContainer.firstChild) {
      addModalContainer.removeChild(addModalContainer.firstChild);
  }
  const deleteModalContainer = document.querySelector(".modal-wrapper-delete");
  deleteModalContainer.style.display = null;
}


//event:when clicking on go-back-button 
document.addEventListener("click", function(event) {
  if (event.target.matches(".go-back-button-addmodal")) {
    goBacktodeletemodal();
    
  }
});


// Function to display the alert message modal
function displayAlertModal(message) {
  // Retrieve the modal dialog element
  const alertModal = document.querySelector(".modal__popup-alert");
  const alertMessage = document.getElementById("alertMessage");

  // Check if alertMessage element exists
  if (alertMessage) {
      // Set alert message
      alertMessage.textContent = message;
  } else {
      console.error("Element with id 'alertMessage' not found.");
      return;
  }

  // Show the modal dialog
  alertModal.showModal();
}

// Function to close the alert message modal
function closeModal() {
  // Retrieve the modal dialog element
  const alertModal = document.querySelector(".modal__popup-alert");

  // Close the modal dialog
  alertModal.close();
}

// Event listener for the "Réessayer" button in the alert message modal
document.getElementById("tryAgainBtn").addEventListener("click", function() {
  // Close the alert message modal when the button is clicked
  closeModal();
});



 
//Trigger function on page load
async function init(){
  await displayWorks();
  //If there are is no token then it generatesfilterbuttons
  if (!sessionStorage.getItem("token")) {
    await generateFilterButtons(artworks);
    }

  if(sessionStorage.getItem("token")){
  adminPageAfterLogin();
  }

}

init();
