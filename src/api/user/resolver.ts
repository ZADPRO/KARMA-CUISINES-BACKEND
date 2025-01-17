import { UserRepository } from "./user-repository";


export class UserResolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new UserRepository();
  }
  public async userSignUpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.userSignUpV1(user_data, domain_code);
  }

  public async verifyUserNameEmailV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.verifyUserNameEmailV1(user_data, domain_code);
  }
  public async orderplacementV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.orderplacementV1(user_data, domain_code);
  }
}