import { test, expect, Page } from '@playwright/test';

const MATERIAS_URL = 'https://studylab.free.laravel.cloud/subjects';

const NOME_LONGO_PROFESSOR =
  'a'.repeat(400) + 's'.repeat(100) + 'd'.repeat(100) +
  'w'.repeat(150) + 'd'.repeat(90)  + 's'.repeat(80);

const NOME_LONGO_COM_ESPECIAIS =
  'e' + 'r'.repeat(180) + 'd'.repeat(130) + 'f'.repeat(110) +
  'h'.repeat(170) + 'xdd52&';


async function irParaMatérias(page: Page) {
  await page.goto(MATERIAS_URL);
  await expect(
    page.getByRole('button', { name: 'Adicionar matéria' })
  ).toBeVisible({ timeout: 15_000 });
}

async function abrirModalNova(page: Page) {
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await expect(page.locator('#modalSubjectName')).toBeVisible();
}

async function fecharModal(page: Page) {
  await page.locator('#btnFecharSubjectModal').click();
  await expect(page.locator('#modalSubjectName')).not.toBeVisible();
}



test.beforeEach(async ({ page }) => {
  await irParaMatérias(page);
});

// Casos felizes

test('caso feliz: editar professor de uma matéria existente', async ({ page }) => {
 
  await page.getByRole('button', { name: 'Editar' }).nth(2).click();
  await expect(
    page.getByRole('textbox', { name: 'Ex: Prof. João Silva' })
  ).toBeVisible();

  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Carlos Vianna');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();

  await expect(
    page.getByRole('button', { name: 'Salvar alterações' })
  ).not.toBeVisible({ timeout: 10_000 });
});

// Casos tristes

test('caso triste: salvar matéria sem preencher campos obrigatórios', async ({ page }) => {
  await abrirModalNova(page);
  await page.getByRole('button', { name: 'Salvar matéria' }).click();
  await expect(page.getByRole('button', { name: 'Salvar matéria' })).toBeVisible();
});

test('caso triste: adicionar matéria duplicada já cadastrada', async ({ page }) => {
  await abrirModalNova(page);
  await page.locator('#modalSubjectName').selectOption('História');
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Carlos Vianna');
  await page.locator('#modalSubjectSemester').selectOption('1');
  await page.getByRole('button', { name: 'Salvar matéria' }).click();
  await expect(page.getByRole('button', { name: 'Salvar matéria' })).toBeVisible();
});

// Casos de borda

test('caso de borda: nome do professor com string extremamente longa', async ({ page }) => {
  await abrirModalNova(page);

  await page.locator('#modalSubjectSemester').selectOption('2');
  await page.locator('#modalSubjectAbbreviation').selectOption('SOC');
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(NOME_LONGO_PROFESSOR);
  await page.getByRole('button', { name: 'Salvar matéria' }).click();
  await expect(page.getByRole('button', { name: 'Salvar matéria' })).toBeVisible();
});

test('caso de borda: editar professor com string longa e caracteres especiais', async ({ page }) => {
  await page.getByRole('button', { name: 'Editar' }).first().click();
  await expect(
    page.getByRole('textbox', { name: 'Ex: Prof. João Silva' })
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill(NOME_LONGO_COM_ESPECIAIS);
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(
    page.getByRole('button', { name: 'Salvar alterações' })
  ).toBeVisible();
});