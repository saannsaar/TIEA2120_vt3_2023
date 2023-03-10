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

let buttonit = document.getElementsByClassName("sarjabutton");
  let rastitt = data.rastit;
  // Tehdään rastiobjekti jotta rastien id, ja koodin käsittely on
  // jatkossa helpompaa
  let rastiObj ={};
  for (let key in rastitt) {
  rastiObj[key] = rastitt[key].koodi;
  }

  // Lajitellaan rastit aakkosjärjestykseen 
  let sortedLeimaustavat = [];
  for (let key in data.rastit) {
    sortedLeimaustavat.push([key, data.rastit[key].koodi]);
  }
  sortedLeimaustavat.sort(function(a,b){
    return a[1].localeCompare(b[1]);
  });


  console.log(rastiObj);

  let tbody = document.getElementsByTagName("tbody")[0];

    console.log(data);
    //Funktiokutsuja
    joukkuelistaus();
    lomakebuttonit();
    ekaRastiInput();

 let leimausinputit = document.getElementsByClassName("leimausvalinta");
 

  function lomakebuttonit() {

    // Haetaan oikea lomake
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

   // Käydään kaikki leimaustavat läpi ja jokaisen kohdalla luodaan
   // uusi checkbox, tallennetaan myös index checkboxin arvoon koska 
   // Se tallennetaan joukkuetta lisättäessä tietorakenteeseen

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
  
    // Käydään kaikki sarjat läpi tietorakenteesta ja jokaisen kohdalla
    // luodaan radiobutton johon tallennetaan myös sarjan id
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
    //Ensimmäinen sarja radiobutton valittu oletuksena
    buttonit[0].checked = true;


  }
// Tehdäään sarjaobjekti auttamaan sarjojen käsittelyä joukkueen lisäyksessä
  let sarjatt = data.sarjat;
  let sarjaObj = {};
  for ( let child of sarjatt) {
          sarjaObj[child.nimi] = child.id;
  }
