// ```
// recipe-details.component.js
// (c) 2016 Codename: Steeve Knight
// CNSKnight@dharmiWeb.net
// ```

// # Recipe Detail Component

import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
// import { AppStore } from '../app/services/app.store';
import { AppStoreI } from '../../frameworks/app.framework/index';

import { RecipeI } from './services/recipe.store';
import { RecipeService } from './services/recipe.service';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeCardsComponent } from './recipe-cards.component';
import { RecipeDetailsComponent } from './recipe-details.component';

@Component({
  moduleId: module.id,
  selector: 'recipes',
  providers: [],
  templateUrl: 'recipes.html',
  directives: [RecipeListComponent, RecipeCardsComponent, RecipeDetailsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['shared/recipes.component.css'],
  encapsulation: ViewEncapsulation.None
})
// snippets: https://marketplace.visualstudio.com/items?itemName=johnpapa.@angular
export class RecipesComponent implements OnInit, OnChanges {
  recipesR: Observable<Array<RecipeI>>;

  selectedRecipeR: Observable<RecipeI>;

  showCards: boolean = false;

  _id: number = null;

  constructor(private recipesService: RecipeService, // so that we can loadRecipes below
              private store: Store<AppStoreI>) {
    // this.showCards = false;
  
    // Bind to the subscribed `recipesR` ~observable~ behavior subject from the store
    this.recipesR = recipesService.recipesR;
    // this.recipesR = store.select('recipesR');

    // Binds/sets up the unsubscribed `selectedRecipe` observable from the store,
    // for our subcomponent(s)
    this.selectedRecipeR = store.select('selectedRecipeR');

    // DEBUG
    console.log(this.selectedRecipeR);
    this.selectedRecipeR.subscribe(v => console.log('selectedRecipeR: ', v));

    // `recipeService.loadRecipes` dispatches the `ADD_RECIPES` event
    // to our store which in turn updates the `recipesS` collection
  }

  ngOnInit() {
    if (! this.recipesService.loadRecipe()) {
      this.loadRecipes();
  }

  ngOnChanges(changed:any) {
  }

  toggle(what:string) {
    if (what == 'cards') {
      this.showCards = (this.showCards ? false : true);
    }
  }

  selectRecipe(recipe:RecipeI) {
    this.store.dispatch({
      type: 'SELECT_RECIPE',
      payload: recipe
    });
  }

  deleteRecipe(recipe:RecipeI) {
    this.recipesService.deleteRecipe(recipe);
  }

  resetRecipe() {
    let emptyRecipe:RecipeI = {
      _id: null,
      creator: '',
      description: '',
      ingredients: [],
      method: [],
      published: false,
      rating: null,
      subTitle: '',
      tags: [],
      title: ''
    };

    this.store.dispatch({
      type: 'SELECT_RECIPE',
      payload: emptyRecipe
    });
  }

  saveRecipe(recipe:RecipeI) {
    this.recipesService.saveRecipe(recipe);
    this.resetRecipe();
  }
}