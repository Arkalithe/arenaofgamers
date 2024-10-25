
const socket = io();


let eventList = [];

function showEventCards(events){


    events.forEach((event,index) => {
        
        const eventCard = document.createElement('div');
        eventCard.classList.add('card'); 

        img = findImageById(event.image.path);

        eventCard.innerHTML= `
            <div class='cardE'>
            <div class = 'cardE-background' style='background-image: url(${img});'>
            <h3 class='cardE-title'>${event.title}</h3>
            <p class='cardE-p'> Organisé le <span>${event.createdAt}</span></p>
            <button class="modalEvent" data-index="${index}" >Plus d'information ici</button>
            </div>
            </div>
        `;
        eventList.push(event);

    });


    const buttons = document.querySelectorAll('.modalEvent');
    buy.forEach(btn=> {

        btn.addEventListener('click',function() {

            const index = this.getAttribute('data-index');
            modalOpen(index);

        });

    });

}



function modalOpen(index){

    const event = eventList[index];
    const eventDiv = document.querySelector('.eventDetails');

    const listItem = document.createElement('div');
    const title = document.createElement('h2');
    const background = document.createElement('div');
    const image = document.createElement('img');
    const dateP = document.createElement('p');
    const desc = document.createElement('p');
    const more = document.createElement('button');


}



socket.emit('getUpcomingEvents');
socket.on('upcomingEvents', (events) => {
    console.log('Événements à venir:', events);
    const upcomingList = document.querySelector('.upcoming-list');
    eventList = events;
    upcomingList.innerHTML = '';
    events.forEach(event => {
        console.log("RECUPERATION DES DONNEES: "+ event.path);

        const listItem = document.createElement('div');
        const title = document.createElement('h2');
        const background = document.createElement('div');
        const image = document.createElement('img');
        const dateP = document.createElement('p');
        const more = document.createElement('button');
        
        listItem.classList.add('cardE');
        title.textContent =`${event.title}`;
        title.classList.add('titleCard');
        background.classList.add('cardE-background');
        image.src=`${event.path}`;
        dateP.classList.add('cardE-p')
        dateP.textContent=`Organisé le ${event.date}`;
        more.classList.add('modalEvent');
        more.textContent="Plus d'information ici";
        // more.addEventListener('click',function(event){

        //     modalOpen(event.id);

        // });

        
        background.appendChild(dateP);
        background.appendChild(more);

        listItem.appendChild(title);
        listItem.appendChild(image);
        listItem.appendChild(background);

        upcomingList.appendChild(listItem);        

    });
});