console.log(sarjaObj);
// Funktio joukkueen lisäykseen
function joukkuelisays() {

  // Haetaan oikea lomake
  let lisayslomake = document.forms[0];
  let nimilaatikko = document.getElementById("nimi"); 
  // Haetaan kaikki lomakkeen sarja radiobuttonit luokkanimen perusteella
  let valittusarja = lisayslomake.getElementsByClassName("sarjabutton");

// Käydään läpi sarja radiobuttonit ja etsitään se jonka käyttäjä on valinnut
  let valittusarjavalue;
  for (let i = 0; i < valittusarja.length; i++) {
    if (valittusarja[i].checked) {
      valittusarjavalue = valittusarja[i].parentElement.textContent;
    }
  }

// Käydään läpi leimausboxit ja etsitään kaikki valitut ja lisätään ne 
// aputaulukkoon "valitutleimuastavat"
  let leimaustapaboxit = lisayslomake.getElementsByClassName("leimausbutton");
  let valitutleimaustavat = [];
  for (let i = 0; i < leimaustapaboxit.length; i++) {
    if (leimaustapaboxit[i].checked) {
      valitutleimaustavat.push(leimaustapaboxit[i].value);
    }
  }


// Käydään rastileimauksien inputit läpi table:n rivien mukaan ja täytetyt rastit lisätään
// aputaulukkoon 
 let rastileimausrivit = lisayslomake.getElementsByClassName("leimausrivi");
 let lisattavatrastileimaukset = [];
 for (let i = 0; i < rastileimausrivit.length; i++) {
  let rivi = rastileimausrivit[i].getElementsByTagName("input");
  console.log(rivi[0].value);
  // Jos rastin nimeä ei ole täytetty, ei lisätä aputaulukkoon tyhjää
  if (!rivi[0].value) {
    continue;
  } else {
    // Etsitään rastin indeksi (joka on tallennettu rastiObj:iin), jotta osataan lisätä oikea
    // rastiviite tietorakenteeseen 
    let rastinimi = Object.keys(rastiObj).find(key => rastiObj[key] == rivi[0].value);
    let rastiaika = rivi[1].value;
    rastiaika.toString();
    // Muutetaan aikainputin antama aika oikeaan muotoon
    let t = rastiaika.replace(/T/, ' ');
    // Jos käyttäjä ei ole lisännyt sekunteja, lisätään perään :00 koska muuten sekunteja
    // ei näy lisättävässä ajassa
    if (t.length == 16) {
     let aika = t.concat(":00");
     //Uusi rastileimaus objekti
     let uusirasti = {
      "aika": aika,
      "rasti": parseInt(rastinimi)
    };
    lisattavatrastileimaukset.push(uusirasti);
    } else {
      //Uusi rastileimaus objekti
      let uusirasti = {
        "aika": t,
        "rasti": parseInt(rastinimi)
      };
      // Työnnetään uusirasti objekti taulukkoon
      lisattavatrastileimaukset.push(uusirasti);
    }
  }
 }

 lisattavatrastileimaukset.sort((a,b) => a.aika.localeCompare(b.aika));

 console.log(lisattavatrastileimaukset);
 
let jasenet = [];
let jasenlaatikot = document.getElementsByClassName("jasenet");
// Käydään jäsenten lisäys inputit läpi ja jos ei ole tyhjä, lisätään inputissa
// oleva arvo jasenet-taulukkoon
for (let i = 0; i < jasenlaatikot.length; i++) {
  if (jasenlaatikot[i].value.length == 0) {
    continue;
  } else {
    jasenet.push(jasenlaatikot[i].value);
  }
}
  // Tietorakenteeseen lisättävä isättävä joukkue-objekti
  let uusijoukkue = {
    "nimi": nimilaatikko.value,
    "sarja": sarjaObj[valittusarjavalue],
    "jasenet": jasenet,
    "rastileimaukset": lisattavatrastileimaukset,
    "leimaustapa": valitutleimaustavat
  };
  // Työnnetään uusi joukkue olemassaolevaan tietorakenteeseen
  data.joukkueet.push(uusijoukkue);
  console.log(uusijoukkue);
  //Tallennetaan 
  localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
 
  return;


}
// ::::::::::::::::::::::::::::


let checkboxi = document.getElementsByClassName("leimausbutton")[0];
let lomake = document.forms[0];

// ================================================================

let lomake2 = document.getElementById("leimausform");
  let leimauslaatikko = lomake2.lleimaus;
  console.log(leimauslaatikko);

  leimauslaatikko.addEventListener("input", function(e) {
    let leimausnimi = e.target;

    leimausnimi.setCustomValidity("");
    // Käydään kaikki leimaustavat läpi tietorakenteesta, ja jos löytyy saman niminen
    // kuin mitä käyttäjä yrittää lisätä, estetään se 
    for (let l of data.leimaustavat) {
      if (l.trim().toLowerCase() === leimausnimi.value.trim().toLowerCase()) {
        leimausnimi.setCustomValidity(l.concat(" on jo lisätty!"));
      } 
      // Jos käyttäjän syöttämä leimaustavan nimi on alle 2 merkkiä pitkä, estetään lisäys
      else if ( leimausnimi.value.trim().toLowerCase().length < 2) {
        leimausnimi.setCustomValidity("Nimen pitää olla vähintään 2 merkkiä pitkä");
      }
    }
  });

  // Leimaustavan lisäys lomakkeen submit tapahtuma
  lomake2.addEventListener("submit", function(e) {

    e.preventDefault();
    // Leimauksen lisäysfunktio
    lisaaLeimaus();
    // Resetoidaan joukkueen lisäys lomake jotta uusi leimaustapa päivittyy myös sinne
    lomake.reset();
    // Generoidaan lomakebuttonit uudestaan, koska leimaustapojen rakenne on muuttunut
    lomakebuttonit();
    // Valitaan ensimmäinen sarja radiobutton oletukseksi 
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;
    // Resetoidaan leimaustavan lisäys lomake
    lomake2.reset();

  });

