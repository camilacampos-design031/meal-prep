# frozen_string_literal: true

class CreateWeeklyPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :weekly_plans do |t|
      t.references :user, null: false, foreign_key: true
      t.date :week_start_date, null: false

      t.timestamps
    end

    add_index :weekly_plans, [ :user_id, :week_start_date ], unique: true
  end
end
