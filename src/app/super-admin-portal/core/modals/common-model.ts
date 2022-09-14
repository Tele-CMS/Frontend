export class FilterModel
{
    pageNumber:number=1;
    pageSize:number=5;
    sortColumn:string='';
    sortOrder:string='';
    searchText:string=''

}

export class ResponseModel
{
    data:any=[];
    statusCode:number;
    message:string=''
    appError:string=''
    meta : Metadata
}
export class Metadata
{
    totalRecords:number
    currentPage:number
    pageSize :number
    defaultPageSize :number
    totalPages :number
    pageSizeOptions:number[] = []
}

