class ClubsController < ApplicationController
  before_action :require_user
  before_action :require_club, only: [:show, :profile]

  def index
    case request.method_symbol
    when :get
      @clubs = Club.all.paginate(page: params[:page],per_page: 10)
    when :post
      @club = Club.find_by_id(params[:clubs][:id]) 
      if @club 
        set_club(@club)
        redirect_to '/clubs/members' 
      end
    end
  end

  def view
    puts(request.method_symbol)
    case request.method_symbol
    when :get
      @current_uri = request.env['PATH_INFO']
      @clubs = current_user.clubs.paginate(page: params[:page],per_page: 10)
    when :post
      @club = Club.find_by_id(params[:clubs][:id]) 
      if @club 
        set_club(@club)
        redirect_to '/clubs/user'
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
     @status = {name:'', intials:''}
    when :post
      @user = current_user 
      @club = Club.new(club_params)
      @status = {name:'', intials:''}

      if @club.save
        ClubMailer.confirmation(@user,@club).deliver

        @m1 = Membership.create(name: 'Full', launch_fee:7.00, soaring_fee:0.3,aerotow_standard_fee: 20, aerotow_unit_fee: 5)
        @m2 = Membership.create(name: 'Junior', launch_fee:4.50, soaring_fee:0.15,aerotow_standard_fee: 20, aerotow_unit_fee: 5)
        @club.memberships << [@m1,@m2]
        @clubUser = ClubUser.create(user:@user,club:@club,membership:@m1,utype:'admin')

        set_club(@club)

        redirect_to '/clubs/user', :success => "The join link has been sent to your email address"

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
        @club.errors.each do |attr, msg|
            @status[attr] = 'error'
          end
        #redirect_to '/clubs/add', :danger => "Ooooppss, something went wrong!"
      end
    end
  end

  def profile
    @club = current_club
  end

  def destroy 
  	end_club 
  	redirect_to '/' 
  end 
  
  private
  def club_params
    params.require(:club).permit(:name, :initials, :country)
  end
end

