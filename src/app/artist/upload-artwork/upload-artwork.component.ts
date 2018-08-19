import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, Hero, states, categories, medium, classification } from '../../core/data.model';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

@Component({
  selector: 'upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss']
})

export class UploadArtworkComponent implements OnChanges {
  @Input() hero: Hero;
  public files: UploadFile[] = [];
  heroForm: FormGroup;
  nameChangeLog: string[] = [];
  states = states;
  medium= medium;
  classification= classification;
   categories= categories;
   availableFrom: Date= null;
   availableTo: Date= null;
  constructor(
    private fb: FormBuilder, private http: HttpClient) {

    this.createForm();
    // this.logNameChange();
  }
  public dropped(event: UploadEvent) {
    this.files = event.files;
    console.log(this.files);
    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry;
        // fileEntry.file((file: File) => {
 
          // Here you can access the real file
        //  console.log(droppedFile.relativePath, file);
 
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
       //  });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
       // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event) {
    console.log(event);
  }
 
  public fileLeave(event) {
    console.log(event);
  }

  createForm() {

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
      artmedium: this.fb.group({
        medium: ''
        
      }),
      rent: '',
      buy: '',
      print: '',
      rentPrice: '',
      sellingPrice: '',
      printPrice: '',
      
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.heroForm.get('file').setValue(file);
    }
  }
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
    const formData = new FormData();
    const data = [];
    data.push(this.heroForm.get('metadata').value);
   
    formData.append('metadata', JSON.stringify(data));
    formData.append('file', this.heroForm.get('file').value);
    return formData;
  }
  onSubmit() {
    const formModel = this.prepareSave();
    const uri = 'https://sns-api-207407.appspot.com/api/art/upload';
    console.log(formModel);
    console.log('in submit');
    this
    .http
    .post(uri, formModel)
    .subscribe(res =>
        console.log('Done'));
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

  revert() { this.rebuildForm(); }

  // logNameChange() {
  //   const nameControl = this.heroForm.get('name');
  //   nameControl.valueChanges.forEach(
  //     (value: string) => this.nameChangeLog.push(value)
  //   );
  // }
}