// Lisätään uusi leimaustapa
function lisaaLeimaus() {
  let lomake2 = document.getElementById("leimausform");
  let leimauslaatikko = lomake2.lleimaus;
  
  // etsitään nimi inputin arvo
  let uusileimaus = leimauslaatikko.value;
  // Lisätään arvo olemassa olevaan tietorakenteeseen
  data.leimaustavat.push(uusileimaus);
  console.log(data.leimaustavat);
  // Tallennetaan
  localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
return;
  
  
}



let muokattava_joukkue = {};
let alkuperainen_joukkue = muokattava_joukkue;
// Joukkuelistaus funktio
function joukkuelistaus() {

    
  let joukkueet = data.joukkueet;
  let i = 0;
  let joukkue = joukkueet[i];
  // let formi = document.getElementsByTagName("form");
  // let formi1 = formi[0];

  // Etsitään oikea ul-elementti johon lisätään listaus
  let ululoin = document.getElementById("lista");
  

  // Järjestetään joukkueet aakkosjärjestykseen 
  let jarjestetytJoukkueet = Array.from(data.joukkueet).sort((a,b) => a.nimi.localeCompare(b.nimi));
  let sarjat = data.sarjat;
  let e = 0; 
  let sarja = sarjat[e];

  // Luodaan sarjaobjekti johon tallennetaan sarjan id ja sitä vastaava nimi 
  let sarjaObj = {};
  for ( let sarja of sarjat) {
          sarjaObj[sarja.id] = sarja.nimi;
  }
  // Luodaan leimausobjekti johon tallennetaan leimauksen index numero
  // (koska leimaustapa tallennetaan tässä muodossa joukkueelle) ja nimi
  let leimausObj = {};
data.leimaustavat.forEach((l, index) => {
  leimausObj[index] = l;
});
  // Käydään joukkueet läpi
  jarjestetytJoukkueet.forEach((joukkue, index) => {
    // Luodaan joukkueen nimen ja sarjan perusteella oikeat elementit
    let lijoukkue = document.createElement("li");
    let sarjastrong = document.createElement("strong");
    let joukkuenimi = document.createTextNode(joukkue.nimi + " ");
   let sarjanimi = document.createTextNode(sarjaObj[joukkue.sarja] + " ");
    sarjastrong.appendChild(sarjanimi);
			let a = document.createElement("a");
			a.href = "#lisays";
      a.appendChild(joukkuenimi);
    // Leimaustavat täytyy luoda yhdeksi stringiksi
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

   // Tallennetaan objektin sisältöä listassa vastaavien dom nodejen viitteet objektiin
   // jotta voidaan lisätä oikeaan kohtaan mahdolliset muokkaukset
    joukkue["lista"] = {
      "nimi" : joukkuenimi,
      "sarja": sarjanimi,
      "leimaustapa": tekstinode,
      "rastileimaukset": joukkue.rastileimaukset,
      "jasenet": jasenetul
    };
    // Joukkueen kilkkaukselle eventhandler
    lijoukkue.addEventListener("click", muokkaaJoukkuetta);

    ululoin.appendChild(lijoukkue);
  
  
  });
  return;
}


let fieldset1 = document.getElementById("fieldsetti");
let jaseninputlaatikot = document.getElementById("jaseninputit");

let trrivit = lomake.getElementsByClassName("leimausrivi");
let tallennusbutton = document.getElementById("tallennusnappi");

