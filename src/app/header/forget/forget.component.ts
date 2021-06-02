import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/document.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
emailsend: Subscription;
forget(email)
{
console.log("forget");
this.documentService.forget(email);
}
  constructor(private documentService: DocumentService, private router: Router) { }

  ngOnInit() {
    this.emailsend = this.documentService.emailsend.subscribe(doc=> {if(doc === "success"){
      this.router.navigate(['/', 'enter']);
    }
  else
{
  document.getElementById('suggest').innerHTML = "You are not registered yet";
}})
  }

}
