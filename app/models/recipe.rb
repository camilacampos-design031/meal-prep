# frozen_string_literal: true

class Recipe < ApplicationRecord
  belongs_to :user
  has_many :recipe_ingredients, dependent: :destroy

  SOURCES = %w[manual ai].freeze

  validates :name, presence: true
  validates :servings, numericality: { only_integer: true, greater_than: 0 }
  validates :source, inclusion: { in: SOURCES }
  validates :prep_time, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
end
