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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {

  user: any
  signupSubscription: Subscription | undefined;

  @ViewChild(MatProgressBar)
  progressBar!: MatProgressBar;
  @ViewChild(MatButton)
  submitButton!: MatButton;

  signupForm!: UntypedFormGroup;

  errorMsg = '';
  private _unsubscribeAll: Subject<any>;
  commonservice: any;

  constructor(
    private snack: MatSnackBar,
    private apiservice: ApiService,
    private router: Router,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signupForm = new UntypedFormGroup({
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

  signup() {
    this.signupSubscription = this.apiservice.signup(this.signupForm.value).subscribe((result: any) => {
      this.snack.open("User registered Successfully. Please Login", 'OK', { duration: 5000 });
    },
      (error: any) => {
        this.signupError(error)
      }
    );
  }

  signupError(result: { error: any; }) {
    if (result.error.user.username[0]) {
      this.snack.open(result.error.user.username[0], '', { duration: 5000 });
    } else {
      this.snack.open("Something went wrong. Please try with another credential", '', { duration: 5000 });
    }
  }
}