// Jäsenen muokkaus-funktio
function muokkaaJoukkuetta(e) {
  // Tyhjennetään lomake jos siinä on ollut jotain ennen klikkausta
  lomake.reset();
  // Poistetaan ylimääräiset jäsenen lisäys inputit
  for (let i = 0; i < jaseninputlaatikot.children.length; i++) {
    if (i > 1) {
      jaseninputlaatikot.children[i].remove();
    }
  }
  console.log(trrivit);
  console.log(trrivit.length);
// Jos on ylimääräisiä rastilisäys inputteja tyhjennetään ne
if (trrivit.length > 1) {
  tbody.textContent = "";
}
console.log(trrivit);
// Muutetaan submit painikkeen arvo "Muokkaa", jotta tehdään oikea submit tapahtuma
  tallennusbutton.value = "Muokkaa";
  
  let joukkue = e.currentTarget.joukkue;

  // tehdään kopio muokattavista tiedoista
  muokattava_joukkue["nimi"] = joukkue["nimi"];
  muokattava_joukkue["sarja"] = joukkue["sarja"];
  muokattava_joukkue["leimaustapa"] = Array.from(joukkue["leimaustapa"]);
  muokattava_joukkue["jasenet"] = Array.from(joukkue["jasenet"]);
  muokattava_joukkue["rastileimaukset"] = Array.from(joukkue["rastileimaukset"]);

  console.log(muokattava_joukkue);

  //Tallennetaan alkuperäisen joukkueen viite
  alkuperainen_joukkue = joukkue;
  // Laitetaan lomakkeen "Nimi" kenttään muokattavan joukkueen nimi
  lomake["nimi"].value = muokattava_joukkue["nimi"];
  
  let buttonit = document.getElementsByClassName("sarjabutton");
	
	// Etsitään lomakkeelta oikea sarja joka muokattavalla joukkueella on ja 
  // valitaan se lomakkeesta
	for (let i = 0; i < buttonit.length; i++) {
		if (buttonit[i].id == muokattava_joukkue["sarja"]) {
			buttonit[i].checked = true;
		}
	}

  let leimauksetbutton = document.getElementsByClassName("leimausbutton");
  // Etsitään oikeat leimaustavat joukkueelta ja lisätään ne valituiksi
  // lomakkeeseen
  for (let i = 0; i < muokattava_joukkue["leimaustapa"].length; i++ ) {
  
   for (let l of leimauksetbutton) {
   
    if (l.id === muokattava_joukkue["leimaustapa"][i].toString()) {
      l.checked = true;
     
    }
  }
  }

  

  let i = 0;
	let jasennumero = 2;
  // Käydään muokattavan joukkueen jäsenet läpi ja tarvittaessa lisätään
  // inputteja ja lisätään jokaiseen inputtiin yhden
  // jäsenen nimi
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

 
  let o = 0;
  // Käydään muokattavan joukkueen rastileimaukset läpi ja
  //lisätään lomakkeelle lisää inputteja jos ei ole tarpeeksi
  for (; o < muokattava_joukkue["rastileimaukset"].length; o++) {
    let rleimaus = muokattava_joukkue["rastileimaukset"][o];
    let tr = tbody.children[o];

    if (!tr) {
        // Luodaan uusi rivi inputeille 
      tr = document.createElement("tr");
      tr.classList = "leimausrivi";
  
   
     let td1 = document.createElement("td");
     // Rastinvalinta input
     let rastiinput = document.createElement("input");
     let idnumero = o;
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

    // Rastin nimi inputtiin laitetaan oikea nimi rasti objektin avulla
    // koska joukkueeseen tallennetut rastileimaukset 
    // on lisätty ideen perusteella
    rastiinput.value = rastiObj[muokattava_joukkue["rastileimaukset"][o].rasti];
    td1.appendChild(rastiinput);
    td1.appendChild(lista);
    
    let td2 = document.createElement("td");

    
     let aikainput = document.createElement("input");
     aikainput.type ="datetime-local";
     aikainput.value= muokattava_joukkue["rastileimaukset"][o].aika;
     aikainput.step ="1";
     aikainput.classList = "aikainputit";
     td2.appendChild(aikainput);
    
    
     let td3 = document.createElement("td");
     let check = document.createElement("input");
     check.type ="checkbox";
     check.classList = "poistaleimaus";
     check.addEventListener("click", poistetaanko);
     let label = document.createElement("label");
     label.textContent ="Poista";
     td3.appendChild(check);
     td3.appendChild(label);
     tr.appendChild(td1);
     tr.appendChild(td2);
     tr.appendChild(td3);
     tbody.appendChild(tr);
    
    }
    if (rleimaus) {
    //console.log(tr.firstElementChild.nextElementSibling.firstChild);
    tr.firstElementChild.firstElementChild.value = rastiObj[muokattava_joukkue["rastileimaukset"][o].rasti];
    //console.log(tr.firstElementChild.firstChild);
    tr.firstElementChild.nextElementSibling.firstElementChild.value = muokattava_joukkue["rastileimaukset"][o].aika; 
    }
  }



}


