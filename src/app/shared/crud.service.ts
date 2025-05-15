import { Injectable } from '@angular/core';
import { Student } from '../shared/student';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
@Injectable({
  providedIn: 'root',
})
export class CrudService {
  studentsRef: AngularFireList<any> | any = [];
  studentRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) {}
  // Create Student
  AddStudent(student: Student) {
    console.log(student)
    console.log(this.studentRef)
    this.studentsRef.push({
      name: student.name,
      email: student.email,
      mobileNumber: student.mobileNumber,
    });
  }
  // AddStudent(firstName:any, lastName:any, email:any, mobileNumber:any) {
  //   console.log({
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email,
  //     mobileNumber: mobileNumber,
  //   })
  //   this.studentsRef.push({
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email,
  //     mobileNumber: mobileNumber,
  //   });
  // }
  // Fetch Single Student Object
  GetStudent(id: string) {
    this.studentRef = this.db.object('students-list/' + id);
    return this.studentRef;
  }
  // Fetch Students List
  GetStudentsList() {
    this.studentsRef = this.db.list('students-list');
    return this.studentsRef;
  }
  // Update Student Object
  UpdateStudent(student: Student) {
    this.studentRef.update({
      // firstName: student.firstName,
      name: student.name,
      email: student.email,
      mobileNumber: student.mobileNumber,
    });
  }
  // Delete Student Object
  DeleteStudent(id: string) {
    this.studentRef = this.db.object('students-list/' + id);
    this.studentRef.remove();
  }
}
