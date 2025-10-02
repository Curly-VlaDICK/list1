const replicas = document.querySelectorAll('.replica');
const target = document.getElementById('target');
const checkButton = document.getElementById('check');
const resetButton = document.getElementById('reset');
const resultDiv = document.getElementById('result');

// Предустановленный правильный порядок реплик
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

replicas.forEach(replica => {
    replica.addEventListener('dragstart', dragStart);
    target.addEventListener('dragover', dragOver);
    target.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.target.classList.add('dragging');
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
    e.dataTransfer.clearData();
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