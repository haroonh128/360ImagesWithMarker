import { Component, OnInit } from '@angular/core';
import { RegisterClass } from 'src/models/register-class';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  userList: any = [];
  constructor(private userServ: UserService) {}

  ngOnInit(): void {
    this.getUsers();
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
      complete: () => {},
    });
  };
}
