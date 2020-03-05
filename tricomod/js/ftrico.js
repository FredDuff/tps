export class Tricolore {
    
    constructor() {
        this.appuiBouton = 0;
        this.init();
    }

    init() {
        // Insertion de la scène
        this.html = document.createElement('div');
        this.html.className = 'container';
        this.html.innerHTML = `
        <div class="scene">
            <div class="theend">
                <p>Oups un camion ...<i class="fas fa-truck-moving"></i></p>
                <a href=".">Restart !!!</a>
            </div>
            <div class="camion"></div>
            <div class="info">
                <div class="message"></div>
            </div>
            <div class="signalisation">
                <div class="poto"></div>
                <div class="trico">
                    <div class="feu rouge"></div>
                    <div class="feu orange"></div>
                    <div class="feu vert allume"></div>
                </div>
                <div class="bouton"></div>
            </div>  
        </div>
        `;

        // Récupération des éléments nécessaires
        this.feuVert = this.html.querySelector('.vert');
        this.feuOrange = this.html.querySelector('.orange');
        this.feuRouge = this.html.querySelector('.rouge');

        this.bouton = this.html.querySelector('.bouton');
        
        this.message = this.html.querySelector('.message');
        this.info = this.html.querySelector('.info');

        // Mise en place des EventListener

        // Fin feu vert => Passe à l'orange. Si trop d'appuis sur le bouton (au moins 5 fois), arrivée du camion.
        this.feuVert.addEventListener('animationend', () => {
            this.feuOrange.classList.add('allume');
            this.feuVert.classList.contains('allume') ? this.feuVert.classList.remove('allume') : this.feuVert.classList.remove('pieton')
            this.appuiBouton > 4 ? this.attentionCamion() : this.appuiBouton = 0;            
        });

        // Fin feu orange => Passe au rouge.
        this.feuOrange.addEventListener('animationend', () => {
            this.feuRouge.classList.add('allume');
            this.feuOrange.classList.remove('allume');
        });
        
        
        // Fin feu rouge => Passe au vert.
        this.feuRouge.addEventListener('animationend', () => {
            this.feuVert.classList.add('allume');
            this.feuRouge.classList.remove('allume');
        });
        
        // Appuie bouton => Si vert allumé, change d'animation pour réduire temps d'attente et incrémentation compteur appuiBouton. Sinon, envoi message du chauffeur en collère.
        this.bouton.addEventListener('click', () => {
            if (this.feuVert.classList.contains('allume')) {
                this.appuiBouton ++;
                this.feuVert.classList.add('pieton');
                this.feuVert.classList.remove('allume');
            } else if (this.feuVert.classList.contains('pieton')) {
                this.appuiBouton ++;
            } else {
                this.foutuPieton();
            };
        });
        
        // Fin animation message du chauffeur en collère => suppression de la classe pour pouvoir relancer l'animation si nouvel appui sur le bouton.
        this.info.addEventListener('animationend', () =>{
            this.info.classList.remove('pieton');
        });
    }
    
    // Si appuie sur bouton à l'orange ou au rouge => configuration du message en fonction de la couleur du feu puis activation de l'animation.
    foutuPieton() {
        if (this.feuOrange.classList.contains('allume')) {
            this.message.innerHTML = `<p>Ca vient...</p><p>T'excite pas sur le bouton !</p>`;
        } else {
            this.message.innerHTML = `<p>C'est déjà à toi de passer !!</p>
            <span>Tocard !</span>`;
        };
        this.info.classList.add('pieton');
    }

    // Si au moins 5 appuie sur le bouton pendant feu vert => Envoie du camion qui emporte le feu suivi par message de fin.
    attentionCamion() {
        document.querySelector(".camion").classList.add("oups");
        document.querySelector(".theend").classList.add("oups");
        document.querySelector(".signalisation").classList.add("oups");
    }
}
