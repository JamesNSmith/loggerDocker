class Club < ApplicationRecord
	before_create {generate_token(:auth_token)}
	before_create {generate_token(:link_token)}

	has_many :club_users
	has_many :users, through: :club_users

	has_many :club_memberships
	has_many :memberships, through: :club_memberships

	#has_many :club_aircrafts
	#has_many :aircrafts, through: :club_aircrafts

	#has_many :flights

  validates_presence_of :name, :initials, :country, :message => "Can't be blank!"

  validates :name, format: {with: /\A[a-z\s]{3,30}\Z/i, message: "Length: 3 to 30 characters Letters and spaces only"}
  validates :initials, format: {with: /\A[a-z]{1,5}\Z/i, message: "Length: 1 to 5 characters Letters only"}

  private
	def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
   	end while Club.exists?(column => self[column])
  end
end



#def email_link
    #	self.email_confirmed = true
    #	self.email_confirm_token = nil
    #	save!(:validate => false)
  	#end
