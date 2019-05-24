class Membership < ApplicationRecord
	has_many :club_users
	has_many :users, through: :club_users
	has_one :club_membership, dependent: :destroy
	has_one :club, through: :club_membership

	validates_presence_of :name, :launch_fee, :aerotow_standard_fee, :aerotow_unit_fee, :soaring_fee, :message => "Can't be blank!"

	validates_format_of :name, :with => /\A[a-z]{2,16}\Z/i, :message => 'Letters only' #dodgy
	validates_format_of :launch_fee, :aerotow_standard_fee, :aerotow_unit_fee, :soaring_fee, :with => /\A[0-9\.]{1,10}\Z/i, :message => 'Numbers only' #dodgy
end
