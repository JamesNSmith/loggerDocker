class ClubUsersController < ApplicationController
  def userupdate
    case request.method_symbol
    when :get
      @clubUser = ClubUser.find(update_params[:id])
      @club = @clubUser.club

      @membershipList = []
      @club.memberships.each do |membership|
        @membershipList.append [membership.name,membership.id]
      end
      
    when :post
      @clubUser = ClubUser.find(update_data_params[:club_user])
      @membership = Membership.find(update_data_params[:id])
      @clubUser.membership = @membership

      if @clubUser.save 
        redirect_to '/clubs/members', :info => 'Membership updated to ' + @membership[:name].to_s
      else 
        redirect_to '/clubs/members', :danger => "Ooooppss, something went wrong!"
      end
    end
  end

  def adminupdate
    case request.method_symbol
    when :get
      @clubUser = ClubUser.find(update_params[:id])
      puts('clubUser')
      @user = @clubUser.user
      @club = @clubUser.club

      @membershipList = []
      @club.memberships.each do |membership|
        @membershipList.append [membership.name,membership.id]
      end

      @utypes = [['Admin','admin'],['Regular','regular']]
      
    when :post
      puts('post')
      @clubUser = ClubUser.find(update_admin_data_params[:club_user])
      @membership = Membership.find(update_admin_data_params[:id])
      @clubUser.membership = @membership
      @utype = update_admin_data_params[:name]

      @adminCount = ClubUser.where(club:@clubUser.club, utype:'admin').count
      puts(@adminCount)
      if (@clubUser.utype == 'admin') && (@utype != 'admin') && (@adminCount <= 1)

        if @clubUser.save 
          redirect_to '/clubs/members', :warning => 'One or more users must be an admin!'
        else 
          redirect_to '/clubs/members', :danger => "Ooooppss, something went wrong!"
        end

      else
        @clubUser.utype = @utype
        if @clubUser.save 
          flash[:info] = ['Membership updated to '+@membership[:name].to_s]
          flash[:info] << 'User Type updated to '+@utype.capitalize 
          redirect_to '/clubs/members'
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
  def update_params
    params.require(:club_user).permit(:id)
  end

  def update_data_params
    params.require(:membership).permit(:id,:club_user)
  end

  def update_admin_data_params
    params.require(:membership).permit(:name,:id,:club_user)
  end

  def delete_club_user_params
    params.require(:club_user).permit(:id,:first_name,:last_name)
  end

  def leave_club_user_params
    params.require(:club_user).permit(:id,:club_id,:club)
  end
end
