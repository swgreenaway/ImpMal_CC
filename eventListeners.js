//event listeners for tab-buttons
//calls tabPanel(e) from main.js
elTabButtons = document.querySelectorAll("button.tab-button");
for(let i = 0; i < elTabButtons.length; i++){
    elTabButtons[i].addEventListener("click", function(e){
        tabPanel(e);
    });
}

//event listener for radio buttons
elRadioButtons = document.querySelectorAll('input[type="radio"]');
for(let i = 0; i < elRadioButtons.length; i++){
    elRadioButtons[i].addEventListener("click", function(e){
        infoText(e.target.className, e.target.id);
    });
}

//event listener for submit button
//calls validateCharacterInput() and updateSheet() from main.js
elSubmit = document.getElementById("submitButton");
elSubmit.addEventListener("click", function(){
    if(validateCharacterInput()){
        updateSheet();
    };
});
