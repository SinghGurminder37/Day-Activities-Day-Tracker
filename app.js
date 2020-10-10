// Storage controller ##########################################################################################################################################
const StorageCtrl = (function () {
  // Public methods
  return {
    storeActivity: function(activity){
      let activities;
      // Check if any item in ls
      if(localStorage.getItem('activities') === null){
        activities = [];
        //Push activities
        activities.push(activity);
        // Set new activity
        localStorage.setItem('activities', JSON.stringify(activities));
      }else{
        // Get whats already in ls
        activities = JSON.parse(localStorage.getItem('activities'));

        // Push new Item
        activities.push(activity);

        // Reset  ls
        localStorage.setItem('activities', JSON.stringify(activities));
      }
    },
    getActivitiesFromStorage: function(){
      let activities;
      if(localStorage.getItem('activities') === null){
        activities =[]; 

      }else{
        activities = JSON.parse(localStorage.getItem('activities'))
      }
      return activities;
    },
    updateActivityStorage: function(updatedActivity){
      let activities = JSON.parse(localStorage.getItem('activities'));

      activities.forEach(function(activity, index){
        if(updatedActivity.id === activity.id){
          activities.splice(index, 1, updatedActivity);
        }
      });
      localStorage.setItem('activities', JSON.stringify(activities));
    },
    deleteActivityFromStorage: function(id){
      let activities = JSON.parse(localStorage.getItem('activities'));

      activities.forEach(function(activity, index){
        if(id === activity.id){
          activities.splice(index, 1);
        }
      });
      localStorage.setItem('activities', JSON.stringify(activities));
    },
    clearActivitiesFromStorage: function (){
      localStorage.removeItem('activities');
    }
  }
})();
 
