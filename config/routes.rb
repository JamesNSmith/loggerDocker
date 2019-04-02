Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'pages#index' 

  match '/users', to: 'users#index', via: [:get, :post]
  match '/signup', to: 'users#new', via: [:get, :post]
  

  match '/clubs', to: 'clubs#index', via: [:get, :post]
  match '/clubs/add', to: 'clubs#new', via: [:get, :post]
  delete '/clubs/del' => 'clubs#destroy'
  match '/clubs/members', to: 'clubs#show', via: :get
  match '/clubs/user', to: 'clubs#view', via: [:get, :post]

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'

  mount ActionCable.server, at: '/cable'

  resources :users
  #resources :password_resets
  #resources :user_authentication
  #resources :club_link

end

#resources :sessions
