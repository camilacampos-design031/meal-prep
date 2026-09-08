# frozen_string_literal: true

class GroceryListItem < ApplicationRecord
  belongs_to :grocery_list

  validates :ingredient_name, :unit, presence: true
  validates :total_quantity, numericality: { greater_than: 0 }
end
