function showWords() {
    var search = document.getElementById("searchQuery").value;
    console.log('Getting words with search query: "' + search + '"');

    if (search != '') {
        search = '?q=' + search;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                var result = JSON.parse(xmlhttp.responseText);

                console.log(result)
                console.log('length:', result.length)

                var html = ``;

                for (var ind = 0; ind < result.length; ++ind) {
                    var currentWord = result[ind].word
                    var currentLanguage = result[ind].lang
                    var currentTranslations = result[ind].translations

                    var relatedText = ``
                    for (var t_ind = 0; t_ind < currentTranslations.length; ++t_ind) {
                        relatedText += '<li>' + currentTranslations[t_ind].word + ' (' + currentTranslations[t_ind].lang + `) <div class="float-sm-right"><a style="cursor:pointer" onclick="deleteRelatedWord('` + currentWord + `', '` + currentTranslations[t_ind].word + `')"><i class="far fa-trash-alt fa-sm"></i></a></div>` + '</li>'
                    }

                    // Add the card-deck
                    if (ind % 5 === 0) {
                        if (ind != 0) {
                            html += '</div>'
                        }

                        html += '<div class="card-deck" style="margin-top:10px">';
                    }

                        html += `<div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">` + currentWord + `<div class="float-sm-right"><a style="cursor:pointer" onclick="deleteWord('` + currentWord + `')"><i class="far fa-trash-alt fa-sm"></i></a></div></h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">Language: ` + currentLanguage + `</p>
                                        <p class="card-text">Related Words:<ul>` + relatedText + `</ul></p>
                                    </div>
                                    <div class="card-footer">
                                        <a href=# class="btn btn-sm btn-success" onclick="addAndShow('` + currentWord + `')">Add related word</a>
                                    </div>
                                  </div>`;
                }

                document.getElementById("searchResults").innerHTML = html;
                console.log("Success")
            }
            else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            }
            else {
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
        }
    };
    xmlhttp.open("GET", "/searchWords" + search, true);
    xmlhttp.send();
}

function showWordsAddRelated() {
    var search = document.getElementById("searchQueryRelated").value;
    console.log('Getting words with search query: "' + search + '"');

    if (search != '') {
        search = '?q=' + search;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200)

                var result = JSON.parse(xmlhttp.responseText);
                var html = ``;

                for (var ind = 0; ind < result.length; ++ind) {
                    var currentWord = result[ind].word
                    var currentLanguage = result[ind].lang
                    var currentTranslations = result[ind].translations

                    var relatedText = ``
                    for (var t_ind = 0; t_ind < currentTranslations.length; ++t_ind) {
                        relatedText += '<li>' + currentTranslations[t_ind].word + ' (' + currentTranslations[t_ind].lang + ')' + '</li>'
                    }

                    // Add the card-deck
                    if (ind % 1 === 0) {
                        if (ind != 0) {
                            html += '</div>'
                        }

                        html += '<div class="card-deck" style="margin-top:10px">';
                    }

                    html += `<div class="card">
                                <div class="card-header">
                                    <h5 class="card-title">` + currentWord + `<div class="float-sm-right"><a style="cursor:pointer" onclick="deleteWord('` + currentWord + `')"><i class="far fa-trash-alt fa-sm"></i></a></div></h5>
                                </div>
                                <div class="card-body">
                                    <p class="card-text">Language: ` + currentLanguage + `</p>
                                    <p class="card-text">Related Words:<ul>` + relatedText + `</ul></p>
                                </div>
                                <div class="card-footer">
                                    <a href=# class="btn btn-sm btn-success" onclick="addRelatedWord('` + currentWord + `', '` + currentLanguage + `')">Select related word</a>
                                </div>
                              </div>`;
                }

                document.getElementById("searchResultsRelated").innerHTML = html;
                console.log("Success")
            }
            else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            }
            else {
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
    };
    xmlhttp.open("GET", "/searchWords" + search, true);
    xmlhttp.send();
}

function addWord() {
    var word = document.getElementById("wordName").value;
    var lang = document.getElementById("wordLanguage").value;

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                // Dismiss modal and show updated words
                $('#addWord').modal('toggle');
                showWords()

                document.getElementById("wordName").value = "";
                document.getElementById("wordLanguage").value = "";
            }
            else {
                // Place error text on screen
                document.getElementById("addWordError").innerHTML = "The word could not be added";
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
        }
    };
    xmlhttp.open("POST", "/addWord", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("word=" + word + "&language=" + lang);
}

function addRelatedWord(toWord, toLang) {
    var fromWord = document.getElementById("relatedFromWord").value;

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                // Dismiss modal and show updated words
                $('#addRelatedWord').modal('toggle');
                showWords()

                document.getElementById("searchQueryRelated").value = "";
                document.getElementById("searchResultsRelated").innerHTML = "";
            }
            else {
                // Place error text on screen
                document.getElementById("addRelatedWordError").innerHTML = "The related word could not be added";
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
        }
    };
    xmlhttp.open("POST", "/addRelatedWord", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("from_word=" + fromWord + "&to_word=" + toWord + "&to_lang=" + toLang);
}

function addAndShow(fromWord) {
    document.getElementById("relatedFromWord").value = fromWord;
    document.getElementById("relatedFromWordTitle").innerHTML = "Select Related Word: " + fromWord;
    $('#addRelatedWord').modal('show')
}

function deleteWord(word) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                // Dismiss modal and show updated words
                showWords()
            }
            else {
                // Place error text on screen
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
        }
    };
    xmlhttp.open("DELETE", "/deleteWord", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("word=" + word);
}

function deleteRelatedWord(fromWord, toWord) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                // Dismiss modal and show updated words
                showWords()
            }
            else {
                // Place error text on screen
                console.log('something else other than 200 was returned: ' + xmlhttp.status);
            }
        }
    };
    xmlhttp.open("DELETE", "/deleteRelatedWord", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("from_word=" + fromWord + "&to_word=" + toWord);
}