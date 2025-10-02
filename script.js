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

    const phraseBank = document.getElementById('phrase-bank');
    const sequenceArea = document.getElementById('sequence-area');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const resultMessage = document.getElementById('result-message');

    let draggablePhrases = [];
    let currentlyDragging = null;

    function populatePhraseBank() {
        const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);

        shuffledPhrases.forEach(phraseText => {
            const phraseElement = document.createElement('div');
            phraseElement.textContent = phraseText;
            phraseElement.classList.add('phrase');
            phraseElement.draggable = true;

            // --- Drag and Drop (Desktop) ---
            phraseElement.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', phraseText);
                event.dataTransfer.setData('source', 'phrase-bank');
                currentlyDragging = phraseElement;
                phraseElement.classList.remove('correct', 'incorrect'); // Сбрасываем классы
            });

            phraseElement.addEventListener('dragend', () => {
                currentlyDragging = null;
            });

            // --- Touch Events (Mobile) ---
            phraseElement.addEventListener('touchstart', (event) => {
                event.preventDefault();
                currentlyDragging = phraseElement;
                phraseElement.classList.remove('correct', 'incorrect'); // Сбрасываем классы
            });

            phraseElement.addEventListener('touchmove', (event) => {
                event.preventDefault();
                if (!currentlyDragging) return;

                const touch = event.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);

                if (target === phraseBank || target === sequenceArea || target.parentNode === phraseBank || target.parentNode === sequenceArea) {
                    if(target.children.length > 0)
                        target.children[0].innerHTML = "";

                    if((touch.clientX - target.offsetLeft) < 0)
                        phraseBank.parentNode.insertBefore(currentlyDragging, target);
                    else
                        phraseBank.parentNode.insertBefore(currentlyDragging, target.nextSibling);
                }
            });

            phraseElement.addEventListener('touchend', () => {
                currentlyDragging = null;
            });

            phraseBank.appendChild(phraseElement);
            draggablePhrases.push(phraseElement);
        });
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const phraseText = event.dataTransfer.getData('text');
        const source = event.dataTransfer.getData('source');

        const phraseElement = draggablePhrases.find(el => el.textContent === phraseText);

        if (phraseElement) {
            if (event.target === phraseBank || event.target.parentNode === phraseBank) {
                phraseBank.appendChild(phraseElement);
            } else {
                sequenceArea.appendChild(phraseElement);
            }
        }
    }

    function checkOrder() {
        const currentOrder = Array.from(sequenceArea.children).map(el => el.textContent);
        let allCorrect = true;

        Array.from(sequenceArea.children).forEach((phraseElement, index) => {
            if (currentOrder[index] === phrases[index]) {
                phraseElement.classList.add('correct');
                phraseElement.classList.remove('incorrect');
            } else {
                phraseElement.classList.add('incorrect');
                phraseElement.classList.remove('correct');
                allCorrect = false;
            }
        });

        resultMessage.textContent = allCorrect ? "Правильно!" : "Неправильно, попробуйте еще раз!";
    }

    function resetGame() {
        draggablePhrases.forEach(phraseElement => {
            phraseBank.appendChild(phraseElement);
            phraseElement.classList.remove('correct', 'incorrect');
        });

        // Очищаем sequence area
        sequenceArea.innerHTML = '';

        phraseBank.innerHTML = '';
        draggablePhrases = [];
        populatePhraseBank();

        resultMessage.textContent = '';
    }

    phraseBank.addEventListener('dragover', allowDrop);
    phraseBank.addEventListener('drop', drop);

    sequenceArea.addEventListener('dragover', allowDrop);
    sequenceArea.addEventListener('drop', drop);

    checkButton.addEventListener('click', checkOrder);
    resetButton.addEventListener('click', resetGame);

    populatePhraseBank();
});
