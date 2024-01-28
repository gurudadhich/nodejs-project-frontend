import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { MatButton as MatButton } from '@angular/material/button';
import { MatProgressBar as MatProgressBar } from '@angular/material/progress-bar';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormControl,
} from '@angular/forms';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy  {
  signinSubscription: Subscription | undefined;
  user: any
  @ViewChild(MatProgressBar)
  progressBar!: MatProgressBar;
  @ViewChild(MatButton)
  submitButton!: MatButton;

  signinForm!: UntypedFormGroup;

  errorMsg = '';
  private _unsubscribeAll: Subject<any>;
  commonservice: any;

 constructor(
    private snack: MatSnackBar,
    // private ls: LocalStoreService,
    private apiservice: ApiService,
    private router: Router,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signinForm = new UntypedFormGroup({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', Validators.required),
    });
  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }

  login() {
    this.signinSubscription = this.apiservice.login(this.signinForm.value).subscribe((result: any) => {
      console.log("token result---", result)
      this.loginSuccess(result)
    },
      (error: any) => {
        this.loginError()
      }
    );
  }

  loginSuccess(result: { token: any; }) {
    const token = result.token
    localStorage.setItem('token', token);
    this.router.navigate(['/profile'], token);
    this.snack.open("Login Successful", 'OK', { duration: 5000 });
  }

  loginError() {
    this.snack.open("Email or Password is incorrect", 'OK', { duration: 5000 });
  }

}
