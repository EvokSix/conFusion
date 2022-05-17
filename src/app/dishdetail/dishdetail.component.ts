import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

  dish!: Dish;
  errMess!: string;
  dishIds!: string[];
  prev!: string;
  next!: string;
  commentForm!: FormGroup;
  form!: FormGroup;
  comment!: Comment[];

  @ViewChild('fform') commentFormDirective!:NgForm;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') public baseURL:HttpClient) {}


  ngOnInit(): void {
    this.dishservice.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
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
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      data:''
    });
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.dish.comments.push.apply(this.comment);
    this.commentForm.reset({
      rating: 0,
      comment: '',
      firstname: '',
      data: ''
    });
    this.commentFormDirective.resetForm();
  }

}
