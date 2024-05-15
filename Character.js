/* Character.js for Imperium Maledictum Character Creator
* Contains getter/setters for Name, Stats, Origin, Role, and Faction.
* additional methods:
*   - randomStat(); simulates 2d10 + 20 and returns int value
* All input is filtered in main.js\validateCharacterInput() before being sent here
*/

var character = {//Req 17: object that contains properties and methods
    strName: "",
    intStats: [0,0,0,0,0,0,0,0,0],//Req 4: Array created, used/gets input from user
    strOrigin: "",
    strRole: "",
    strFaction: "",
    strInventory: [""],  
    strAllOrigins: ["Agri World","Feral World","Fuedal World","Forge World","Hive World","Schola Progenium","Shrine World","Voidborn"],
    strAllFactions: ["Adeptus Administratum","Adeptus Astra Telepathica","Adeptus Mechanicus","Astra Militarum","Imperial Fleet","Infractionist","The Inquisition","Rogue Trader Dynasty"],
    strAllRoles: ["Interlocutor","Mystic","Penumbra","Savant","Warrior","Zealot"],

    getName(){
        return this.strName;//Req 18: this.keyword, plenty of uses below.
    },//end getName, returns character name

    setName(strNewName){
        this.strName = strNewName;
    },//end setName, gets filtered string and sets name

    getStat(intStatIndex){
        return this.intStats[intStatIndex];
    },//end getStat, returns value for specified stat

    setStat(intStatIndex, intNewStat){
        this.intStats[intStatIndex] = intNewStat;
    },//end setStat, already filtered integer

    randomStat(){
        var intRandomStat = Math.floor((Math.random() * 10) + 1);//1d10 //Req 15: using math object
        intRandomStat = intRandomStat + Math.floor((Math.random() * 10) + 1);//1d10
        intRandomStat = intRandomStat + 20;// + 20
        return intRandomStat;
    },//end randomStat, "rolls 2 10 sided dice" and adds 20

    setOrigin(strOrigin){
        if(strOrigin == ""){//if blank, set random
            this.strOrigin = this.strAllOrigins[Math.floor((Math.random() * 8))];
        } else {
            this.strOrigin = strOrigin;
        }
    },//end setOrigin, gets integer and assigns based on dictionary

    getOrigin(){
            return this.strOrigin;
    },//end getOrigin, returns origin

    setFaction(strFaction){
        if(strFaction == ""){
            this.strFaction = this.strAllFactions[Math.floor((Math.random() * 8))];
        } else {
            this.strFaction = strFaction;
        }
    },//end setFaction
    
    getFaction(){
            return this.strFaction;
    },//end getFaction

    setRole(strRole){
        if(strRole == ""){
            this.strRole = this.strAllRoles[Math.floor((Math.random() * 6))];
        } else {
            this.strRole = strRole;
        }
    },//end setRole, 

    getRole(){
            return this.strRole;
    },/*end getRole, returning role
    Could add different return values, like description and bonuses.
    */
}//end character object