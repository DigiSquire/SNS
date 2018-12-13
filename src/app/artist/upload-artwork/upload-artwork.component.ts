import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
  FormControl
} from '@angular/forms';
import {
  HttpClient
} from '@angular/common/http';
import { Address, Hero, states, categories, medium, classification } from '../../core/data.model';
import { ArtworkService } from '../../core/artwork.service';
import { AuthService } from '../../core/auth.service';
import { NotifyService } from '../../core/notify.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import * as uuid from 'uuid';
@Component({
  selector: 'upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss']
})

export class UploadArtworkComponent implements OnChanges {
  @Input() hero: Hero;
  readonly MAX_SIZE = 3145728;
  email: string;
  // public files: UploadFile[] = [];
  heroForm: FormGroup;
  nameChangeLog: string[] = [];
  states = states;
  medium = medium;
  sellCheckbox = false;
  classification = classification;
  categories = categories;
  availableFrom: Date = null;
  availableTo: Date = null;
  file;
  rentValue = false;
  atLeastOneChecked = false;
  rentCheckboxes = false;
  atLeastOneMonthRentChecked = false;
  formArrayLength = 0;
  // State for dropzone CSS toggling
  isHovering: boolean;
  downloadURL;
  
   @ViewChild('uploadFile') uploadFile: any;
  @ViewChild('formDirective') form: any;
  rentDetails = [{
      month: 1,
      price: ''
    },
    {
      month: 3,
      price: ''
    },
    {
      month: 6,
      price: ''
    }

  ];
  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private artService: ArtworkService, private auth: AuthService,
    public notify: NotifyService,
    private storage: AngularFireStorage) {
    this.auth.getEmail.subscribe((message) => {
      this.email = message;
      this.createForm();
      this.patchValues();
      // this.heroForm.valueChanges.subscribe(val => {
      //   this.atLeastOneChecked = this.verifyCheckboxes();
      // });

    });

    // this.logNameChange();
  }
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  clearFile(error: 'image' | 'file') {
    window.scroll(0, 0);
    if (error === 'image') {
      this.notify.update('Unsupported file format.', 'error');
    } else if (error === 'file') {
      this.notify.update('Keep your artworks below 3MB.', 'error');
    }
    this.uploadFile.nativeElement.value = '';
    this.file = null;
    return;
  }
  startUpload(event: FileList) {
    // Clear any existing notifications
    this.notify.clear();
    // The File object
    this.file = event.item(0);

    // Client-side validation example
    if (this.file.type.split('/')[0] !== 'image') {
      this.clearFile('image');
    }else if (this.file.size > this.MAX_SIZE) {
      this.clearFile('file')
    }
    console.log(this.file);
    this.heroForm.get('file').setValue(this.file);
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
        name: ['', Validators.required],
        description: ['', Validators.required],
        dimension: this.fb.group({
          height: '',
          width: '',
          depth: ''
        }),
        category: this.fb.group({
          artType: ''
        }),
        weight: '',
        classification: this.fb.group({
          artClassification: ''

        }),
        artmedium: this.fb.group({
          medium: ''

        }),
        rentInformation: this.fb.group({
          rent: false,
          rentPrice: [null],
          //  rentDetails: this.buildRentDetails()
          rows: this.fb.array([])

        }),

        // rentTenure: this.fb.group({
        //   oneMonth : '',
        //   oneMonthRentPrice : '',
        //   threeMonth : '',
        //   threeMonthRentPrice : '',
        //   sixMonth : '',
        //   sixMonthRentPrice : ''

        //   }),



        buy: false,
        print: false,

        sellingPrice: '',
        printPrice: '',
        approvalStatus: 'pending',
        agreement: '',
        owner: this.email,
        URL: null,
        artBy: `${sessionStorage.getItem('fname')} ${sessionStorage.getItem('lname')}`

      }),
      file: [null, Validators.required]
    });
  }
  // on change of Rent Out checkbox
  rentChange() {
    this.rentValue = this.heroForm.get('metadata.rentInformation.rent').value;
    if (this.rentValue) {
      for (let i = 0; i < this.formArrayLength; i++) {
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          price: ''
        });
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          checkbox_value: null
        });
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).setValidators(Validators.required);
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).updateValueAndValidity();
        console.log(this.heroForm.get(`metadata.rentInformation.rows.${i}.checkbox_value`));
      }
    } else {
      for (let i = 0; i < this.formArrayLength; i++) {
        this.heroForm.get(`metadata.rentInformation.rows.${i}.price`).clearValidators();
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).clearValidators();
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          price: ''
        });
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          checkbox_value: null
        });

        this.heroForm.get(`metadata.rentInformation.rows.${i}`).updateValueAndValidity();
      }
      this.rentCheckboxes = false;
      this.atLeastOneChecked = this.verifyCheckboxes();

    }

  }

  // on change of 1/3/6 month checkbox

  verifyIfAnyChecked() {
    let flag = false;

    for (let i = 0; i < this.formArrayLength; i++) {
      if (this.heroForm.get(`metadata.rentInformation.rows.${i}`).value.checkbox_value) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  verifyCheckboxes() {
    let flag = false;
    if (this.sellCheckbox || this.rentCheckboxes) {
      flag = true;
      return flag;
    } else {
      flag = false;
      return flag;
    }

  }
  clearPriceIfNecessary(id) {
    if (this.rentValue) {

      this.atLeastOneMonthRentChecked = this.verifyIfAnyChecked();
      if (this.atLeastOneMonthRentChecked) {
        this.rentCheckboxes = true;
        for (let i = 0; i < this.formArrayLength; i++) {
          this.heroForm.get(`metadata.rentInformation.rows.${i}`).clearValidators();
          //  this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({price: ''});
          this.heroForm.get(`metadata.rentInformation.rows.${i}.price`).clearValidators();
          this.heroForm.get(`metadata.rentInformation.rows.${i}`).updateValueAndValidity();
        }

        // this.heroForm.get(`metadata.rentInformation.rows.${id}`).clearValidators();
        // this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();
        if (this.heroForm.get(`metadata.rentInformation.rows.${id}`).value.checkbox_value) {
          this.heroForm.get(`metadata.rentInformation.rows.${id}`).patchValue({
            price: ''
          });
          this.heroForm.get(`metadata.rentInformation.rows.${id}.price`).setValidators(Validators.required);
          this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();
          this.atLeastOneChecked = this.verifyCheckboxes();

        } else {
          // this.rentCheckboxes = false ; 
          this.heroForm.get(`metadata.rentInformation.rows.${id}`).patchValue({
            price: ''
          });
          this.heroForm.get(`metadata.rentInformation.rows.${id}.price`).clearValidators();
          this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();
          //  this.atLeastOneChecked = this.verifyCheckboxes();
        }
        // this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();
      } else {


        for (let i = 0; i < this.formArrayLength; i++) {
          this.heroForm.get(`metadata.rentInformation.rows.${i}`).setValidators(Validators.required);
          this.heroForm.get(`metadata.rentInformation.rows.${i}`).updateValueAndValidity();
        }
        this.rentCheckboxes = false;
        this.atLeastOneChecked = this.verifyCheckboxes();
        this.heroForm.get(`metadata.rentInformation.rows.${id}`).patchValue({
          price: ''
        });
        this.heroForm.get(`metadata.rentInformation.rows.${id}.price`).clearValidators();
        this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();

      }

      console.log(this.heroForm.get(`metadata.rentInformation.rows.${id}`).value.checkbox_value);
    } else {
      this.rentCheckboxes = false;
      for (let i = 0; i < this.formArrayLength; i++) {
        this.heroForm.get(`metadata.rentInformation.rows.${i}.price`).clearValidators();
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).clearValidators();
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          price: ''
        });
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).patchValue({
          checkbox_value: false
        });
        this.heroForm.get(`metadata.rentInformation.rows.${i}`).updateValueAndValidity();
      }
      console.log(this.heroForm.get(`metadata.rentInformation.rows.${id}`).value.checkbox_value);
      this.heroForm.get(`metadata.rentInformation.rows.${id}.price`).clearValidators();
      this.heroForm.get(`metadata.rentInformation.rows.${id}`).clearValidators();
      this.heroForm.get(`metadata.rentInformation.rows.${id}`).patchValue({
        checkbox_value: false
      });
      this.heroForm.get(`metadata.rentInformation.rows.${id}`).patchValue({
        price: ''
      });
      this.heroForm.get(`metadata.rentInformation.rows.${id}`).updateValueAndValidity();
      this.atLeastOneChecked = this.verifyCheckboxes();

    }

  }

  sellChange() {
    const buyValue = this.heroForm.get('metadata.buy').value;

    if (buyValue) {
      this.heroForm.get('metadata.sellingPrice').setValidators(Validators.required);
      this.heroForm.updateValueAndValidity();
      this.heroForm.get('metadata.sellingPrice').patchValue('');
      this.sellCheckbox = true;
      this.atLeastOneChecked = this.verifyCheckboxes();
    } else {
      this.heroForm.get('metadata.sellingPrice').clearValidators();
      this.heroForm.updateValueAndValidity();
      this.heroForm.get('metadata.sellingPrice').patchValue('');
      this.sellCheckbox = false;
      this.atLeastOneChecked = this.verifyCheckboxes();
    }

  }
  patchValues() {
    const rows = this.heroForm.get('metadata.rentInformation.rows') as FormArray;
    this.rentDetails.map(detail => {
      rows.push(this.fb.group({
        checkbox_value: [null],
        newdisablecontrol: ({
          value: '',
          disabled: true
        }),
        month: detail.month,
        price: [null]
      }));
      this.formArrayLength++;
    });
  }

  // buildRentDetails() {
  //   const arr = this.rentDetails.map(rentDetail => {
  //     this.fb.group({
  //       checkbox_value: false,
  //       material_id: new FormControl({ value: x.id, disabled: true }, Validators.required),
  //       material_name: x.name,
  //       quantity: [null]
  //     })
  //     return this.fb.control(rentDetail.selected);
  //   });
  //   return this.fb.array(arr);
  // }

  //  createItem(): FormGroup {
  //   return this.fb.group({
  //    month: [null],
  //     price: ''
  // });
  //  }
  //  addItem(): void {
  //   this.rentDetails = this.heroForm.get('rentDetails') as FormArray;
  //   this.rentDetails.push(this.createItem());
  //  }

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
    this.uploadFile.nativeElement.value = '';
    this.heroForm.reset();
    this.file = null;

    const rowsToDelete = this.heroForm.get('metadata.rentInformation.rows') as FormArray;
    while (rowsToDelete.length !== 0) {
      rowsToDelete.removeAt(0)
    }
    // const clearFormArray = (this.heroForm.get('metadata.rentInformation.rows'): FormArray) => {
    //   while (this.heroForm.get('metadata.rentInformation.rows').length !== 0) {
    //     rows.removeAt(0)
    //   }
    // }
    this.patchValues();

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
  prepareSave() {
    console.log(`Signed in user's email is: ${this.email}`)
    // const formData = new FormData();
    // const data = [];
    
    // Return download URL and 
    // data.push(this.heroForm.get('metadata').value);
    // return this.uploadFileToFS(this.heroForm.get('file').value);
    // data.push(this.heroForm.get('metadata').value);
    // formData.append('metadata', JSON.stringify(data));

    // formData.append('image', this.heroForm.get('file').value);

    // const file = this.heroForm.get('file').value;
    
  
    // return formData;
  }
  uploadFileToFS(file, formDirective: FormGroupDirective) {
    const payload = {
      data : []
    }
    const preparePayload = [];
    // Generate a file name wih hex-code
    const fileName = uuid.v4() + file.name;
    console.log('Generated Filename', fileName);
    this.storage.upload('PROD/' + fileName, file).then((uploadResponse) => {
      // Initiate Upload to FS
      console.log('Upload success response', uploadResponse);
      // Retrieve  URL
      this.storage.ref('PROD/' + fileName).getDownloadURL()
      .subscribe((URL) => {
        console.log('URL Received', URL);
        // Assign the URL to metadata object
        this.heroForm.get('metadata').value.URL = URL;
        // Assign the lowest value to rentPrice
        const rentPrices = this.heroForm.get('metadata').value.rentInformation.rows;
        this.heroForm.get('metadata').value.rentInformation.rentPrice = Math.min(...rentPrices.map((s) => {
          return parseInt(s.price) || 999999999999999;
        }));
        if (this.heroForm.get('metadata').value.rentInformation.rentPrice === 999999999999999) {
          this.heroForm.get('metadata').value.rentInformation.rentPrice = 0;
        }
        console.log('lowest value', this.heroForm.get('metadata').value.rentInformation.rentPrice);

        // Update the data to be sent to server
        preparePayload.push(this.heroForm.get('metadata').value);
        payload.data = preparePayload;
        console.log('Payload to be sent ', payload );
        // Initiate save to MongoDB
        return this.artService.uploadArtwork(payload).subscribe((result => {
      if (result) {
        console.log('Success, formDirective received to service', formDirective);
        // Check Below with Nida
        this.form.resetForm();
        this.rebuildForm();
        this.createForm();
        this.patchValues();
        this.uploadFile.nativeElement.value = '';
        this.file = null;
      } else {
        this.auth.changeMessage(false);
        this.form.resetForm();
        this.rebuildForm();
        this.createForm();
        this.patchValues();
        this.uploadFile.nativeElement.value = '';
        this.file = null;
      }
    }
    ));
        }, (error) => {
          this.handleUploadFileToFSError(error);
        });
    }).catch((reason) => {
      this.handleUploadFileToFSError(reason);
    });
  }
  handleUploadFileToFSError(reason): Observable<any> {
    switch (reason.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        console.log(1);
        this.auth.changeMessage(false);
        this.notify.update('File could not be upload. Please Try again.', 'error');
        return Observable.of(null);

      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log(2);
        this.auth.changeMessage(false);
        this.notify.update('File could not be upload. Please Try again.', 'error');
        return Observable.of(null);

      case 'storage/canceled':
        // User canceled the upload
        console.log(3);
        this.auth.changeMessage(false);
        this.notify.update('File could not be upload. Please Try again.', 'error');
        return Observable.of(null);

      case 'storage/unknown':
        console.log(123);
        this.auth.changeMessage(false);
        this.notify.update('File could not be upload. Please Try again.', 'error');
        // Unknown error occurred, inspect the server response
        return Observable.of(null);
    }
  }
  onSubmit(formDirective: FormGroupDirective) {
    this.auth.changeMessage(true);
    this.notify.clear();
    window.scroll(0, 0); 
    this.uploadFileToFS(this.heroForm.get('file').value, formDirective);  
    
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
    this.createForm();
    this.patchValues();
  }
}
