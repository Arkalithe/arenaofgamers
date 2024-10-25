const form = document.getElementById("reserve");
const socket = io();

// Fonction pour obtenir la ville sélectionnée d'après les checkbox
function getChecked() {
    const radios = document.querySelectorAll('input[name="location"]');
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Fonction pour valider le formulaire
function validateForm() {
    const prenom = document.getElementById("first").value.trim();
    const nom = document.getElementById("last").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthdate = document.getElementById("birthdate").value;
    const quantity = document.getElementById("quantity").value;
    const location = getChecked();

    // Validation des champs obligatoires
    if (prenom.length < 2 || !/^[a-zA-Z]+$/.test(prenom)) {
        alert("Le prénom est invalide. Veuillez entrer un prénom valide.");
        return false;
    }
    if (nom.length < 2 || !/^[a-zA-Z]+$/.test(nom)) {
        alert("Le nom est invalide. Veuillez entrer un nom valide.");
        return false;
    }
    if (!validateEmail(email)) {
        alert("L'email est invalide. Veuillez entrer un email valide.");
        return false;
    }
    if (!birthdate) {
        alert("Veuillez entrer une date de naissance valide.");
        return false;
    }
    if (isNaN(quantity) || quantity < 0 || quantity > 99) {
        alert("Veuillez entrer un nombre valide de participations.");
        return false;
    }
    if (!location) {
        alert("Veuillez sélectionner une ville.");
        return false;
    }

    return true;
}

// Fonction de validation pour l'email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

// Gestion de la soumission du formulaire
form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (validateForm()) {
        const formData = {
            prenom: document.getElementById("first").value,
            nom: document.getElementById("last").value,
            email: document.getElementById("email").value,
            birthdate: document.getElementById("birthdate").value,
            quantity: document.getElementById("quantity").value,
            location: getChecked()
        };

        // Envoie des données
        socket.emit("inscriptionCreate", formData);
    }
});

socket.on('launchCreate', (data) => {
    // Afficher un message après l'inscription réussie
    alert('Inscription réussie pour ' + data.prenom + ' ' + data.nom);
});

socket.on('validationError', (data) => {
    alert(data.errors.join("\n"));
});


//evenement a venir
socket.emit('getUpcomingEvents');
socket.on('upcomingEvents', (events) => {
    console.log('Événements à venir:', events);

    const upcomingList = document.getElementById('upcoming-list');
    upcomingList.innerHTML = '';

    events.map(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()}`;
        upcomingList.appendChild(listItem);
    });
});

//evenement passer
socket.emit('getPastEvents');
socket.on('pastEvents', (events) => {
    const pastList = document.getElementById('past-list');
    pastList.innerHTML = '';
    events.map(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()}`;
        pastList.appendChild(listItem);
    });
});