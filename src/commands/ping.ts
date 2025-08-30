import { z } from 'zod';
import { defineCommand, defineOptions } from '@robingenz/zli';
import { spinner } from '@clack/prompts';
import { Resolver } from "node:dns/promises";

const getCloudflareResolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['1.1.1.1', '1.0.0.1'])
  return resolver
}

const getGoogleResolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['8.8.8.8', '8.8.4.4'])
  return resolver
}

const getQuad9Resolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['9.9.9.9', '149.112.112.112'])
  return resolver
}

const getOpenDnsResolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['208.67.222.222', '208.67.220.220'])
  return resolver
}

const getAdGuardResolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['94.140.14.14', '94.140.15.15'])
  return resolver
}

const getSafeServeResolver = (): Resolver => {
  const resolver = new Resolver()
  resolver.setServers(['198.54.117.10', '198.54.117.11'])
  return resolver
}

const ping = async (host: string, resolver: Resolver): Promise<{ duration: number }> => {
  const startTime = performance.now()
  await resolver.resolve4(host)
  const duration = parseFloat((performance.now() - startTime).toFixed(2))
  return { duration }
}

export default defineCommand({
  description: 'Ping a host',
  options: defineOptions(
    z.object({
      host: z.string().regex(z.regexes.domain).describe('Host to ping'),
    }),
    { h: 'host' }
  ),
  action: async (options) => {
    const s = spinner();
    s.start('Cloudflare: Pending...');
    const cloudflareResult = await ping(options.host, getCloudflareResolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('Cloudflare: Completed');
    
    s.start('Google: Pending...');
    const googleResult = await ping(options.host, getGoogleResolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('Google: Completed');

    s.start('Quad9: Pending...');
    const quad9Result = await ping(options.host, getQuad9Resolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('Quad9: Completed');

    s.start('OpenDNS: Pending...');
    const openDnsResult = await ping(options.host, getOpenDnsResolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('OpenDNS: Completed');

    s.start('AdGuard: Pending...');
    const adGuardResult = await ping(options.host, getAdGuardResolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('AdGuard: Completed');

    s.start('SafeServe: Pending...');
    const safeServeResult = await ping(options.host, getSafeServeResolver());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    s.stop('SafeServe: Completed');

    console.table([
      { duration: `${cloudflareResult.duration} ms`, dns: 'Cloudflare' },
      { duration: `${googleResult.duration} ms`, dns: 'Google' },
      { duration: `${quad9Result.duration} ms`, dns: 'Quad9' },
      { duration: `${openDnsResult.duration} ms`, dns: 'OpenDNS' },
      { duration: `${adGuardResult.duration} ms`, dns: 'AdGuard' },
      { duration: `${safeServeResult.duration} ms`, dns: 'SafeServe' }
    ])
  },
});