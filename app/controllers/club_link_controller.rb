class ClubLinkController < ApplicationController
  before_action :require_user

  def new
  	puts params[:format]
  	@club = Club.find_by_link_token!(params[:format])
    @membershipList = []

    if @club
      @club.memberships.each do |membership|
        @membershipList.append [membership.name,membership.id]
      end
    else
      redirect_to '/', :danger => "Sorry. Club does not exist!"
    end
  end

  def update 
    @user = current_user
    @club = Club.find(update_params[:club])
    @membership = Membership.find(update_params[:id])
    @utype = 'regular'

    if @user && @club

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
      redirect_to '/', :danger => "Sorry. User / Club does not exist!"
    end
  end

  private
  def update_params
    params.require(:membership).permit(:id,:club)
  end
end
