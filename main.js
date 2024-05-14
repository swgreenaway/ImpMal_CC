/*tabPanel()
* PURPOSE: displays corresponding panel when clicking on tab-button
* RETURNS: void
*/
function tabPanel(e){
    let elPanels = document.querySelectorAll("div.tab-panel");
    let elTabs = document.querySelectorAll("button.tab-button");
    for(let i = 0; i < elPanels.length; i++){
        elPanels[i].style.display = "none";
        elTabs[i].className = elTabs[i].className.replace(" active", "");
    }
    e.target.className += " active";
    document.getElementById(e.target.value).style.display = "";
}

/*infoText()
* PURPOSE: display info based on radio selection
* RETURNS: String? contents maybe?
*/
function infoText(radioClass, radioID){
    let infoText = "";
    if(radioClass = "origin"){
        switch(radioID){
            case "agri":
                infoText = "These are the breadbaskets of the Imperium, dedicated entirely to agriculture.";
                break;
            case "feral":
                infoText = "These are wild and dangerous with nomadic tribes. There is very little technology.";
                break;
            case "fuedal":
                infoText = "These tend to be in the late iron age, ruled over by noble houses.";
                break;
            case "forge":
                infoText = "Factories cover this world, producing all sorts of goods for the Imperium.";
                break;
            case "hive":
                infoText = "These have cities with populations in the billions. The majority of people live on such worlds.";
                break;
            case "schola":
                infoText = "These worlds are dedicated to knowledge, and are home to massive libraries and databanks.";
                break;
            case "shrine":
                infoText = "Entire planets made into shrines for The God Emperor.";
                break;
            case "void":
                infoText = "Born on a voidship amongst the emptiness of space. They are as big as a city.";
                break;
        }
        document.getElementById("originInfo").textContent = infoText;
    }
    if(radioClass = "faction"){
        switch(radioID){
            case "administratum":
                infoText = "The Adminastratum are the recordkeepers and lawmakers of the Imperium. Bureacrats.";
                break;
            case "astra":
                infoText =  "Responsible for long distance communication and warp naviagtion. Members are often psychics.";
                break;
            case "mechanicus":
                infoText = "In charge of the forge worlds, they often replace body parts with machines. They worship the machine god.";
                break;
            case "militarum":
                infoText = "Largest army in the galaxy. Worlds often pay their tithe in troops for this group.";
                break;
            case "fleet":
                infoText = "They staff the massive voidships that transport armies around the galaxy";
                break;
            case "infractionist":
                infoText = "The criminals and low lives of the Imperium. Most don't ever leave their planets.";
                break;
            case "inquisition":
                infoText = "Limitless authority, this group weeds out the heretics with an iron fist.";
                break;
            case "trader":
                infoText = "Traders and explorers, this group has many freedoms compared to the rest.";
                break;
       }
       document.getElementById("factionInfo").textContent = infoText; 
    }
}


/*validateCharacterInput()
* PURPOSE: checks for name input and valid stat input
* RETURNS: boolean - true if valid, false if no name (invalid stats are randomized)
*/
function validateCharacterInput(){
    let elAlert = document.getElementById("alert");
    let nameInput = document.getElementById("nameInput").value
    if(nameInput === ""){
        elAlert.textContent = "You must enter a name for your character.";
        return false;
    }else{
        character.setName(nameInput);
        elAlert.textContent = "";
    }
    character.setOrigin(document.querySelector('input[name="origin"]:checked').value);
    character.setFaction(document.querySelector('input[name="faction"]:checked').value);
    character.setRole(document.querySelector('input[name="role"]:checked').value);
    var elAttributes = document.getElementsByClassName("attribute");
    for(let i=0; i < elAttributes.length; i++){
        let intNewStat = elAttributes[i].value;
        intNewStat = parseInt(intNewStat);
        if(isNaN(intNewStat) || intNewStat > 100 || intNewStat < 1){//checking for invalid stat input
            character.setStat(i, character.randomStat());
        }else{
            character.setStat(i, intNewStat);
        }
    }//end for assigning attributes
    return true;
}

/*updateSheet()
* PURPOSE: updates sheet contents using Character's getters
* RETURNS: void
*/
function updateSheet(){
    document.getElementById("sheetName").textContent = "Name: " + character.getName();
    document.getElementById("sheetOrigin").textContent = "Origin: " + character.getOrigin();
    document.getElementById("sheetFaction").textContent = "Faction: " + character.getFaction();
    document.getElementById("sheetRole").textContent = "Role: " + character.getRole();
    let elSheetAttributes = document.getElementsByClassName("sheetAttribute");
    for(let i = 0; i < elSheetAttributes.length; i++){
        elSheetAttributes[i].textContent = character.getStat(i);
    }
}
