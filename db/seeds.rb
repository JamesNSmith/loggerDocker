# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

ua1 = User.create(username:'jamesnsmith',email: 'jamesnsmith@hotmail.co.uk', password: '1234', password_confirmation: '1234', first_name: 'James', last_name: 'Smith', utype: 'webadmin')
ua2 = User.create(username:'jamesnsmith97',email: 'jamesnsmith97@gmail.com', password: '1234', password_confirmation: '1234', first_name: 'James', last_name: 'Smith', utype: '', email_confirmed: true)

u1 = User.create(username:'carlosBu',email: 'carlos@email.com', password: 'Carlos1', password_confirmation: 'Carlos1', first_name: 'Carlos', last_name: 'Bueno', email_confirmed: true)
u2 = User.create(username:'freidaBu',email: 'freida@email.com', password: 'Freida1', password_confirmation: 'Freida1', first_name: 'Frieda', last_name: 'Bueno', email_confirmed: true)
u3 = User.create(username:'julianBu',email: 'julian@email.com', password: 'Julian1', password_confirmation: 'Julian1', first_name: 'Julian', last_name: 'Bueno', email_confirmed: true)

u4 = User.create(username:'losBu',email: 'los@email.com', password: 'Carlos1', password_confirmation: 'Carlos1', first_name: 'los', last_name: 'Bueno', email_confirmed: true)
u5 = User.create(username:'idaBu',email: 'ida@email.com', password: 'Freida1', password_confirmation: 'Freida1', first_name: 'eda', last_name: 'Bueno', email_confirmed: true)
u6 = User.create(username:'lianBu',email: 'lian@email.com', password: 'Julian1', password_confirmation: 'Julian1', first_name: 'lian', last_name: 'Bueno', email_confirmed: true)

u7 = User.create(first_name: 'Jack', last_name: 'Bueno', password:'@4321', password_confirmation:'@4321')

cd1 = Club.create(name:'Default', initials:'D', country:'UK')
c1 = Club.create(name:'Logger Club', initials:'LC', country:'UK')
c2 = Club.create(name:'Test Club', initials:'TC', country:'UK')

md1 = Membership.create(name: 'Default', mtype: true)
m1 = Membership.create(name: 'Full', mtype: true, launch_fee:7.00, soaring_fee:0.3)
m2 = Membership.create(name: 'Junior', mtype: true, launch_fee:4.50, soaring_fee:0.15)
m3 = Membership.create(name: 'Trial', mtype: true, launch_fee:4.50, soaring_fee:0.15)

#md2 = Membership.create(name: 'Default', mtype: false)
m4 = Membership.create(name: 'Full', mtype: false, launch_fee:7.00, soaring_fee:0.6)
m5 = Membership.create(name: 'Junior', mtype: false, launch_fee:4.50, soaring_fee:0.3)
m6 = Membership.create(name: 'Trial', mtype: false, launch_fee:4.50, soaring_fee:0.3)

#md3 = Membership.create(name: 'Default', mtype: false)
m7 = Membership.create(name: 'Full', mtype: false, launch_fee:8.00, soaring_fee:0.4)
m8 = Membership.create(name: 'Junior', mtype: false, launch_fee:6.00, soaring_fee:0.25)
m9 = Membership.create(name: 'Trial', mtype: false, launch_fee:6.00, soaring_fee:0.3)

cud1 = ClubUser.create(user:ua1,club:cd1,membership:md1,utype:'admin')
cud2 = ClubUser.create(user:ua2,club:c1,membership:m4,utype:'admin') #userType:regular,admin,regular editor, regular financial
cud2 = ClubUser.create(user:ua2,club:c2,membership:m7,utype:'admin') #userType:regular,admin,regular editor, regular financial
cu1 = ClubUser.create(user:u1,club:c1,membership:m4,utype:'regular')
cu2 = ClubUser.create(user:u2,club:c1,membership:m4,utype:'regular')
cu3 = ClubUser.create(user:u3,club:c1,membership:m5,utype:'regular')
cu4 = ClubUser.create(user:u4,club:c2,membership:m7,utype:'regular')
cu5 = ClubUser.create(user:u5,club:c2,membership:m8,utype:'regular')
cu6 = ClubUser.create(user:u6,club:c2,membership:m9,utype:'regular')

cd1.memberships << [md1,m1,m2,m3]
c1.memberships << [m4,m5,m6]
c2.memberships << [m7,m8,m9]