import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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

  constructor(
    public userServ: UserService,
    private fireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private route: Router,
    private crud: AngularFirestore
  ) {}

  ngOnInit(): void {}

  CountryISO: any = [];
  searchCountryField: any = [];
  selectedCountryISO: any = [];
  preferredCountries: any = [];

  onSubmit = () => {
    this.form.controls.IsActive.setValue(true);
    this.form.controls.Id.setValue(UUID.UUID());
    this.form.controls.CreatedDate.setValue(Date.now().toString());
    var email = this.form.controls.Email.value;
    let pass = this.form.controls.Password.value;
    if (this.form.valid) {
      this.fireAuth
        .createUserWithEmailAndPassword(String(email), String(pass))
        .then(
          () => {
            this.crud
              .collection('/Users')
              .add(this.form.getRawValue())
              .then(
                (r) => {
                  this.toastr.success('User Registered Successfully');
                  this.isRegister = false;
                },
                (err) => {
                  console.log(err);
                  this.toastr.error('Error Occured');
                }
              );
          },
          (err) => {
            console.error(err);
          }
        );
    }
  };

  logIn = () => {
    this.fireAuth
      .signInWithEmailAndPassword(
        String(this.logInForm.controls.Email.value),
        String(this.logInForm.controls.Password.value)
      )
      .then(
        (res: any) => {
          const user = res.user.multiFactor.user;
          localStorage.setItem('user', user);
          localStorage.setItem('uid', user.uid);
          this.toastr.success('LoggedIn successfully.');
          this.route.navigate(['adminmapviewer']);
        },
        (err) => {
          console.error(err);
        }
      );
  };

  get f() {
    return this.form.controls;
  }

  get a() {
    return this.logInForm.controls;
  }
}
