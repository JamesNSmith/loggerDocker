class ClubsController < ApplicationController
  before_action :require_user
  before_action :require_club, only: :show

  def index
    case request.method_symbol
    when :get
      @clubs = Club.all.paginate(page: params[:page],per_page: 10)
    when :post
      @club = Club.find_by_id(params[:clubs][:id]) 
      if @club 
        session[:club_id] = @club.id
        redirect_to '/clubs/members' 
      end
    end
  end

  def view
    case request.method_symbol
    when :get
      @clubs = User.find(session[:user_id]).clubs
    when :post
      puts params
      @club = Club.find_by_id(params[:clubs][:id]) 
      if @club 
        session[:club_id] = @club.id
        redirect_to '/clubs/members' #not sure
      end
    end
  end

  def show
    case request.method_symbol
    when :get
      @currentClub = current_club
      @currentClubUser = current_user.club_users.find_by(club: @currentClub)
      @users = @currentClub.users.paginate(page: params[:page],per_page: 10)
    end
  end

  def new
    case request.method_symbol
    when :get
  	 @club = Club.new
    when :post
      @user = User.find(session[:user_id])
      @club = Club.new(club_params)
      if @club.save
        ClubMailer.confirmation(@user,@club).deliver

        @m1 = Membership.create(name: 'Full', mtype: false, launch_fee:7.00, soaring_fee:0.3,aerotow_standard_fee: 20, aerotow_unit_fee: 5)
        @m2 = Membership.create(name: 'Junior', mtype: false, launch_fee:4.50, soaring_fee:0.15,aerotow_standard_fee: 20, aerotow_unit_fee: 5)
        @club.memberships << [@m1,@m2]
        @clubUser = ClubUser.create(user:@user,club:@club,membership:@m1,utype:'admin')

        session[:club_id] = @club.id

        redirect_to '/', :success => "Further instructions have been sent to your email address"

        #@membership = Membership.find(1)
        #puts @clubMembership

        #@clubUser = ClubUser.new(user:@user,club:@club,membership:@membership,utype:'admin')

        #if @clubUser.save
 
        #else
        #  flash[:error] = "Ooooppss, something went wrong!"
         # redirect_to '/clubs/add'
        #  puts "error clubuser"
        #end
      else
        redirect_to '/clubs/add', :danger => "Ooooppss, something went wrong!"
      end
    end
  end

  def destroy 
  	session[:club_id] = nil 
  	redirect_to '/' 
  end 
  
  private
  def club_params
    params.require(:club).permit(:name, :initials, :country)
  end
end

