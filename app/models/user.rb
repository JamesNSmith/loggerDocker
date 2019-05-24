class User < ApplicationRecord
	has_secure_password

	before_create {generate_token(:auth_token)}
	before_create {generate_token(:email_confirm_token)}
	before_create {generate_u_id(:u_id)}

	has_many :club_users
	has_many :clubs, through: :club_users
	has_many :memberships, through: :club_users

	has_many :user_aircrafts
	has_many :aircrafts, through: :user_aircrafts

	has_many :flights

  #validates_format_of :username, :with => /\A([a-z])\Z/i, :message => "Format Error!"
  #/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  #validates :email, format: { with: URI::MailTo::EMAIL_REGEXP, message: "Email not valid!" }

	validates_presence_of :first_name, :middle_name, :last_name, :username, :email, :message => "Can't be blank!" #, :on => :create
  validates_uniqueness_of :username, :email, :message => "Already in use!"

  validates :first_name, format: {with: /\A[a-z]{2,16}\Z/i, message: "Length: 2 to 16 characters Letters only"}
  validates :middle_name, format: {with: /\A[a-z]{2,16}\Z/i, message: "Length: 2 to 16 characters Letters only"}
  validates :last_name, format: {with: /\A[a-z]{2,16}\Z/i, message: "Length: 2 to 16 characters Letters only"}
  validates :username, format: {with: /\A[a-z0-9_-]{3,16}\Z/i, message: "Format: a-z, 0-9 Length: 3 to 16 characters"}
  validates :email, format: {with: /\A([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})\Z/i, message: "Enter a valid email"}#Not sure
  validates :password, format: {with: /\A[a-z0-9_-]{4,18}\Z/i, message: "Format: a-z, 0-9 Length: 4 to 18 characters"}
	
  validates :password, confirmation: {:message => "Doesn't match password!"}
	validates :password_confirmation, confirmation: true

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

	def generate_isbn
		begin
  			@sum = 0
  			@number = []
  			@count = 10

  			while @count > 1
  				@numberTemp = rand(1...10)
  				@number.push(@numberTemp)
  				@sum += (@numberTemp * @count)
  				@count -= 1
  			end

  			@numberTemp = @sum%11
  			if @numberTemp != 0
  				@numberTemp = 11 - @numberTemp
  			end

  		end while @numberTemp == 10

  		@number.push(@numberTemp)

  		return @number.join.to_i
  	end

	private
	def generate_token(column)
    	begin
      		self[column] = SecureRandom.urlsafe_base64
   		end while User.exists?(column => self[column])
  	end

  	def generate_u_id(column)
    	begin
      		self[column] = generate_isbn
   		end while User.exists?(column => self[column])
  	end
end
