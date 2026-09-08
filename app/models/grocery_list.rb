# frozen_string_literal: true

class GroceryList < ApplicationRecord
  belongs_to :weekly_plan
  has_many :grocery_list_items, dependent: :destroy
end
