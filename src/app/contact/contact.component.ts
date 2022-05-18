import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { flyInOut,expand } from '../animations/app.animation';

import { Feedback, ContactType } from '../shared/feedback';

import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
    animations: [
      flyInOut(),
      expand()
    ]
})

export class ContactComponent implements OnInit {

  errMess!: string;
  feedbackForm!: FormGroup;
  feedback!: Feedback;
  copyfeedback!: Feedback;
  feedbackEmpty!: Feedback;
  contactType = ContactType;
  statusEnviando: boolean = false;
  statusEnviado: boolean = false;

  @ViewChild('fform') feedbackFormDirective!:NgForm;


  constructor(private feedbackservice: FeedbackService,
              private fb: FormBuilder,
              @Inject('baseURL') public baseURL:HttpClient) {
              this.createForm();
  }

  ngOnInit(): void {
  }

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  createForm(): void{
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

   onValueChanged(data?: any) {
    // if (!this.feedbackForm) { return; }
    // const form = this.feedbackForm;
    // for (const field in this.formErrors) {
    //   if (this.formErrors.hasOwnProperty(field)) {
    //     // clear previous error message (if any)
    //     this.formErrors[field] = '';
    //     const control = form.get(field);
    //     if (control && control.dirty && !control.valid) {
    //       const messages = this.validationMessages[field];
    //       for (const key in control.errors) {
    //         if (control.errors.hasOwnProperty(key)) {
    //           this.formErrors[field] += messages[key] + ' ';
    //         }
    //       }
    //     }
    //   }
    // }
  }

  submitFeedback(){
    this.feedback = this.feedbackForm.value;
    this.feedbackservice.postFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedback = feedback;
      },
        errmess => { this.feedback = <any>null; this.errMess = <any>errmess;});
  }

  onSubmit(){
    this.statusEnviando = true;
    this.submitFeedback();
    setTimeout(()=>{
      this.statusEnviando = false;this.statusEnviado = true;}, 2000);
      setTimeout(() => {
        this.statusEnviado = false;}, 5000);
        this.feedbackForm.reset({
          firstname: '',
          lastname: '',
          telnum: 0,
          email: '',
          agree: false,
          contacttype: 'None',
          message: ''
        });
    this.feedbackFormDirective.resetForm();
  }


}
