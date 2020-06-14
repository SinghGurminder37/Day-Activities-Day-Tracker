// Storage controller #########################
const StorageCtrl = function(){
return{

}
}();

// Activity Controlle  ########################
const ActivityCtrl = function(){
    //Activity Constructor
    const Activity = function(id, name, time){
        this.id = id;
        this.name = name;
        this.time = time;
    }

    const data = {
        activities: [
            // {id: 0, name: "breakfast", time: "7 am"},
            // {id: 1, name: "Get Ready", time: "7:30 am"},
            // {id: 2, name: "Go to Work", time: "8:00 am"}
        ],
        currentActivity: null,
        totalActivities: 0
   
    }
    return{
        logData:function(){
            return data;
        },
        addActivity: function(name, time){
           let ID;
        //    Create ID
           if(data.activities.length > 0){
            ID = data.activities[data.activities.length - 1].id +1;
           }else{
            ID=0;
           }
        
            // Create new activity with ID
            newActivity = new Activity(ID, name, time);

            // Push new created activity into array
            data.activities.push(newActivity);
            return newActivity;

        },
        getActivities: function(){
            return data.activities;
        },
        getTotalActivities: function(){
            let total = 0;
            // Loop through items in array
            data.activities.forEach(function(activity){
                total = data.activities.length;
            });
            // Set activities to DStructure totalActivities  
            data.totalActivities = total;

            // return total activities
            return data.totalActivities;
        },
        getActivityById: function(id){
            let found = null;
            data.activities.forEach(function(activity){
               if(activity.id === id){
                   found = activity;
               }
            });
            return found;                   
        },
        setCurrentActivity: function(activity){
            data.currentActivity = activity;
        },
        getCurrentActivity: function(){
            return data.currentActivity;
        }
    }    
}();

// UI Controller ##############################
const UICtrl = function(){
    const UISelectors = {
        activityList: '#activity-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        activityName: '#activity-name',
        activityTime: '#activity-time',
        totalCalories: '.total-calories'
    }
    
    return{
        hideUIList: function(){
            document.querySelector(UISelectors.activityList).style.display = 'none';
        },
        clearInput: function(){
            document.querySelector(UISelectors.activityName).value = '',
            document.querySelector(UISelectors.activityTime).value = ''
        },
        addUIActivity: function(newActivity){
            // Show UI List
            document.querySelector(UISelectors.activityList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class name
            li.className = 'collection-item';
            // Add id
            li.id = `item-${newActivity.id}`;
            // Add HTML
            li.innerHTML = `<strong>${newActivity.name}: </strong> <em>${newActivity.time}</em>
            <a href="#" class="secondary-content">
                <i class="edit-activity fa fa-pencil"></i>
            </a>`;
            // Insert item
            document.querySelector(UISelectors.activityList).insertAdjacentElement('beforeend', li);
        },
        populateListAct: function(activities){
            let html = '';

            activities.forEach(function(activity){
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

        getActivityInput: function(){
            return{
                name:document.querySelector(UISelectors.activityName).value,
                time:document.querySelector(UISelectors.activityTime).value
            }
        },
        getUISelectors: function(){
            return UISelectors;
        },
        showTotalActivities: function(totalActivities){
            document.querySelector(UISelectors.totalCalories).textContent = totalActivities;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addActivityToForm: function(){
            document.querySelector(UISelectors.activityName).value = 
            ActivityCtrl.getCurrentActivity().name;
            document.querySelector(UISelectors.activityTime).value = ActivityCtrl.getCurrentActivity().time; 
            UICtrl.showEditState();
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        }
    }
}();

// App Controller #############################
const App = function(ActivityCtrl, UICtrl){
    const loadEventListers = function(){
        // Call UISelectors
        const UISelectors = UICtrl.getUISelectors();

        // Add event listener to add Button
        document.querySelector(UISelectors.addBtn).addEventListener('click', addActivitySubmit);

        // Add event listener for list pencil btn
        document.querySelector(UISelectors.activityList).addEventListener('click', activityUpdateSubmit);

    }

    // Call method of addbtn
    const addActivitySubmit = function(e){
        // Get input from UI Ctrl
        const inputs = UICtrl.getActivityInput();
        
        // Check for the input value in Form
        if(inputs.name !== '' && inputs.time !== ''){
            const newActivity = ActivityCtrl.addActivity(inputs.name, inputs.time);

        // Add activity to UI list
        UICtrl.addUIActivity(newActivity);
        }

        // Get total cals from ItemCtrl
        const totalActivities = ActivityCtrl.getTotalActivities(); 

        // Add totalActivities into UICtrl
        UICtrl.showTotalActivities(totalActivities);

        // Clear input form
        UICtrl.clearInput();

        e.preventDefault();
    }

    const activityUpdateSubmit = function(e){
        if(e.target.classList.contains('edit-activity')){
            // Get id of UI list activity
            const activityListID = e.target.parentNode.parentNode.id; 
            // Break list id to array
            const listId = activityListID.split('-');
            
            // Get 2nd array element(id)
            const activityID = parseInt(listId[1]);
            
            // Get activity info from data structure with UI activity id
            const activityToEdit = ActivityCtrl.getActivityById(activityID);

            //Set found activity to currentActivity
            ActivityCtrl.setCurrentActivity(activityToEdit);
            
            // Add activity to form input
            UICtrl.addActivityToForm();
                       
        }
    }
    
    
    return{
        init: function(){
            // Clear Edit State of UICtrl
            UICtrl.clearEditState();

            // Get activities from Data Structure
            const activities = ActivityCtrl.getActivities();

            // Check for list activities
            if(activities.length === 0){
                UICtrl.hideUIList();
            }else{
                // Populate activities into UI
                 UICtrl.populateListAct(activities);
            }

            // Get total cals from ItemCtrl
            const totalActivities = ActivityCtrl.getTotalActivities();

            // Add totalActivities into UICtrl
            UICtrl.showTotalActivities(totalActivities);
     
            // Call eventListeners
            loadEventListers();
           
        }
        
    }
}(ActivityCtrl,UICtrl);

App.init();