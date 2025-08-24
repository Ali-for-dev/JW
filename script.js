document.addEventListener('DOMContentLoaded', () => {
    const terminalPrompt = document.getElementById('terminal-prompt');
    const dossier = document.querySelector('.continental-dossier');
    const stamp = document.getElementById('stamp');
    const keyboardSound = document.getElementById('keyboard-sound');
    const stampSound = document.getElementById('stamp-sound');

    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !dossier.classList.contains('active')) {
            dossier.classList.add('active'); // Empêche de relancer
            startSequence();
        }
    });

    async function startSequence() {
        terminalPrompt.style.display = 'none';
        dossier.classList.remove('hidden');
        dossier.style.opacity = '1';

        await runTypingAnimation();
        
        setTimeout(() => {
            stamp.classList.remove('hidden');
            stamp.style.opacity = '1';
            stampSound.currentTime = 0;
            stampSound.play();
        }, 1000); 
    }

    function runTypingAnimation() {
        return new Promise(async resolve => {
            const animations = [];
            findTextNodes(dossier, animations);

            for (const animation of animations) {
                await animation();
            }
            resolve();
        });
    }

    function findTextNodes(element, animations) {
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                const originalText = node.textContent;
                node.textContent = '';
                animations.push(() => typeText(node, originalText));
            } else if (node.nodeType === Node.ELEMENT_NODE && node.id !== 'stamp') {
                findTextNodes(node, animations);
            }
        });
    }

    function typeText(node, text) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    node.textContent += text.charAt(i);
                    // Joue un son de clavier à chaque lettre ou presque
                    if (Math.random() > 0.4) { // Ne joue pas le son pour chaque lettre
                         keyboardSound.currentTime = 0;
                         keyboardSound.play().catch(e => {}); // Ignore les erreurs si le son ne peut pas jouer
                    }
                    i++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 35); // Vitesse d'écriture
        });
    }
});