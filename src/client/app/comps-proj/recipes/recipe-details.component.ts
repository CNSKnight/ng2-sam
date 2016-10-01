// ```
// recipes.component.js
// (c) 2016 David Newman
// blackshuriken@hotmail.com
// recipes.component.js may be freely distributed under the MIT license
// ```

// # Recipes Component

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges
} from '@angular/core';
import { recipeModel, RecipeI } from './services/recipe.store';
// import { AppStore } from '../app/services/app.store';

import {padStart} from "lodash";

declare var Materialize: { updateTextFields: Function };

@Component({
  moduleId: module.id,
  selector: 'recipe-detail',
  templateUrl: 'recipe-details.html',
  // directives: [Rating]
})
export class RecipeDetailsComponent implements OnInit, OnChanges {
  selectedRecipeR: RecipeI;
  rModel: RecipeI;
  originalTitle: string;
  recipe: RecipeI;
  test: RecipeI;

  // Assign our `recipe` to a locally scoped property
  // Perform additional logic on every update via ES6 setter
  // Create a copy of `_recipe` and assign it to `this.selectedRecipe`
  // to which we will use to bind our form
  // @Input('test') selectedRecipeR: RecipeI;
  @Input('selectedRecipeR')
  set _recipe(recipe: RecipeI) {
    recipe && (this.originalTitle = recipe.title);
    this.recipe = Object.assign(_.cloneDeep(this.rModel), recipe || {});
  }

  // Allow the user to save/delete a `recipe or cancel the
  // operation. Flow events up from here.
  @Output() saveUA = new EventEmitter();
  @Output() cancelUA = new EventEmitter();

  constructor() {
    this.rModel = recipeModel;
    // this.title = new Control('', Validators.required);
    // this.rdform = builder.group({
    //   title: this.title
    // });
  }

  ngOnInit() {
    // this.rdForm = this.builder.group({
    //   title: [],
    //   ingredient: this.builder.group({
    //     qty: [],
    //     unit: [],
    //     name: []
    //   })
    // });

  }

  ngOnChanges(changed: any) {
  }

  ngAfterViewChecked() {
    Materialize.updateTextFields();
  }

  // get textarea ID
  getTAID(id: number, idx: number) {
    let label = (id !== undefined ? id : 'newID');
    let count = (idx + 1);
    return label.toString().concat('-rTA-', count.toString());
  }

  getTALabel(idx: number) {
    return 'Step #'.concat(_.padStart((idx + 1).toString(), 2, '0'));
  }

  // Whenever the user needs to add a new `tag`, push an
  // empty `tag` object onto the `tags` array on the
  // `selectedRecipe`
  newTag() {
    // Check to see if the `tags` array exists before
    // attempting to push a `tag` to it
    this.recipe.tags || (this.recipe.tags = []);
    let tag = _.clone(this.rModel.tags[0]);
    tag.priority = this.recipe.tags.length;
    this.recipe.tags.push(tag);
  }

  // Whenever the user needs to add a new `ingredient`, push an
  // empty `ingredient` object to the `ingredient` array on the
  // `selectedRecipe`
  newIngredient() {
    // Check to see if the `ingredients` array exists before
    // attempting to push an `ingredient` to it
    if (!this.recipe.ingredients)
      this.recipe.ingredients = [];

    this.recipe.ingredients.push(_.clone(this.rModel.ingredients[0]));
  }

  // Whenever the user needs to add a new `method`, push an
  // empty `method` object to the `method` array on the
  // `selectedRecipe`
  newMethod() {
    // Check to see if the `method` array exists before
    // attempting to push a `method` to it
    if (!this.recipe.method)
      this.recipe.method = [];

    this.recipe.method.push(_.clone(this.rModel.method[0]));
  }

  onChangeRate(value: number) {
    // Set the value of the selectUA recipe's rating to the
    // value passed up from the `rating` component
    this.recipe.rating = value;
  }

  deleteTag(idx: number) {
    this.recipe.tags.splice(idx, 1);
  }

  deleteIngredient(idx: number) {
    this.recipe.ingredients.splice(idx, 1);
  }

  deleteMethod(idx: number) {
    this.recipe.method.splice(idx, 1);
  }

  orderIngredients() {
    // @todo
  }

  orderSteps() {
    // @todo
  }

  orderTags() {
    // @todo
  }

  /*
  * @todo remove empty or blacklisted tags or blacklisted chars
  */
  onSubmit(recipe: RecipeI, next: { emit: Function }) {
    // validate submitted tags
    if (recipe.tags && recipe.tags.length) {
      let fTags = recipe.tags.filter((tag, idx, ary) => {
        return !!tag.text.trim().length;
      });

      recipe.tags = fTags;
    }

    next && next.emit && next.emit(recipe);
  }

}
