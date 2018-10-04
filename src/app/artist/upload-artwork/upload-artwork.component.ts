import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Address, Hero, states, categories, medium, classification } from '../../core/data.model';
import { environment } from '../../../environments/environment';
import { ArtworkService } from '../../core/artwork.service';
import { AuthService } from '../../core/auth.service';
import { NotifyService } from '../../core/notify.service';
@Component({
  selector: 'upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss']
})

export class UploadArtworkComponent implements OnChanges {
  @Input() hero: Hero;
  email: string;
  // public files: UploadFile[] = [];
  heroForm: FormGroup;
  nameChangeLog: string[] = [];
  states = states;
  medium= medium;
  classification= classification;
  categories= categories;
  availableFrom: Date= null;
  availableTo: Date= null;
  file;
  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private artService: ArtworkService, private auth: AuthService,
    private notify: NotifyService) {
    
    this.auth.getEmail.subscribe((message) => {
      this.email = message;
      this.createForm();
    });
    
    // this.logNameChange();
  }

  startUpload(event: FileList) {
    // The File object
    this.file = event.item(0);

    // Client-side validation example
    if (this.file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // Totally optional metadata
    // const customMetadata = { app: 'My AngularFire-powered PWA!' };
    console.log(this.file);
    this.heroForm.get('file').setValue(this.file);
    // return this.updateUserData(file).subscribe((result => {
    //   console.log(result);
    // }));
    // Progress monitoring
    // this.percentage = this.task.percentageChanges();
    // this.snapshot = this.task.snapshotChanges().pipe(
    //   tap(snap => {
    //     if (snap.bytesTransferred === snap.totalBytes) {
    //       // Update firestore on completion
    //       this.db.collection('photos').add({ path, size: snap.totalBytes });
    //     }
    //   }),
    //   finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL() )
    // );


    // The file's download URL
  }
  // public dropped(event: UploadEvent) {
  //   this.files = event.files;
  //   console.log(this.files);
  //   for (const droppedFile of event.files) {
 
  //     // Is it a file?
  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry;
  //        fileEntry.file((file: File) => {
 
  //         // Here you can access the real file
  //         console.log(droppedFile.relativePath, file);
 
          
  //         // You could upload it like this:
  //         const formData = new FormData()
  //         formData.append('logo', file, relativePath)
 
  //         // Headers
  //         const headers = new HttpHeaders({
  //           'security-token': 'mytoken'
  //         })
 
  //         this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
  //         .subscribe(data => {
  //           // Sanitized logo returned from backend
  //         })
          
 
  //       });
  //     } else {
  //       // It was a directory (empty directories are added, otherwise only files)
  //      const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //        console.log(droppedFile.relativePath, fileEntry);
  //     }
  //   }
  // }
 
  // public fileOver(event) {
  //   console.log(event);
  // }
 
  // public fileLeave(event) {
  //   console.log(event);
  // }

  createForm() {
    console.log(`Signed in user's email is: ${this.email}`)
    this.heroForm = this.fb.group({
      metadata: this.fb.group({
        availableFrom: null,
        availableTo: null,
        name: ['', Validators.required ],
      description: ['', Validators.required ],
      dimension: this.fb.group({
        height: '',
        width: '',
        depth: ''

      }),
        category: this.fb.group({
        artType: ''
      }),
      
      weight: '',
      
      //   artType:this.fb.group({
      //     categories
      // }),
      
      classification: this.fb.group({
        artClassification: ''
        
      }),
      artmedium : this.fb.group({
        medium: ''
        
      }),
      rent: '',
      rentTenure: this.fb.group({
        oneMonth : '',
        oneMonthRentPrice : '',
        threeMonth : '',
        threeMonthRentPrice : '',
        sixMonth : '',
        sixMonthRentPrice : ''

        }),
      buy: '',
      print: '',
      rentPrice: '',
      sellingPrice: '',
      printPrice: '',
      approvalStatus: 'pending',
      agreement: '',
      owner: this.email,
      artBy: `${sessionStorage.getItem('fname')} ${sessionStorage.getItem('lname')}`
      
      }),
    file: [null, Validators.required]
    });
  }

  ngOnChanges() {
    this.rebuildForm();
  }
  // onFileChange(event) {
  //   let reader = new FileReader();
  //   if(event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.heroForm.get('file').setValue({
  //         filename: file.name,
  //         filetype: file.type,
  //         value: reader.result.split(',')[1]
  //       })
  //     };
  //   }
  // }

  // onFileChange(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.heroForm.get('file').setValue(file);
  //   }
  // }
  rebuildForm() {
    this.heroForm.reset();
    // {
    //   name: this.hero.name
    // });
    // this.setAddresses(this.hero.addresses);
  }

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }
  prepareSave(): any {
    console.log(`Signed in user's email is: ${this.email}`)
    const formData = new FormData();
    const data = [];
    data.push(this.heroForm.get('metadata').value);
  
    formData.append('metadata', JSON.stringify(data));
    formData.append('file', this.heroForm.get('file').value);
    return formData;
  }
  onSubmit(formData: any, formDirective: FormGroupDirective) {
    this.notify.clear();
    window.scroll(0, 0);
    const formModel = this.prepareSave();
    console.log(formModel);
    console.log('Submit Executed');
    return this.artService.uploadArtwork(formModel).subscribe((result => {
      console.log(result);
      formDirective.resetForm();
      this.heroForm.reset();
    }));
  }

  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      // addresses: formModel.secretLairs // <-- bad!
      addresses: secretLairsDeepCopy
    };
    return saveHero;
  }

  revert() {
    this.notify.clear();
    window.scroll(0, 0);    
    this.rebuildForm();
  }

  // logNameChange() {
  //   const nameControl = this.heroForm.get('name');
  //   nameControl.valueChanges.forEach(
  //     (value: string) => this.nameChangeLog.push(value)
  //   );
  // }
}
