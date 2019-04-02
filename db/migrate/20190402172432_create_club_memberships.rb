class CreateClubMemberships < ActiveRecord::Migration[5.1]
  def change
    create_table :club_memberships do |t|
      t.belongs_to :club
      t.belongs_to :membership

      t.timestamps
    end
  end
end
