class Membership < ApplicationRecord
	has_many :club_users
	has_many :users, through: :club_users
	has_one :club_membership
	has_one :club, through: :club_membership
end