let joukkueennimi = document.getElementById("lisays").nimi;

// Joukkueen nimen tarkistin
joukkueennimi.addEventListener("input", function(e) {
  let joukkueennimi = e.target;
  console.log(joukkueennimi.value);
  console.log(alkuperainen_joukkue["nimi"]);
  if (tallennusbutton.value == "Tallenna") {
   
    joukkueennimi.setCustomValidity("");

  for (let joukkue of data.joukkueet) {
    if (joukkueennimi.value.trim().toLowerCase() === joukkue.nimi.trim().toLowerCase() || !joukkueennimi.value.trim()) {
      joukkueennimi.setCustomValidity("Ei saman nimisiä tai tyhjää!");
    } 
  }
  } else if (tallennusbutton.value == "Muokkaa") {
   // KORJAA TÄMÄ!!!!!!!
    for (let joukkue of data.joukkueet) {
      if (joukkueennimi.value.trim().toLowerCase() == alkuperainen_joukkue["nimi"]) {
        continue;
      } else if (joukkueennimi.value.trim().toLowerCase() == joukkue.nimi.trim().toLowerCase()) {
        joukkueennimi.setCustomValidity(joukkue.nimi + " nimi on jo käytössä!");
      } else {
        muokattava_joukkue["nimi"] = e.target.value;
        joukkueennimi.setCustomValidity("");
      }
    }
   
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

  // Käydään rastileimaus inputit läpi ja jos löydettiin samoja arvoja 
  // Ei tehdä submit tapahtumaa 
  for (let l = 0; l < leimausinputit.length; l++) {
    leimausinputit[l].setCustomValidity("");
   
    if (leimausinputit.length == 1 ) {
      continue;
    }
    // Täytyy ohittaa tyhjät inputit muuten tarkistus ei onnistu
    if (l+1 == leimausinputit.length-1 && l+1 > 0 || l== leimausinputit.length-1 && l > 0 ) {
      continue;
    }
    if (leimausinputit[l].value == leimausinputit[l+1].value) {
      console.log("LÖYTYI SAMAT");
      leimausinputit[l+1].setCustomValidity("Et voi lisätä samaa rastia uudeleen");

    } else {
      leimausinputit[l+1].setCustomValidity("");
    }
    
  }
 
 
});


let jaseninputit = document.getElementsByClassName("jasenet");

console.log(leimausinputit);
lomake.addEventListener("change", function(e) {
  if (tallennusbutton.value == "Tallenna") {
    tsekkaaAika();
  }
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
    if (trrivit.length > 1) {
      tbody.textContent = "";
      ekaRastiInput();
    }
   
  
   localStorage.setItem("TIEA2120-vt3-2023", JSON.stringify(data));
    console.log(data.joukkueet);

  } 
  // JOS MUOKATAAN OLEMASSA OLEVAA JOUKKUETTA
  else if (tallennusbutton.value == "Muokkaa") {
    e.preventDefault();

    let valittusarja = lomake.getElementsByClassName("sarjabutton");

// ====================// ====================
// Etsitään sarja radiobuttoneista checkattu button ja tallennetaan sen
//labelin teksti talteen
  let valittusarjavalue;
  for (let i = 0; i < valittusarja.length; i++) {
    if (valittusarja[i].checked) {
      valittusarjavalue = valittusarja[i].parentElement.textContent;
    }
  }
  let leimaustapaboxit = lomake.getElementsByClassName("leimausbutton");

  // Käydään valitut leimaustavat läpi ja etsitään sieltä checkatut
  // jotka lisätään aputaulukkoon 
  let valitutleimaustavat = [];
  for (let i = 0; i < leimaustapaboxit.length; i++) {
    if (leimaustapaboxit[i].checked) {
      valitutleimaustavat.push(leimaustapaboxit[i].value);
    }
  }

 
  let rastileimausrivit = lomake.getElementsByClassName("leimausrivi");
  let lisattavatrastileimaukset = [];
  for (let i = 0; i < rastileimausrivit.length; i++) {
   let rivi = rastileimausrivit[i].getElementsByTagName("input");
   console.log(rivi[0].value);
   if (rivi[2].checked == true) {
      continue;
   }
   if (!rivi[0].value) {
     continue;
   } else {
     let rastinimi = Object.keys(rastiObj).find(key => rastiObj[key] == rivi[0].value);
     let rastiaika = rivi[1].value;
     rastiaika.toString();
     let t = rastiaika.replace(/T/, ' ');
     if (t.length == 16) {
      let aika = t.concat(":00");
      let uusirasti = {
       "aika": aika,
       "rasti": parseInt(rastinimi)
     };
     lisattavatrastileimaukset.push(uusirasti);
     } else {
       let uusirasti = {
         "aika": t,
         "rasti": parseInt(rastinimi)
       };
       lisattavatrastileimaukset.push(uusirasti);
     }
   }
  }
 console.log(lisattavatrastileimaukset);
  

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
  muokattava_joukkue["rastileimaukset"] = lisattavatrastileimaukset;
  // ====================// ====================

    alkuperainen_joukkue["nimi"] = muokattava_joukkue["nimi"];
    alkuperainen_joukkue["sarja"] = muokattava_joukkue["sarja"];
    alkuperainen_joukkue["leimaustapa"] = muokattava_joukkue["leimaustapa"];
    alkuperainen_joukkue["jasenet"] = muokattava_joukkue["jasenet"];
    alkuperainen_joukkue["rastileimaukset"] = muokattava_joukkue["rastileimaukset"];
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

    console.log(alkuperainen_joukkue);
    console.log(jaseninputlaatikot);
    let jasenlaatikotinputit = document.getElementsByClassName("jasenet");
    for (let i = 0; i < jasenlaatikotinputit.length; i++) {
      if (i > 1) {
        jasenlaatikotinputit[i].parentNode.remove();
      }
    }
    let buttonit = document.getElementsByClassName("sarjabutton");
    buttonit[0].checked = true;
    if (trrivit.length > 1) {
      tbody.textContent = "";
      ekaRastiInput();
    }
   

    tallennusbutton.value = "Tallenna";
   

   
  }
 
});

