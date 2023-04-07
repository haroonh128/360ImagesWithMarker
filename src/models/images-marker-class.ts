export class ImagesMarkerClass {
  Id: number;
  Name: string;
  Description: string;
  ImageId: number;
  xAxis: string;
  yAxis: string;
  IsDeleted: boolean;
  CreatedBy: string;
  ModifiedBy: string;

  /**
   *
   */
  constructor() {
    this.Id = 0;
    this.Name = '';
    this.Description = '';
    this.ImageId = 0;
    this.xAxis = '';
    this.yAxis = '';
    this.IsDeleted = false;
    this.CreatedBy = '';
    this.ModifiedBy = '';
  }
}
