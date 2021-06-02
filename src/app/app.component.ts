import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CanDeactivate } from '@angular/router/src/utils/preactivation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public href: string = "";
  constructor(private router: Router){}
  isOn = true;
  isOn1 = true;
  
active(){
  
  this.isOn = false;
this.isOn1 = false;
this.href = this.router.url;
console.log(this.router.url);

}
deactive()
{
this.isOn =true;
this.isOn1=true;
this.href = this.router.url;
console.log(this.router.url);
}
/*this.href = this.router.url;
if(this.href === "/submit")
this.isOn = false;
else
this.isOn = true;
}*/

}
