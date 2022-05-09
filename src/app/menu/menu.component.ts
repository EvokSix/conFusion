import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  selectedDish!: Dish;

  constructor() { }

  ngOnInit(): void {
  }

  dishes: Dish[] = DISHES;

  onSelect( dish: Dish ){
    this.selectedDish = dish;
  }

}
