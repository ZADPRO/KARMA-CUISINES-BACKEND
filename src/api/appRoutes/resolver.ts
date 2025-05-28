import { AppRoutesRepository } from "./app-routes";

export class AppRoutesResolver {
  public AppRoutesRepository: any;
  constructor() {
    this.AppRoutesRepository = new AppRoutesRepository();
  }

  public async listOrderDetails(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.AppRoutesRepository.listOrderDetails(
      user_data,
      token_data,
      domain_code
    );
  }
}
