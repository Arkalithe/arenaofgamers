
function validateContact(e){
    console.log("dazdz")
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const objet = document.getElementById("objet").value;
    const message = document.getElementById("message").value;
    const utilisationDonnees = document.getElementById("checkboxDonnee").checked;
    const caseRGPD = document.getElementById("checkboxRGPD").checked

  if (!name || !surname || !email || !objet || !message || !utilisationDonnees|| !caseRGPD) {
    alert("Remplissez tous les champs !!!");
    event.preventDefault();
  } else {
    alert("Votre message a bien été envoyé ");
  }
}