import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentService } from 'src/app/document.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

contentEditable = false;
  toggleEditable(event) {
    if ( event.target.checked ) {
        this.contentEditable = true;
   }
}

  signup(username, email, password, confirm){
    if(username === "" || email === "" || password === "" || confirm === ""){
      document.getElementById('error-container').innerHTML += "Please fill all fields correctly";
    }
    else if(!(password === confirm)){
      document.getElementById('error-container').innerHTML += "Please fill same password in password and confirm password field";
    }
    else if(!this.contentEditable){
      document.getElementById('error-container').innerHTML += "Please Check the Checkbox";
    }
    else{
    this.documentService.signup({username: username, email: email, password: password, confirm: confirm});
    this.router.navigate(['/', 'submit']);
    this.documentService.setname(username);
  }
  }

  constructor(private documentService: DocumentService, private router: Router) { }

  ngOnInit() {
  }

}
