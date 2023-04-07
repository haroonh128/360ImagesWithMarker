export class ImagesClass {
  Id: number;
  Title = '';
  Description = '';
  Lat = '';
  Long = '';
  IsDeleted: boolean;
  CreatedBy = '';
  ModifiedBy = '';
  UserId: number;

  constructor() {
    this.Id = 0;
    this.Title = '';
    this.Description = '';
    this.Lat = '';
    this.Long = '';
    this.IsDeleted = false;
    this.CreatedBy = '';
    this.ModifiedBy = '';
    this.UserId = 0;
  }
}
