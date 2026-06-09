
import { test, expect, Page } from '@playwright/test';

const TRABALHOS_URL = 'https://studylab.free.laravel.cloud/works';

async function irParaTrabalhos(page: Page) {
  await page.goto(TRABALHOS_URL);
  await expect(
    page.getByRole('button', { name: 'Novo trabalho' })
  ).toBeVisible({ timeout: 15_000 });
}

async function abrirModalNovo(page: Page) {
  await page.getByRole('button', { name: 'Novo trabalho' }).click();
  await expect(page.locator('#workType')).toBeVisible();
}

async function fecharModal(page: Page) {
  await page.locator('#closeWorkModal').click();
  await expect(page.locator('#workType')).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await irParaTrabalhos(page);
});

// CASOS FELIZES


test('caso feliz: criar trabalho de pesquisa de geografia', async ({ page }) => {
  await abrirModalNovo(page);
  await page.locator('#workType').selectOption('Artigo');
  await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('pesquisa de geografia');
  await page.locator('#workDueDate').fill('2026-12-23');
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

  
  await expect(page.locator('#workType')).not.toBeVisible({ timeout: 10_000 });
});

test('caso feliz: criar trabalho de robótica e depois editar para concluído', async ({ page }) => {
  
  await abrirModalNovo(page);
  await page.locator('#workType').selectOption('Artigo');
  await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('tarefa de robotica');
  await page.locator('#workDueDate').fill('2026-06-10');
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
  await expect(page.locator('#workType')).not.toBeVisible();

  
  await page.getByRole('button', { name: 'Editar' }).first().click();
  await expect(page.locator('#workStatus')).toBeVisible();
  await page.locator('#workStatus').selectOption('completed');
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

  
  await expect(page.locator('#workStatus')).not.toBeVisible();
});

test('caso feliz: excluir o primeiro trabalho da lista', async ({ page }) => {
  await page.getByRole('button', { name: 'Excluir' }).first().click();
  await page.getByRole('button', { name: 'Sim, excluir' }).click();

  
  await expect(page.getByRole('button', { name: 'Sim, excluir' })).not.toBeVisible();
});

// CASOS TRISTES

test('caso triste: tentar salvar trabalho em branco', async ({ page }) => {
  await abrirModalNovo(page);
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
  await expect(page.getByRole('button', { name: 'Salvar Trabalho' })).toBeVisible();
  await fecharModal(page);
});


// CASOS DE BORDA 

test('caso de borda: criar trabalho com título numérico e ano inválido', async ({ page }) => {
  await abrirModalNovo(page);
  await page.locator('#workType').selectOption('Artigo');
  await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('77777744');
  await page.locator('#workDueDate').fill('7654-06-05');
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
  
  
  await expect(page.getByRole('button', { name: 'Salvar Trabalho' })).toBeVisible();
  await fecharModal(page);
});

test('caso de borda: criar trabalho de apresentação com caractere especial e sem data', async ({ page }) => {
  await abrirModalNovo(page);
  await page.locator('#workType').selectOption('Apresentação');
  await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('carcara@');
  await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
  
  
  await expect(page.getByRole('button', { name: 'Salvar Trabalho' })).toBeVisible();
  await fecharModal(page);
});