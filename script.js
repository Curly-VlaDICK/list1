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
        item.draggable = true; // Для десктопа

        // Обработчики для touch-событий (смартфоны)
        item.addEventListener('touchstart', touchStart);
        item.addEventListener('touchmove', touchMove);
        item.addEventListener('touchend', touchEnd);
        item.addEventListener('dragstart', dragStart); // Для десктопа

        return item;
    }

    // Заполнение sourceArea репликами
    shuffledLines.forEach(line => {
        const item = createDialogItem(line);
        sourceArea.appendChild(item);
    });

    // --- Drag and Drop для десктопа ---
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

    // --- Touch Events для смартфонов ---
    let touchStartPos = null;
    let movingItem = null;

    function touchStart(event) {
        movingItem = event.target;
        touchStartPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }

    function touchMove(event) {
        if (!movingItem || !touchStartPos) return;

        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;

        movingItem.style.position = 'absolute';
        movingItem.style.left = (x - touchStartPos.x) + 'px';
        movingItem.style.top = (y - touchStartPos.y) + 'px';
    }

    function touchEnd(event) {
        if (!movingItem) return;

        const x = event.changedTouches[0].clientX;
        const y = event.changedTouches[0].clientY;

        let targetElement = document.elementFromPoint(x, y);

        // Находим ближайший родительский элемент с id "source-area" или "target-area"
        while (targetElement && targetElement.id !== 'source-area' && targetElement.id !== 'target-area') {
            targetElement = targetElement.parentNode;
        }

        if (targetElement && (targetElement.id === 'source-area' || targetElement.id === 'target-area')) {
            targetElement.appendChild(movingItem);
        } else {
            // Если не попали в допустимую зону, возвращаем элемент на исходную позицию
            // (Нужно хранить исходную позицию, чтобы правильно вернуть)
            //  movingItem.style.position = 'static'; // Или как было изначально
        }

        movingItem.style.position = 'static';
        movingItem = null;
        touchStartPos = null;
    }

    // --- Проверка и Сброс ---
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
        sourceArea.innerHTML = '';
        targetArea.innerHTML = '';

        shuffledLines = [...dialogLines].sort(() => Math.random() - 0.5);

        shuffledLines.forEach(line => {
            const item = createDialogItem(line);
            sourceArea.appendChild(item);
        });

        resultDiv.textContent = '';
    });
});
