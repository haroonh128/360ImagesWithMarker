import * as firebase from 'firebase/compat';

export interface RegisterClass {
  Id: number;
  UserName: string;
  FirstName: string;
  LastName: string;
  Password: string;
  PhoneNo: number;
  IsActive: boolean;
  CreatedDate: string;
  ModifiedDate: string;

  // constructor() {
  //   this.Id = 0;
  //   this.UserName = '';
  //   this.FirstName = '';
  //   this.LastName = '';
  //   this.Password = '';
  //   this.PhoneNo = 0;
  //   this.IsActive = false;
  //   this.CreatedDate = '';
  //   this.ModifiedDate = '';
  // }
}
