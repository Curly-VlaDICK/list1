const replicas = document.querySelectorAll('.replica');
const target = document.getElementById('target');
const checkButton = document.getElementById('check');
const resetButton = document.getElementById('reset');
const resultDiv = document.getElementById('result');

const correctOrder = [
    "Здра́вствуй!",
    "Приве́т!",
    "Дава́й познако́мимся, меня́ зову́т Влад. Как тебя́ зову́т?",
    "Меня́ зову́т Ка́тя.",
    "Прия́тно познако́миться.",
    "И мне о́чень прия́тно.",
    "Ка́тя, ско́лько тебе́ лет?",
    "Мне 21, а тебе́?",
    "Мне 20.",
    "Влад, отку́да ты?",
    "Я из Биробиджа́на, а ты?",
    "Я из Владивосто́ка."
];

let draggingElement = null;

replicas.forEach(replica => {
    replica.addEventListener('dragstart', dragStart);
    replica.addEventListener('touchstart', touchStart);
    target.addEventListener('dragover', dragOver);
    target.addEventListener('drop', drop);
});

// Для перетаскивания мышью
function dragStart(e) {
    draggingElement = e.target;
    e.dataTransfer.setData('text/plain', draggingElement.textContent);
    draggingElement.classList.add('dragging');
}

// Для перетаскивания на сенсорных экранах
function touchStart(e) {
    const touch = e.touches[0];
    draggingElement = e.target;

    const newReplica = document.createElement('div');
    newReplica.textContent = draggingElement.textContent;
    newReplica.classList.add('replica');
    newReplica.draggable = true;

    target.appendChild(newReplica);
    draggingElement.remove();
  
    // Для переноса с помощью touch
    newReplica.style.position = 'absolute';
    newReplica.style.left = `${touch.clientX - 100}px`;
    newReplica.style.top = `${touch.clientY - 20}px`;

    newReplica.addEventListener('touchmove', function (ev) {
        const touchMove = ev.touches[0];
        newReplica.style.left = `${touchMove.clientX - 100}px`;
        newReplica.style.top = `${touchMove.clientY - 20}px`;
    });

    newReplica.addEventListener('touchend', function () {
        target.appendChild(newReplica);
        newReplica.style.position = 'static';
    });
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    const newReplica = document.createElement('div');
    newReplica.textContent = text;
    newReplica.classList.add('replica');
    newReplica.draggable = true;

    newReplica.addEventListener('dragstart', dragStart);

    target.appendChild(newReplica);
}

checkButton.addEventListener('click', checkOrder);
resetButton.addEventListener('click', resetGame);

function checkOrder() {
    const targetReplicas = Array.from(target.children).map(child => child.textContent);
    const correctIndices = targetReplicas.map((replica, index) => {
        return replica === correctOrder[index] ? index : null;
    }).filter(i => i !== null);
  
    target.childNodes.forEach((child, index) => {
        if (child.textContent === correctOrder[index]) {
            child.classList.add('correct');
        } else {
            child.classList.add('incorrect');
        }
    });
  
    if (correctIndices.length === correctOrder.length) {
        resultDiv.textContent = "Поздравляем! Все реплики на своих местах.";
    } else {
        resultDiv.textContent = "Некоторые реплики расставлены неправильно. Исправьте их.";
    }
}

function resetGame() {
    target.innerHTML = '';
    resultDiv.textContent = '';
    replicas.forEach(replica => replica.classList.remove('correct', 'incorrect'));
    Array.from(replicas).forEach(replica => target.appendChild(replica.cloneNode(true)));
}