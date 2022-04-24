//Function to open the answer json file inside the res folder
//Dump all the data inside a table of object dezerialized from the json file
function openAnswer(fileName) {
    //Open the json file 
    var jsonFile = new XMLHttpRequest();
    jsonFile.open("GET", fileName, false);
    jsonFile.send();
    //Get the data from the json file
    var jsonData = jsonFile.responseText;
    //Dezerialize the json data
    var jsonObj = JSON.parse(jsonData);

    //Create a table of qa objects
    var qas = [];
    for (var i = 0; i < jsonObj.length; i++) {
        var qa = new QA(jsonObj[i].question, jsonObj[i].answer, jsonObj[i].imgURI, jsonObj[i].userAnswer);
        qas.push(qa);
    }

    return qas;

    // //Create a table to display the data
    // var table = document.createElement("table");
    // table.setAttribute("id", "table");
    // table.setAttribute("class", "table table-striped");
    // //Create a table header
    // var header = document.createElement("thead");
    // var row = document.createElement("tr");
    // var th = document.createElement("th");
    // th.innerHTML = "Question";
    // row.appendChild(th);
    // th = document.createElement("th");
    // th.innerHTML = "Answer";
    // row.appendChild(th);
    // th = document.createElement("th");
    // th.innerHTML = "Image";
    // row.appendChild(th);
    // th = document.createElement("th");
    // th.innerHTML = "User Answer";
    // row.appendChild(th);
    // header.appendChild(row);
    // table.appendChild(header);
    // //Create a table body
    // var body = document.createElement("tbody");
    // //Loop through the json object
    // for (var i = 0; i < jsonObj.length; i++) {
    //     //Create a table row
    //     var row = document.createElement("tr");
    //     //Create a table data
    //     var td = document.createElement("td");
    //     td.innerHTML = jsonObj[i].question;
    //     row.appendChild(td);
    //     td = document.createElement("td");
    //     td.innerHTML = jsonObj[i].answer;
    //     row.appendChild(td);
    //     td = document.createElement("td");
    //     td.innerHTML = jsonObj[i].imgURI;
    //     row.appendChild(td);
    //     td = document.createElement("td");
    //     td.innerHTML = jsonObj[i].userAnswer;
    //     row.appendChild(td);
    //     body.appendChild(row);
    // }
    // table.appendChild(body);
    // //Append the table to the div
    // var div = document.getElementById("answer");
    // div.appendChild(table);
}

//Function that call the openAnswer function 
//Create a new radio button for each question
//Display the question and the image
function populateQuizz(qas) {

    //get the length of qas
    var length = qas.length;

    //Append a new radio button to the q-select div
    for (var i = 0; i < length; i++) {
        //Create a new radio button
        var radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "q-select");
        radio.setAttribute("value", "q" + i);
        radio.setAttribute("id", "q-" + i);
        radio.setAttribute("class", "q-select-radio");
        //Append the radio button to the q-select div
        document.getElementById("q-select").appendChild(radio);
    }

    addEventListenerToRadioButton();
    addEventListenerToNextButton();

    //Auto select the first radio button of the list
    document.getElementsByClassName("q-select-radio")[0].checked = true;
    //Set the question and the image
    //var question = qas[0].question;
    var image = qas[0].getImgURI();
    //Display the question and the image
    //document.getElementById("question").innerHTML = question;
    document.getElementById("image").src = "./res/Fruitiers/" + image;


}

//Adding an evenlistener to change the question when the radio button is selected
function addEventListenerToRadioButton() {
    var radios = document.getElementsByClassName("q-select-radio");
    for (var i = 0; i < radios.length; i++) {
        radios[i].addEventListener("click", function() {

            //Get the value of the selected radio button
            var value = this.value;
            //Get the index of the selected radio button
            var index = value.substring(1);
            //Get the question and the image
            //var question = qas[index].question;

            var image = qas[index].getImgURI();
            //Display the question and the image
            //document.getElementById("question").innerHTML = question;
            document.getElementById("image").src = "./res/Fruitiers/" + image;

            //If there is no next radio button (i.e the last button is seleted), the next button should change the page to the result one
            //The text of the button should channge from the arrow to "Finir"
            if (index == qas.length - 1) {
                // document.getElementById("next").innerHTML = "Finir";
                document.getElementById("next").addEventListener("click", function() {
                    localStorage.setItem("qas", JSON.stringify(qas));
                    console.log(qas.length);
                    //Change the page to the result one
                    window.location.href = "./results.html";
                });
            }
        });
    }
}

//Adding an eventlistener on the button to set the qa's userAnswer to the text input value
//Then select the next radio button
//If there is no next radio button (i.e the last button is seleted), the next button should change the page to the result one
//The text of the button should channge from the arrow to "Finir"
function addEventListenerToNextButton() {
    document.getElementById("next").addEventListener("click", function() {
        //Get the value of the selected radio button
        var value = document.querySelector('input[name="q-select"]:checked').value;
        //Get the index of the selected radio button
        var index = value.substring(1);

        //Get the text input value
        var userAnswer = document.getElementById("user-answer_input").value;
        //Set the userAnswer of the selected qa
        qas[index].setUserAnswer(userAnswer);
        //log the userAnswer for the current qa
        console.log(qas[index].getUserAnswer());
        //Select the next radio button
        document.getElementsByClassName("q-select-radio")[index++].checked = true;

    });
}


//Append every object of the table to the table table-results-body in the results.html page
function appendToTable(qas) {

    //Get the table body
    var tableBody = document.getElementById("table-results-body");
    //Get the length of qas
    var length = qas.length;

    //Append a new row to the table body
    for (var i = 0; i < length; i++) {
        var row = document.createElement("tr");
        //Append a new cell to the row
        var cell = document.createElement("td");

        //Get the answer and the user answer for the current qa
        var answer = qas[i].getAnswer();
        var userAnswer = qas[i].getUserAnswer();

        //if the answer = userAnswer, the cell should be green and have a checkmark icon
        //else the cell should be red and have a cross icon
        if (answer == userAnswer) {
            cell.setAttribute("class", "green");
            cell.innerHTML = "<i class='fa fa-check'></i>";
        } else {
            cell.setAttribute("class", "red");
            cell.innerHTML = "<i class='fa fa-times'></i>";
        }
        row.appendChild(cell);
        cell = document.createElement("td");
        //Set the text of the cell
        cell.setAttribute("style", "background-image: URL('./res/Fruitiers/" + qas[i].getImgURI() + "'); background-position: center; background-size: cover;");
        //cell.setAttribute("style", "background-po")
        //Append the cell to the row
        row.appendChild(cell);
        //Append a new cell to the row
        cell = document.createElement("td");
        //Set the text of the cell
        cell.innerHTML = qas[i].getAnswer();
        //Append the cell to the row
        row.appendChild(cell);
        //Append a new cell to the row
        cell = document.createElement("td");
        //Set the text of the cell
        cell.innerHTML = qas[i].getUserAnswer();
        //Append the cell to the row
        row.appendChild(cell);
        //Append the row to the table body
        tableBody.appendChild(row);
    }
}