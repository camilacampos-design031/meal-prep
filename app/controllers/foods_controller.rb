# frozen_string_literal: true

class FoodsController < ApplicationController
  def search
    results = FoodSearch.search(params[:q].to_s.strip)
    render json: results
  end
end
