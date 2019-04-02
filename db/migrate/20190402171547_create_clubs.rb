class CreateClubs < ActiveRecord::Migration[5.1]
  def change
    create_table :clubs do |t|
      t.string :name
      t.string :initials
      t.string :country
      t.string :auth_token
      t.string :link_token

      t.timestamps
    end
  end
end
