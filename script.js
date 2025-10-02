document.addEventListener('DOMContentLoaded', () => {
    const sentences = [
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

    const sourceArea = document.getElementById('sourceArea');
    const targetArea = document.getElementById('targetArea');
    const resultArea = document.getElementById('resultArea');
    const resetButton = document.getElementById('resetButton');
    const originalOrderList = document.getElementById('orderList');

    let shuffledSentences = [...sentences]; // Копия для перемешивания
    let correctOrder = [...sentences]; // Сохраняем правильный порядок
    let draggedItem = null;

    // Функция для перемешивания массива (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createSentenceElement(sentence) {
        const element = document.createElement('div');
        element.textContent = sentence;
        element.classList.add('draggable');
        element.draggable = true;
        element.id = `sentence-${sentence.replace(/[^a-zA-Z0-9]/g, '')}`; // Уникальный ID
        return element;
    }

    function populateSourceArea() {
        shuffleArray(shuffledSentences);
        shuffledSentences.forEach(sentence => {
            const element = createSentenceElement(sentence);

            element.addEventListener('dragstart', (e) => {
                draggedItem = element;
                // Добавьте класс для визуализации перетаскивания (необязательно)
                element.classList.add('dragging');
            });

             element.addEventListener('dragend', () => {
                // Уберите класс после завершения перетаскивания
                element.classList.remove('dragging');
             });

            sourceArea.appendChild(element);
        });
    }

    function populateOriginalOrder() {
        correctOrder.forEach(sentence => {
            const listItem = document.createElement('li');
            listItem.textContent = sentence;
            originalOrderList.appendChild(listItem);
        });
    }

    populateOriginalOrder(); // Отображаем правильный порядок

    // События для targetArea
    targetArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    targetArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        // Подсветка целевой области (необязательно)
        targetArea.classList.add('drag-over');
    });

    targetArea.addEventListener('dragleave', () => {
        targetArea.classList.remove('drag-over');
    });

    targetArea.addEventListener('drop', (e) => {
        targetArea.classList.remove('drag-over');
        if (draggedItem) {
            targetArea.appendChild(draggedItem);
            draggedItem = null; // Сбрасываем draggedItem
        }
    });

     // События для sourceArea (чтобы возвращать элементы)
    sourceArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    sourceArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        sourceArea.classList.add('drag-over');
    });

    sourceArea.addEventListener('dragleave', () => {
        sourceArea.classList.remove('drag-over');
    });

    sourceArea.addEventListener('drop', (e) => {
        sourceArea.classList.remove('drag-over');
         if (draggedItem) {
            sourceArea.appendChild(draggedItem);
            draggedItem = null; // Сбрасываем draggedItem
        }
    });


    function checkOrder() {
        const droppedSentences = Array.from(targetArea.children).map(item => item.textContent);

        let allCorrect = true;
        Array.from(targetArea.children).forEach((item, index) => {
            if (droppedSentences[index] === correctOrder[index]) {
                item.classList.add('correct');
                item.classList.remove('incorrect');
            } else {
                item.classList.add('incorrect');
                item.classList.remove('correct');
                allCorrect = false;
            }
        });

        if (allCorrect) {
            resultArea.textContent = 'Правильно! Все реплики на своих местах!';
        } else {
            resultArea.textContent = 'Некоторые реплики не на своих местах.';
        }
    }


    resetButton.addEventListener('click', () => {
        // Очищаем обе области
        sourceArea.innerHTML = '';
        targetArea.innerHTML = '';
        resultArea.textContent = '';

        // Сбрасываем стили подсветки
        shuffledSentences.forEach(sentence => {
            const element = document.getElementById(`sentence-${sentence.replace(/[^a-zA-Z0-9]/g, '')}`);
            if (element) {
                element.classList.remove('correct', 'incorrect');
            }
        });

        shuffledSentences = [...sentences]; // Reset shuffled sentences
        populateSourceArea(); // Заново заполняем sourceArea перемешанными репликами
    });

    // Первоначальная загрузка реплик в sourceArea
    populateSourceArea();

    // Добавляем кнопку для проверки порядка (можно добавить в HTML)
    const checkButton = document.createElement('button');
    checkButton.textContent = 'Проверить';
    checkButton.addEventListener('click', checkOrder);
    document.querySelector('.container').appendChild(checkButton);
});