function ekaRastiInput() {
  let tr = document.createElement("tr");
      tr.classList = "leimausrivi";
  
   
     let td1 = document.createElement("td");
     // Rastinvalinta input
     let rastiinput = document.createElement("input");
     let idnumero = 0;
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

       
    
    td1.appendChild(rastiinput);
    td1.appendChild(lista);
    
    let td2 = document.createElement("td");
    
    
     let aikainput = document.createElement("input");

     aikainput.type ="datetime-local";
     let valittusarja;
     let aika;
     for (let i = 0; i < buttonit.length; i++) {
      if (buttonit[i].checked == true) {
   
      valittusarja = buttonit[i].id;
        // Etsitään valitun sarjan id:een perusteella tietorakenteen
        // sarjoista vastaava sarja ja katsotaan löytyykö sille omaa
        // alku- ja loppuaikaa
        for (let sarja in data.sarjat) {
   
          if (data.sarjat[sarja].id == valittusarja) {
            // Jos sarjalla ei ole alkuaikaa käytetään kilpailun alkuaikaa
            if (data.sarjat[sarja].alkuaika == "")
            {
              aika = data.alkuaika;
            } else {
              aika = data.sarjat[sarja].alkuaika;
            }
   
          }
        }
      }
    }
    let oletusaika = aika.toString().replace(/ /g,"T");
    aikainput.value= oletusaika;
    
     aikainput.step ="1";
     aikainput.classList = "aikainputit";
     td2.appendChild(aikainput);
    
    
     let td3 = document.createElement("td");
     let check = document.createElement("input");
     check.type ="checkbox";
     check.classList = "poistaleimaus";
     check.addEventListener("click", poistetaanko);
     let label = document.createElement("label");
     label.textContent ="Poista";
     td3.appendChild(check);
     td3.appendChild(label);
     tr.appendChild(td1);
     tr.appendChild(td2);
     tr.appendChild(td3);
     tbody.appendChild(tr);
    
}

