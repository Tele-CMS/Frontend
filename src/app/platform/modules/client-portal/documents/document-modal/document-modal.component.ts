import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";

@Component({
  selector: "app-document-modal",
  templateUrl: "./document-modal.component.html",
  styleUrls: ["./document-modal.component.css"]
})
export class DocumentModalComponent implements OnInit {
  userId: number = null;
  masterDocumentTypes: any = [];
  addDocumentForm: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  constructor(
    private dialogModalRef: MatDialogRef<DocumentModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) {
    this.userId = this.data;
  }

  ngOnInit() {
    this.addDocumentForm = this.formBuilder.group({
      documentType: [],
      expirationDate: [],
      title: []
    });
    this.getMasterData();
  }
  get formControls() {
    return this.addDocumentForm.controls;
  }

  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }
  getMasterData() {
    this.clientService
      .getMasterData("MASTERDOCUMENTTYPESSTAFF")
      .subscribe((response: any) => {
        if (response != null)
          this.masterDocumentTypes = response.masterDocumentTypesStaff =
            response.masterDocumentTypesStaff != null
              ? response.masterDocumentTypesStaff
              : [];
      });
  }

  handleImageChange(e) {
    //if (this.commonService.isValidFileType(e.target.files[0].name, "image")) {
    let fileExtension = e.target.files[0].name
      .split(".")
      .pop()
      .toLowerCase();
    var input = e.target;
    var reader = new FileReader();
    reader.onload = () => {
      this.dataURL = reader.result;
      this.fileList.push({
        data: this.dataURL,
        ext: fileExtension,
        fileName: e.target.files[0].name
      });
    };
    reader.readAsDataURL(input.files[0]);
    // }
    // else
    //   this.notifier.notify('error', "Please select valid file type");
  }
  removeFile(index: number) {
    this.fileList.splice(index, 1);
  }
  onSubmit() {
    ///Please chnage this API to avoid loops
    if (!this.addDocumentForm.invalid) {
      if (this.fileList.length > 0) {
        let formValues = {
          base64: this.fileList,
          documentTitle: this.addDocumentForm.value.title,
          documentTypeIdStaff: this.addDocumentForm.value.documentType,
          expiration: this.addDocumentForm.value.expirationDate,
          key: "STAFF",
          otherDocumentType: "",
          userId: this.userId
        };
        let dic = [];
        formValues.base64.forEach((element, index) => {
          dic.push(
            `"${element.data.replace(
              /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
              ""
            )}": "${element.ext}"`
          );
        });
        let newObj = dic.reduce((acc, cur, index) => {
          acc[index] = cur;
          return acc;
        }, {});
        formValues.base64 = newObj;
        this.submitted = true;
        this.clientService
          .uploadUserDocuments(formValues)
          .subscribe((response: ResponseModel) => {
            this.submitted = false;
            if (response != null && response.statusCode == 200) {
              this.notifier.notify("success", response.message);
              this.closeDialog("save");
            } else this.notifier.notify("error", response.message);
          });
      } else this.notifier.notify("error", "Please add atleast one file");
    }
  }
}
