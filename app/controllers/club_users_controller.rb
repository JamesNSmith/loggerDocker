class ClubUsersController < ApplicationController
  def userupdate
    case request.method_symbol
    when :get
      @clubUser = ClubUser.find(params[:id])
      @user = @clubUser.user
      @club = @clubUser.club
      check_user_membership(@club,@user)

      @membershipList = []
      @club.memberships.each do |membership|
        @membershipList.append [membership.name,membership.id]
      end
      
    when :post
      @clubUser = ClubUser.find(update_data_params[:club_user])
      check_user_membership(@clubUser.club,@clubUser.user)

      @membership = Membership.find(update_data_params[:id])
      @clubUser.membership = @membership

      if @clubUser.save 
        redirect_to '/clubs/user', :info => 'Membership updated to ' + @membership[:name].to_s
      else 
        redirect_to '/clubs/user', :danger => "Ooooppss, something went wrong!"
      end
    end
  end

  def adminupdate
    case request.method_symbol
    when :get
      @clubUser = ClubUser.find(params[:id])
      @user = @clubUser.user
      @club = @clubUser.club
      check_admin_membership(@club)

      @membershipList = []
      @club.memberships.each do |membership|
        @membershipList.append [membership.name,membership.id]
      end

      @utypes = [['Admin','admin'],['Regular','regular']]
      
    when :post
      @clubUser = ClubUser.find(params[:membership][:club_user])
      check_admin_membership(@clubUser.club)

      @membership = Membership.find(params[:membership][:id])
      @clubUser.membership = @membership

      @utype = params[:membership][:name]
      @adminCount = ClubUser.where(club:@clubUser.club, utype:'admin').count

      if (@clubUser.utype == 'admin') && (@utype != 'admin') && (@adminCount <= 1)
        redirect_to '/clubs/members', :warning => 'One or more users must be an admin!'
        
      else
        @clubUser.utype = @utype
        @user = @clubUser.user

        if @clubUser.save 
          redirect_to '/clubs/members', :info => @user.first_name+' '+@user.last_name+"'s membership updated"
        else 
          redirect_to '/clubs/members', :danger => "Ooooppss, something went wrong!"
        end

      end
    end
  end 

  def delete
    @clubUser = delete_club_user_params
    ClubUser.find(@clubUser[:id]).destroy
    redirect_to '/clubs/members', :info =>  @clubUser[:first_name] + ' ' + @clubUser[:last_name] + ' Removed'
  end

  def leave
    @clubUser = leave_club_user_params
    ClubUser.find(@clubUser[:id]).destroy
    
    if current_club['id'].to_i == @clubUser['club_id'].to_i
      end_club
    end

    redirect_to '/clubs/user', :info => 'You have left ' + @clubUser[:club] 
  end

  private
  def update_data_params
    params.require(:membership).permit(:id,:club_user)
  end

  def delete_club_user_params
    params.require(:club_user).permit(:id,:first_name,:last_name)
  end

  def leave_club_user_params
    params.require(:club_user).permit(:id,:club_id,:club)
  end
end