// Activity Controller ##########################################################################################################################################
const ActivityCtrl = (function () {
  //Activity Constructor
  const Activity = function (id, name, time) {
    this.id = id;
    this.name = name;
    this.time = time;
  };

  const data = {
    // activities: [
      // {id: 0, name: "breakfast", time: "7 am"},
      // {id: 1, name: "Get Ready", time: "7:30 am"},
      // {id: 2, name: "Go to Work", time: "8:00 am"}
    // ],
    activities: StorageCtrl.getActivitiesFromStorage(),
    currentActivity: null,
    totalActivities: 0,
  };
  return {
    logData: function () {
      return data;
    },
    addActivity: function (name, time) {
      let ID;
      //    Create ID
      if (data.activities.length > 0) {
        ID = data.activities[data.activities.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new activity with ID
      newActivity = new Activity(ID, name, time);

      // Push new created activity into array
      data.activities.push(newActivity);
      return newActivity;
    },
    // Update activity
    updateActivity: function (name, time) {
      let found = null;

      data.activities.forEach(function (activity) {
        if (activity.id === data.currentActivity.id) {
          activity.name = name;
          activity.time = time;
          found = activity;
        }
      });
      return found;
    },

    // Delete Activity from Data Structure
    deleteActivity: function(id){
        // Get Ids
        const ids = data.activities.map(function(activity){
           return activity.id;
        });

        // Get Index
        const index = ids.indexOf(id);
        console.log(index);

        // Remove item
        data.activities.splice(index, 1)
    },

    clearAllActivities: function(){
      data.activities = [];
    },
   
    // Get Activities
    getActivities: function () {
      return data.activities;
    },
    getTotalActivities: function () {
      let total = 0;
      // Loop through items in array
      data.activities.forEach(function (activity) {
        total = data.activities.length;
      });
      // Set activities to DStructure totalActivities
      data.totalActivities = total;

      // return total activities
      return data.totalActivities;
    },
    getActivityById: function (id) {
      let found = null;
      data.activities.forEach(function (activity) {
        if (activity.id === id) {
          found = activity;
        }
      });
      return found;
    },
    setCurrentActivity: function (activity) {
      data.currentActivity = activity;
    },
    getCurrentActivity: function () {
      return data.currentActivity;
    },
  };
})();

// UI Controller ##########################################################################################################################################
const UICtrl = (function () {
  const UISelectors = {
    clearBtn : '.clear-btn',
    activityList: "#activity-list",
    listActivities: "#activity-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    activityName: "#activity-name",
    activityTime: "#activity-time",
    totalCalories: ".total-calories",
  };

  return {
    hideUIList: function () {
      document.querySelector(UISelectors.activityList).style.display = "none";
    },
    clearInput: function () {
      (document.querySelector(UISelectors.activityName).value = ""),
        (document.querySelector(UISelectors.activityTime).value = "");
    },
    addUIActivity: function (newActivity) {
      // Show UI List
      document.querySelector(UISelectors.activityList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class name
      li.className = "collection-item";
      // Add id
      li.id = `item-${newActivity.id}`;
      // Add HTML
      li.innerHTML = `<strong>${newActivity.name}: </strong> <em>${newActivity.time}</em>
            <a href="#" class="secondary-content">
                <i class="edit-activity fa fa-pencil"></i>
            </a>`;
      // Insert item
      document
        .querySelector(UISelectors.activityList)
        .insertAdjacentElement("beforeend", li);
    },
    populateListAct: function (activities) {
      let html = "";

      activities.forEach(function (activity) {
        html += `<li class="collection-item" id="item-${activity.id}">
                <strong>${activity.name}: </strong> <em>${activity.time}</em>
                <a href="#" class="secondary-content">
                    <i class="edit-activity fa fa-pencil"></i>
                </a>
            </li>
                `;
      });
      document.querySelector(UISelectors.activityList).innerHTML = html;
    },
    updateListActivity: function (activity) {
      let listItems = document.querySelectorAll(UISelectors.listActivities);

      //   Turn Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const activityID = listItem.getAttribute("id");

        if (activityID === `item-${activity.id}`) {
          document.querySelector(
            `#${activityID}`
          ).innerHTML = `<strong>${activity.name}: </strong> <em>${activity.time}</em>
                <a href="#" class="secondary-content">
                    <i class="edit-activity fa fa-pencil"></i>
                </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    getActivityInput: function () {
      return {
        name: document.querySelector(UISelectors.activityName).value,
        time: document.querySelector(UISelectors.activityTime).value,
      };
    },
    getUISelectors: function () {
      return UISelectors;
    },
    showTotalActivities: function (totalActivities) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalActivities;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    addActivityToForm: function () {
      document.querySelector(
        UISelectors.activityName
      ).value = ActivityCtrl.getCurrentActivity().name;
      document.querySelector(
        UISelectors.activityTime
      ).value = ActivityCtrl.getCurrentActivity().time;
      UICtrl.showEditState();
    },

    removeActivities: function() {
    let  listActivities = document.querySelectorAll(UISelectors.listActivities);

    // Turn Node list into array
    listActivities = Array.from(listActivities);

    listActivities.forEach(function(activity){
      activity.remove();
    });
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
  };
})();

// App Controller ################################################################################################################################################################
const App = (function (ActivityCtrl, StorageCtrl, UICtrl) {
  const loadEventListers = function () {
    // Call UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // Add event listener to add Button
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", addActivitySubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Add event listener for list pencil btn
    document
      .querySelector(UISelectors.activityList)
      .addEventListener("click", activityEditClick);

    // Event Listener update activity
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", activityUpdateSubmit);

    // Event Listener delete activity
    document
    .querySelector(UISelectors.backBtn)
    .addEventListener("click", function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    });

    // Event Listener delete activity
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", activityDeleteSubmit);

      // Event Listener clear all activities
    document
    .querySelector(UISelectors.clearBtn)
    .addEventListener("click", clearAllActivitiesClick);
  };

  // Call method of addbtn
  const addActivitySubmit = function (e) {
    // Get input from UI Ctrl
    const inputs = UICtrl.getActivityInput();

    // Check for the input value in Form
    if (inputs.name !== "" && inputs.time !== "") {
      const newActivity = ActivityCtrl.addActivity(inputs.name, inputs.time);

      // Add activity to UI list
      UICtrl.addUIActivity(newActivity);
    }

    // Get total cals from ItemCtrl
    const totalActivities = ActivityCtrl.getTotalActivities();

    // Add totalActivities into UICtrl
    UICtrl.showTotalActivities(totalActivities);

    // Store Into ls
    StorageCtrl.storeActivity(newActivity);
  
    // Clear input form
    UICtrl.clearInput();

    e.preventDefault();
  };

  // Activity Update Submit
  const activityEditClick = function (e) {
    if (e.target.classList.contains("edit-activity")) {
      // Get id of UI list activity
      const activityListID = e.target.parentNode.parentNode.id;
      // Break list id to array
      const listId = activityListID.split("-");

      // Get 2nd array element(id)
      const activityID = parseInt(listId[1]);

      // Get activity info from data structure with UI activity id
      const activityToEdit = ActivityCtrl.getActivityById(activityID);

      //Set found activity to currentActivity
      ActivityCtrl.setCurrentActivity(activityToEdit);

      // Add activity to form input
      UICtrl.addActivityToForm();
    }
    e.preventDefault();
  };

// Activity Update submit
  const activityUpdateSubmit = function (e) {
    // Get Input from UI
    const input = UICtrl.getActivityInput();

    // Update Item
    const updatedActivity = ActivityCtrl.updateActivity(input.name, input.time);

    // Update UI
    UICtrl.updateListActivity(updatedActivity);

    // Get total cals from ItemCtrl
    const totalActivities = ActivityCtrl.getTotalActivities();

    // Add totalActivities into UICtrl
    UICtrl.showTotalActivities(totalActivities);
    // Update ls
    StorageCtrl.updateActivityStorage(updatedActivity);

    UICtrl.clearEditState();
    e.preventDefault();
  };

// Activity delete from List
const activityDeleteSubmit = function(e){
    console.log(123);
    // Get current Item
    const currentItem = ActivityCtrl. getCurrentActivity();

    // Delete activity from Data Structure
    ActivityCtrl.deleteActivity(currentItem.id); 

    // Delete from UI 
    UICtrl.deleteListItem(currentItem.id);

    // Get total activities from ItemCtrl
    const totalActivities = ActivityCtrl.getTotalActivities();

    // Add totalActivities into UICtrl
    UICtrl.showTotalActivities(totalActivities);

    // Delete activity from ls
    StorageCtrl.deleteActivityFromStorage(currentItem.id);

    e.preventDefault();
};

// Clear Activities
const clearAllActivitiesClick = function(e){
  // Delete all activities from data Structure
  ActivityCtrl.clearAllActivities();

  // Get total activities from ItemCtrl
  const totalActivities = ActivityCtrl.getTotalActivities();

  // Add totalActivities into UICtrl
  UICtrl.showTotalActivities(totalActivities);

  // Delete all activities from UI
  UICtrl.removeActivities();

  // Clear activities from ls
  StorageCtrl.clearActivitiesFromStorage();

  // Hide the UL
  UICtrl.hideUIList();

  e.preventDefault();
};


  return {
    init: function () {
      // Clear Edit State of UICtrl
      UICtrl.clearEditState();

      // Get activities from Data Structure
      const activities = ActivityCtrl.getActivities();

      // Check for list activities
      if (activities.length === 0) {
        UICtrl.hideUIList();
      } else {
        // Populate activities into UI
        UICtrl.populateListAct(activities);
      }

      // Get total cals from ItemCtrl
      const totalActivities = ActivityCtrl.getTotalActivities();

      // Add totalActivities into UICtrl
      UICtrl.showTotalActivities(totalActivities);

      // Call eventListeners
      loadEventListers();
    },
  };
})(ActivityCtrl, StorageCtrl, UICtrl);

App.init();
