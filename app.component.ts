import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatInput, MatPaginator } from '@angular/material';
import { DatePipe } from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { Auditdashboard } from './models/auditdashboard';


const ELEMENT_DATA: Auditdashboard[] = [
  {
    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
     logTime: new Date(2002, 2, 24)
  },
  {

    entID: 'U765351',
    queueName: '1CBR.SWIFT.DATAGRAM',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2020, 2, 20)
     },
  {

    entID: 'U765351',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2021, 2, 24)
   },
  {

    entID: 'U765351',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(1991, 2, 24)
  },
  {

    entID: 'U765353',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWX',
    messageID: '414HIIOGH7878490',
    logTime: new Date(1994, 1, 2)
    },
  {

    entID: 'U765389',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USW1',
    messageID: '414HIIOGHHG67777',
    logTime: new Date(2014, 9, 15)
     },
  {

    entID: 'U765788',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4U89F',
    messageID: '414HIIOGHHG6784945',
    logTime: new Date(2009, 2, 11)
    },
  {

    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2012, 6, 17)
      },
  {

    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2028, 12, 20)
    },
  {

    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2002, 2, 24)
   },
  {

    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date(2019, 2, 2)
   },
  {

    entID: 'U765398',
    queueName: '1BFD.SWIFT.REQUEST',
    queueManager: '1L4USWF',
    messageID: '414HIIOGHHG678490',
    logTime: new Date()
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('fromdate', { read: MatInput,static: false}) fromdate: MatInput;
  @ViewChild('todate', { read: MatInput,static: false}) todate: MatInput;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSourcePaginator: MatTableDataSource<Auditdashboard>;
  @ViewChild('TABLE',{static: true})
  table: ElementRef;
  displayedColumns: string[] = ['entID', 'queueName', 'queueManager', 'messageID', 'logTime'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  pipe: DatePipe;
  pageSize = 5;

filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),

});
get fromDate() { return this.filterForm.get('fromDate').value; }
get toDate() { return this.filterForm.get('toDate').value; }
get toRowString() { return this.filterForm.get('rowfilter').value; }

  constructor() {
    console.log("constructor calling.." + this.fromDate + "--" + this.toDate);
  }
  ExportTOExcel() {
    const skipData = this.paginator.pageSize * this.paginator.pageIndex;
    const pagedData = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort).filter((u, i) => i >= skipData)
    .filter((u, i: number) => i < this.paginator.pageSize);
    const workSheet = XLSX.utils.json_to_sheet(pagedData);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'export.xlsx');
}
  reset() {
  this.fromdate.value = '';
  this.todate.value= '';
  this.dataSource.filter = '';
  }
 ngOnInit(): void {
    this.dataSourcePaginator = new MatTableDataSource<Auditdashboard>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort=this.sort;
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      console.log(data);
      const filterObject = JSON.parse(filter);
      if(filterObject.fromDate){
      return Math.round(+new Date(data.logTime)/1000)  >= filterObject.fromDate
       && Math.round(+new Date(data.logTime)/1000) <= filterObject.toDate;
      }
      else {
        return data.queueName.toLowerCase().indexOf(filterObject.queueName) !== -1 ||
          data.queueManager.toLowerCase().indexOf(filterObject.queueName) !== -1 ||
          data.entID.toLowerCase().indexOf(filterObject.queueName) !== -1 ||
          data.messageID.toLowerCase().indexOf(filterObject.queueName) !== -1 ||
          Math.round(+new Date(data.logTime)/1000) === Math.round(+new Date(filterObject.queueName)/1000);
      }
  };
  }
  applyCalenderFilter(){
    console.log("from date" + this.fromDate);
    console.log("to date" + this.toDate);
    if(this.fromDate!=null && this.toDate!=null){
    let toDate = Math.round(+new Date(this.toDate)/1000);
    let fromDate = Math.round(+new Date(this.fromDate)/1000);
    this.dataSource.filter = JSON.stringify({fromDate, toDate});
    }
};
applyFilterSearchData(filterValue: string) {
   filterValue = filterValue.trim(); 
   filterValue = filterValue.toLowerCase();
   this.dataSource.filter = JSON.stringify({queueName:filterValue});
 }
}
