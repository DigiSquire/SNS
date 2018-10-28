import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from '../../core/admin.service';
export interface DialogData {
  approvalStatus: 'approve' | 'reject';
  objectId: string;
}
@Component({
  selector: 'dialog-confirm',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(private adminService: AdminService, 
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }
  setApprovalTo = (approvalStatus, id) => {
    return this.adminService.setApprovalTo(approvalStatus, id).subscribe((result => {
      if (result) {
        this.dialogRef.close(id);
      }else {
        this.dialogRef.close();
      }
    }));
    
  }
}
