class ClubLinkController < ApplicationController
  def new
  	puts params[:format]
  	@club = Club.find_by_link_token!(params[:format])
    if @club
      @user = User.find(session[:user_id])
      @membership = Membership.find(1)

      if @club.users.length == 0
      	@utype = 'admin'
      else
      	@utype = 'regular'
      end

      @checkClubUser = ClubUser.where("user_id = :user AND club_id = :club",{user: @user, club: @club})
      if @checkClubUser.length > 0
         redirect_to '/', :warning => "You are already a member of " +  @club.name + "!"

      else
        @clubUser = ClubUser.new(user:@user,club:@club,membership:@membership,utype:@utype) ##,utype:'admin'

        if @clubUser.save 
          session[:club_id] = @club.id
          redirect_to '/', :success => "You have joined " + @club.name
        else
          redirect_to '/', :danger => "Sorry. Club does not exist!"
        end

      end
    else
      redirect_to '/', :danger => "Sorry. Club does not exist!"
    end
  end
end
