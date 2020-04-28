import { Contact } from './models/contact.js';

export class App {
    constructor() {
        this.rep = document.querySelector("#repertoire");
        this.contacts = [];
        this.listContacts = null;
        this.detailsContact = null;
        this.init();
    }

    init() {
        document.formAddContact.addEventListener('submit', this.postContact.bind(this));
        document.formAddContact.addEventListener('reset', () => location.hash = '');

        this.contacts = localStorage.getItem('contacts') ? JSON.parse(localStorage.getItem('contacts')) : [];
        this.refreshContacts();
    }

    refreshContacts() {
        this.rep.innerHTML = '';
        if (this.contacts.length) {

            this.listContacts = document.createElement('div');
            this.listContacts.classList.add('listContacts');

            this.detailsContact = document.createElement('div');
            this.detailsContact.classList.add('detailsContact');

            this.rep.appendChild(this.listContacts);
            this.rep.appendChild(this.detailsContact);

            for (let contact of this.contacts) {
                this.addContactToList(contact);
            }

        }
        else {
            this.rep.innerHTML =`
            <div class="info">
                    <p>
                        Ajouter un contact !!! <i class="fas fa-level-up-alt fa-2x"></i>
                    </p>
            </div>
            `;
        }
    }

    addContactToList(contact) {
        contact.listItemHtml = document.createElement('div');
        contact.listItemHtml.innerHTML = `
            <p>${contact.firstname}</p><!--
            --><p>${contact.lastname}</p>
        `;
        contact.listItemHtml.addEventListener('click', () => {
            this.showDetailsOf(contact);
        });
        this.listContacts.appendChild(contact.listItemHtml);
        if (contact.state.current) {
            contact.listItemHtml.classList.add("current");
            this.showDetailsOf(contact);
        }
    }

    showDetailsOf(contact) {
        
        this.changeCurrentContact(contact);

        const { firstname, lastname, tel, mail, notes } = contact;
        this.detailsContact.innerHTML = `
            <div id="labels">
                <p class="lfn lab">Prénom :</p>
                <p class="lln lab">Nom :</p>
                <p class="lt lab">Téléphone :</p>
                <p class="lm lab">Mail :</p>
                <p class="ln lab">Notes :</p>
            </div>
            <div id="datas">
                <div id="buttons" contentEditable = "false">
                    <div>
                        <div class="backToList btn"><span>Afficher la liste</span><i class="fas fa-arrow-alt-circle-left fa-2x"></i></div>
                        <div class="edit btn"><span>Modifier le contact</span><i class="fas fa-user-edit fa-2x"></i></div>
                        <div class="delete btn"><span>Suprimer le Contact</span><i class="fas fa-user-minus fa-2x"></i></div>
                    </div>
                    <div class="flipped">
                        <div class="update btn"><span>Valider</span><i class="fas fa-check-circle fa-2x"></i></div>
                        <div class="cancel btn"><span>Annuler</span><i class="fas fa-times-circle fa-2x"></i></div>
                        <div class="delete btn"><span>Supprimer le contact</span><i class="fas fa-user-minus fa-2x"></i></div>
                    </div>
                </div>
                <p id="fn" class="editabled">${firstname}</p>
                <p id="ln" class="editabled">${lastname}</p>
                <p id="t" class="editabled">${tel}</p>
                <p id="m" class="editabled">${mail || "..."}</p>
                <p id="n" class="editabled">${notes || "..." }</p>
            </div>
        `;
        this.rep.classList.add('showDetail');
        document.querySelector('.backToList').addEventListener('click', () => {this.rep.classList.remove('showDetail')});
        document.querySelector('.edit').addEventListener('click', this.editContact);
        document.querySelector('.update').addEventListener('click', this.updateContact.bind(this, contact));
        document.querySelectorAll('.delete').forEach(el => el.addEventListener('click', this.deleteContact.bind(this, contact)));
        document.querySelector('.cancel').addEventListener('click', this.refreshContacts.bind(this));
    }

