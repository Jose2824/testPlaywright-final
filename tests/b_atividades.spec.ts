import { test, expect, Page } from '@playwright/test';

const ATIVIDADES_URL = 'https://studylab.free.laravel.cloud/contents';


// Funções auxiliares 
async function irParaAtividades(page: Page) {
  await page.goto(ATIVIDADES_URL);
  await page.getByRole('link', { name: 'Matérias Matérias' }).click();
  await page.getByRole('link', { name: 'Ver atividades' }).first().click();
  await expect(
    page.getByRole('button', { name: 'Nova atividade' })
  ).toBeVisible({ timeout: 20_000 });
}

async function abrirModalNova(page: Page) {
  await page.getByRole('button', { name: 'Nova atividade' }).click();
  await expect(
    page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' })
  ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await irParaAtividades(page);
});

// Casos felizes

test('caso feliz: adicionar atividade com dados válidos', async ({ page }) => {
  await abrirModalNova(page);

  await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('Questões da Israelly');
  

  const selectSubject = page.locator('#modalSubjectId');
  await selectSubject.selectOption({ index: 1 });
  await selectSubject.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })));

  
  const selectDueDate = page.locator('#modalDueDateQuick');
  await selectDueDate.selectOption('3dias');
  await selectDueDate.evaluate((el) => el.dispatchEvent(new Event('change', { bubbles: true })));

  
  await page.waitForTimeout(500);

  
  const btnSalvar = page.getByRole('button', { name: 'Salvar atividade' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click();

  
  await expect(page.locator('#modalSubjectId')).not.toBeVisible({ timeout: 20_000 });
});
test('caso feliz: editar status de uma atividade para concluída', async ({ page }) => {
  await page.getByRole('button', { name: 'Editar' }).first().click();

  await page.locator('#modalStatus').selectOption('completed');
  
  const btnSalvarAlteracoes = page.getByRole('button', { name: 'Salvar alterações' });
  await btnSalvarAlteracoes.scrollIntoViewIfNeeded();
  await btnSalvarAlteracoes.click({ force: true });

  await expect(page.locator('#modalStatus')).not.toBeVisible({ timeout: 20_000 });
});

// Casos tristes

test('caso triste: cancelar a exclusão de uma atividade', async ({ page }) => {
  await page.getByRole('button', { name: 'Excluir' }).first().click();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  
  await expect(page.getByRole('button', { name: 'Nova atividade' })).toBeVisible();
});

// Casos de borda

test('caso de borda: adicionar matéria manualmente com caracteres especiais', async ({ page }) => {
  await abrirModalNova(page);

  await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('Atividade de Teste');
  await page.locator('#modalSubjectId').selectOption('manual');
  
  await page.getByRole('textbox', { name: 'Ex: GEO, Cálculo II, Inglês…' }).fill('%%¨');
  await page.locator('#modalDueDateQuick').selectOption('amanha');

  const btnSalvar = page.getByRole('button', { name: 'Salvar atividade' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click({ force: true });

  await expect(page.locator('#modalSubjectId')).toBeVisible();
});

test('caso de borda: descrição da atividade extremamente longa', async ({ page }) => {
  await abrirModalNova(page);

  const textoLongo = 'matematica' + 'd'.repeat(150);
  await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill(textoLongo);
  await page.locator('#modalSubjectId').selectOption({ index: 1 });
  await page.locator('#modalDueDateQuick').selectOption('1mes');

  const btnSalvar = page.getByRole('button', { name: 'Salvar atividade' });
  await btnSalvar.scrollIntoViewIfNeeded();
  await btnSalvar.click({ force: true });

  await expect(page.locator('#modalSubjectId')).not.toBeVisible({ timeout: 10_000 });
});