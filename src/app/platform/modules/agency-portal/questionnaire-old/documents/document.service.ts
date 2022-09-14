import { Injectable } from '@angular/core';
import { CommonService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterModel } from '../../../core/modals/common-model';
import { DocumentModel, CategoryModel, CategoryCodeModel, SectionModel, SectionItemModel, PatientDocumentModel } from './document.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    checkIfExistUrl = '/CheckIfRecordExists';
    //document
    saveDocumentURL = 'Questionnaire/SaveDocument';
    deleteDocumentURL = 'Questionnaire/DeleteDocument';
    getDocumentByIdURL = 'Questionnaire/GetDocumentById';
    getAllDocumentURL = 'Questionnaire/GetDocuments';
    //category
    saveCategoryURL = 'Questionnaire/SaveCategory';
    deleteCategoryURL = 'Questionnaire/DeleteCategory';
    getCategoryByIdURL = 'Questionnaire/GetCategoryById';
    getAllCategoryURL = 'Questionnaire/GetCategories';
    //category code
    saveCategoryCodeURL = 'Questionnaire/SaveCategoryCodes';
    deleteCategoryCodeURL = 'Questionnaire/DeleteCategoryCode';
    getCategoryCodeByIdURL = 'Questionnaire/GetCategoryCodeById';
    getAllCategoryCodeURL = 'Questionnaire/GetCategoryCodes';
    //section
    saveSectionURL = 'Questionnaire/SaveSection';
    deleteSectionURL = 'Questionnaire/DeleteSection';
    getSectionByIdURL = 'Questionnaire/GetSectionById';
    getAllSectionURL = 'Questionnaire/GetSections';
    //section items
    saveSectionItemsURL = 'Questionnaire/SaveSectionItem';
    getSectionItemsByIdURL = 'Questionnaire/GetSectionItemById';
    getAllSectionItemsURL = 'Questionnaire/GetSectionItems';
    getSectionItemDDValuesURL = 'Questionnaire/GetSectionItemDDValues';
    // Patient Document Answer
    savePatientDocumentAnswerURL = 'Questionnaire/SavePatientDocumentAnswer';
    getPatientDocumentAnswerURL = 'Questionnaire/GetPatientDocumentAnswer';
    // Assign Document to Patient
    assignDocumentToPatientURL = 'Questionnaire/AssignDocumentToPatient';
    getPatientDocumentURL = 'Questionnaire/GetPatientDocuments';
    getPatientDocumentByIdURL = 'Questionnaire/GetPatientDocumentById';
    updateStatusURL = 'Questionnaire/UpdateStatus';

    constructor(private commonService: CommonService) { }

    getMasterData(masterData: any): Observable<any> {
        return this.commonService.post('api/MasterData/MasterDataByName', masterData);
    }
    getPatientMasterForDropdown(): Observable<CategoryModel> {
        return this.commonService.getAll('api/PatientAppointments/GetStaffAndPatientByLocation?locationIds=0&permissionKey=%27%27&isActiveCheckRequired=NO', {})
    }
    validate(postData: any) {
        return this.commonService.post(this.checkIfExistUrl, postData);
    }
    //document
    saveDocuments(modalData: DocumentModel): Observable<DocumentModel> {
        return this.commonService.post(this.saveDocumentURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deleteDocuments(id: number) {
        return this.commonService.patch(`${this.deleteDocumentURL}?id=${id}`, {})
    }
    getDocumentsById(id: number): Observable<DocumentModel> {
        let url = `${this.getDocumentByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    getAllDocuments(filterModal: FilterModel) {
        let url = this.getAllDocumentURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    //category
    saveCategory(modalData: CategoryModel): Observable<CategoryModel> {
        return this.commonService.post(this.saveCategoryURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deleteCategory(id: number) {
        return this.commonService.patch(`${this.deleteCategoryURL}?id=${id}`, {})
    }
    getCategoryById(id: number): Observable<CategoryModel> {
        let url = `${this.getCategoryByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    getAllCategory(filterModal: FilterModel) {
        let url = this.getAllCategoryURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + +filterModal.pageSize + '&SearchText=' + filterModal.searchText + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    //category codes
    saveCategoryCode(modalData: CategoryCodeModel): Observable<CategoryCodeModel> {
        return this.commonService.post(this.saveCategoryCodeURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deleteCategoryCode(id: number) {
        return this.commonService.patch(`${this.deleteCategoryCodeURL}?id=${id}`, {})
    }
    getCategoryCodeById(id: number): Observable<CategoryCodeModel> {
        let url = `${this.getCategoryCodeByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    getAllCategoryCode(filterModal: FilterModel, categoryId: number) {
        let url = this.getAllCategoryCodeURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&SearchText=' + filterModal.searchText + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&CategoryId=' + categoryId;
        return this.commonService.getAll(url, {});
    }
    //section
    saveSection(modalData: SectionModel): Observable<SectionModel> {
        return this.commonService.post(this.saveSectionURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    deleteSection(id: number) {
        return this.commonService.patch(`${this.deleteSectionURL}?id=${id}`, {})
    }
    getSectionById(id: number): Observable<SectionModel> {
        let url = `${this.getSectionByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    getAllSection(filterModal: FilterModel, documentId: number) {
        let url = this.getAllSectionURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&DocumentId=' + documentId;
        return this.commonService.getAll(url, {});
    }
    //section item
    saveSectionItem(modalData: SectionItemModel): Observable<SectionItemModel> {
        return this.commonService.post(this.saveSectionItemsURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    getSectionItemById(id: number): Observable<SectionItemModel> {
        let url = `${this.getSectionItemsByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    getAllSectionItem(filterModal: FilterModel, documentId: number) {
        let url = this.getAllSectionItemsURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder + '&DocumentId=' + documentId;
        return this.commonService.getAll(url, {});
    }
    getSectionItemDDValues(documentId: number): Observable<SectionItemModel> {
        let url = `${this.getSectionItemDDValuesURL}?DocumentId=${documentId}`;
        return this.commonService.getById(url, {})
    }
    getAllSectionItemForDocumentModal(documentId: number) {
        let url = this.getAllSectionItemsURL + '?DocumentId=' + documentId;
        return this.commonService.getAll(url, {});
    }
    //document answer
    savePatientDocumentAnswer(modalData: SectionItemModel): Observable<SectionItemModel> {
        return this.commonService.post(this.savePatientDocumentAnswerURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    getAllPatientDocuments(filterModal: FilterModel) {
        let url = this.getPatientDocumentURL + '?pageNumber=' + filterModal.pageNumber + '&pageSize=' + filterModal.pageSize + '&sortColumn=' + filterModal.sortColumn + '&sortOrder=' + filterModal.sortOrder;
        return this.commonService.getAll(url, {});
    }
    getPatientDocumentById(id: number): Observable<PatientDocumentModel> {
        let url = `${this.getPatientDocumentByIdURL}?id=${id}`;
        return this.commonService.getById(url, {})
    }
    assignDocumentToPatient(modalData: PatientDocumentModel): Observable<PatientDocumentModel> {
        return this.commonService.post(this.assignDocumentToPatientURL, modalData)
            .pipe(map((response: any) => {
                let data = response;
                return data;
            }))
    }
    getPatientDocumentAnswer(documentId: number, patientId: number): Observable<PatientDocumentModel> {
        let url = `${this.getPatientDocumentAnswerURL}?DocumentId=${documentId}&PatientId=${patientId}`;
        return this.commonService.getById(url, {})
    }
}
