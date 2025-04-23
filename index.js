const search = document.querySelector('#search');
const inputTitle = document.querySelector('#input-title');
const inputPrice = document.querySelector('#input-price');
const inputDescription = document.querySelector('#input-description');
const btnAddCard = document.querySelector('#button');
const cards = document.querySelectorAll('.cardBlock'); 
const loading = document.querySelector('.loading-title');
const btnSpan = document.querySelector('.btn-span');
const sidebar = document.querySelector('.sidebar');

let products = JSON.parse(localStorage.getItem('card')) || [];

function createElements(title, price, description , name) {
    let creatingCard = document.createElement('div');
    creatingCard.classList.add('cardBlock');
    creatingCard.setAttribute("data-id", name);
    
    let deletBtn = document.createElement('button');
    deletBtn.classList.add('removeBtn');
    deletBtn.innerHTML = `✖`;

    deletBtn.onclick = function() {
        creatingCard.remove();
        deletingDataLocal(name);
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
    let title = inputTitle.value.trim();
    let price = inputPrice.value.trim();
    let description = inputDescription.value.trim();
    let id = Date.now();    
    const name = 'product_' + id;

    if (title === '' || price === '' || description === '') {
        search.innerText = 'Вы не ввели название, цену и описание';
        search.classList.add('absence-goods');
        return;
    } 
    if (!isNaN(title) || !isNaN(description)) {
        search.innerText = 'Вы ввели цифры в название и описание';
        search.classList.add('incorrect-data');
        return;
    } 
    if (isNaN(price) || price <= 100) {
        search.innerText = 'Введите корректную цену';
        search.classList.add('incorrect-price');
        return;
    }

    if (isDuplicateId(name)) {
        search.innerText = 'Такой товар уже существует';
        return;
    }

    let creatingCard = createElements(title, price, description, name);
    search.appendChild(creatingCard);
    
    savingDataLocal(title, price, description, name);
    setCookies(title, price, description, name);
}

btnAddCard.addEventListener('click', () => {
    productCreation(); 
    cleaningTheForm();
});

function savingDataLocal(title, price, description, id) {    
    products.push({ title, price, description, id });
    localStorage.setItem('card', JSON.stringify(products));
}

function deletingDataLocal(id) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        localStorage.setItem('card', JSON.stringify(products));
        deleteCookies(id);
    }
}

function creatingDownloadsLocal() {
    products.forEach(product => {
        let creatingCard = createElements(product.title, product.price, product.description, product.id);
        search.appendChild(creatingCard);
    });
}
window.addEventListener('load', creatingDownloadsLocal);

function setCookies(title, price, description, name, days = 7) {
    const productObject = {
        title: title,
        price: price,
        description: description,
    };
    const product = encodeURIComponent(JSON.stringify(productObject));
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${product}; expires=${expires}; path=/`;
}

function deleteCookies(name) {
    document.cookie = `${name}=; expires=${new Date(0)}; path=/`;
}

function getCookies(name) {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    if (!cookie) return null;

    try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch (e) {
        return null;
    }
}

function isDuplicateId(id) {
    return products.some(product => product.id === id);
}

function clearAllAppCookies() {
    document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        deleteCookies(name);
    });
}
