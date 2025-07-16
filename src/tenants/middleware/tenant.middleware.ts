import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const hostname = req.hostname;
    const baseDomain = this.configService.get('BASE_DOMAIN');

    // Skip tenant resolution for API routes
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Extract subdomain
    const subdomain = hostname.replace(`.${baseDomain}`, '');
    
    if (subdomain === baseDomain) {
      // Request to main domain, redirect to app subdomain or handle differently
      return res.redirect(`https://app.${baseDomain}`);
    }

    // Find tenant by subdomain
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain, active: true }
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Attach tenant to request
    (req as any).tenant = tenant;
    next();
  }
}
