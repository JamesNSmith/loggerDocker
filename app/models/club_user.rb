class ClubUser < ApplicationRecord
	belongs_to :user
	belongs_to :membership #, optional: true
	belongs_to :club

	#has_many :flights_p1, :class_name => 'Flights', :foreign_key => 'club_user_p1_id'
	#has_many :flights_p2, :class_name => 'Flights', :foreign_key => 'club_user_p2_id'
end