function poistetaanko(e) {
   let valittu = e.target;
  
   // Tarkistetaan käyttäjältä haluaako varmasti poistaa joukkueen
    if (valittu.checked == true) {
      if (window.confirm("Haluatko varmasti poistaa " + valittu.parentElement.previousSibling.previousSibling.firstElementChild.value + " rastileimauksen?")) {
        return;
      } else {
        valittu.checked = false;
      }
    }
}
// console.log(sortedLeimaustavat);

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
      // Jos käyttäjä on syöttänyt jotain muuta kuin datalistissä olevia arvoja
      // asetetaan inputin arvo taas tyhjäksi
     if (Array.from(lista.children).find(elem => elem.value == j) == undefined) {
      input.value ="";
      return;
     } else {
      let poistettava = Array.from(lista.children).find(elem => elem.value == j);
      poistettava.setAttribute("disabled", "true");
     }
      
    }
     
 
 


td1.appendChild(rastiinput);
td1.appendChild(lista);

let td2 = document.createElement("td");


 // Luodaan input leimauksen ajalle
 let aikainput = document.createElement("input");
 aikainput.type ="datetime-local";

 let valittusarja;
 let aika;
 for (let i = 0; i < buttonit.length; i++) {
   if (buttonit[i].checked == true) {

   valittusarja = buttonit[i].id;
     // Etsitään valitun sarjan id:een perusteella tietorakenteen
     // sarjoista vastaava sarja ja katsotaan löytyykö sille omaa
     // alku- ja loppuaikaa
     for (let sarja in data.sarjat) {

       if (data.sarjat[sarja].id == valittusarja) {
         // Jos sarjalla ei ole alkuaikaa käytetään kilpailun alkuaikaa
         if (data.sarjat[sarja].alkuaika == "")
         {
           aika = data.alkuaika;
         } else {
           aika = data.sarjat[sarja].alkuaika;
         }

       }
     }
   }
 }
 let oletusaika = aika.toString().replace(/ /g,"T");
 aikainput.value= oletusaika;
 aikainput.step ="1";
 aikainput.classList = "aikainputit";
 td2.appendChild(aikainput);
 

 let td3 = document.createElement("td");
 let check = document.createElement("input");
 check.type ="checkbox";
 check.classList = "poistaleimaus";
 check.addEventListener("click", poistetaanko);
 let label = document.createElement("label");
 label.textContent ="Poista";
 td3.appendChild(check);
 td3.appendChild(label);
 tr.appendChild(td1);
 tr.appendChild(td2);
 tr.appendChild(td3);
 tbody.appendChild(tr);

console.log(tbody);
}

    
}
});

