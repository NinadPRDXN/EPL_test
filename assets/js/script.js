/* Author: 
    Ninad Parkar
*/

var
login = document.querySelectorAll('.login'), //For Index Page
home = document.querySelectorAll('.home'), //For Home Page
clubList = document.querySelectorAll('.club_list'), //For Clubs List Page
matchDetails = document.querySelectorAll('.match_details'), //For Match Details Page
logout = document.querySelector('.logout'),
loc = document.location.pathname,
dir = loc.substring(0, loc.lastIndexOf('/'));


//Js Script for Login(index) page
if (login.length > 0) {
    
    var 
    submit = document.querySelector('.submit input'),
    auth = document.querySelector('.login_form');

    //To redirect to Home page if user has login
    login.onload = checking();
    function checking() {
        if(localStorage.hasOwnProperty('user') == true) {
            return window.location.href = dir+"/home.html";
        }
    }

    //After Login btn is clicked
    submit.onclick = function(e) {
        e.preventDefault();

        var
        userName = document.querySelector('.user_name input'),
        password = document.querySelector('.password input'),
        errorMsg = document.querySelector('.error_msg');

        if (userName.value == "admin" && password.value == "admin") {
            localStorage.setItem("user", 1);
            window.location.href = dir+"/home.html";
        }
        else {
            auth.reset();
            errorMsg.classList.add('error_msg_display');
            errorMsg.innerHTML = "Invalid Credentials";
        }
    }
}

//Js Script for Home page
if (home.length > 0) {
    //To redirect to Login(index) page if user has not login
    home.onload = checking();
    function checking() {
        loadingIndex();
    }
}

//Js Script for Clubs List page
if (clubList.length > 0) {
    var
    teamDropdown = document.querySelector('.team_dropdown'),
    teamPerformance = document.querySelector('.team_performance'),
    showPerformance = document.querySelector('.show_more');

    //Fetching Details of Matches and Create dropdown according to that
    ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json');
    
    ourRequest.onload = function() {
        apiData = JSON.parse(ourRequest.responseText);
        var 
        matches = apiData.matches,
        teamNames = [];

        matches.forEach(function(item) {
            teamNames.push(item.team1);
            teamNames.push(item.team2);
        });

        var teamNamesRefined = teamNames.filter(onlyUnique);

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        teamNamesRefined.forEach( function(item) {
            teamDropdown.innerHTML += 
            "<option>" + item + "</option>";
        });

    }
    ourRequest.send();

    clubList.onload = checking();

    function checking() {
        loadingIndex();
        var
        urlThread = window.location.href,
        url = new URL(urlThread),
        urlParameter = url.search;
        refiningPhase1 = urlParameter.replace("?teamname=", "");
        refiningPhase2 = refiningPhase1.replace(/%20/g, " ");
        refinedUrlPara = refiningPhase2.replace(/&amp;/g, "&");
        if (refinedUrlPara.length > 0) {
            //Loading Details of Matches
            ourRequest.onload = function() {
                apiData = JSON.parse(ourRequest.responseText);

                var 
                matches = apiData.matches,
                teamNames = [];

                matches.forEach(function(item) {
                    teamNames.push(item.team1);
                    teamNames.push(item.team2);
                });

                var teamNamesRefined = teamNames.filter(onlyUnique);

                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                teamNamesRefined.forEach( function(item) {
                    teamDropdown.innerHTML += 
                    "<option>" + item + "</option>";
                });

                var
                teamDropdownSelected = teamDropdown.options,
                teamDropdownLength = teamDropdownSelected.length;

                //To Display after it is redirected from Match Details Page
                for(var i = 0; i < teamDropdownLength; i++) {
                    if ( refinedUrlPara == teamDropdownSelected[i].firstChild.data) {
                        teamDropdown.selectedIndex = i;
                        var
                            teamDropdownSelected = refinedUrlPara,
                            matches = apiData.matches,
                            teamMatches = [];

                            showPerformance.classList.add('show_more_display');
                            teamPerformance.className = 'team_performance_display';

                            matches.forEach( function(item) {
                                if ( item.team1 == teamDropdownSelected || item.team2 == teamDropdownSelected ) {
                                    teamMatches.push({team1: item.team1, team2: item.team2, score1: item.score.ft[0], score2: item.score.ft[1], date: item.date});
                                }
                            });

                            teamPerformance.innerHTML = "";

                            for ( var i = 0; i < 5; i++) {
                                teamPerformance.innerHTML +=
                                "<ul class='club_list_teams'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
                            }
                        break;
                    }
                } 
            }
        }
    }

    //After Selecting the dropdown
    teamDropdown.onchange = function() {
        var 
        teamDropdownStr = teamDropdown.options[teamDropdown.selectedIndex].innerHTML,
        matches = apiData.matches,
        teamMatches = [];

        teamPerformance.className = 'team_performance_display';
        teamDropdownSelected = teamDropdownStr.replace("&amp;", "&");

        matches.forEach( function(item) {
            if ( item.team1 == teamDropdownSelected || item.team2 == teamDropdownSelected ) {
                teamMatches.push({team1: item.team1, team2: item.team2, score1: item.score.ft[0], score2: item.score.ft[1], date: item.date});
            }
        });

        teamPerformance.innerHTML = "";

        showPerformance.classList.add('show_more_display');
        for ( var i = 0; i < 5; i++) {
            teamPerformance.innerHTML +="<ul class='club_list_teams'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
        }
    }

    //For Show 5 more
    showPerformance.onclick = function() {
        var
        displayedTeam = document.querySelectorAll('.club_list_teams').length,
        teamDropdownStr = teamDropdown.options[teamDropdown.selectedIndex].innerHTML,
        matches = apiData.matches,
        teamMatches = [],
        limit = displayedTeam + 5;

        teamDropdownSelected = teamDropdownStr.replace("&amp;", "&");
        
        matches.forEach( function(item) {
            if ( item.team1 == teamDropdownSelected || item.team2 == teamDropdownSelected ) {
                teamMatches.push({team1: item.team1, team2: item.team2, score1: item.score.ft[0], score2: item.score.ft[1], date: item.date});
            }
        });
        if (limit > teamMatches.length) {
            var
            leftout = limit - teamMatches.length,
            newlimit = displayedTeam + leftout;

            for ( var i = displayedTeam; i <= newlimit; i++ ) {
                teamPerformance.innerHTML +="<ul class='club_list_teams'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
            }
            showPerformance.classList.remove('show_more_display');
        }
        else {
            for ( var i = displayedTeam; i < limit; i++ ) {
                teamPerformance.innerHTML +="<ul class='club_list_teams'><li>" + teamMatches[i].team1 + "</li><li>" + teamMatches[i].score1 + "-" + teamMatches[i].score2 + "</li><li>" + teamMatches[i].team2 + "</li><li>Date: " + teamMatches[i].date + "</li></ul>";
            }
        }
    }
}

