# Milestone 2 — Recipe Library

## What's new in the app

- **Recipe library** — Users can browse all their recipes at `/recipes`, with a live search filter that narrows results by name as they type.
- **Create recipe** — A full-page form lets users name their recipe, set servings, add optional prep time, description, and instructions, and build a dynamic ingredient list.
- **USDA ingredient search** — While typing in any ingredient field, the app searches USDA FoodData Central in real time and shows matching foods. Selecting one auto-fills macros based on the quantity entered (in grams). For non-gram units or missing API key, users can type macros manually.
- **Live macro preview** — As ingredients are added or adjusted, the form shows real-time per-serving calorie and macro totals with the color-coded breakdown bar.
- **Recipe detail page** — Clicking a recipe shows a full detail view with an ingredient table and the per-serving macro breakdown.
- **Edit and delete** — Recipes can be edited (all fields + ingredients rebuilt atomically) or deleted from the detail page.
- **Recipes in the sidebar** — A "Recipes" link with a chef hat icon now appears in the main navigation.

---

## What was built

### New backend

| File | Purpose |
|---|---|
| `app/services/usda_food_search.rb` | Calls USDA FoodData Central API, normalizes results to per-100g macro hashes |
| `app/controllers/foods_controller.rb` | `GET /foods/search?q=...` — renders JSON (raw fetch endpoint, not Inertia) |
| `app/controllers/recipes_controller.rb` | Full CRUD: `index`, `show`, `new`, `create`, `edit`, `update`, `destroy` |

### Models updated

- `app/models/recipe.rb` — added `#total_macros` and `#per_serving_macros` instance methods (computed from loaded ingredients, no extra DB columns)

### Routes added

```ruby
resources :recipes
get "foods/search", to: "foods#search"
```

### New frontend

| File | Purpose |
|---|---|
| `app/frontend/components/IngredientRow.tsx` | Single ingredient row with debounced USDA search, quantity/unit inputs, macro fields |
| `app/frontend/components/RecipeForm.tsx` | Shared form used by both New and Edit pages |
| `app/javascript/pages/Recipes/Index.tsx` | Recipe library list with client-side name filter |
| `app/javascript/pages/Recipes/New.tsx` | Create form page |
| `app/javascript/pages/Recipes/Edit.tsx` | Edit form page |
| `app/javascript/pages/Recipes/Show.tsx` | Recipe detail with ingredient table and macro bar |

### Updated frontend

- `app/frontend/types/inertia.ts` — added `Recipe`, `RecipeIngredient`, `RecipeMacros` types
- `app/frontend/components/MainNav.tsx` — added "Recipes" nav item with `ChefHat` icon

### Tests created

- `test/controllers/recipes_controller_test.rb` — 12 tests covering full CRUD + authorization
- `test/fixtures/recipes.yml`
- `test/fixtures/recipe_ingredients.yml`

---

## Decisions made during implementation

1. **Ingredients submitted as a flat JSON array** — Inertia's `useForm` sends `ingredients` as a top-level array of objects. Controller uses `params.permit(ingredients: %i[...])` (not nested `params.expect`). Matches M1's established params pattern.

2. **Atomic ingredient replace on update** — `destroy_all` + rebuild inside a transaction. Simpler than a diff/patch approach; ingredients are cheap to recreate and the form always sends the full current list.

3. **Macros computed at read time** — No aggregate columns on `recipes`. `per_serving_macros` iterates over the loaded `recipe_ingredients` association. The `index` action uses `includes(:recipe_ingredients)` to avoid N+1.

4. **USDA key graceful fallback** — If `FOOD_DATA_CENTRAL_API_KEY` is not set, `UsdaFoodSearch.search` returns `[]` immediately. The ingredient row stays in manual-entry mode — no crash, no error message.

5. **Auto-calculate only for unit = "g"** — When a USDA result is selected, macros recalculate as quantity changes only when the unit is `"g"` (direct 100g proportionality). For oz, cups, etc., the USDA values are pre-filled but the user can adjust manually.

6. **`errors.base` via shared props** — Inertia's `useForm` types `form.errors` against the form's own data keys. The `base` error from the controller goes through the global `inertia: { errors: { base: "..." } }` flash and is read from `usePage().props.errors.base` in the form component.

---

## What milestone 3 needs to know

- `recipes` and `recipe_ingredients` are fully functional. `Current.user.recipes.includes(:recipe_ingredients)` is the standard access pattern.
- `Recipe#per_serving_macros` returns `{ calories, protein_grams, fat_grams, carbs_grams }` — use this when displaying a recipe's nutritional info in the weekly planner.
- `weekly_plans` and `meal_slots` tables exist from M1 but have no UI or controller. Milestone 3 should create `WeeklyPlansController` and `MealSlotsController`.
- The `MealSlot` model's `recipe_id` is nullable — a slot can exist without an assigned recipe. M3 should handle this case in the UI.

---

## Deviations from the PRD

None. All items in the M2 scope were delivered as specified. The USDA ingredient search, recipe CRUD, and library with name search are all implemented.
