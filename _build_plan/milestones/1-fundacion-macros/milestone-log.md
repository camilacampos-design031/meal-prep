# Milestone 1 — Fundación + Macros

## What's new in the app

- **Onboarding de macros** — Nuevos usuarios son redirigidos automáticamente a una pantalla de configuración de macros después de registrarse. Ahí ingresan sus metas diarias de proteína, grasa y carbohidratos, y las calorías se calculan y muestran en tiempo real mientras escriben.
- **Barra visual de macros** — Una barra segmentada de colores muestra el porcentaje de calorías que aporta cada macro (proteína = azul, grasa = amarillo, carbohidratos = rojo), con etiquetas de porcentaje abajo.
- **Sección de macros en Ajustes** — Los usuarios existentes pueden editar sus macros en cualquier momento desde `/settings`. Los valores guardados se pre-cargan en el formulario.
- **Redirección automática** — Cualquier usuario autenticado sin macros configurados es redirigido a `/onboarding` antes de acceder a cualquier parte del app.
- **Branding actualizado** — La navegación lateral ahora muestra "Meal Prep" en lugar del nombre de plantilla "Build New".

---

## What was built

### Database migrations (all 9 domain models)

| File | Table |
|---|---|
| `db/migrate/20260908000001_create_nutrition_goals.rb` | `nutrition_goals` |
| `db/migrate/20260908000002_create_recipes.rb` | `recipes` |
| `db/migrate/20260908000003_create_recipe_ingredients.rb` | `recipe_ingredients` |
| `db/migrate/20260908000004_create_weekly_plans.rb` | `weekly_plans` |
| `db/migrate/20260908000005_create_meal_slots.rb` | `meal_slots` |
| `db/migrate/20260908000006_create_saved_foods.rb` | `saved_foods` |
| `db/migrate/20260908000007_create_food_logs.rb` | `food_logs` |
| `db/migrate/20260908000008_create_grocery_lists.rb` | `grocery_lists` |
| `db/migrate/20260908000009_create_grocery_list_items.rb` | `grocery_list_items` |

### Models created

- `app/models/nutrition_goal.rb` — with `before_save :compute_calories` callback (protein×4 + fat×9 + carbs×4)
- `app/models/recipe.rb`
- `app/models/recipe_ingredient.rb`
- `app/models/weekly_plan.rb`
- `app/models/meal_slot.rb`
- `app/models/saved_food.rb`
- `app/models/food_log.rb`
- `app/models/grocery_list.rb`
- `app/models/grocery_list_item.rb`

### Controllers created

- `app/controllers/onboarding_controller.rb` — `show` + `create`; skips `require_onboarding`
- `app/controllers/nutrition_goals_controller.rb` — `update` (used by Settings page)

### Models updated

- `app/models/user.rb` — added `has_one :nutrition_goal`, `has_many :recipes`, `has_many :weekly_plans`, `has_many :food_logs`, `has_many :saved_foods`

### Controllers updated

- `app/controllers/application_controller.rb` — added `before_action :require_onboarding` and `nutrition_goal` to `inertia_share`
- `app/controllers/settings_controller.rb` — passes `nutrition_goal` as an Inertia prop

### Routes added

```ruby
get  "onboarding", to: "onboarding#show"
post "onboarding", to: "onboarding#create"
resource :nutrition_goal, only: %i[update]
```

### Frontend created

- `app/javascript/pages/Onboarding.tsx` — onboarding form using `AuthShell`
- `app/frontend/components/MacroBreakdownBar.tsx` — reusable segmented bar component

### Frontend updated

- `app/javascript/pages/Settings.tsx` — macro settings section (replaced placeholder)
- `app/frontend/types/inertia.ts` — added `NutritionGoal` type to `SharedProps`
- `app/frontend/components/MainNav.tsx` — `BRAND = "Meal Prep"`

### Tests created

- `test/models/nutrition_goal_test.rb` — calorie callback, presence validations
- `test/controllers/onboarding_controller_test.rb` — full flow including redirect check
- `test/controllers/nutrition_goals_controller_test.rb` — update happy path + error case
- `test/fixtures/nutrition_goals.yml`

### Tests updated

- `test/controllers/registrations_controller_test.rb` — updated signup flow test to expect redirect to `/onboarding`

---

## Decisions made during implementation

1. **Params format** — Inertia's `useForm` posts data as flat top-level params (not nested). The controllers use `params.permit(:protein_grams, :fat_grams, :carbs_grams)` instead of a nested `params.expect(nutrition_goal: [...])`.

2. **`calories` stored vs. computed** — `calories` is stored in the database and recomputed via `before_save`. This avoids computed-column complexity and keeps queries simple.

3. **`require_onboarding` as a `before_action`** — Applied globally in `ApplicationController` so it catches direct URL access (not just post-signup). `OnboardingController` skips it explicitly.

4. **All 9 migrations in M1** — The PRD specifies creating all domain migrations in M1 even though only `NutritionGoal` has UI in this milestone. Later milestone migrations won't need to exist.

5. **MacroBreakdownBar placeholder state** — When no macros are entered (total = 0 calories), the bar shows equal thirds (33/34/33) as a visual placeholder; labels show "—" for percentages.

---

## What milestone 2 needs to know

- `nutrition_goals` table and model are fully set up. `Current.user.nutrition_goal` is the standard access pattern.
- `recipes` and `recipe_ingredients` tables exist but have no UI or controller. Milestone 2 should create `RecipesController` and the corresponding Inertia pages.
- `nutrition_goal` is shared via `inertia_share` in `ApplicationController`, so all pages receive it automatically as `props.nutrition_goal`.
- The USDA FoodData Central integration (for ingredient search) is an external API — milestone 2 will need to add an `FOOD_DATA_CENTRAL_API_KEY` env var.

---

## Deviations from the PRD

None. All items in the M1 scope were delivered as specified.
