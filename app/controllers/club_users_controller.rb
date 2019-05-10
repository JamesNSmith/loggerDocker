class ClubUsersController < ApplicationController
  def delete
    @clubUser = delete_club_user_params
    ClubUser.find(@clubUser[:id]).destroy
    redirect_to '/clubs/members', :info =>  @clubUser[:first_name] + ' ' + @clubUser[:last_name] + ' Removed'
  end

  def leave
    @clubUser = leave_club_user_params
    ClubUser.find(@clubUser[:id]).destroy
    redirect_to '/clubs/user', :info => 'Left ' + @clubUser[:club] 
  end

  private
  def delete_club_user_params
    params.require(:club_user).permit(:id,:first_name,:last_name)
  end

  def leave_club_user_params
    params.require(:club_user).permit(:id,:club)
  end
end
