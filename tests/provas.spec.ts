import { test, expect, Page } from '@playwright/test';

const PROVAS_URL = 'https://studylab.free.laravel.cloud/exams';

async function irParaProvas(page: Page) {
  await page.goto(PROVAS_URL);
  await expect(
    page.getByRole('button', { name: 'Adicionar' }).first()
  ).toBeVisible({ timeout: 15_000 });
}

async function abrirModalNova(page: Page, posicaoBotao: number = 0) {
  await page.getByRole('button', { name: 'Adicionar' }).nth(posicaoBotao).click({ force: true });
  await expect(page.locator('#modalDesc')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await irParaProvas(page);
});

// Casos felizes

test('caso feliz: adicionar e excluir prova com dados válidos', async ({ page }) => {
  await abrirModalNova(page, 0);

  await page.locator('#modalDesc').selectOption({ index: 1 });
  await page.locator('#modalTimeStart').fill('08:00');
  await page.locator('#modalTimeEnd').fill('10:00');

  const btnSalvar = page.getByRole('button', { name: 'Salvar prova' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click({ force: true });

  await expect(page.locator('#modalDesc')).not.toBeVisible({ timeout: 10_000 });
  await page.locator('#calBody').getByText('Prova').first().click();
  await page.getByRole('button', { name: 'Excluir' }).click();
  await page.getByRole('button', { name: 'Sim, excluir' }).click();
});

test('caso feliz: adicionar prova marcando como concluída', async ({ page }) => {
  await abrirModalNova(page, 1);

  await page.locator('#modalDesc').selectOption({ index: 1 });
  await page.locator('#modalTimeStart').fill('01:00');
  await page.locator('#modalTimeEnd').fill('02:00');
  
  await page.getByText('✅ Concluída').click();

  const btnSalvar = page.getByRole('button', { name: 'Salvar prova' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click({ force: true });

  await expect(page.locator('#modalDesc')).not.toBeVisible({ timeout: 10_000 });
});

// Casos tristes

test('caso triste: tentar fechar o modal sem salvar', async ({ page }) => {
  await abrirModalNova(page, 2);

  await page.locator('#modalClose').click();

  await expect(page.locator('#modalDesc')).not.toBeVisible({ timeout: 10_000 });
});

// Casos de borda

test('caso de borda: prova com duração mínima de um minuto', async ({ page }) => {
  await abrirModalNova(page, 3);

  await page.locator('#modalDesc').selectOption({ index: 1 });
  await page.locator('#modalTimeStart').fill('10:00');
  await page.locator('#modalTimeEnd').fill('10:01');

  const btnSalvar = page.getByRole('button', { name: 'Salvar prova' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click({ force: true });

  await expect(page.locator('#modalDesc')).not.toBeVisible({ timeout: 10_000 });
});

test('caso de borda: horário de término menor que o de início', async ({ page }) => {
  await abrirModalNova(page, 2);

  await page.locator('#modalDesc').selectOption({ index: 1 });
  await page.locator('#modalTimeStart').fill('10:00');
  await page.locator('#modalTimeEnd').fill('08:00');

  await page.getByRole('button', { name: 'Salvar prova' }).click({ force: true });
  
  await expect(page.locator('#modalDesc')).toBeVisible();
});
