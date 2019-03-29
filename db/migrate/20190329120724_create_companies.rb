class CreateCompanies < ActiveRecord::Migration[5.2]
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.string :ticker, null: false

      t.timestamps
    end
    add_index :companies, :name
    add_index :companies, :ticker
  end
end
