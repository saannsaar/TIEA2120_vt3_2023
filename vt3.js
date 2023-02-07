"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check

// Alustetaan data, joka on jokaisella sivun latauskerralla erilainen.
// tallennetaan data selaimen localStorageen, josta sitä käytetään seuraavilla
// sivun latauskerroilla. Datan voi resetoida lisäämällä sivun osoitteeseen
// ?reset=1
// jolloin uusi data ladataan palvelimelta
// Tätä saa tarvittaessa lisäviritellä
function alustus() {
     // luetaan sivun osoitteesta mahdollinen reset-parametri
     // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
     const params = new window.URLSearchParams(window.location.search);
     let reset = params.get("reset");
     let data;
     if ( !reset  ) {
       try {
          // luetaan vanha data localStoragesta ja muutetaan merkkijonosta tietorakenteeksi
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
          data = JSON.parse(localStorage.getItem("TIEA2120-vt3-2023"));
       }
       catch(e) {
         console.log("vanhaa dataa ei ole tallennettu tai tallennusrakenne on rikki", data, e);
       }
       if (data) {
               console.log("Käytetään vanhaa dataa");
	       start( data );
               return;
           }
     }
     // poistetaan sivun osoitteesta ?reset=1, jotta ei koko ajan lataa uutta dataa
     // manipuloidaan samalla selaimen selainhistoriaa
     // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
     history.pushState({"foo":"bar"}, "VT3", window.location.href.replace("?reset="+reset, ""));
     // ladataan asynkronisesti uusi, jos reset =! null tai tallennettua dataa ei ole
     // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	fetch('https://appro.mit.jyu.fi/cgi-bin/tiea2120/randomize_json.cgi')
	    .then(response => response.json())
	    .then(function(data) {
               console.log("Ladattiin uusi data", data);
               // tallennetaan data localStorageen. Täytyy muuttaa merkkijonoksi
	       // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
	       localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
 	       start( data );
	    }
  	    );
}

