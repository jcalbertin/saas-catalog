import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DomainService {
  private readonly cloudflareApiToken: string;
  private readonly zoneId: string;
  private readonly baseDomain: string;

  constructor(private configService: ConfigService) {
    const cloudflareApiToken = this.configService.get<string>('CLOUDFLARE_API_TOKEN');
    const zoneId = this.configService.get<string>('CLOUDFLARE_ZONE_ID');
    const baseDomain = this.configService.get<string>('BASE_DOMAIN');

    if (!cloudflareApiToken || !zoneId || !baseDomain) {
      throw new Error('Missing required Cloudflare configuration');
    }

    this.cloudflareApiToken = cloudflareApiToken;
    this.zoneId = zoneId;
    this.baseDomain = baseDomain;
  }

  async createSubdomain(subdomain: string): Promise<void> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cloudflareApiToken}`,
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: subdomain,
        content: this.baseDomain,
        proxied: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create subdomain: ${error.errors[0]?.message}`);
    }
  }

  async deleteSubdomain(subdomain: string): Promise<void> {
    // First, get the DNS record ID
    const records = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records?name=${subdomain}.${this.baseDomain}`,
      {
        headers: {
          'Authorization': `Bearer ${this.cloudflareApiToken}`,
        },
      }
    );

    const { result } = await records.json();
    if (result && result[0]) {
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${result[0].id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.cloudflareApiToken}`,
          },
        }
      );
    }
  }

  async validateSubdomain(subdomain: string): Promise<boolean> {
    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
    return subdomainRegex.test(subdomain);
  }
}