function tsekkaaAika(){
  // Etsitäään kaikki rastileimauksen aikainputit luokkanimen mukaan
  let aikainputit = document.getElementsByClassName("aikainputit");
  // Etsitään kaikki lomakkeen sarja radiobuttonit
  
	let alku;
  let loppu;
 
	// Etsitään lomakkeelta oikea sarja joka muokattavalla joukkueella on ja 
  // valitaan se
  let valittusarja;
	for (let i = 0; i < buttonit.length; i++) {
		if (buttonit[i].checked == true) {

    valittusarja = buttonit[i].id;
      // Etsitään valitun sarjan id:een perusteella tietorakenteen
      // sarjoista vastaava sarja ja katsotaan löytyykö sille omaa
      // alku- ja loppuaikaa
      for (let sarja in data.sarjat) {

        if (data.sarjat[sarja].id == valittusarja) {
          // Jos sarjalla ei ole alkuaikaa käytetään kilpailun alkuaikaa
          if (data.sarjat[sarja].alkuaika == "")
          {
            alku = data.alkuaika;
          } else {
            alku = data.sarjat[sarja].alkuaika;
          }
          // Jos sarjalla ei ole loppuaikaa käytetään kilpailun loppuaikaa
          if (data.sarjat[sarja].loppuaika == "") {
            loppu = data.loppuaika;
          }
          else {
            loppu = data.sarjat[sarja].loppuaika;
          }
      
        }
      }
		}
	}

  console.log(alku, loppu);
 
  // Käydään kaikki aika inputit läpi ja verrataan 
  for (let i= 0; i < aikainputit.length; i++) {
    let verrattavaaika;
    console.log(aikainputit[i].value);
    let valittuaika = aikainputit[i].value.toString().replace(/T/, ' ');
    if (valittuaika.length == 16) {
      verrattavaaika = valittuaika.concat(":00");
  } else {
    verrattavaaika = valittuaika;
  }
  console.log(verrattavaaika);
  // Jos syötetty aika on liian pieni verrattuna sarjan/kilpailun alkuaikaan
  // ei hyväksytä
  if (verrattavaaika < alku) {
    aikainputit[i].setCustomValidity("Valitun sarjan alkuaika on " + alku +" ja leimaus ei voi tapahtua ennen sitä");
  } else {
    aikainputit[i].setCustomValidity("");
  }
   // Jos syötetty aika on liian iso verrattuna sarjan/kilpailun loppuaikaan
  // ei hyväksytä
  if (verrattavaaika > loppu) {
    aikainputit[i].setCustomValidity("Valitun sarjan loppuaika on " + loppu + " ja leimaus ei voi tapahtua sen jälkeen!");
  } else {
    aikainputit[i].setCustomValidity("");
  }
}

}

function tsekkaaLeimausinputit(e) {


  // Käydään leimausinputit läpi ja poistetaan kaikista "disabled"-attribuutti
  // Koska jos ollaankin vaihdettu joku jo valittu pois niin sen ei enää 
  // tarvitse olla "disabled"
  for (let r = 0; r < leimausinputit.length; r++) {
    
      // Aputaulukko datalist vaihtoehdoille
      let apuArr = Array.from(leimausinputit[r].nextSibling.children);
      for (let o = 0; o < apuArr.length; o++) {
        if (apuArr[o].hasAttribute("disabled")) {
          apuArr[o].removeAttribute("disabled");
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
        } 
         // Jos käyttäjä on syöttänyt jotain muuta kuin datalistissä olevia arvoja
      // asetetaan inputin arvo taas tyhjäksi
        if (Array.from(leimausinputit[i].nextSibling.children).find(elem => elem.value == tsekattava) == false) {
          tsekattava.value = "";
        } else {
         
           // Etsitään datalististä tsekattava arvo ja laitetaan sille attribuutti "disabled"
           // Jotta muissa rasti inputeissa ei voida valita samaa arvoa
            let poistettava = Array.from(leimausinputit[i].nextSibling.children).find(elem => elem.value == tsekattava);
          poistettava.setAttribute("disabled", "true");
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
