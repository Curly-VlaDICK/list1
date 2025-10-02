document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
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
    const checkButton = document.getElementById('checkButton');
    const resetButton = document.getElementById('resetButton');
    const resultDiv = document.getElementById('result');

    let draggedItem = null;
    let touchTimeout;

    // Функция для перемешивания массива (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Инициализация игры: создание и отображение реплик в случайном порядке
    function initializeGame() {
        sourceArea.innerHTML = ''; // Очищаем перед повторной инициализацией
        targetArea.innerHTML = '';  // Очищаем целевую область
        resultDiv.textContent = ''; // Очищаем результаты

        const shuffledPhrases = [...phrases]; // создаем новую копию массива
        shuffleArray(shuffledPhrases);

        shuffledPhrases.forEach(phraseText => {
            const phrase = document.createElement('div');
            phrase.classList.add('phrase');
            phrase.textContent = phraseText;
            phrase.draggable = true;
            phrase.dataset.originalArea = 'source'; // Помечаем, где фраза изначально находилась

            // Добавляем возможность очистки подсветки (красного/зеленого)
            phrase.clearHighlight = function() {
                this.classList.remove('correct', 'incorrect');
            }

            // Обработчики событий для Drag and Drop
            phrase.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.target.classList.add('dragging');
            });

            phrase.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
                draggedItem = null;
            });
            phrase.addEventListener('dblclick', handleDoubleClick);


            sourceArea.appendChild(phrase);
        });
    }

    // Обработчики событий для Drop Area
    targetArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    targetArea.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem.dataset.originalArea === 'source') {
            targetArea.appendChild(draggedItem);
            draggedItem.dataset.originalArea = 'target'; // Обновляем местоположение
            draggedItem.clearHighlight(); // Add this line!
        }
    });

    sourceArea.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    sourceArea.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem.dataset.originalArea === 'target') {
            sourceArea.appendChild(draggedItem);
            draggedItem.dataset.originalArea = 'source'; // Обновляем местоположение
            draggedItem.clearHighlight(); // Add this line!
        }
    });

    function handleDoubleClick(e) {
        const phrase = e.target;
        if (phrase.classList.contains('phrase')) {
            // Определяем текущее местоположение и перемещаем в обратную сторону
            if (phrase.dataset.originalArea === 'source') {
                targetArea.appendChild(phrase);
                phrase.dataset.originalArea = 'target';
            } else {
                sourceArea.appendChild(phrase);
                phrase.dataset.originalArea = 'source';
            }
            phrase.clearHighlight();
        }
    }

    // Проверка правильности
    checkButton.addEventListener('click', () => {
        const targetPhrases = Array.from(targetArea.children).map(item => item.textContent);

        // Добавляем проверку, что хоть что-то перетащили
        if (targetPhrases.length === 0) {
            resultDiv.textContent = "Перетащите реплики в правую область!";
            // Сбрасываем классы correct/incorrect, чтобы они не оставались от предыдущих проверок
            targetArea.childNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.classList.remove('correct', 'incorrect');
                }
            });
            return; // Выходим из функции, чтобы не проверять пустую область
        }


        targetArea.childNodes.forEach((node, index) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.textContent === phrases[index]) {
                    node.classList.add('correct');
                    node.classList.remove('incorrect');
                } else {
                    node.classList.add('incorrect');
                    node.classList.remove('correct');
                }
            }
        });

        const isCorrect = targetPhrases.every((phrase, index) => phrase === phrases[index]);
        resultDiv.textContent = isCorrect ? "Всё правильно!" : "Есть ошибки!";
    });

    // Кнопка "Заново"
    resetButton.addEventListener('click', () => {
        initializeGame();
    });

    // Запуск игры при загрузке страницы
    initializeGame();
});
