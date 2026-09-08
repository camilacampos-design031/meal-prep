# frozen_string_literal: true

require "net/http"
require "json"

class UsdaFoodSearch
  BASE_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"

  # USDA nutrient IDs for the values we care about (per 100g)
  NUTRIENT_IDS = {
    calories:      1008,
    protein_grams: 1003,
    fat_grams:     1004,
    carbs_grams:   1005
  }.freeze

  def self.search(query, max: 8)
    # Fall back to public DEMO_KEY in development so the feature works without setup
    api_key = ENV["FOOD_DATA_CENTRAL_API_KEY"].presence ||
              (Rails.env.development? ? "DEMO_KEY" : nil)
    return [] if api_key.nil? || query.blank?

    uri = URI(BASE_URL)
    uri.query = URI.encode_www_form(query: query, pageSize: max, api_key: api_key)

    response = Net::HTTP.get_response(uri)
    return [] unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    (data["foods"] || []).filter_map { |food| normalize(food) }
  rescue StandardError
    []
  end

  private_class_method def self.normalize(food)
    nutrients = (food["foodNutrients"] || []).index_by { |n| n["nutrientId"] }

    {
      food_name:        food["description"].to_s.split.map(&:capitalize).join(" "),
      calories_per_100g:  nutrients.dig(NUTRIENT_IDS[:calories],      "value").to_f.round(1),
      protein_per_100g:   nutrients.dig(NUTRIENT_IDS[:protein_grams], "value").to_f.round(1),
      fat_per_100g:       nutrients.dig(NUTRIENT_IDS[:fat_grams],     "value").to_f.round(1),
      carbs_per_100g:     nutrients.dig(NUTRIENT_IDS[:carbs_grams],   "value").to_f.round(1)
    }
  end
end
