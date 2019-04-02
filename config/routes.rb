Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'pages#index' 

  match '/users', to: 'users#index', via: [:get, :post]
  match '/users/signup', to: 'users#new', via: [:get, :post]

  #match '/users/authenticate', to: 'userlink#show', via: :get
  #match '/users/recover_password', to: 'userlink#new', via: [:get, :post]
  #match '/users/set_password', to: 'userlink#edit', via: [:get, :post]
  

  match '/clubs', to: 'clubs#index', via: [:get, :post]
  match '/clubs/add', to: 'clubs#new', via: [:get, :post]
  delete '/clubs/del' => 'clubs#destroy'
  match '/clubs/members', to: 'clubs#show', via: :get
  match '/clubs/user', to: 'clubs#view', via: [:get, :post]

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'

  resources :users
  resources :user_link
  resources :club_link

end

#resources :sessions
