class ClubMembership < ApplicationRecord
	belongs_to :club
	belongs_to :membership
end
