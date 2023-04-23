const greeting = document.querySelector('.greeting');

window.onload = () => {
    if(!sessionStorage.name){
        location.href = '/login';
    } else{
		
		var clueClickCount = 0;
        greeting.innerHTML = `hello ${sessionStorage.name}`;
        var puzzelTable = document.getElementById("puzzel");
	puzzelArrayData = preparePuzzelArray();
	for ( var i = 0; i < puzzelArrayData.length ; i++ ) {
		var row = puzzelTable.insertRow(-1);
		var rowData = puzzelArrayData[i];
		for(var j = 0 ; j < rowData.length ; j++){
			var cell = row.insertCell(-1);
			if(rowData[j] != 0){
				var txtID = String('txt' + '_' + i + '_' + j);
				cell.innerHTML = '<input type="text" class="inputBox" maxlength="1" style="text-transform: uppercase" ' + 'id="' + txtID + '" onfocus="textInputFocus(' + "'" + txtID + "'"+ ')" autocomplete="off" >';
				

			}else{
				cell.style.backgroundColor  = "transparent";
			}
		}
	}
	addHint();
	
}
    }


const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}
function addHint(){
	document.getElementById("txt_1_4").placeholder = "1";
	document.getElementById("txt_1_7").placeholder = "2";
	document.getElementById("txt_3_2").placeholder = "3";
	document.getElementById("txt_0_10").placeholder = "4";
	document.getElementById("txt_6_3").placeholder = "5";
	document.getElementById("txt_9_0").placeholder = "6";
}
//Stores ID of the selected cell into currentTextInput
function textInputFocus(txtID123){
	currentTextInput = txtID123;
}
//Returns Array
function preparePuzzelArray(){
var items = [	[0, 0,0, 0, 0, 0, 0, 0, 0, 0, 's',0],
				[0, 0,0, 0, 'h', 0, 0, 'd', 0, 0, 'u' ,0],
				[0, 0,0, 0, 'u', 0, 0, 'a', 0, 0, 'p',0],
				[0, 0,'w', 'o', 'l', 'v', 'e', 'r', 'i', 'n', 'e',0],
				[0, 0,0, 0, 'k', 0, 0, 'e', 0, 0, 'r',0],
				[0, 0,0, 0, 0, 0, 0, 'd', 0, 0, 'm', 0],
				[0, 0,0, 's', 'p', 'i', 'd', 'e', 'r', 'm', 'a', 'n'],
				[0,0, 0, 0, 0, 0, 0, 'v', 0, 0, 'n',0],
				[0,0, 0, 0, 0, 0, 0, 'i', 0, 0, 0,0],
				['d','e', 'a', 'd', 'p', 'o', 'o','l',0, 0, 0, 0],
				[0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0,0]
			];
return items;
}
//Clear All Button
function clearAllClicked() {
    currentTextInput = '';
    var inputElements = document.querySelectorAll('.inputBox');
    inputElements.forEach(function (inputElement) {
      inputElement.value = '';
      inputElement.style.backgroundColor = 'white';
    });
  }
  

//Check button
function checkClicked() {
	event.preventDefault();
	clearInterval(timerInterval);

    for (var i = 0; i < puzzelArrayData.length; i++) {
        var rowData = puzzelArrayData[i];
        for (var j = 0; j < rowData.length; j++) {
          if (rowData[j] != 0) {
            var selectedInputTextElement = document.getElementById('txt' + '_' + i + '_' + j);
            if (selectedInputTextElement.value != puzzelArrayData[i][j]) {
              selectedInputTextElement.style.backgroundColor = 'red';
            } else {
              selectedInputTextElement.style.backgroundColor = 'white';
            }
          }
        }
      }
	  
  // prevent form submission
  var crosswordData = JSON.stringify(puzzelArrayData);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/store-crossword-data');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log('Crossword data stored successfully.');
      } else {
        console.error('Failed to store crossword data.');
      }
    }
  };
  xhr.send(crosswordData);
}

  function puzzleCompleted() {
	const timeTaken = document.getElementById('timer').innerHTML; // get the time taken by the user
	// send an AJAX request to the server to store the time taken
	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/puzzle-completed');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({ timeTaken }));
  }
  
//Clue Button


function clueClicked() {
  if (currentTextInput != null) {
    var temp1 = currentTextInput;
    var token = temp1.split("_");
    var row = token[1];
    var column = token[2];
    document.getElementById(temp1).value = puzzelArrayData[row][column];
    clueClickCount++;
    if (clueClickCount >= 5) {
	
		alert("Clues Over!");

      document.getElementById("clueButton").style.display = "none";
    }
  }
}

let startTime; // variable to store start time
let timerInterval; // variable to store the interval

function startTimer() {
  startTime = new Date(); // store the start time
  timerInterval = setInterval(updateTimer, 1000); // update the timer every second
}

function updateTimer() {
  const currentTime = new Date(); // get the current time
  const timeDiff = currentTime - startTime; // calculate the time difference
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // calculate minutes
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000); // calculate seconds
  const timerElement = document.getElementById('timer'); // get the timer element
  timerElement.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // update the timer element
}

//Solve Button
function solveClicked(event){
	
	if (currentTextInput != null){
		var temp1 = currentTextInput;
		var token = temp1.split("_");
		var row = token[1];
		var column = token[2];
		
		// Print elements on top
		for(j = row; j >= 0; j--){
			if(puzzelArrayData[j][column] != 0){
				document.getElementById('txt' + '_' + j + '_' + column).value = puzzelArrayData[j][column];
				}else break;
		}
		// Print elements on right
		for(i = column; i< puzzelArrayData[row].length; i++){
			if(puzzelArrayData[row][i] != 0){
				document.getElementById('txt' + '_' + row + '_' + i).value = puzzelArrayData[row][i];
				}else break;
		}
		
		// Print elements below
		for(m = row; m< puzzelArrayData.length; m++){
			if(puzzelArrayData[m][column] != 0){
				document.getElementById('txt' + '_' + m + '_' + column).value = puzzelArrayData[m][column];
				}else break;
		}
		// Print elements on left
		for(k = column; k >= 0; k--){
			if(puzzelArrayData[row][k] != 0){
				document.getElementById('txt' + '_' + row + '_' + k).value = puzzelArrayData[row][k];
				}else break;
		}
		// Done!
		
	}
}


