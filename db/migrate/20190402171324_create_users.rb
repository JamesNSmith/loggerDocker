class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :u_id
      t.string :username
      t.string :email
      t.string :password_digest
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.string :utype
      t.string :auth_token
      t.string :email_confirm_token
      t.boolean :email_confirmed, :default => false
      t.string :password_reset_token
      t.datetime :password_reset_sent_at
      #preferences https://www.altcademy.com/questions/store-arrays-or-hashes-in-rails-activerecord
      #language

      t.timestamps
    end
  end
end
