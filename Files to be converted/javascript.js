let map = L.map('map',{
    maxBounds: [
        [41.09807268468239, 29.01338475141975],
        [41.11383548170815, 29.039887364827734],
      ],
    maxBoundsViscosity: 1.0,
    minZoom:14,}).setView([41.10474805585872, 29.022884681711798   ], 15);
let openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20,
});

openstreetmap.addTo(map);
var beemarker = L.icon({
    iconUrl: 'images/Icons and Stuff/Bee-Marker.png',
    iconSize: [20, 30],
    iconAnchor: [10,30],
});
let tournumber = 0 ;
let allguesses = [];
let alllocations = [];
let participants = JSON.parse(localStorage.getItem("participants"));


let isitresult = false;
let ismarkeronmap = false;
let isconclusion = false;
let ispregame = true;
let numberofparticipant = participants.length;
var guess = L.marker( {icon: beemarker, draggable : true})

map.on('click', (e) => {
    if(!isitresult){
        if (ismarkeronmap) {
            guess.setLatLng(e.latlng);
            
        } else {
            guess = L.marker(e.latlng, {icon: beemarker, draggable: true }).addTo(map);
            ismarkeronmap = true;
            submitb.className="biggersubmit";
            submitb.innerText="Submit";
        }
    }
});
function parsing() {
    return new Promise((resolve, reject) => {
        Papa.parse('FinalCsv.csv', {
            download: true,
            header: true,
            complete: function(results) {
                latlong = results.data.map(row => [row.name, row.lat, row.lng]); 
                resolve(latlong);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

parsing()
    .then(data => {
        rndnum = rnd(0, data.length - 1);
        currentimage.src = `images/ordered photos/${rndnum}.jpg`;
    })
    .catch(error => {
        console.error('Error parsing CSV:', error);
    });
let rndnum;
var latlong;
let imgline;
let score = 0 ;
const latlengthmeter = 111.32*1000;
const longtiduelengthmeter = 40075*1000*0.75346369194/360 //0.75346369194 is cos of latitude

const afterscore = document.getElementById("afterscore");
const image = document.getElementById("current-image");
const submitb = document.getElementById("submit");
const scorea = document.getElementById("score");
const nextimagea = document.getElementById("nextimage");
const errora = document.getElementById("htmlerror");

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let totalscore = 0;
let linebetweenmarkers;
 
const sizeofitü = Math.floor(Math.sqrt((0.00944033377*latlengthmeter)**2 + (0.01506450233**longtiduelengthmeter)**2));
function timerunout(){
        if(!!ismarkeronmap){
            console.log(ismarkeronmap)
            guessSubmit()
        }else{
            clearInterval(secondsleft);
        clearTimeout(timeforshrink);    
        curlat =latlong[rndnum][1];
        curlng =latlong[rndnum][2];
        allguesses.push([""]);
        alllocations.push([curlat,curlng]);
        afterscore.textContent = `Time Runout`;
        errora.textContent = `lol`
        curloc = L.marker([curlat,curlng]).addTo(map);
        isitresult = true;
        currentimage.className = "afterimage";
        document.getElementById("map").style = `
    position:fixed;
    width: 100%;
    height: 85vh;`;
        map.invalidateSize(true);
        document.getElementById("results").removeAttribute("style");
        submitb.style.display="none";
        submitb.className="submit";
        ismarkeronmap = true;
        
    tournumber +=1;
    document.getElementById("tournumber").innerHTML = `${tournumber}/5`;
        document.getElementById("totalscore").innerHTML = `${totalscore}`;
        }
        


}
function guessSubmit() {
    if (!isitresult && ismarkeronmap ){
        clearInterval(secondsleft);
        clearTimeout(timeforshrink);
        latLngObj = guess.getLatLng();
        let latLngArr = [latLngObj.lat, latLngObj.lng];
        curlat =latlong[rndnum][1];
        curlng =latlong[rndnum][2];
        allguesses.push([latLngArr[0],latLngArr[1]]);
        alllocations.push([curlat,curlng]);
        guess.remove(map);
        guess = L.marker(latLngObj, {icon: beemarker, draggable: false }).addTo(map);
        let error = Math.floor(Math.sqrt((((curlat-latLngArr[0])*latlengthmeter)**2) + (((curlng-latLngArr[1])*longtiduelengthmeter)**2)));
        score = Math.floor(5000 * Math.E**(-5 * Math.sqrt(((curlat-latLngArr[0])**2)+((curlng-latLngArr[1])**2)) / 0.01947557727)) + 1;
        totalscore = totalscore + score;
        afterscore.textContent = `${score}`;
        errora.textContent = `${error}m`
        curloc = L.marker([curlat,curlng]).addTo(map);
        isitresult = true;
        currentimage.className = "afterimage";
        document.getElementById("map").style = `
    position:fixed;
    width: 100%;
    height: 85vh;`;
        
        document.getElementById("results").removeAttribute("style");
        submitb.style.display="none";
        submitb.className="submit";
        
    map.setView([41.10474805585872, 29.022884681711798], 15);
    linebetweenmarkers = L.polyline([[curlat,curlng],[latLngArr[0],latLngArr[1]]], {color: 'black',weight: '3', dashArray: '10, 10', dashOffset: '10'}).addTo(map);
    
    map.fitBounds(linebetweenmarkers.getBounds());
    tournumber +=1;
    map.invalidateSize(true);
        
    }
    
}
let secondsleft;
function alisfantasy() {
    document.getElementById("currentimage").className = "afterimage";
    document.getElementById("logo").style = "display:none;";


}
function timer() {
    passedtime = 0;
    secondsleft = setInterval(() => {
        if(passedtime === 30){
            clearInterval(secondsleft);
            timerunout()
        }
            if(passedtime>20){
                document.getElementById("timer").innerHTML = `00:0${30-passedtime}`
            }else{
                document.getElementById("timer").innerHTML = `00:${30-passedtime}`
            }
            passedtime +=1;
            
    }, 1000);
}
function nextimg() {
    if(isitresult && ismarkeronmap && tournumber===5 && !isconclusion && !ispregame){
        conclusion()
    } else{rndnum = rnd(0, latlong.length - 1);
        const newImageSrc = `images/ordered photos/${rndnum}.jpg`;
        
        const img = new Image();
        img.onload = function() {
            currentimage.src = newImageSrc;
            curloc.remove();
            guess.remove();
            ismarkeronmap = false;
            isitresult = false;
            document.getElementById("results").style.display = "none";
            currentimage.className = "image";
            document.getElementById("map").style = `position: absolute;   
        width: 20vw;
        height: 25vh;
        bottom:0;
        right: 0;
        margin-right: 2vw;
        margin-bottom: 5vh;
            `;
            document.getElementById("")
            
            submitb.removeAttribute("style");
            linebetweenmarkers.remove();
            map.setView([41.10474805585872, 29.022884681711798], 15);
            map.invalidateSize(true);
        };
        
        img.onerror = function() {
            console.error("Image failed to load: " + newImageSrc);
        }
        img.src = newImageSrc;
        submitb.className="placemarker";
        submitb.innerText="PLACE MARKER ON THE MAP";
        document.getElementById("ingameinfo").removeAttribute("style");
        document.getElementById("tournumber").innerHTML = `${tournumber}/5`;
        document.getElementById("totalscore").innerHTML = `${totalscore}`;
        timer()
     }
    
}
console.log(!!" ")
function conclusion(){
    isconclusion = true;
    document.getElementById("results").style.display = "none";
    document.getElementById("map").style = `position:fixed;
            width: 100%;
            height: 70vh;`;
    submitb.style.display = "none";
    document.getElementById("conclusion").removeAttribute("style");
    document.getElementById("progressbar").value = `${totalscore}`;
    document.getElementById("points").innerText = `${totalscore} POINTS`;
    linebetweenmarkers.remove(map);
    curloc.remove();
    guess.remove();
    let bounds = L.latLngBounds(L.polyline([alllocations[0],allguesses[0]], {color: 'black',weight: '3', dashArray: '10, 10', dashOffset: '10'}).getBounds());
    console.log(allguesses)
    console.log(alllocations)
    for (i=0 ; i<5 ;i+=1){
        if(!allguesses[i][0] ){
            console.log("empty guess")
            L.marker(alllocations[i], {
                icon: L.icon({
                    iconUrl: `images/Icons and Stuff/${i+1}.svg`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map);
        }else{
            L.marker(allguesses[i],{icon:beemarker}).addTo(map);
            L.marker(alllocations[i], {
                icon: L.icon({
                    iconUrl: `images/Icons and Stuff/${i+1}.svg`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map);
            conclusionline = L.polyline([alllocations[i],allguesses[i]], {color: 'black',weight: '3', dashArray: '10, 10', dashOffset: '10'}).addTo(map);
             bounds.extend(conclusionline.getBounds());
        }
        console.log(i+1);
    }
    map.fitBounds(bounds);
    participants[numberofparticipant - 1].push(totalscore);
    participants.sort((a, b) => b[1] - a[1]);
    let participants_serialized = JSON.stringify(participants);
    localStorage.setItem("participants",participants_serialized);
    participants = JSON.parse(localStorage.getItem("participants"));
    updateParticipantsList();  
    document.getElementById("participants-list").style = "display:none;"; 
    console.log(participants,"a");
}
leaderboardid = document.getElementById("leaderboard");
function updateParticipantsList() {
    const container = document.getElementById('participants-list-container');
    container.innerHTML = '';
    const ul = document.createElement('ol');
    ul.id = 'participants-list';
    ul.className = "participants-list"
    for (i=0;i<15 && i <participants.length;i+=1){
        const li = document.createElement('li');
        li.textContent = `${i+1}.  ${participants[i][0]}: ${participants[i][1]} `;
        ul.appendChild(li); 
        container.appendChild(ul);
    };

    container.appendChild(ul);
}
updateParticipantsList();
function pregame() {
    isconclusion= false;
    isconclusion = false;
    document.getElementById("conclusion").style = "display:none;";
    document.getElementById("map").style = "display:none;";
    document.getElementById("pregame").removeAttribute("style");
    document.getElementById("ingameinfo").style = "display:none;";

    document.getElementById("logo").removeAttribute("style");
    document.getElementById("participants-list").removeAttribute("style");

    ispregame = true;
    
}
function readygame() {
    const newImageSrc = `images/ordered photos/${rndnum}.jpg`;
        
        const img = new Image();
        img.onload = function() {
            currentimage.src = newImageSrc;
            ismarkeronmap = false;
            isitresult = false;
            document.getElementById("results").style.display = "none";
            currentimage.className = "image";
            document.getElementById("map").style = `position: absolute;   
        width: 20vw;
        height: 25vh;
        bottom:0;
        right: 0;
        margin-right: 2vw;
        margin-bottom: 5vh;
            `;
            submitb.removeAttribute("style");
        };
        
        img.onerror = function() {
            console.error("Image failed to load: " + newImageSrc);
        }
        img.src = newImageSrc;
    
    document.getElementById("participants-list").style = "display:none;";
    ispregame = false;
    document.getElementById("map").style = `position: absolute;   
    width: 20vw;
    height: 25vh;
    bottom:0;
    right: 0;
    margin-right: 2vw;
    margin-bottom: 5vh;
        `;
    map.invalidateSize(true);
    document.getElementById("submit").removeAttribute("style");
    document.getElementById("currentimage").className="image";
    document.getElementById("pregame").style= "display:none;";
    tournumber = 0;
    totalscore = 0;
    ismarkeronmap = false;
    isitresult = false;
    map.eachLayer(function (layer) {
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    });
    submitb.className="placemarker";
    submitb.innerText="PLACE MARKER ON THE MAP";
    allguesses = [];
    alllocations = [];
    document.getElementById("ingameinfo").removeAttribute("style");
    timer();
}
function controlspace(e) {
    if (e.code === 'Space') {
        if(isitresult&&ismarkeronmap && tournumber < 5){
            nextimg()
        }else if(isitresult && ismarkeronmap && tournumber===5 && !isconclusion && !ispregame){
            conclusion()
        } else if (isconclusion && !ispregame){
            pregame()
        }else{
            guessSubmit()
        }
    }
    if (e.code === "Enter" && ispregame) {
        addparticipant()
    }
}
function addparticipant() {
    if(document.getElementById("input").value.replace(/\s/g, '').length >1){
        participants.push([document.getElementById("input").value]);
        numberofparticipant +=1;
        document.getElementById("input").value = "";
        readygame()
    }

}
let timeforshrink;
function enlargenmapandsubmitbutton() {
    if (!isitresult) {
        const mapcenter = map.getCenter();
        document.getElementById("map").style = `position: absolute;   
        width: 60vw;
        height: 75vh;
        bottom:0;
        right: 0;
        margin-right: 2vw;
        margin-bottom: 8vh;
            `;
        map.invalidateSize(true);
        map.panTo(mapcenter);   
        if(ismarkeronmap){
            submitb.className="biggersubmit";
        } else {submitb.className="biggerplacemarker"}
        clearTimeout(timeforshrink);}
    
}
function shrinksubmitandmap() {
    if (!isitresult) {timeforshrink = setTimeout(() => {
        const mapcenter = map.getCenter();
    document.getElementById("map").style = `position: absolute;   
    width: 20vw;
    height: 25vh;
    bottom:0;
    right: 0;
    margin-right: 2vw;
    margin-bottom: 5vh;
        `;
    map.panTo(mapcenter);
    map.invalidateSize(true);
    if(ismarkeronmap === true){
        submitb.className="submit";
    } else
     {submitb.className="placemarker"}
    }, 700);}
    
    

}

nextimagea.addEventListener("click", nextimg);
submitb.addEventListener("click", guessSubmit);
document.addEventListener("keydown", controlspace);
document.getElementById("menu").addEventListener("click",pregame);
document.getElementById("start").addEventListener("click",addparticipant);







