
import { test, expect, Page } from '@playwright/test';

// Constantes de URL e Dados de Teste
const CONTEUDOS_URL = 'https://studylab.free.laravel.cloud/contents';

const STRING_EXTREMAMENTE_LONGA = 
  'r'.repeat(164) + 'h'.repeat(61) + 'f'.repeat(153) + 'j';

  const TEXTO_LONGO_ALFABETICO = 
  'a'.repeat(156) + 'l'.repeat(91) + 'a'.repeat(154) + 'n'.repeat(94) + 
  'a'.repeat(163) + 'l'.repeat(91) + 'o'.repeat(66) + 'v'.repeat(53) + 'e'.repeat(95);

const TEXTO_ESPECIAL_CURTO = '!@#$%¨&*&¨%$#@#$%¨&**&¨%$#@#$%¨&*';

const TEXTO_LONGO_MISTO = 
  't'.repeat(37) + 'h'.repeat(66) + 'a'.repeat(67) + 'n'.repeat(67) + 
  'k'.repeat(27) + 'y'.repeat(96) + 'o'.repeat(26) + 'f'.repeat(30) + 
  'o'.repeat(75) + 'r'.repeat(53) + 'a'.repeat(63) + 'l'.repeat(25) + 
  '!@#$%¨&*||())(*&¨%$#@!';

// Funções Auxiliares (Helpers)
async function irParaConteudos(page: Page) {
  await page.goto(CONTEUDOS_URL);
  await expect(
    page.getByRole('button', { name: 'Adicionar conteúdo' })
  ).toBeVisible({ timeout: 15_000 });
}

async function abrirModalNovo(page: Page) {
  const modalAberto = page.locator('#modalContentSubject');
  if (await modalAberto.isVisible()) {
    await page.locator('#btnFecharContentModal').click();
    await expect(modalAberto).not.toBeVisible();
  }
  await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
  await expect(page.locator('#modalContentSubject')).toBeVisible({ timeout: 10_000 });
}

async function fecharModal(page: Page) {
  await page.locator('#btnFecharContentModal').click();
  await expect(page.locator('#modalContentSubject')).not.toBeVisible({ timeout: 10_000 });
}


test.beforeEach(async ({ page }) => {
  await irParaConteudos(page);
});




// CASOS TRISTES

test('caso triste: salvar conteúdo totalmente em branco', async ({ page }) => {
  await abrirModalNovo(page);
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});

test('caso triste: criar conteúdo sem matéria e sem semestre (apenas com professor)', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).click();
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('historia moderna');
  
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).click();
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('silvania');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});

test('caso triste: adicionar sem dados', async ({ page }) => {
  await abrirModalNovo(page);
  

  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});

test('caso triste: adicionar sem professor', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('estágio');
  await page.locator('#modalContentSubject').selectOption('242');
  
  
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('');
  
  await page.locator('#modalContentSemester').selectOption('8');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page); 
});

test('caso triste: adicionando sem matéria', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('adjectives');
  
  
  await page.locator('#modalContentSubject').selectOption('');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});






test('caso de borda: string extremamente longa', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill(TEXTO_LONGO_ALFABETICO);
  

  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).click();
  
  await page.locator('#modalContentSubject').selectOption('233');
  await page.locator('#modalContentSemester').selectOption('10');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});

test('caso de borda: string com caracteres especiais', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill(TEXTO_ESPECIAL_CURTO);
  
  await page.locator('#modalContentSubject').selectOption('231');
  await page.locator('#modalContentSemester').selectOption('1');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});

test('caso de borda: string extremamente longa com caracteres especiais', async ({ page }) => {
  await abrirModalNovo(page);
  
  await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill(TEXTO_LONGO_MISTO);
  
  await page.locator('#modalContentSubject').selectOption('307');
  await page.locator('#modalContentSemester').selectOption('10');
  
  await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
  
  await expect(page.locator('#modalContentSubject')).toBeVisible();
  await fecharModal(page);
});