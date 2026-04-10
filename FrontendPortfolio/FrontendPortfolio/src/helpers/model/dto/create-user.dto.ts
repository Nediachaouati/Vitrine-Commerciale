export interface CreateUserDto {
  email:     string;
  firstName: string;
  lastName:  string;
  username:  string;
  password:  string;
  kcRole:    string; // 'vitrine-collaborator' | 'vitrine-manager'
}