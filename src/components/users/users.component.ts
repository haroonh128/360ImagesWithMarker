import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  userList: any = [];
  constructor(private userSer: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers = () => {
    this.userSer.getUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.userList = res;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  };
}