    postContact(e) {
        e.preventDefault();
        const form = e.target;
        const firstname = form.lastname.value.trim();
        const lastname = form.firstname.value.trim();
        const tel = form.tel.value.trim();
        const mail = form.mail.value.trim();
        const notes = form.notes.value.trim();
        if(this.validContact("addContact", firstname, lastname, tel, mail)) {
            const contact = new Contact(
                firstname[0].toUpperCase() + firstname.slice(1).toLowerCase(),
                lastname.toUpperCase(),
                this.formatTel(tel),
                mail,
                notes
            );

            const current = this.contacts.find(c => c.state.current);
            if (current) {
                current.state.current = false;
            }
            contact.state.current = true;
            this.contacts.push(contact);
            this.persistContacts();
            this.refreshContacts();
            form.reset();
            location.hash = '';
        }
    }

    editContact() {
        document.querySelectorAll('.editabled').forEach( element => element.setAttribute("contentEditable", true));
        document.querySelectorAll('#buttons>div').forEach(element => element.classList.toggle('flipped'));
    }

    updateContact(contact) {
        const firstname = document.querySelector('#fn').textContent.trim();
        const lastname = document.querySelector('#ln').textContent.trim();
        const tel = document.querySelector('#t').textContent.trim();
        const mail = document.querySelector('#m').textContent.trim();
        const notes = document.querySelector('#n').textContent.trim();
        if(this.validContact("repertoire", firstname, lastname, tel, mail)) {
            contact.firstname = firstname[0].toUpperCase() + firstname.slice(1).toLowerCase();
            contact.lastname = lastname.toUpperCase();
            contact.tel = this.formatTel(tel);
            contact.mail = (mail == "...") ? "" : mail;
            contact.notes = (notes == "...") ? "" : notes;
            this.persistContacts();
            this.refreshContacts();
        };
    }

    deleteContact(contact) {
        this.contacts = this.contacts.filter(c => c !== contact);
        this.persistContacts();
        this.refreshContacts();
        this.rep.classList.remove('showDetail');
    }

    persistContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    validContact(target, firstname, lastname, tel, mail) {
        let isValid = true;
        if (!firstname || firstname == "") {
            document.querySelector('#' + target + ' .lfn').classList.add('error');
            isValid = false;
        } else {
            document.querySelector('#' + target + ' .lfn').classList.remove('error');

        };// "Le prénom est obligatoire et doit contenir au moins 2 caractères" : null;
        if (!lastname || lastname == "") {
            document.querySelector('#' + target + ' .lln').classList.add('error');
            isValid = false;
        } else {
            document.querySelector('#' + target + ' .lln').classList.remove('error');

        };
        if (!tel || !tel.match(/^(?:0|\+33[ ]?)[1-9]([-. ]?)\d{2}\1\d{2}\1\d{2}\1\d{2}$/)) {
            document.querySelector('#' + target + ' .lt').classList.add('error');
            isValid = false;
        } else {
            document.querySelector('#' + target + ' .lt').classList.remove('error');

        };
        if (mail && !mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && mail != "...") {
            document.querySelector('#' + target + ' .lm').classList.add('error');
            isValid = false;
        } else {
            document.querySelector('#' + target + ' .lm').classList.remove('error');

        };
        return isValid;
    }

    formatTel(tel) {
        return tel.replace(/^(?:0|\+33[ ]?)([1-9])([-. ]?)(\d{2})\2(\d{2})\2(\d{2})\2(\d{2})$/, "+33 $1 $3 $4 $5 $6")
    }

    changeCurrentContact(contact) {
        const current = this.contacts.find(c => c.state.current);
        if (!current) {
            contact.state.current = true;
            contact.listItemHtml.classList.add("current");
            this.persistContacts();
        } else if (current != contact) {
            current.state.current = false;
            current.listItemHtml.classList.remove("current");
            contact.state.current = true;
            contact.listItemHtml.classList.add("current");
            this.persistContacts();
        }
    }
}
