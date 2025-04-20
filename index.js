const search = document.querySelector('#search');
const inputTitle = document.querySelector('#input-title');
const inputPrice = document.querySelector('#input-price');
const inputDescription = document.querySelector('#input-description');
const btnAddCard = document.querySelector('#button');
const cards = document.querySelectorAll('.cardBlock'); 
const loading = document.querySelector('.loading-title');
const btnSpan = document.querySelector('.btn-span');
const sidebar = document.querySelector('.sidebar');

function createElements(title, price, description ,id ) {
    let creatingCard = document.createElement('div');
    creatingCard.classList.add('cardBlock');
    creatingCard.setAttribute("data-id", id);
    
    let deletBtn = document.createElement('button');
    deletBtn.classList.add('removeBtn');
    deletBtn.innerHTML = `✖`;

    deletBtn.onclick = function() {
        creatingCard.remove();
        deletingDataLocal(id);
    };

    let cardContents = document.createElement('p');
    cardContents.classList.add('text-container');
    cardContents.innerText = `Название: ${title}\nЦена: ${price}\nОписание: ${description}`;
    creatingCard.appendChild(deletBtn);
    creatingCard.appendChild(cardContents);
    return creatingCard;
}

function cleaningTheForm() {
    inputTitle.value = '';
    inputPrice.value = '';
    inputDescription.value = '';
}

function productCreation() {
    let title = inputTitle.value,
    price = inputPrice.value,
    description = inputDescription.value;
    let id = Date.now();    


    let creatingCard = createElements(title, price, description, id);

    if (title === '' || price === '' || description === '') {
        search.innerText = 'Вы не ввели название, цену и описание';
        search.classList.add('absence-goods');
        console.log('Не ввел');
        return;
    } 
    if (!isNaN(title) || !isNaN(description)) {
        search.innerText = 'Вы ввели цифры в название и описание';
        search.classList.add('incorrect-data');
        console.log('хуй пойми');
        return;
    } 
    if(price <= 100) {
        search.innerText = 'Введите корректную цену';
        search.classList.add('incorrect-price');
        console.log('Цена');
        return;
    } 

    search.appendChild(creatingCard);
    
    savingDataLocal(title, price, description, id);

    setCookies(id, title)
    // регулярные выражения
}

btnAddCard.addEventListener('click', () => {
    productCreation(); 
    cleaningTheForm();
});

function savingDataLocal(title, price, description, id) {
    
    let products = JSON.parse(localStorage.getItem('card')) || [];
    products.push({title, price, description, id});
    localStorage.setItem('card', JSON.stringify(products));
    console.log(products);
}

function deletingDataLocal(id) {
    let products = JSON.parse(localStorage.getItem('card')) || [];
    products = products.filter(product => product.id !== id);
    localStorage.setItem('card', JSON.stringify(products));
    deleteCookies(id);
    console.log(products)
}

function creatingDownloadsLocal() {
    let products = JSON.parse(localStorage.getItem('card')) || [];
    products.forEach(product => {
        let creatingCard = createElements(product.title, product.price, product.description, product.id);
        search.appendChild(creatingCard);
        
    });
}
window.addEventListener('load', creatingDownloadsLocal);

function setCookies(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}


function deleteCookies(name) {
    document.cookie = `${name}=; expires=${new Date(0)}; path=/`
}


function getCookies(name) {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    return cookie ? cookie.split('=')[1] : null;
}

