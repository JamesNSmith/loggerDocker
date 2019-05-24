class CreateMemberships < ActiveRecord::Migration[5.1]
  def change
    create_table :memberships do |t|
      t.string :name
      t.decimal :launch_fee, precision:6, scale:2 
      t.decimal :soaring_fee, precision:6, scale:2 
      t.decimal :aerotow_standard_fee, precision:6, scale:2
      t.decimal :aerotow_unit_fee, precision:6, scale:2

      t.timestamps
    end
  end
end
