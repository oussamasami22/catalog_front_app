import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { AppUser } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userFormGroup!: FormGroup;
  errorMessage :any ;
  
  constructor(private fb: FormBuilder,private authService :AuthenticationService,private router:Router) { }

  ngOnInit(): void {
    this.userFormGroup = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      useremail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  handleLogin(): void {
   let useremail=this.userFormGroup.value.useremail;
   let password=this.userFormGroup.value.password;
   let firstname=this.userFormGroup.value.firstname;
   let lastname=this.userFormGroup.value.lastname;
   this.authService.login(useremail,password,firstname,lastname).subscribe({
    next : (appUser:AppUser)=>{
   this.authService.authenticateUser(appUser).subscribe({
 next : (data : boolean)=>{
  this.router.navigateByUrl("/admin");

}

});
    },
    error:(err)=>{
this.errorMessage=err;
    }

   });

  }
}
