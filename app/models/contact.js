export class Contact {
    constructor( lastname, firstname, tel, mail, notes ) {
      this.lastname = lastname;
      this.firstname = firstname;
      this.tel = tel;
      this.mail = mail;
      this.notes = notes;
  
      this.state = {
        current: false,
      };  
  
      this.listItemHtml = "";
    }
  }