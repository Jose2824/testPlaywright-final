import { test as setup } from '@playwright/test';

const SESSION_FILE = '.auth/session.json';

setup('autenticar e salvar sessão', async ({ page }) => {
  await page.goto('https://studylab.free.laravel.cloud/');
  await page.getByRole('link', { name: 'Entrar' }).click();

  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(
    'mateus.santana4@aluno.ce.gov.br'
  );
  await page.getByRole('textbox', { name: '••••••••' }).fill('JMteste@123');
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 70_000,
  });

  await page.context().storageState({ path: 'tests/.auth/user.json' });
});
