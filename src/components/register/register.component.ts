import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    Id: new FormControl(''),
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    PhoneNumber: new FormControl(0, [Validators.required]),
    IsActive: new FormControl(false),
    CreatedDate: new FormControl(''),
    ModifiedDate: new FormControl(''),
  });

  logInForm = new FormGroup({
    Email: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
  });

  //bool
  isRegister: boolean = false;
  submitted: boolean = false;

  constructor(public userServ: UserService) {}

  ngOnInit(): void {}

  CountryISO: any = [];
  searchCountryField: any = [];
  selectedCountryISO: any = [];
  preferredCountries: any = [];

  onSubmit = () => {
    this.form.controls.IsActive.setValue(true);
    this.form.controls.Id.setValue(UUID.UUID());
    this.form.controls.CreatedDate.setValue(Date.now().toString());
    this.form.controls.CreatedDate.setValue('');
    if (this.form.valid) {
      this.userServ.addUser(this.form.getRawValue()).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
    }
  };

  onLogInSubmit = () => {
    if (this.logInForm.valid) {
      this.userServ.logIn(this.logInForm.getRawValue()).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
    }
  };

  get f() {
    return this.form.controls;
  }

  get a() {
    return this.logInForm.controls;
  }
}
