function createHeader(){
    var header = document.createElement('header');
    var showHighscoreButton = document.createElement('button');

    showHighscoreButton.innerHTML = "Highscore";
    showHighscoreButton.setAttribute('id','show-highscore');
    showHighscoreButton.addEventListener("click", function(){
        showHighscoreButton.disabled = true;
        showHighscoreButton.style.translate = '0 -30px';
    })

    header.appendChild(showHighscoreButton);
    document.body.appendChild(header);
}

function init(){
    createHeader();

    document.querySelector('#show-highscore').style.translate = '0';
}

init()