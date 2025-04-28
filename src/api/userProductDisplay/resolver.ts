import { userProductDisplayRepository } from "./userProductDisplayRepository";

export class userProductDisplayResolver {
  public userProductDisplayRepository: any;
  constructor() {
    this.userProductDisplayRepository = new userProductDisplayRepository();
  }
  public async FoodListV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userProductDisplayRepository.FoodListV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async foodInfoV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userProductDisplayRepository.foodInfoV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async orderFoodV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userProductDisplayRepository.orderFoodV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async paymentGateway(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.userProductDisplayRepository.paymentGateway(
      user_data,
      token_data,
      domain_code
    );
  }
}
