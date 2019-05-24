class CreateClubMemberships < ActiveRecord::Migration[5.1]
  def change
    create_table :club_memberships do |t|
      t.belongs_to :club, index: true
      t.belongs_to :membership, index: true

      t.timestamps
    end
  end
end
