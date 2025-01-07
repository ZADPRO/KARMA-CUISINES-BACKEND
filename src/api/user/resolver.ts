import { UserRepository } from "./user-repository";


export class UserResolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new UserRepository();
  }
  public async userSignUpV1(user_data: any, domain_code: any): Promise<any> {
    console.log('user_data line ---9', user_data)

    console.log('line --- 10')
    return await this.userRepository.userSignUpV1(user_data, domain_code);
  }
}