/* main.js for Imperium Maledictum Character Creator
* contains functions that do all the "work" that aren't in 

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
* PURPOSE: display information and any bonuses based on radio selection
*/
function infoText(radioClass, radioID){
    let infoText = "";
    if(radioClass = "origin"){
        switch(radioID){
            case "agri":
                infoText = "These are the breadbaskets of the Imperium, dedicated entirely to agriculture.<br>" +
                "+5 to Strength and +5 to Toughness, Agility, OR Willpower.<br>" +
                "You gain a shoddy entrenching tool.";              
                break;
            case "feral":
                infoText = "These are wild and dangerous with nomadic tribes. There is very little technology.<br>" +
                "+5 to Toughness and +5 to Weapon Skill, Strength, OR Perception.<br>" +
                "You gain a shoddy set of survival gear.";
                break;
            case "fuedal":
                infoText = "These tend to be in the late iron age, ruled over by noble houses.<br>" +
                "+5 to Weapon Skill and +5 to Strength, Fellowship, OR Willpower.<br>" +
                "You gain a shoddy writing kit.";
                break;
            case "forge":
                infoText = "Factories cover this world, producing all sorts of goods for the Imperium.<br>" +
                "+5 to Intelligence and +5 to Balistic Skill, Agility, OR Toughness.<br>" +
                "You gain a vial of sacred Unguents.";
                break;
            case "hive":
                infoText = "These have cities with populations in the billions. The majority of people live on such worlds.<br>" +
                "+5 to Agility and +5 to Ballistic Skill, Perception, OR Fellowship<br>" +
                "You gain a set of ugly Filtration plugs.";
                break;
            case "schola":
                infoText = "These worlds are dedicated to knowledge, and are home to massive libraries and databanks.<br>" +
                "+5 to Fellowship and +5 to Toughness, Weapon Skill, OR Ballistic Skill.<br>" +
                "You gain a chrono.";
                break;
            case "shrine":
                infoText = "Entire planets made into shrines for The God Emperor.<br>" +
                "+5 to Willpower and +5 to Intelligence, Perception, OR Fellowship<br>" +
                "You gain a holy icon.";
                break;
            case "void":
                infoText = "Born on a voidship amongst the emptiness of space. They are as big as a city.<br>" +
                "+5 to Perception and +5 to Intelligence, Agility, OR Willpower.<br>" +
                "You gain a set of shoddy mag boots.";
                break;
        }
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
    }
    if(radioClass = "role"){
        switch(radioID){
            case "interlocutor":
                infoText = "Interlocutor's prefer talking things out over fighting. Whether that's with persuaion or indimidation varies with each individual.<br>" +
                "Choose 4 talents from: Air of Authority, Briber, Dealmaker, Distracting, Gallows, Humor, Gothic Gibberish, Lickspittle, and Overseer.<br>" +
                "3 advances to spend on Awareness, Discipline, Intuition, Lingusitics, and Rapport.<br>" +
                "2 advances to spend on any specialisation for Intuition, Presence, and Rapport.<br>" +
                "You gain a knife, a laspistol OR revolver, a vox bead, and either a Laud Hailer, pict recorder, or vox-caster.";
                break;
            case "mystic":
                infoText = "Mystics are touched by the warp, they are able to tap into vast amounts of power. Viewed as a blessing by some, but a heretical curse by many.";
                break;
            case "penumbra":
                infoText = "Penumbra's excel at espionage, sneaking around, and infiltration. Consist of spies, assasins, and thieves.";
                break;
            case "savant":
                infoText = "Savant's are scholars and experts. Fountains of knowledge, often specializing in certain fields. Care mroe for brains than brawn.";
                break;
            case "warrior":
                infoText = "Warrior's thrive in the heat of combat. Whether it's with an auto-gun or a power sword, they are adept fighters weathered by combat.";
                break;
            case "zealot":
                infoText = "Zealot's are fully devoted to their cause. This determiniation ca push them beyond what might seem possible, miracles of their faith.";
                break;
        }
    }
    document.getElementById("info").innerHTML = infoText;
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
