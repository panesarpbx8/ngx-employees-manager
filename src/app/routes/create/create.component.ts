import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Employee } from 'src/app/model/employee.model';
import { CreateEmployee } from 'src/app/store/employees.actions';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {

  employee: Employee = new Employee();
  error: string = null;
  
  constructor(
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit(): void { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        document.getElementsByTagName('section')[0].classList.remove('fadeInUp');
        document.getElementsByTagName('section')[0].classList.add('fadeOutDown');
      }
    })
  }

  async create(): Promise<void> {
    if (this.validate(this.employee)) {
      this.store.dispatch(new CreateEmployee(this.employee));
      await this.home();
    } else {
      this.error = 'ERROR! all fields are required';
    }
  }
  
  async home(): Promise<void> {
    document.querySelector('section').classList.add('fadeOutDown');
    await this.router.navigate(['home']);
  }
  
  parseDate(dateString: string): Date {
    if (dateString)
      return new Date(dateString);
    return null;
  }

  calculateAge(dob: Date): number {
    const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2425;
    return Math.floor((new Date().getTime() - dob.getTime()) / MS_PER_YEAR);
  }

  validate(employee: Employee): boolean {
    let hasErrors: boolean = true;
    for (const field in employee) {
      if (field) hasErrors = false;
    }
    return hasErrors ? false : true;
  }

}
