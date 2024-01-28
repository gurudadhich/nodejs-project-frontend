import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  private _unsubscribeAll: Subject<any>;

  files: any[] = [];
  uniqueCode: string = '';
  userId: any;
  fileViewUniqueCode:any
  ngOnInit(): void {
    this.getProfile()
    this.getFiles();
  }
  constructor(
    private apiService: ApiService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  getProfile() {
    this.apiService.getProfile().subscribe(
      (response: any) => {
        this.userId = response.id;
        console.log("profile:", this.userId);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getFiles(): void {
    this.apiService.getFiles().subscribe(
      (response) => {
        console.log("files", response)
        this.files = response;
      },
      (error) => {
        console.error('Error fetching files:', error);
      }
    );
  }

  public selectedFile: File | null = null;
  public selectedFileName = '';

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;

    console.log("Selected file:", this.selectedFile);

    if (!this.selectedFile || !this.uniqueCode) {
      console.error('Please select a file and enter a unique code.');
      return;
    }
  }

  onUploadFile() {
    console.log("file uploading")
    this.apiService.uploadFile(this.selectedFile, this.uniqueCode, this.userId).subscribe(
      (response: any) => {
        console.log("File uploaded successfully:", response);
        this.getFiles();
      },
      (error: any) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  viewAndDownloadFile() {
    // if (this.fileViewUniqueCode!='' || this.fileViewUniqueCode == 0) {
      this.fileViewUniqueCode = 54367
      this.apiService.viewAndDownloadFile(this.fileViewUniqueCode).subscribe(
        (response: any) => {
          if (response) {
            var blob = new Blob([response], { type: 'application/pdf' });
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
          } else {
            console.error("Empty or invalid PDF content.");
          }
        },
        (error: any) => {
          console.error('Error removing file:', error);
        }
      );
    // }
  }

  removeFile(fileId: number): void {
    this.apiService.removeFile(fileId).subscribe(
      (response: any) => {
        this.getFiles();
      },
      (error: any) => {
        console.error('Error removing file:', error);
      }
    );
  }

}