// oma sovelluskoodi voidaan sijoittaa tähän funktioon
function start(data) {
  // tänne oma koodi
  console.log(data);
  joukkuelistaus();
 lomakebuttonit();
 rastivaihtoehdot();
 let leimausinputit = document.getElementsByClassName("leimausvalinta");
 

  function lomakebuttonit() {

    let lisaysformi = document.forms[0];
    let div1 = document.getElementById("leimaukset");
    div1.textContent ="";
    
    let div2 = document.getElementById("sarjaiset");
    div2.textContent ="";
    let fieldsetti = document.getElementById("tiedot");
    let sarjat = data.sarjat;
    console.log(sarjat);
    let labell = document.createElement("label");
    labell.textContent ="Leimaustapa";
   
    let div3 = document.createElement("div");
    div3.appendChild(labell);
    div1.appendChild(div3);
   let leimaustavat = data.leimaustavat;
   let div4 = document.createElement("div");
   leimaustavat.forEach((leimaustapa, index) => {
    let p = document.createElement("p");
   
    let label = document.createElement("label");
    label.textContent = leimaustapa;
    let checkboxl = document.createElement("input");
    checkboxl.type ="checkbox";
    checkboxl.name = "leimaustapa";
    checkboxl.value = index;
    checkboxl.id = index;
    checkboxl.classList ="leimausbutton";
   
    p.appendChild(label);
    p.appendChild(checkboxl);
    div4.appendChild(p);
   });
   div1.appendChild(div4);
   
   let labelll = document.createElement("label");
   labelll.textContent = "Sarja";
   let div5 = document.createElement("div");
   div5.appendChild(labelll);
   div2.appendChild(div5);
   let div6 = document.createElement("div");
  
    for (let sarja of sarjat) {
      let p = document.createElement("p");
      let labeli = document.createElement("label");
      labeli.textContent = sarja.nimi;
      let radiobutton = document.createElement("input");
      radiobutton.type = "radio";
      radiobutton.name = "sarjat";
      radiobutton.id = sarja.id;
      radiobutton.className = "sarjabutton";
      p.appendChild(labeli);
      p.appendChild(radiobutton);
      div6.appendChild(p);
    }
    div2.appendChild(div6);
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;


  }

  let sarjatt = data.sarjat;
  let sarjaObj = {};
  for ( let child of sarjatt) {
          sarjaObj[child.nimi] = child.id;
  }


  function rastivaihtoehdot() {
  
    let datalista = document.getElementById("leimauslista");
    
    for (let key in data.rastit) {
     
      let option = document.createElement("option");
   
      option.value = data.rastit[key].koodi;
      option.id = key;
      datalista.appendChild(option);
      
    }
     console.log(datalista);
   
  }

function joukkuelisays() {


  // Sarjaobjekti helpottamaan sarjan nimen ja ideen käsittelyä
  let sarjat = data.sarjat;
  
  let lisayslomake = document.forms[0];

  let nimilaatikko = document.getElementById("nimi"); 
  let valittusarja = lisayslomake.getElementsByClassName("sarjabutton");


// Käydään läpi sarja radiobuttonit ja etsitään valittu 
  let valittusarjavalue;
  for (let i = 0; i < valittusarja.length; i++) {
    if (valittusarja[i].checked) {
      valittusarjavalue = valittusarja[i].parentElement.textContent;
    }
  }

  let leimaustapaboxit = lisayslomake.getElementsByClassName("leimausbutton");

  let valitutleimaustavat = [];
  for (let i = 0; i < leimaustapaboxit.length; i++) {
    if (leimaustapaboxit[i].checked) {
      valitutleimaustavat.push(leimaustapaboxit[i].value);
    }
  }
 let rastileimausrivit = lisayslomake.getElementsByClassName("leimausrivi");
 
 for (let i = 0; i < rastileimausrivit.length; i++) {
  let rivi = rastileimausrivit[i].children;
  for (let o = 0; o < rivi.length; o++) {
    console.log(rivi[o].firstChild.value);
  }
  

 }
 
let jasenet = [];
let jasenlaatikot = document.getElementsByClassName("jasenet");

for (let i = 0; i < jasenlaatikot.length; i++) {
  if (jasenlaatikot[i].value.length == 0) {
    continue;
  } else {
    jasenet.push(jasenlaatikot[i].value);
  }
}
  // LIsättävä joukkue
  let uusijoukkue = {
    "nimi": nimilaatikko.value,
    "sarja": sarjaObj[valittusarjavalue],
    "jasenet": jasenet,
    "rastileimaukset": [0],
    "leimaustapa": valitutleimaustavat
  };

  data.joukkueet.push(uusijoukkue);
  localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
 
  return;


}
// ::::::::::::::::::::::::::::


let checkboxi = document.getElementsByClassName("leimausbutton")[0];
console.log(checkboxi);

let lomake = document.forms[0];



// ================================================================




let lomake2 = document.getElementById("leimausform");
  let leimauslaatikko = lomake2.lleimaus;
  console.log(leimauslaatikko);

  leimauslaatikko.addEventListener("input", function(e) {
    let leimausnimi = e.target;

    leimausnimi.setCustomValidity("");

    for (let l of data.leimaustavat) {
      if (l.trim().toLowerCase() === leimausnimi.value.trim().toLowerCase()) {
        leimausnimi.setCustomValidity(l.concat(" on jo lisätty!"));
      } else if ( leimausnimi.value.trim().toLowerCase().length < 2) {
        leimausnimi.setCustomValidity("Nimen pitää olla vähintään 2 merkkiä pitkä");
      }
    }
  });

  lomake2.addEventListener("submit", function(e) {

    e.preventDefault();

    lisaaLeimaus();
    lomake.reset();
    lomakebuttonit();
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;
    lomake2.reset();

  });

function lisaaLeimaus() {
  let lomake2 = document.getElementById("leimausform");
  let leimauslaatikko = lomake2.lleimaus;
  

  let uusileimaus = leimauslaatikko.value;
  data.leimaustavat.push(uusileimaus);
  console.log(data.leimaustavat);
  localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
return;
  
  
}



let muokattava_joukkue = {};
let alkuperainen_joukkue = muokattava_joukkue;

function joukkuelistaus() {

    
  let joukkueet = data.joukkueet;
  let i = 0;
  let joukkue = joukkueet[i];
  // let formi = document.getElementsByTagName("form");
  // let formi1 = formi[0];

  let ululoin = document.getElementById("lista");
  


  let jarjestetytJoukkueet = Array.from(data.joukkueet).sort((a,b) => a.nimi.localeCompare(b.nimi));
  let sarjat = data.sarjat;
  let e = 0; 
  let sarja = sarjat[e];

  // Luodaan sarjaobjekti johon tallennetaan sarjan id ja sitä vastaava nimi 
  let sarjaObj = {};
  for ( let sarja of sarjat) {
          sarjaObj[sarja.id] = sarja.nimi;
  }

  let leimausObj = {};
data.leimaustavat.forEach((l, index) => {
  leimausObj[index] = l;
});

  jarjestetytJoukkueet.forEach((joukkue, index) => {
    let lijoukkue = document.createElement("li");
    let sarjastrong = document.createElement("strong");
    let joukkuenimi = document.createTextNode(joukkue.nimi + " ");
   let sarjanimi = document.createTextNode(sarjaObj[joukkue.sarja] + " ");
    sarjastrong.appendChild(sarjanimi);
			let a = document.createElement("a");
			a.href = "#lisays";
      a.appendChild(joukkuenimi);

    let leimauksettext = "(";
    for (let l = 0; l < joukkue.leimaustapa.length; l++) {

      if (joukkue.leimaustapa[l+1] === undefined) {
        leimauksettext += leimausObj[joukkue.leimaustapa[l]];
      } else {
       
        leimauksettext += leimausObj[joukkue.leimaustapa[l]];
        leimauksettext += ", ";
      }
     
     
    }
    leimauksettext += ")";
    
     lijoukkue.appendChild(a);
    lijoukkue.appendChild(sarjastrong);
    let tekstinode = document.createTextNode(leimauksettext);
    sarjastrong.parentNode.insertBefore(tekstinode, sarjastrong.nextSibling);


    let jasenetul = document.createElement("ul");
    lijoukkue.appendChild(jasenetul);
    let jasenet = joukkue.jasenet;

    
  // Jos useampi jäsen niin käydään loopilla läpi kaikki jäsenet ja lisätään ne omna textnodeina
    if (Array.isArray(jasenet)) {
      let jarjestetytjasenet = Array.from(jasenet).sort((a,b) => a.localeCompare(b));
      for (let jasen of jarjestetytjasenet) {
        let jasenli = document.createElement("li");
        let jasennimi = document.createTextNode(jasen);
        jasenli.appendChild(jasennimi);
        jasenetul.appendChild(jasenli);
      } 
    } else {
      let jasenli = document.createElement("li");
      let jasennimi = document.createTextNode(jasenet);
      jasenetul.appendChild(jasenli);
      jasenli.appendChild(jasennimi);
    }

    
    // TALLENNETAAN LI-OBJEKTIIN VIITE TIETORAKENTEESSA OLEVAAN OBJEKTIIN
    lijoukkue.joukkue = joukkue;

    // tallennetaan objektin sisältöä listauksessa vastaavien dom-nodejen viitteet myös objektiin
   // jos alkuperäistä objektia ei saa muuttaa niin pitää tehdä tätä varten oma
   // tietorakenne ja tallentaa vastaavat tiedot sinne
    joukkue["lista"] = {
      "nimi" : joukkuenimi,
      "sarja": sarjanimi,
      "leimaustapa": tekstinode,
      "jasenet": jasenetul
    };
    lijoukkue.addEventListener("click", muokkaaJoukkuetta);

    ululoin.appendChild(lijoukkue);
  
  
  });
  // Silmukka käy kaikki joukkueet läpi ja lisää ne listaukseen sivulle
 

  return;
}
let fieldset1 = document.getElementById("fieldsetti");
let jaseninputlaatikot = document.getElementById("jaseninputit");
  
let tallennusbutton = document.getElementById("tallennusnappi");

function muokkaaJoukkuetta(e) {
  
  lomake.reset();
  tallennusbutton.value = "Muokkaa";
  
  let joukkue = e.currentTarget.joukkue;

  // tehdään kopio muokattavista tiedoista
  // muokkaus on aina syytä tehdä kopioon ja muutokset päivitetään
  // tietorakenteeseen vasta, kun ne hyväksytään painikkeella
  // ei koskaan muokata suoraan alkuperäistä rakennetta, koska virheiden
  // peruminen tulee mahdottomaksi
  muokattava_joukkue["nimi"] = joukkue["nimi"];
  muokattava_joukkue["sarja"] = joukkue["sarja"];
  muokattava_joukkue["leimaustapa"] = Array.from(joukkue["leimaustapa"]);
  muokattava_joukkue["jasenet"] = Array.from(joukkue["jasenet"]);

  console.log(muokattava_joukkue);

  // TOIMI TÄHÄN MENNESSÄ

  //Tallennetaan alkuperäisen joukkueen viite
  alkuperainen_joukkue = joukkue;

  lomake["nimi"].value = muokattava_joukkue["nimi"];
  
  let buttonit = document.getElementsByClassName("sarjabutton");
	
	
	for (let i = 0; i < buttonit.length; i++) {
		if (buttonit[i].id == muokattava_joukkue["sarja"]) {
     
      console.log(muokattava_joukkue["sarja"]);
			buttonit[i].checked = true;
		}
	}

  let leimauksetbutton = document.getElementsByClassName("leimausbutton");
  console.log((muokattava_joukkue["leimaustapa"][0]));
  for (let i = 0; i < muokattava_joukkue["leimaustapa"].length; i++ ) {
   console.log(muokattava_joukkue["leimaustapa"][i]);
   for (let l of leimauksetbutton) {
    console.log(l.id);
    if (l.id === muokattava_joukkue["leimaustapa"][i].toString()) {
      l.checked = true;
      console.log(l);
    }
  }
  }

  console.log(muokattava_joukkue["jasenet"]);

  let i = 0;
	let jasennumero = 2;
	for (; i < muokattava_joukkue["jasenet"].length; i++) {
		let jasen = muokattava_joukkue["jasenet"][i];
		let p = jaseninputlaatikot.children[i];
		
		// Jos ei ole tarpeeksi jäsenien lisäys inputeja
		//tehdään lisää
		if ( !p ) {
			p = document.createElement("p");
			let label = document.createElement("label");
      jasennumero += 1;
      jasennumero.toString();
      label.textContent = "Jäsen ".concat(jasennumero);
      let input = document.createElement("input");
      input.type ="text";
			input.value = "";
			input.name = label.textContent;
			input.id = label.textContent;
			input.classList ="jasenet";
			p.appendChild(label);
      p.appendChild(input);
			jaseninputlaatikot.appendChild(p);

		}
		if ( jasen ) {
			
			console.log(p);
			p.children[1].value = jasen;
		}
    else {
      p.children[1].value = "";
    }

    p.children[1].indeksi = i; 
   
		
	}



}


let joukkueennimi = document.getElementById("lisays").nimi;


// Joukkueen nimen tarkistin
joukkueennimi.addEventListener("input", function(e) {
  let joukkueennimi = e.target;
  console.log(joukkueennimi);
  if (tallennusbutton.value == "Tallenna") {
    joukkueennimi.setCustomValidity("");

  for (let joukkue of data.joukkueet) {
    if (joukkueennimi.value.trim().toLowerCase() === joukkue.nimi.trim().toLowerCase() || !joukkueennimi.value.trim()) {
      joukkueennimi.setCustomValidity("Ei saman nimisiä tai tyhjää!");
    } 
  }
  } else if (tallennusbutton.value == "Muokkaa") {
    muokattava_joukkue["nimi"] = e.target.value;
  }
  
});

lomake.addEventListener("change", function(e) {
 
    let arr = document.getElementsByClassName("jasenet");
  for( let j = 0; j < arr.length; j++) {
    arr[0].setCustomValidity("");
    if (arr[0].value.length == 0 && arr[1].value.length == 0 ) {
      arr[0].setCustomValidity("Joukkueella täytyy olla edes yksi jäsen");
    } else {
      arr[0].setCustomValidity("");
    }
  }

  let ar = document.getElementsByClassName("leimausbutton");
  let varaar = [];
  for (let s = 0; s < ar.length; s++) {
    ar[0].setCustomValidity("");
    if (ar[s].checked == true) {
      varaar.push(ar[s].value);
    }
  }
  if (varaar.length == 0) {
    ar[0].setCustomValidity("Joukkueella täytyy olla edes yksi leimaustapa!");
  } else {
    ar[0].setCustomValidity("");
  }
 
 
});


let jaseninputit = document.getElementsByClassName("jasenet");

console.log(leimausinputit);
lomake.addEventListener("change", function(e) {

    jaseninputit[1].addEventListener("input", lisaaJasenInput);
   tsekkaaLeimausinputit();
});
//Submit tapahtumankäsittelijä jossa myös poistetaan listaus ja lisätään se uudestaan uuden jäsenen kera
lomake.addEventListener("submit", function(e) {

  // JOS TALLENNETAAN UUSI JOUKKUE
  if (tallennusbutton.value == "Tallenna") {
    e.preventDefault();

  
    let poistettava = document.getElementById("lista");
   
    poistettava.textContent = "";
   
    joukkuelisays();
  
    localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
    
   
   
   joukkuelistaus();
    lomake.reset();
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;
  
   localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
    console.log(data.joukkueet);

  } 
  // JOS MUOKATAAN OLEMASSA OLEVAA JOUKKUETTA
  else if (tallennusbutton.value == "Muokkaa") {
    e.preventDefault();

    let valittusarja = lomake.getElementsByClassName("sarjabutton");
// ====================// ====================
  let valittusarjavalue;
  for (let i = 0; i < valittusarja.length; i++) {
    if (valittusarja[i].checked) {
      valittusarjavalue = valittusarja[i].parentElement.textContent;
    }
  }
  let leimaustapaboxit = lomake.getElementsByClassName("leimausbutton");

  let valitutleimaustavat = [];
  for (let i = 0; i < leimaustapaboxit.length; i++) {
    if (leimaustapaboxit[i].checked) {
      valitutleimaustavat.push(leimaustapaboxit[i].value);
    }
  }

 
 
let jasenetarray = [];
let jasenlaatikot = document.getElementsByClassName("jasenet");

for (let i = 0; i < jasenlaatikot.length; i++) {
  if (jasenlaatikot[i].value.length == 0) {
    continue;
  } else {
    jasenetarray.push(jasenlaatikot[i].value);
  }
}
let leimausObj = {};
data.leimaustavat.forEach((l, index) => {
  leimausObj[index] = l;
});

  muokattava_joukkue["sarja"] = sarjaObj[valittusarjavalue];
  muokattava_joukkue["jasenet"] = jasenetarray;
  muokattava_joukkue["leimaustapa"] = valitutleimaustavat;
  // ====================// ====================

    alkuperainen_joukkue["nimi"] = muokattava_joukkue["nimi"];
    alkuperainen_joukkue["sarja"] = muokattava_joukkue["sarja"];
    alkuperainen_joukkue["leimaustapa"] = muokattava_joukkue["leimaustapa"];
    alkuperainen_joukkue["jasenet"] = muokattava_joukkue["jasenet"];
    alkuperainen_joukkue["lista"]["nimi"].textContent = muokattava_joukkue["nimi"] + " ";
    alkuperainen_joukkue["lista"]["sarja"].textContent = valittusarjavalue;
    let leimauksettext = "(";
    for (let i = 0; i < muokattava_joukkue["leimaustapa"].length; i++) {
 

      if (muokattava_joukkue["leimaustapa"][i+1] === undefined) {
        leimauksettext += leimausObj[muokattava_joukkue["leimaustapa"][i]];
      } else {
       
        leimauksettext += leimausObj[muokattava_joukkue["leimaustapa"][i]];
        leimauksettext += ", ";
      }
    }
    leimauksettext += ")";
  
    for (let i = 0; i < muokattava_joukkue["jasenet"].length; i++) {
      if (alkuperainen_joukkue["lista"]["jasenet"].children.length < muokattava_joukkue["jasenet"].length) {
       
        let uusili = document.createElement("li");
        alkuperainen_joukkue["lista"]["jasenet"].appendChild(uusili);
      } else if (alkuperainen_joukkue["lista"]["jasenet"].children.length > muokattava_joukkue["jasenet"].length){
        alkuperainen_joukkue["lista"]["jasenet"].lastChild.remove();
      }

      console.log(muokattava_joukkue["jasenet"][i]);
      let rivi = alkuperainen_joukkue["lista"]["jasenet"].children[i];
      rivi.textContent = muokattava_joukkue["jasenet"][i];
    }
    alkuperainen_joukkue["lista"]["leimaustapa"].textContent = leimauksettext;

    localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
    lomake.reset();
    console.log(jaseninputlaatikot);
    let jasenlaatikotinputit = document.getElementsByClassName("jasenet");
    for (let i = 0; i < jasenlaatikotinputit.length; i++) {
      if (i > 1) {
        jasenlaatikotinputit[i].parentNode.remove();
      }
    }
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;
    tallennusbutton.value = "Tallenna";
   

   
  }
 
});


let sortedLeimaustavat = [];
for (let key in data.rastit) {
  sortedLeimaustavat.push([key, data.rastit[key].koodi]);
}
sortedLeimaustavat.sort(function(a,b){
  return a[1].localeCompare(b[1]);
});

console.log(sortedLeimaustavat);
// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
// OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

let table = document.getElementById("rastileimaukset");

table.addEventListener("change", function(e){
 
  let jovalitut = [];
  for (let i = 0; i < leimausinputit.length; i++) {
    let input = leimausinputit[i];
   
    
    jovalitut.push(input.value);
    if (input.value.length > 0 && i == leimausinputit.length-1) {
     
 // Luodaan uusi rivi inputeille 
 let tr = document.createElement("tr");
 tr.classList = "leimausrivi";
 let td1 = document.createElement("td");
 // Rastinvalinta input
 let rastiinput = document.createElement("input");
 let idnumero = i+1;
 rastiinput.setAttribute("list", "leimalista"+idnumero);
 rastiinput.classList = "leimausvalinta";
 



 let lista = document.createElement("datalist");
 lista.id = "leimalista"+idnumero;

for (let key of sortedLeimaustavat) {
  
      let option = document.createElement("option");
  
      option.value = key[1];
      option.name = key[0];
      lista.appendChild(option);
      
    }
   
     
    for ( let j of jovalitut) {
      let poistettava = Array.from(lista.children).find(elem => elem.value == j);
        poistettava.setAttribute("disabled", "true");
    }
     
 
 


td1.appendChild(rastiinput);
td1.appendChild(lista);

let td2 = document.createElement("td");



 let aikainput = document.createElement("input");
 aikainput.type ="datetime-local";
 aikainput.value="2017-03-18T09:00:00";
 aikainput.step ="1";
 td2.appendChild(aikainput);


 let td3 = document.createElement("td");
 let check = document.createElement("input");
 check.type ="checkbox";
 check.classList = "poistaleimaus";
 let label = document.createElement("label");
 label.textContent ="Poista";
 td3.appendChild(check);
 td3.appendChild(label);
 tr.appendChild(td1);
 tr.appendChild(td2);
 tr.appendChild(td3);
 table.appendChild(tr);


    }

    
}
});


function tsekkaaLeimausinputit(e) {

 
  // Käydään leimausinputit läpi ja poistetaan kaikista "disabled"-attribuutti
  // Koska jos ollaankin vaihdettu joku jo valittu pois niin sen ei enää 
  // tarvitse olla "disabled"
  for (let r = 0; r < leimausinputit.length; r++) {
    if (r == 0) {
      let apuArr = Array.from(leimausinputit[r].nextSibling.nextSibling.children);
      for (let o = 0; o < apuArr.length; o++) {
        if (apuArr[o].hasAttribute("disabled")) {
          console.log("LÖYTY DISABLED", apuArr[o]);
          apuArr[o].removeAttribute("disabled");
          console.log(apuArr[0]);
        }
      }
    } else {
      let apuArr = Array.from(leimausinputit[r].nextSibling.children);
      for (let o = 0; o < apuArr.length; o++) {
        if (apuArr[o].hasAttribute("disabled")) {
          console.log("LÖYTY DISABLED", apuArr[o]);
          apuArr[o].removeAttribute("disabled");
          console.log(apuArr[o]);
        }
      }
    }
    
  }

  // Käydään leimausinputit läpi jotta voidaan 
  // lisätä "disabled"-attribuutti jo valituille leimauksille
  // muissa inputeissa 
  for (let a = 0; a < leimausinputit.length; a++) {
    
    let tsekattava = leimausinputit[a].value;
    // Jos input on tyhjä ei jatketaan tekemättä mitään
    if (tsekattava.length == 0) {
      continue;
    } else {
      for (let i = 0; i < leimausinputit.length; i++) {
        // Ei käydä samaa inputtia läpi 
        if (a == i) {
          continue;
        } else {
         
          if (i== 0) {
           console.log(leimausinputit[i].nextSibling.nextSibling.children[0].value);
           console.log(tsekattava);
            let poistettava = Array.from(leimausinputit[i].nextSibling.nextSibling.children).find(elem => elem.value == tsekattava);
            console.log(poistettava);
            poistettava.setAttribute("disabled", "true");
            console.log(poistettava);
    
          } else {
           // Etsitään datalististä tsekattava arvo ja laitetaan sille attribuutti "disabled"
            let poistettava = Array.from(leimausinputit[i].nextSibling.children).find(elem => elem.value == tsekattava);
         
          poistettava.setAttribute("disabled", "true");
          console.log(poistettava);
          }
        }
    
      }
    }
   
  }
  
}



  function lisaaJasenInput(e) {
      // käydään läpi kaikki input-kentät viimeisestä ensimmäiseen
      // järjestys on oltava tämä, koska kenttiä mahdollisesti poistetaan
      // ja poistaminen sotkee dynaamisen nodeList-objektin indeksoinnin
      // ellei poisteta lopusta 
      

      let viimeinen_tyhja = -1; // viimeisen tyhjän kentän paikka listassa
      for(let i=jaseninputit.length-1 ; i>-1; i--) { // inputit näkyy ulommasta funktiosta
          let input = jaseninputit[i];
          
          if ( viimeinen_tyhja > -1 && input.value.trim() == "") { // ei kelpuuteta pelkkiä välilyöntejä
              let poistettava = jaseninputit[viimeinen_tyhja].parentNode; 
             // parentNode on label, joka sisältää inputin
              fieldset1.removeChild( poistettava );
              viimeinen_tyhja = i;
          }
          // ei ole vielä löydetty yhtään tyhjää joten otetaan ensimmäinen tyhjä talteen
          if ( viimeinen_tyhja == -1 && input.value.trim() == "") {
                  viimeinen_tyhja = i;
          }
      }
      // ei ollut tyhjiä kenttiä joten lisätään yksi
      if ( viimeinen_tyhja == -1) {
        let p = document.createElement("p");
          let label = document.createElement("label");
          label.textContent = "Jäsen";
          let input = document.createElement("input");
          input.setAttribute("type", "text");
          input.classList = "jasenet";
          input.addEventListener("input", lisaaJasenInput);
          p.appendChild(label);
          p.appendChild(input);
          fieldset1.appendChild(p);
         
      }
      // jos halutaan kenttiin numerointi
      for(let i=2; i<jaseninputit.length; i++) { // inputit näkyy ulommasta funktiosta
              let label = jaseninputit[i].previousSibling;
              label.textContent = "Jäsen " + (i+1); // päivitetään labelin ekan lapsen eli tekstin sisältö
      }
  
  }
  //<p>
  //<label>Jäsen 1 </label>
  //<input type="text" id="jasenyksi" name="Jasen1" class="jasenet" />
   //</p>



  console.log(data);
  // tallenna data sen mahdollisten muutosten jälkeen aina localStorageen: 
  // localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
  // kts ylempää mallia
  // varmista, että sovellus toimii oikein omien tallennusten jälkeenkin
  // eli näyttää sivun uudelleen lataamisen jälkeen edelliset lisäykset ja muutokset
  // resetoi rakenne tarvittaessa lisäämällä sivun osoitteen perään ?reset=1
  // esim. http://users.jyu.fi/~omatunnus/TIEA2120/vt2/pohja.xhtml?reset=1

}

window.addEventListener("load", alustus);
