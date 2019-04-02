class User < ApplicationRecord
	has_secure_password 
	validates_presence_of :password, :on => :create

	before_create {generate_token(:auth_token)}
	before_create {generate_token(:email_confirm_token)}

	has_many :club_users
	has_many :clubs, through: :club_users
	has_many :memberships, through: :club_users

	has_many :user_aircrafts
	has_many :aircrafts, through: :user_aircrafts

	has_many :flights

	def email_activate
    	self.email_confirmed = true
    	self.email_confirm_token = nil
    	save!(:validate => false)
  	end

	def send_password_reset
  		generate_token(:password_reset_token)
  		self.password_reset_sent_at = Time.zone.now
  		save!
  		UserMailer.password_reset(self).deliver
	end

	private
	def generate_token(column)
    	begin
      		self[column] = SecureRandom.urlsafe_base64
   		end while User.exists?(column => self[column])
  	end
end
