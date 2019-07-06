import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

import { API, graphqlOperation } from 'aws-amplify';
import { listRestaurants } from '../graphql/queries';
import { Restaurant } from './types/restaurant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  restaurants: Array<Restaurant>;
  constructor(public amplify: AmplifyService) {
    amplify.auth().currentAuthenticatedUser().then(console.log)
  }
  async ngOnInit() {
    var response = await API.graphql(graphqlOperation(listRestaurants))
    this.restaurants = (response as any).data.listRestaurants.items;
  }
}
