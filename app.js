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
        }

    }    
}();

// UI Controller ##############################
const UICtrl = function(){
    const UISelectors = {
        activityList: '#activity-list',
        addBtn: '.add-btn',
        activityName: '#activity-name',
        activityTime: '#activity-time'
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

        // Clear input form
        UICtrl.clearInput();

        e.preventDefault();
    }
    
    
    return{
        init: function(){
            const activities = ActivityCtrl.getActivities();

            // Check for list activities
            if(activities.length === 0){
                UICtrl.hideUIList();
            }else{
                // Populate activities into UI
                 UICtrl.populateListAct(activities);
            }
       

            // Call eventListeners
            loadEventListers();
           
        }
        
    }
}(ActivityCtrl,UICtrl);

App.init();