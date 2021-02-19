function filterAndUpdate(category){
  toggleFilterCross(category);
  updateCategories();
}

function closeModal(id){
  let el = document.getElementById(id);
  el.style.height = 0;
  openMainWrapper();
}

function openModal(id){
  let el = document.getElementById(id);
  el.style.height = "100%";
  closeMainWrapper();
}

//call these two when you open/close a modal
function openMainWrapper(){
  document.getElementById("main-wrapper").style.height = "100%";
}

function closeMainWrapper(){
  document.getElementById("main-wrapper").style.height = 0;
}

function toggleFilterCross(category){
  let filterCrossElements = document.getElementsByClassName("filter-cross");
  [].forEach.call(filterCrossElements, function(filterCross) {
    if (filterCross.classList) {
      if (filterCross.classList.contains(category)) {
        if (filterCross.classList.contains("selected")) {
          filterCross.classList.remove("selected");
        } else {
          filterCross.classList.add("selected");
        }
      }
    }
  });
}


//loops the filter-crosses and checks which are selected - those selected, it makes visible down below. Those not, it makes invisible.
function updateCategories() {
  let filterCrossElements = document.getElementsByClassName("filter-cross");
  let selectedCategories = [];
  let notSelectedCategories =[];
  //firstly collect lists of categories selected and not selected
  [].forEach.call(filterCrossElements, function(filterCross) {
    if (filterCross.classList) {
      let category = filterCross.classList[1];
      if (filterCross.classList.contains("selected")) {
        selectedCategories.push(category);
      } else {
        notSelectedCategories.push(category);
      }
    }
  });
  //display all if nothing is selected
  if(selectedCategories.length === 0){
    selectedCategories = notSelectedCategories;
    notSelectedCategories = []
  }
  //hide all that aren't selected,
  notSelectedCategories.forEach(category => {
    let itemsToHide = document.querySelectorAll(".item."+category);
    [].forEach.call(itemsToHide, function(item) {
      item.classList.add("invisible");
      item.classList.remove("visible");
    });
  });
  //then show all that are selected - the order here is important
  selectedCategories.forEach(category => {
    let itemsToShow = document.querySelectorAll(".item."+category);
    [].forEach.call(itemsToShow, function(item) {
      item.classList.add("visible");
      item.classList.remove("invisible");
    });
  });
}

function selectAllCategories() {
  document.getElementById("feed").childNodes.forEach(item => {
    if (item.classList) {
      if (item.classList.contains("invisible")) {
        item.classList.add("visible");
        item.classList.remove("invisible");
      }
    }
  });
  let filterCrossElements = document.getElementsByClassName("filter-cross");
  [].forEach.call(filterCrossElements, function(filterCross) {
    if (filterCross.classList) {
      filterCross.classList.remove("selected");
    }
  });
}

function openAndPlay(modalId, iframeId, url) {
  openModal(modalId);
  let contentContainer = document.querySelector("#" + modalId + " .item-modal-content");
  let newiframe = document.createElement('iframe');
  newiframe.classList.add("window", "border-lav", "big-thing", "in-front");
  newiframe.id = iframeId;
  newiframe.style.opacity = 0;
  contentContainer.appendChild(newiframe);
  setTimeout(() => { 
    newiframe.src = url; //load and display after the 1 second dropdown animation (dependency)
    newiframe.onload = () => {
      newiframe.style.opacity = 1;
    }
  }, 1000);
}

function closeAndRemoveiframe(modalId, iframeId){
  let sendTo = undefined; //will set the iframe src to undefined to close it down
  closeModal(modalId);
  let iframe = document.getElementById(iframeId);
  setTimeout(() => { iframe.style.display = "none"; iframe.id = ""; }, 1000);
  setTimeout(() => { iframe.src = sendTo; }, 1000);
}
