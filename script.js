const replicas = document.querySelectorAll('.replica');
const target = document.getElementById('target');
const checkButton = document.getElementById('check');
const resetButton = document.getElementById('reset');
const resultDiv = document.getElementById('result');

let draggingElement = null;

// Добавление обработчиков события для перетаскивания
replicas.forEach(replica => {
    replica.addEventListener('dragstart', dragStart);
    replica.addEventListener('dragend', dragEnd);
});

target.addEventListener('dragover', dragOver);
target.addEventListener('drop', drop);

function dragStart(e) {
    draggingElement = e.target;
    e.dataTransfer.setData('text/plain', draggingElement.textContent);
    setTimeout(() => {
        draggingElement.classList.add('invisible');
    }, 0);
}

function dragEnd() {
    draggingElement.classList.remove('invisible');
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
    newReplica.addEventListener('dragend', dragEnd);

    target.appendChild(newReplica);
}

// Проверка правильности порядка реплик
checkButton.addEventListener('click', checkOrder);
resetButton.addEventListener('click', resetGame);

function checkOrder() {
    const targetReplicas = Array.from(target.children).map(child => child.textContent);
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

    target.childNodes.forEach((child, index) => {
        if (child.textContent === correctOrder[index]) {
            child.classList.add('correct');
        } else {
            child.classList.add('incorrect');
        }
    });

    if (targetReplicas.join('') === correctOrder.join('')) {
        resultDiv.textContent = "Поздравляем! Все реплики на своих местах.";
    } else {
        resultDiv.textContent = "Некоторые реплики расставлены неправильно. Исправьте их.";
    }
}

function resetGame() {
    target.innerHTML = '';
    resultDiv.textContent = '';
    Array.from(replicas).forEach(replica => {
        const clone = replica.cloneNode(true);
        clone.addEventListener('dragstart', dragStart);
        clone.addEventListener('dragend', dragEnd);
        target.appendChild(clone);
    });
}