import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

import { visibility, flyInOut, expand } from '../animations/app.animation';

import { DishService } from '../services/dish.service';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ],
})
export class DishdetailComponent implements OnInit {

  dish!: Dish;
  errMess!: string;
  dishIds!: string[];
  prev!: string;
  next!: string;
  commentForm!: FormGroup;
  form!: FormGroup;
  comment!: Comment;
  dishcopy!: Dish;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author Name is  required.',
      'minlenght': 'Author Name must be at least 2 characteres.'
    },
    'comment':{
      'required': 'Comment is required.'
    }
  };

  @ViewChild('cform') commentFormDirective!:NgForm;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') public baseURL:HttpClient) {}


  ngOnInit(): void {
    this.dishservice.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any> errmess);
    this.createForm();
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: 0,
      comment: ['', Validators.required],
      author: ['', [Validators.required, Validators.minLength(2)]],
      date:''
    });
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(<any>this.comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = <any>null; this.dishcopy = <any>null; this.errMess = <any>errmess;});
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      rating: 0,
      comment: '',
      author: ''
    });
    this.commentFormDirective.resetForm();
  }

}
