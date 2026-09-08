# frozen_string_literal: true

class WeeklyPlan < ApplicationRecord
  belongs_to :user
  has_many :meal_slots, dependent: :destroy
  has_one :grocery_list, dependent: :destroy

  validates :week_start_date, presence: true
  validates :week_start_date, uniqueness: { scope: :user_id }
end
