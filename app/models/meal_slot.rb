# frozen_string_literal: true

class MealSlot < ApplicationRecord
  belongs_to :weekly_plan
  belongs_to :recipe, optional: true

  MEAL_TYPES = %w[breakfast lunch dinner].freeze
  DAY_RANGE = (0..6).freeze

  validates :day_of_week, inclusion: { in: DAY_RANGE }
  validates :meal_type, inclusion: { in: MEAL_TYPES }
  validates :meal_type, uniqueness: { scope: [ :weekly_plan_id, :day_of_week ] }
end
