import { pingPrisma } from '@/database/index.js';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  uptime: number;
  timestamp: string;
  version: string;
  checks?: Record<string, 'up' | 'down'>;
}

const version = process.env.npm_package_version ?? '1.0.0';

export const healthService = {
  /** Liveness: the process is up. Never touches the database. */
  liveness(): HealthStatus {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      version,
    };
  },

  /** Readiness: dependencies are reachable. */
  async readiness(): Promise<HealthStatus> {
    const database = (await pingPrisma()) ? 'up' : 'down';
    return {
      ...this.liveness(),
      status: database === 'up' ? 'ok' : 'degraded',
      checks: { database },
    };
  },
};
