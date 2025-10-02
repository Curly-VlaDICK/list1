const replicasData = [
    "Здра вству́й!",
    "При́ве т!",
    "Дава й познако ми́мся, меня зову́ т Влад. Как тебя зову́ т?",
    "Меня зову́ т Ка тя.",
    "При́я тно познако ми́ться.",
    "И мне о чень при́я тно.",
    "Ка тя, ско лько тебе лет?",
    "Мне 21, а тебе ?",
    "Мне 20",
    "Влад, отку́ да ты́?",
    "Я и́з Би́роби́джа на, а ты́?",
    "Я и́з Влади́восто ка."
];

const draggableReplicas = document.getElementById('draggable-replicas');
const dropZone = document.getElementById('drop-zone');
const checkButton = document.getElementById('check-button');
const resultDiv = document.getElementById('result');

let draggedReplica = null;
let currentOrder = [];

// Функция для перемешивания массива (алгоритм Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для создания DOM-элемента реплики
function createReplicaElement(replicaText, index) {
    const replicaElement = document.createElement('div');
    replicaElement.classList.add('replica');
    replicaElement.textContent = replicaText;
    replicaElement.draggable = true;
    replicaElement.dataset.index = index; // Сохраняем индекс для проверки
    return replicaElement;
}

// Создаем и добавляем перемешанные реплики
const shuffledReplicas = shuffleArray(replicasData.slice()); // Создаем копию массива
shuffledReplicas.forEach((replica, index) => {
    const replicaElement = createReplicaElement(replica, replicasData.indexOf(replica));
    draggableReplicas.appendChild(replicaElement);
});

// Обработчики событий для перетаскивания
draggableReplicas.addEventListener('dragstart', (e) => {
    draggedReplica = e.target;
    e.dataTransfer.setData('text/plain', draggedReplica.dataset.index);
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('over');
});

dropZone.addEventListener('drop', (e) => {
   e.preventDefault();
    dropZone.classList.remove('over');
    if (draggedReplica) {
        dropZone.appendChild(draggedReplica);
        currentOrder.push(draggedReplica.dataset.index); // Сохраняем индекс
        draggedReplica = null;
    }
});

// Обработчик события для кнопки "Проверить"
checkButton.addEventListener('click', () => {
    let isCorrect = true;
    for (let i = 0; i < currentOrder.length; i++) {
        if (parseInt(currentOrder[i]) !== i) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect && currentOrder.length === replicasData.length) {
        resultDiv.textContent = 'Правильно!';
        resultDiv.classList.remove('incorrect');
        resultDiv.classList.add('correct');
    } else {
        resultDiv.textContent = 'Неправильно!';
        resultDiv.classList.remove('correct');
        resultDiv.classList.add('incorrect');
    }
});
