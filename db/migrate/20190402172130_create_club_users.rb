class CreateClubUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :club_users do |t|
      t.belongs_to :user, index: true
      t.belongs_to :membership, index: true
      t.belongs_to :club, index: true
      t.string :utype

      t.timestamps
    end
  end
end
