import { config, DotenvParseOutput, DotenvConfigOutput } from "dotenv";
import { IConfigService } from "./config.service.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";

@injectable()
export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if(result.error) {
            this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсуствует");
        }
        else {
            this.logger.log("[ConfigService] Конфигурация .env загружена");
            this.config = result.parsed as DotenvParseOutput;
        }
    }

    get(key: string): string {
       return  this.config[key];
    }
}
