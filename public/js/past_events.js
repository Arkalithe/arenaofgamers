const eventBoard = document.querySelector('.showPastEvents');
const socket = io();


let eventList = [];

function showEventCards(events){


    events.forEach((event,index) => {
        
        const eventCard = document.createElement('div');
        eventCard.classList.add('card'); 

        img = findImgById(event.image.path);

        eventCard.innerHTML= `

        <div style='background-image: url(${img});'>
        <h3>${event.title}</h3>
        <p> Organisé le <span>${event.createdAt}</span></p>
        <button class="modalEvent" data-index="${index} >Plus d'information ici</button>
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

    


}


socket.on('chatMessage',(data)=>{

    showEventCards(data);

});
