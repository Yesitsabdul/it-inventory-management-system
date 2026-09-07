import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../../database/entities/setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  private async seedDefaults() {
    const defaultPrefix = await this.settingRepository.findOne({ where: { key: 'COMPANY_PREFIX' } });
    if (!defaultPrefix) {
      const setting = this.settingRepository.create({
        key: 'COMPANY_PREFIX',
        value: 'HB',
        description: 'Company prefix used for generating IDs like Employee Numbers',
      });
      await this.settingRepository.save(setting);
    }
  }

  async getAllSettings(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  async getSetting(key: string): Promise<Setting | null> {
    return this.settingRepository.findOne({ where: { key } });
  }

  async updateSetting(key: string, value: string): Promise<Setting> {
    let setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      setting = this.settingRepository.create({ key, value });
    } else {
      setting.value = value;
    }
    return this.settingRepository.save(setting);
  }
}