//Js Script for Match Details page
if (matchDetails.length > 0) {
    var 
    matchday = [],
    matchDropdown = document.querySelector('.match_dropdown'),
    listOfMatches = document.querySelector('.list_of_matches'),
    ourRequest = new XMLHttpRequest();

    matchDetails.onload = checking();
    function checking() {
        loadingIndex();
    }

    ourRequest.open('GET', 'https://raw.githubusercontent.com/openfootball/football.json/master/2019-20/en.1.json');
    ourRequest.onload = function() { 
        apiData = JSON.parse(ourRequest.responseText);

        var matches = apiData.matches;

        matches.forEach(function(item) {
            matchday.push(item.round);
        });

        var matchdayRefined = matchday.filter(onlyUnique);

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        matchdayRefined.forEach( function(item, index) {
            matchDropdown.innerHTML += 
            "<option>" + item + "</option>";
        });
    }
    ourRequest.send();

    matchDropdown.onchange = function() {
        var 
        matchDropdownSelected = matchDropdown.options[matchDropdown.selectedIndex].innerHTML,
        matches = apiData.matches;

        listOfMatches.className = "list_of_matches_display";

        listOfMatches.innerHTML = "";

        matches.forEach( function(item) {
            if ( item.round == matchDropdownSelected ) {
                listOfMatches.innerHTML +=
                "<ul class='match_details_teams'><li class='team_name' onclick='transfer(this)'>" + item.team1 + "</li><li>" + item.score.ft[0] + "-" + item.score.ft[1] + "</li><li class='team_name' onclick='transfer(this)'>" + item.team2 + "</li><li>Date: " + item.date + "</li></ul>"; 
            }
        });
    }

    function transfer(team) {
        window.location.href = dir+"/clubs.html?teamname=" + team.innerHTML;
    }
}

//Js script for Home, Match Details and Club List Page combine
if ( home.length > 0 || matchDetails.length > 0 || clubList.length > 0 ) {

    var 
    menuBtn = document.querySelector('.menu_btn'),
    nav = document.querySelector('.navigation'),
    body = document.querySelector('body'),
    menuOpen = false;

    //For Menu Toggle
    menuBtn.addEventListener('click', () => {
        if(!menuOpen) {
            menuBtn.classList.add('open');
            nav.classList.add('nav_open');
            body.classList.add('overflow_hide');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            nav.classList.remove('nav_open');
            body.classList.remove('overflow_hide');
            menuOpen = false;
        }
    });

    //For logout
    logout.onclick = function() {
        localStorage.removeItem('user');
        window.location.href = dir+'/index.html';
    }
}

//For Loading Login(index) Page if user has not login
function loadingIndex() {
    if(localStorage.hasOwnProperty('user') == false) {
        return window.location.href = dir+"/index.html";
    }
}