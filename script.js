// Массив реплик
const replies = [
    "Привет, как дела?",
    "Все хорошо, спасибо!",
    "А у тебя?",
    "Тоже отлично!",
    "Давай встретимся завтра?",
    "Отличная идея!"
];

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Инициализация игры
function initGame() {
    const container = document.getElementById('repliesContainer');
    const result = document.getElementById('result');
    
    // Перемешиваем реплики
    shuffleArray(replies);
    
    // Создаем элементы для каждой реплики
    replies.forEach((reply, index) => {
        const div = document.createElement('div');
        div.classList.add('reply');
        div.draggable = true;
        div.innerHTML = `<span>${index + 1}. </span>${reply}`;
        
        // Добавляем обработчики событий
        div.addEventListener('dragstart', dragStart);
        div.addEventListener('dragend', dragEnd);
        
        container.appendChild(div);
    });
    
    // Добавляем обработчики для перетаскивания
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', drop);
}

// Обработчики событий drag-and-drop
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragEnd(e) {
    const dragged = document.getElementById