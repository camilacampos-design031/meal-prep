class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_one :nutrition_goal, dependent: :destroy
  has_many :recipes, dependent: :destroy
  has_many :weekly_plans, dependent: :destroy
  has_many :food_logs, dependent: :destroy
  has_many :saved_foods, dependent: :destroy

  normalizes :email, with: ->(e) { e.strip.downcase }

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 7 }, allow_nil: true
end
