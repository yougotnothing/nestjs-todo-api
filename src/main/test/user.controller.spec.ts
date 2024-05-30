import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "controller/user.controller";
import { UserService } from "service/user.service";

describe("UserController", () => {
  let controller: UserController;

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    controller = userModule.get<UserController>(UserController);

  });
  
  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  
  describe("get-user", () => {
    it("should return a user", async () => {
      expect(await controller.getUser(1)).toBeDefined();
    });
  });
});