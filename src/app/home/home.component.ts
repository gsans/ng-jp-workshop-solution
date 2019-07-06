import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { API, graphqlOperation } from 'aws-amplify';
import { listRestaurants } from '../../graphql/queries';
import { Restaurant } from './../types/restaurant';

import * as Observable from 'zen-observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createRestaurant } from '../../graphql/mutations';
import { onCreateRestaurant } from '../../graphql/subscriptions';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'amplify-app';
  restaurants: Array<Restaurant>;
  loading = true;
  public createForm: FormGroup;

  constructor(
    public amplify: AmplifyService,
    private fb: FormBuilder
  ) {
    amplify.auth().currentAuthenticatedUser().then(console.log)
  }
  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    this.loading = true;
    var response = await API.graphql(graphqlOperation(listRestaurants));
    this.restaurants = (response as any).data.listRestaurants.items;
    this.loading = false;

    //Subscribe to changes
    var subscription = API.graphql(
      graphqlOperation(onCreateRestaurant)
    ) as Observable<object>;
    
    subscription.subscribe({
      next: (sourceData) => {
        const newRestaurant = (sourceData as any).value.data.onCreateRestaurant
        this.restaurants = [newRestaurant, ...this.restaurants];
      }
    });
  }
  
  public async onCreate(restaurant: any) {
    try {
      await API.graphql(graphqlOperation(createRestaurant, {
        input: restaurant
      }));
      console.log('item created!');
      //this.restaurants = [restaurant, ...this.restaurants];
      this.createForm.reset();
    } 
    catch (e) {
      console.log('error creating restaurant...', e);
    }
  }
}