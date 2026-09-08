# frozen_string_literal: true

require "net/http"
require "json"

class FoodSearch
  BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl"

  def self.search(query, max: 8)
    return [] if query.blank?

    uri = URI(BASE_URL)
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
    (data["products"] || []).filter_map { |product| normalize(product) }
  rescue StandardError
    []
  end

  private_class_method def self.normalize(product)
    name = product["product_name"].to_s.strip
    return nil if name.blank?

    n        = product["nutriments"] || {}
    calories = n["energy-kcal_100g"].to_f
    # Fall back to kJ → kcal if no direct kcal field
    calories = (n["energy_100g"].to_f / 4.184).round(1) if calories.zero? && n["energy_100g"].present?
    protein  = n["proteins_100g"].to_f
    fat      = n["fat_100g"].to_f
    carbs    = n["carbohydrates_100g"].to_f

    # Skip entries with no nutritional data at all
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
