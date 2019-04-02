class ClubMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.club_mailer.confirmation.subject
  #
  def confirmation(user,club)
    @user = user
    @club = club
    mail(:to => user.email, :subject => "New Club")
  end
end
