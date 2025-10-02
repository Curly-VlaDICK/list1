document.addEventListener('DOMContentLoaded', () => {
    const sourceArea = document.getElementById('source-area');
    const targetArea = document.getElementById('target-area');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const resultDiv = document.getElementById('result');

    const dialogLines = [
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

    let shuffledLines = [...dialogLines].sort(() => Math.random() - 0.5);

    // Функция для создания элемента реплики
    function createDialogItem(text) {
        const item = document.createElement('div');
        item.classList.add('dialog-item');
        item.textContent = text;
        item.draggable = true;
        item.addEventListener('dragstart', dragStart);
        return item;
    }

    // Заполнение sourceArea репликами
    shuffledLines.forEach(line => {
        const item = createDialogItem(line);
        sourceArea.appendChild(item);
    });

    let draggedItem = null;

    function dragStart(event) {
        draggedItem = event.target;
    }

    targetArea.addEventListener('dragover', (event) => {
        event.preventDefault(); // Разрешаем перетаскивание
    });

    targetArea.addEventListener('drop', (event) => {
        event.preventDefault();
        if (draggedItem) {
            targetArea.appendChild(draggedItem);
            draggedItem = null;
        }
    });

    sourceArea.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    sourceArea.addEventListener('drop', (event) => {
        event.preventDefault();
        if (draggedItem) {
            sourceArea.appendChild(draggedItem);
            draggedItem = null;
        }
    });

    checkButton.addEventListener('click', () => {
        const targetItems = Array.from(targetArea.querySelectorAll('.dialog-item'));
        let correctCount = 0;

        targetItems.forEach((item, index) => {
            if (item.textContent === dialogLines[index]) {
                item.classList.add('correct');
                item.classList.remove('incorrect');
                correctCount++;
            } else {
                item.classList.add('incorrect');
                item.classList.remove('correct');
            }
        });

        resultDiv.textContent = `Правильных реплик: ${correctCount} из ${dialogLines.length}`;
    });

    resetButton.addEventListener('click', () => {
       // Очищаем обе области
       sourceArea.innerHTML = '';
       targetArea.innerHTML = '';

       // Перемешиваем реплики заново
       shuffledLines = [...dialogLines].sort(() => Math.random() - 0.5);

       // Заполняем sourceArea перемешанными репликами
       shuffledLines.forEach(line => {
           const item = createDialogItem(line);
           sourceArea.appendChild(item);
       });

       // Очищаем результаты
       resultDiv.textContent = '';
   });
});
