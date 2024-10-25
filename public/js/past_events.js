
const socket = io();


let eventList = [];




function modalOpen(ev){

    const eventDiv = document.querySelector('.eventDetails');
    eventDiv.innerHTML='';

    const close = document.querySelector('.close');
    const content = document.querySelector('.content');
    const bground = document.querySelector('.bground');
    bground.style.display="block";
    content.style.display = "flex";
    const listItem = document.createElement('div');
    const title = document.createElement('h2');
    const background = document.createElement('div');
    const image = document.createElement('img');
    const dateP = document.createElement('p');
    const desc = document.createElement('p');


    listItem.classList.add('cardE');
    title.textContent =`${ev.title}`;
    title.classList.add('titleCard');
    background.classList.add('cardE-background');
    image.src=`${ev.path}`;
    desc.classList.add('cardE-p');
    desc.textContent=`${ev.description}`;
    dateP.classList.add('cardE-p');
    dateP.textContent=`Organisé le ${ev.date}`;


    close.addEventListener('click',function(event){

        bground.style.display = "none";
        content.style.display = "none";

    });



    background.appendChild(dateP);
    background.appendChild(desc);


    listItem.appendChild(title);
    listItem.appendChild(image);
    listItem.appendChild(background);

    eventDiv.appendChild(listItem)




}




socket.emit('getPastEvents');
socket.on('pastEvents', (events) => {
    const pastList = document.querySelector('.past-list');
    eventList = events;

    
    pastList.innerHTML = '';
    
    events.forEach(event => {
        console.log(pastList);
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
        more.addEventListener('click',function(e){

            modalOpen(event);

        });


        
        background.appendChild(dateP);
        background.appendChild(more);

        listItem.appendChild(title);
        listItem.appendChild(image);
        listItem.appendChild(background);

        pastList.appendChild(listItem);        

    });




    
});