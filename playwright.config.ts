import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: 1, 
  
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // 1. Projeto de Setup para o Login
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // 2. Navegadores (Observe a mudança na propriedade storageState abaixo)
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Isso garante que o caminho aponte exatamente para a raiz do projeto
        storageState: 'tests/.auth/user.json', 
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'tests/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});