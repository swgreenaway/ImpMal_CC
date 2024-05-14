var character = {//Req 17: object that contains properties and methods
    strName: "",
    intStats: [0,0,0,0,0,0,0,0,0],//Req 4: Array created, used/gets input from user
    strOrigin: "",
    strRole: "",
    strFaction: "",
    strInventory: [""],  
    strAllOrigins: ["Agri World","Feral World","Fuedal World","Forge World","Hive World","Schola Progenium","Shrine World","Voidborn"],
    origin: ["These are the breadbaskets of the Imperium, dedicated entirely to agriculture.",
               "These are wild and dangerous with nomadic tribes. There is very little technology.",
               "These tend to be in the late iron age, ruled over by noble houses.",
               "Factories cover this world, producing all sorts of goods for the Imperium.",
               "These have cities with populations in the billions. The majority of people live on such worlds.",
               "These worlds are dedicated to knowledge, and are home to massive libraries and databanks.",
               "Entire planets made into shrines for The God Emperor.",
               "Born on a voidship amongst the emptiness of space. They are as big as a city."
            ],
    strAllFactions: ["Adeptus Administratum","Adeptus Astra Telepathica","Adeptus Mechanicus","Astra Militarum","Imperial Fleet","Infractionist","The Inquisition","Rogue Trader Dynasty"],
    faction: ["The Adminastratum are the recordkeepers and lawmakers of the Imperium. Bureacrats.",
                  "Responsible for long distance communication and warp naviagtion. Members are often psychics.",
                  "In charge of the forge worlds, they often replace body parts with machines. They worship the machine god.",
                  "Largest army in the galaxy. Worlds often pay their tithe in troops for this group.",
                  "They staff the massive voidships that transport armies around the galaxy",
                  "The criminals and low lives of the Imperium. Most don't ever leave their planets.",
                  "Limitless authority, this group weeds out the heretics with an iron fist.",
                  "Traders and explorers, this group has many freedoms compared to the rest."
            ],
    strAllRoles: ["Interlocutor","Mystic","Penumbra","Savant","Warrior","Zealot"],


    getInfo(radioName, radioIndex){
        if(radioName == faction){
            return this.faction[radioIndex];
        }
        if(radioName == origin){
            return this.faction[radioIndex];
        }
    },

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
        this.strOrigin = strOrigin;
    },//end setOrigin, gets integer and assigns based on dictionary

    getOrigin(){
            return this.strOrigin;
    },//end getOrigin, returns origin

    setFaction(strFaction){
        this.strFaction = strFaction;
    },//end setFaction
    
    getFaction(){
            return this.strFaction;
    },//end getFaction

    setRole(strRole){
        this.strRole = strRole;
    },//end setRole, 

    getRole(){
            return this.strRole;
    },/*end getRole, returning role
    Could add different return values, like description and bonuses.
    */
}//end character object