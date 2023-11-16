import { Component } from '@angular/core';
import {UsersService} from './users.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})

export class AppComponent {
  title = 'app';
  public getjsonvalue : any;
  constructor(private user :UsersService){
    this.user.getdata().subscribe(data=>{

     this.getjsonvalue = data
     console.log(data);
     
     
     
    })
 
  }
  

}
