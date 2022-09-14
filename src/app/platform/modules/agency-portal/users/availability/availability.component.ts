import { debug } from "util";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CommonService } from "../../../core/services";
import { UsersService } from "../users.service";
import { ResponseModel } from "../../../core/modals/common-model";
import { StaffAssignedLocationModel } from "../users.model";
import { StaffAvailabilityModel } from "../staff-availability.model";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { format } from "date-fns";
import { NotifierService } from "angular-notifier";
import { HomeService } from "src/app/front/home/home.service";

@Component({
  selector: "app-availability",
  templateUrl: "./availability.component.html",
  styleUrls: ["./availability.component.css"]
})
export class AvailabilityComponent implements OnInit {
  availabilityForm: FormGroup;
  staffId: number;
  locationId: number;
  staffLocations: Array<StaffAssignedLocationModel>;
  staffAvailabilityTypes: Array<any>;
  masterWeekDays: Array<any>;
  days: Array<StaffAvailabilityModel> = [];
  available: Array<StaffAvailabilityModel> = [];
  unavailable: Array<StaffAvailabilityModel> = [];
  sunday: Array<StaffAvailabilityModel> = [];
  monday: Array<StaffAvailabilityModel> = [];
  tuesday: Array<StaffAvailabilityModel> = [];
  wednesday: Array<StaffAvailabilityModel> = [];
  thursday: Array<StaffAvailabilityModel> = [];
  friday: Array<StaffAvailabilityModel> = [];
  saturday: Array<StaffAvailabilityModel> = [];
  existingDayAvailabilities: Array<StaffAvailabilityModel> = [];
  existingAvailabilities: Array<StaffAvailabilityModel> = [];
  existingUnaAvailabilities: Array<StaffAvailabilityModel> = [];
  submitted: boolean = false;
  timeinterval: string;
  userInfo: any;
  providerId: string;
//   public timeintervals: string[] = [
//     '15 min',
//     '30 min',
//     '45 min',
//     '1 hr',
//     '2 hr',
    
// ];
  loop: any[] = [1];

