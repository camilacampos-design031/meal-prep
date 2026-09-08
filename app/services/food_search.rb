# frozen_string_literal: true

require "net/http"
require "json"

# Searches USDA FoodData Central first (best for whole/basic foods).
# Falls back to Open Food Facts when USDA returns nothing (e.g. Spanish
# terms like "avena" that aren't in the English-only USDA database).
class FoodSearch
  USDA_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
  OFF_URL  = "https://world.openfoodfacts.org/cgi/search.pl"

  USDA_NUTRIENTS = { calories: 1008, protein: 1003, fat: 1004, carbs: 1005 }.freeze

  def self.search(query, max: 8)
    return [] if query.blank?

    results = usda(query, max: max)
    results = off(query, max: max) if results.empty?
    results
  end

  # ── USDA ──────────────────────────────────────────────────────────────────

  private_class_method def self.usda(query, max:)
    api_key = ENV["FOOD_DATA_CENTRAL_API_KEY"].presence
    return [] if api_key.blank?

    uri = URI(USDA_URL)
    uri.query = URI.encode_www_form(query: query, pageSize: max, api_key: api_key)

    response = Net::HTTP.get_response(uri)
    return [] unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    (data["foods"] || []).filter_map { |food| normalize_usda(food) }
  rescue StandardError
    []
  end

  private_class_method def self.normalize_usda(food)
    nutrients = (food["foodNutrients"] || []).index_by { |n| n["nutrientId"] }

    calories = nutrients.dig(USDA_NUTRIENTS[:calories], "value").to_f
    protein  = nutrients.dig(USDA_NUTRIENTS[:protein],  "value").to_f
    fat      = nutrients.dig(USDA_NUTRIENTS[:fat],      "value").to_f
    carbs    = nutrients.dig(USDA_NUTRIENTS[:carbs],    "value").to_f

    return nil if calories.zero? && protein.zero? && fat.zero? && carbs.zero?

    {
      food_name:         food["description"].to_s.split.map(&:capitalize).join(" "),
      calories_per_100g: calories.round(1),
      protein_per_100g:  protein.round(1),
      fat_per_100g:      fat.round(1),
      carbs_per_100g:    carbs.round(1)
    }
  end

  # ── Open Food Facts fallback ───────────────────────────────────────────────

  private_class_method def self.off(query, max:)
    uri = URI(OFF_URL)
    uri.query = URI.encode_www_form(
      search_terms: query,
      json:         "true",
      action:       "process",
      page_size:    max,
      fields:       "product_name,nutriments"
    )

    response = Net::HTTP.get_response(uri)
    return [] unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    (data["products"] || []).filter_map { |product| normalize_off(product) }
  rescue StandardError
    []
  end

  private_class_method def self.normalize_off(product)
    name = product["product_name"].to_s.strip
    return nil if name.blank?

    n        = product["nutriments"] || {}
    calories = n["energy-kcal_100g"].to_f
    calories = (n["energy_100g"].to_f / 4.184).round(1) if calories.zero? && n["energy_100g"].present?
    protein  = n["proteins_100g"].to_f
    fat      = n["fat_100g"].to_f
    carbs    = n["carbohydrates_100g"].to_f

    return nil if calories.zero? && protein.zero? && fat.zero? && carbs.zero?

    {
      food_name:         name.split.map(&:capitalize).join(" "),
      calories_per_100g: calories.round(1),
      protein_per_100g:  protein.round(1),
      fat_per_100g:      fat.round(1),
      carbs_per_100g:    carbs.round(1)
    }
  end
end
