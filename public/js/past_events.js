const eventBoard = document.querySelector('.showPastEvents');
const socket = io();


let eventList = [];

function showEventCards(events){


    events.forEach((event,index) => {
        
        const eventCard = document.createElement('div');
        eventCard.classList.add('card'); 

        img = findImgById(event.image.path);

        eventCard.innerHTML= `
            <div class='cardE'>
            <div class = 'cardE-background' style='background-image: url(${img});'>
            <h3 class='cardE-title'>${event.title}</h3>
            <p class='cardE-p'> Organisé le <span>${event.createdAt}</span></p>
            <button class="modalEvent" data-index="${index} >Plus d'information ici</button>
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
        <div><h2 class='modalE-title'>${event.title}</h2><img src=${event.image.path}></div>
        <div class = 'modalE-background' style='background-image: url(${img});'>
        <p class='modalE-p'> Organisé le <span>${event.createdAt}</span></p>
        <p class='modalE-p'><span>${event.description}</span></p>
        </div>
        `;


}


socket.on('chatMessage',(data)=>{

    showEventCards(data);

});
