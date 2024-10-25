
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

    const event = eventBoard[index];
    const eventDiv = document.querySelector('.eventDetails');
    eventDiv.innerHTML=`        
        <div><h2 class='modalE-title'>${event.title}</h2><img src=${event.path}></div>
        <p class='modalE-p'> Organisé le <span>${event.createdAt}</span></p>
        <p class='modalE-p'><span>${event.description}</span></p>
        </div>
        `;


}



socket.emit('getUpcomingEvents');
socket.on('upcomingEvents', (events) => {
    console.log('Événements à venir:', events);
    const upcomingList = document.querySelector('.upcoming-list');
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