  @Output() handleTabChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private commonService: CommonService,
    private homeService: HomeService,
  ) {}
  ngOnInit() {
    this.GetStaffLocations();
    const configContols = {
      daysAvailability: this.formBuilder.array([
        this.formBuilder.group({
          items: this.formBuilder.array([])
        })
      ]),
      availability: this.formBuilder.array([]),
      unavailability: this.formBuilder.array([])
    };
    this.availabilityForm = this.formBuilder.group(configContols);
    this.staffLocations = new Array<StaffAssignedLocationModel>();
    this.getStaffDetail();
  }
  getStaffAvailbilityTypes() {
    let data = "staffavailability,MASTERWEEKDAYS";
    this.userService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.staffAvailabilityTypes = response.staffAvailability;
        this.masterWeekDays = response.masterWeekDays;
        this.GetStaffAvailabilityByLocation();
      }
    });
  }
  getDayId(dayName: string = ""): number {
    return this.masterWeekDays.find(
      x => x.day.toLowerCase() == dayName.toLowerCase()
    ).id;
  }

  getDayName(dayId: number): string {
    return this.masterWeekDays.find(x => x.id == dayId).dayName;
  }
  get formControls() {
    return this.availabilityForm.value;
  }

  get daysAvailability() {
    return this.availabilityForm.get("daysAvailability") as FormArray;
  }

  get availability() {
    return this.availabilityForm.get("availability") as FormArray;
  }
  get unavailability() {
    return this.availabilityForm.get("unavailability") as FormArray;
  }

  addItem(ix, array: Array<StaffAvailabilityModel>) {
    this.daysAvailability.push(
      this.formBuilder.group({
        items: this.formBuilder.array([])
      })
    );

    const control = (<FormArray>this.availabilityForm.controls[
      "daysAvailability"
    ])
      .at(ix)
      .get("items") as FormArray;
    for (let i = 0; i < array.length; i++) {
      control.push(
        this.formBuilder.group({
          id: array[i].id,
          dayId: array[i].dayId,
          startTime: array[i].startTime,
          endTime: array[i].endTime,
          dayName: array[i].dayName,
          locationId: array[i].locationId,
          staffID: array[i].staffID,
          isActive: array[i].isActive,
          isDeleted: array[i].isDeleted,
          staffAvailabilityTypeID: array[i].staffAvailabilityTypeID
        })
      );
    }
  }

  addAvlItem(obj: StaffAvailabilityModel) {
    const control = <FormArray>this.availabilityForm.controls["availability"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        dayId: obj.dayId,
        startTime: obj.startTime,
        endTime: obj.endTime,
        dayName: obj.dayName,
        locationId: obj.locationId,
        staffID: obj.staffID,
        date: obj.date,
        isActive: obj.isActive,
        isDeleted: obj.isDeleted,
        staffAvailabilityTypeID: obj.staffAvailabilityTypeID
      })
    );
  }

  addUnAvlItem(obj: StaffAvailabilityModel) {
    const control = <FormArray>this.availabilityForm.controls["unavailability"];
    control.push(
      this.formBuilder.group({
        id: obj.id,
        dayId: obj.dayId,
        startTime: obj.startTime,
        endTime: obj.endTime,
        dayName: obj.dayName,
        locationId: obj.locationId,
        staffID: obj.staffID,
        date: obj.date,
        isActive: obj.isActive,
        isDeleted: obj.isDeleted,
        staffAvailabilityTypeID: obj.staffAvailabilityTypeID
      })
    );
  }

  GetStaffLocations() {
    this.userService
      .getStaffLocations(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          this.staffLocations = response.data;
          this.locationId = this.staffLocations.find(
            x => x.isDefault == true
          ).id;
          this.getStaffAvailbilityTypes();
        }
      });
  }
  GetStaffAvailabilityByLocation() {
    let maxLength: number = 1;
    let emptyObject: StaffAvailabilityModel;
    let avlType = this.staffAvailabilityTypes.find(
      x => x.globalCodeName == "WeekDay"
    ).id;
    this.userService
      .getStaffAvailabilityByLocation(this.staffId, this.locationId)
      .subscribe((response: ResponseModel) => {
        this.existingDayAvailabilities = [];
        this.existingAvailabilities = [];
        this.existingUnaAvailabilities = [];
        if (response != null && response.data != null) {
          if (response.data.days != null) {
            this.existingDayAvailabilities = response.data.days; //.map(y => { y.startTime = format(y.startTime, 'HH:mm'), y.endTime = format(y.endTime, 'HH:mm'); return y });
            this.sunday = response.data.days
              .filter(x => x.dayId == this.getDayId("Sunday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.sunday.length > maxLength ? this.sunday.length : maxLength;
            this.monday = response.data.days
              .filter(x => x.dayId == this.getDayId("Monday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.monday.length > maxLength ? this.monday.length : maxLength;
            this.tuesday = response.data.days
              .filter(x => x.dayId == this.getDayId("Tuesday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.tuesday.length > maxLength ? this.tuesday.length : maxLength;
            this.wednesday = response.data.days
              .filter(x => x.dayId == this.getDayId("Wednesday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.wednesday.length > maxLength
                ? this.wednesday.length
                : maxLength;
            this.thursday = response.data.days
              .filter(x => x.dayId == this.getDayId("Thursday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.thursday.length > maxLength
                ? this.thursday.length
                : maxLength;
            this.friday = response.data.days
              .filter(x => x.dayId == this.getDayId("Friday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.friday.length > maxLength ? this.friday.length : maxLength;
            this.saturday = response.data.days
              .filter(x => x.dayId == this.getDayId("Saturday"))
              .map(y => {
                (y.startTime = format(y.startTime, "HH:mm")),
                  (y.endTime = format(y.endTime, "HH:mm"));
                return y;
              });
            maxLength =
              this.saturday.length > maxLength
                ? this.saturday.length
                : maxLength;

            for (let i = 0; i < maxLength; i++) {
              this.addItem(i, [
                this.sunday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Sunday"),
                    avlType
                  ),
                this.monday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Monday"),
                    avlType
                  ),
                this.tuesday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Tuesday"),
                    avlType
                  ),
                this.wednesday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Wednesday"),
                    avlType
                  ),
                this.thursday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Thursday"),
                    avlType
                  ),
                this.friday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Friday"),
                    avlType
                  ),
                this.saturday[i] ||
                  this.initializeStaffAvailabilityObject(
                    this.getDayId("Saturday"),
                    avlType
                  )
              ]);
            }
          } else {
            this.addItem(0, [
              this.initializeStaffAvailabilityObject(
                this.getDayId("Sunday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Monday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Tuesday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Wednesday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Thursday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Friday"),
                avlType
              ),
              this.initializeStaffAvailabilityObject(
                this.getDayId("Saturday"),
                avlType
              )
            ]);
          }

          if (
            response.data.available != null &&
            response.data.available.length > 0
          ) {
            this.existingAvailabilities = response.data.available;
            response.data.available.forEach(element => {
              element.startTime = format(element.startTime, "HH:mm");
              element.endTime = format(element.endTime, "HH:mm");
              this.addAvlItem(element);
            });
          } else {
            this.addAvlItem(
              this.initializeStaffAvailabilityObject(
                null,
                this.staffAvailabilityTypes.find(
                  x => x.globalCodeName == "Available"
                ).id
              )
            );
          }
          if (
            response.data.unavailable != null &&
            response.data.unavailable.length > 0
          ) {
            this.existingUnaAvailabilities = response.data.unavailable;
            response.data.unavailable.forEach(element => {
              element.startTime = format(element.startTime, "HH:mm");
              element.endTime = format(element.endTime, "HH:mm");
              this.addUnAvlItem(element);
            });
          } else {
            this.addUnAvlItem(
              this.initializeStaffAvailabilityObject(
                null,
                this.staffAvailabilityTypes.find(
                  x => x.globalCodeName == "Unavailable"
                ).id
              )
            );
          }
        }
      });
  }

  initializeStaffAvailabilityObject(
    dayId: number,
    availabilityTypeId: number
  ): StaffAvailabilityModel {
    let dayName =
      dayId != undefined && dayId != null ? this.getDayName(dayId) : "";
    //  dayId == 1 ? "Sunday" : dayId == 2 ? "Monday" : dayId == 3 ? "Tuesday" : dayId == 4 ? "Wednesday" : dayId == 5 ? "Thursday" : dayId == 6 ? "Friday" : dayId == 7 ? "Saturday" : "";
    let staffAvailability = new StaffAvailabilityModel();
    staffAvailability.dayId = dayId;
    staffAvailability.dayName = dayName;
    staffAvailability.date = "";
    staffAvailability.isActive = true;
    staffAvailability.isDeleted = false;
    staffAvailability.staffID = this.staffId;
    staffAvailability.staffAvailabilityTypeID = availabilityTypeId;
    staffAvailability.locationId = this.locationId;
    return staffAvailability;
  }
  loadChildComponent(eventType: any): any {
    if (eventType != null && eventType.tab.textLabel != "") {
      this.clearFormControls();
      this.locationId = this.staffLocations.find(
        x => x.locationName == eventType.tab.textLabel
      ).id;
      //this.GetStaffAvailabilityByLocation();
    }
  }
  clearFormControls() {
    while (this.daysAvailability.length !== 0) {
      this.daysAvailability.removeAt(0);
    }
    while (this.availability.length !== 0) {
      this.availability.removeAt(0);
    }
    while (this.unavailability.length !== 0) {
      this.unavailability.removeAt(0);
    }
  }

  onSubmit() {
    this.locationId;
    let nowDate = new Date();
    let currentDate =
      nowDate.getFullYear() +
      "-" +
      (nowDate.getMonth() + 1) +
      "-" +
      nowDate.getDate();
    let dayAvailability: Array<StaffAvailabilityModel> = [];
    let avl: Array<StaffAvailabilityModel> = [];
    let unAvl: Array<StaffAvailabilityModel> = [];
    let tempAvailibilty = this.availabilityForm.value.daysAvailability;
    tempAvailibilty.forEach(element => {
      element.items.forEach(x => {
        if (x.startTime != null && x.endTime != null) dayAvailability.push(x);
      });
    });

    dayAvailability.forEach(a => {
      a.startTime = currentDate + " " + a.startTime;
      a.endTime = currentDate + " " + a.endTime;
    });

    this.availabilityForm.value.availability
      .filter(x => x.date != null && x.startTime != null && x.endTime != null)
      .forEach(element => {
        if (
          element.date != null &&
          element.startTime != null &&
          element.endTime != null
        ) {
          let currentVal =
            new Date(element.date).getFullYear() +
            "-" +
            (new Date(element.date).getMonth() + 1) +
            "-" +
            new Date(element.date).getDate();
          element.startTime = currentVal + " " + element.startTime;
          element.endTime = currentVal + " " + element.endTime;
          avl.push(element);
        }
      });

    this.availabilityForm.value.unavailability
      .filter(x => x.date != null && x.startTime != null && x.endTime != null)
      .forEach(element => {
        if (
          element.date != null &&
          element.startTime != null &&
          element.endTime != null
        ) {
          let currentVal =
            new Date(element.date).getFullYear() +
            "-" +
            (new Date(element.date).getMonth() + 1) +
            "-" +
            new Date(element.date).getDate();
          element.startTime = currentVal + " " + element.startTime;
          element.endTime = currentVal + " " + element.endTime;
          unAvl.push(element);
        }
      });

    this.existingDayAvailabilities.filter((x: StaffAvailabilityModel) => {
      if (dayAvailability.findIndex(y => y.id == x.id) == -1) {
        x.isDeleted = true;
        dayAvailability.push(x);
      }
    });

    this.existingAvailabilities.filter((x: StaffAvailabilityModel) => {
      if (avl.findIndex(y => y.id == x.id) == -1) {
        x.isDeleted = true;
        avl.push(x);
      }
    });

    this.existingUnaAvailabilities.filter((x: StaffAvailabilityModel) => {
      if (unAvl.findIndex(y => y.id == x.id) == -1) {
        x.isDeleted = true;
        unAvl.push(x);
      }
    });
    let data = {
      staffID: this.staffId,
      locationId: this.locationId,
      days: dayAvailability,
      available: avl,
      unavailable: unAvl
    };
    this.submitted = true;
    this.userService
      .saveStaffAvailability(data)
      .subscribe((response: ResponseModel) => {
        this.submitted = false;
        if (response != null) {
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            this.clearFormControls();
            this.GetStaffAvailabilityByLocation();
            this.commonService.isProfileUpdated(this.staffId);
          } else {
            this.notifier.notify("error", response.message);
          }
        }
      });
  }

  addDayItem() {
    let avlType = this.staffAvailabilityTypes.find(
      x => x.globalCodeName == "WeekDay"
    ).id;
    this.addItem(this.daysAvailability.length, [
      this.initializeStaffAvailabilityObject(this.getDayId("Sunday"), avlType),
      this.initializeStaffAvailabilityObject(this.getDayId("Monday"), avlType),
      this.initializeStaffAvailabilityObject(this.getDayId("Tuesday"), avlType),
      this.initializeStaffAvailabilityObject(
        this.getDayId("Wednesday"),
        avlType
      ),
      this.initializeStaffAvailabilityObject(
        this.getDayId("Thursday"),
        avlType
      ),
      this.initializeStaffAvailabilityObject(this.getDayId("Friday"), avlType),
      this.initializeStaffAvailabilityObject(this.getDayId("Saturday"), avlType)
    ]);
  }
  removeDayItem(index: number) {
    this.daysAvailability.removeAt(index);
  }
  addAvailabilityItem() {
    this.addAvlItem(
      this.initializeStaffAvailabilityObject(
        null,
        this.staffAvailabilityTypes.find(x => x.globalCodeName == "Available")
          .id
      )
    );
  }
  removeAvailabilityItem(index: number) {
    this.availability.removeAt(index);
  }
  addUnAvailabilityItem() {
    this.addUnAvlItem(
      this.initializeStaffAvailabilityObject(
        null,
        this.staffAvailabilityTypes.find(x => x.globalCodeName == "Unavailable")
          .id
      )
    );
  }
  removeUnAvailabilityItem(index: number) {
    this.unavailability.removeAt(index);
  }
  timeintervalselect() {
    
    //console.log(this.timeinterval);
    this.userService.updateProviderTimeInterval(this.timeinterval).subscribe((response:ResponseModel)=>{
      if (response != null) {
        if (response.statusCode == 200) {
          this.notifier.notify("success", "Slot time interval has been updated");
         
        } else {
          this.notifier.notify("error", response.message);
        }
      }
    })
  }

  getStaffDetail() {
    this.providerId=(this.staffId).toString();
      this.homeService.getProviderDetail(this.providerId).subscribe(res => {
        if (res.statusCode == 200) {
          
          this.userInfo = res.data;
          //this.bindStaffProfile();
          this.timeinterval=(res.data.timeInterval).toString();
        }
      });
    
  }
}
