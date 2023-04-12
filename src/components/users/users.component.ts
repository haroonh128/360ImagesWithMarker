import { Component, OnInit } from '@angular/core';
import { RegisterClass } from 'src/models/register-class';
import { ImageViewerService } from 'src/services/image-viewer.service';
import { UserService } from 'src/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  userList: any = [];
  showModal: boolean = false;

  form = new FormGroup({
    Id: new FormControl(UUID.UUID),
    Title: new FormControl('', [Validators.required]),
    Description: new FormControl('', [Validators.required]),
    Lat: new FormControl(''),
    Long: new FormControl(''),
    IsDeleted: new FormControl(false),
    CreatedDate: new FormControl(''),
    UserId: new FormControl(''),
  });

  constructor(private userServ: UserService, private imgSer: ImageViewerService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  modalToggle = () => {
    this.showModal = !this.showModal;
  }

  getUsers = () => {
    this.userServ.getUsers().subscribe({
      next: (res: any) => {
        console.log(res);
        this.userList = res.map((a: any) => {
          const data = a.payload.doc.data();
          // data.Id = a.payload.doc.id;
          return data;
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { },
    });
  };

  addImage = () => {
    this.form.controls.CreatedDate.setValue(Date.now().toString());
    this.imgSer.addImage(this.form.getRawValue()).then(
      (res) => {
        console.log(res);
        this.modalToggle();
      },
      (err) => {
        console.error(err);
      }
    );
  };
}
