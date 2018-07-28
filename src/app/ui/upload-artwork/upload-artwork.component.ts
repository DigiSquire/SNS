import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, Hero, states, categories } from '../../core/data.model';
import { ArtworkService } from '../../core/artwork.service';
@Component({
  selector: 'upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss']
})

export class UploadArtworkComponent implements OnChanges {
  @Input() hero: Hero;

  heroForm: FormGroup;
  nameChangeLog: string[] = [];
  states = states;
  categories = categories;
  availableFrom: Date = null;
  availableTo: Date = null;
  constructor(
    private fb: FormBuilder, private http: HttpClient, private artService: ArtworkService) {

    this.createForm();
    // this.logNameChange();
  }

  createForm() {

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

        //   artType:this.fb.group({
        //     categories
        // }),

        classification: this.fb.group({
          nature: false,
          abstract: false,
          animals: false,
          flowers: false,
          cityscape: false

        }),
        medium: this.fb.group({
          oilOnCanvas: false,
          watercolourOnCanvas: false,
          acrylicOnCanvas: false,
          watercolourOnPaper: false,
          inkOnPaper: false,
          mixedMedia: false

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
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
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
    console.log(formModel);
    return this.artService.uploadArtwork(formModel).subscribe((result => {
      if (result) {
        console.log(result);
        // Clear form here
        // this.revert();
      }     
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
    this.rebuildForm();
  }

  // logNameChange() {
  //   const nameControl = this.heroForm.get('name');
  //   nameControl.valueChanges.forEach(
  //     (value: string) => this.nameChangeLog.push(value)
  //   );
  // }
}
