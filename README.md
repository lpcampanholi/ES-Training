# ES Training

Conexão com o banco:

```
mysql -u root -p
```
senha: 1234

npx prisma db push --force-reset  

database: testes_online

# Usuário Administrador:
admin@example.com
admin123

27/04 - 1h  
28/04 - 1h  
01/05 - 1,5h  
02/05 - 1h  
03/05 - 4h  
04/05 - 2,5h  
05/05 - 2h  
10/05 - 1,5h  
11/05 - 1h  
12/05 - 3h  
_________________

19/05 - 1,5h  
24/05 - 3h + 2h à noite  
25/05 - 2h  
26/05 - 1h  
27/05 - 4h  
30/05 - 5h
31/05 - 7h
01/06 - 2h
05/06 - 2h
07/06 - 4h
08/06 - 6h

## Níveis

- Fundamental
- Essencial
- Avançado

Formação completa - 12 créditos - 3 por módulo  

Se passou no fundamental, começar o essencial, e assim por diante  

Resultado - oferecer o módulo nível pra ele  

começar o teste de excel, os outros ficam bloqueados  

LEADS - Nome, email, celular - qual teste, qual nível, Id, Se veio pelo teste de nivelamento ou não, classificação no teste, Etapa pendente, contatado, convertido (quando envia o link de pagamento), motivos  

responsável pelo lead, aparecer só os dele  

ROLES: vendedor, master, administrador  

## Tela de turmas

Quantos alunos tem crédito pra participar  

TURMAS - Calendário das turmas  

ESTUDANTES - qual módulo

*INDICAÇÃO* - liste 10 contatos e ganhe até 10% de desconto na formação da excel solutions  

Comando para resetar o banco:
```
npx prisma db push --force-reset
```
Popular o banco:
```
npx tsx .\src\scripts\seed-data.ts 
```

# Regra do teste:W

- Níveis do teste (nesta ordem): fundamental, essencial e avançado.
- O usuário inicia o teste no primeiro nível: fundamental.

- No início de cada nível, o usuário começa com 3 questões obrigatórias desse nível.

- Após fazer essas três primeiras questões, há uma avaliação:

	- Se a média atual for >= 8.0, o usuário já avança para o próximo nível.
	- Se a média atual for < 8.0, verifica-se se é possível atingir média 8.0 tirando 10 nas duas próximas questões.
	- Se não for possível atingir média 8.0, mesmo tirando 10.0 nas duas próximas questões, o teste é encerrado e o usuário permanece no nível atual.
	- Se for possível atingir média 8.0, o usuário faz mais duas perguntas deste nível.

Então o usuário faz mais duas questões do nível.

	- Se atingiu a média (>= 8.0), ele continua o teste e avança para o próximo nível.
	- Se não atingiu a média (< 8.0), o teste é encerrado e o usuário fica no nível atual.

- Ao final do teste, o sistema recomenda o nível adequado para o usuário com base em seu desempenho.

- Sobre as alternativas (options) de cada questão, elas podem ter os valores:  

	Cada questão possui 4 opções, com valores:
	Totalmente correta -10
	Quase correta -	7
	Parcialmente correta -4
	Totalmente errada	- 0

- É recomendado que cada questão deve ter exatamente uma opção de cada tipo (10, 7, 4, 0)

# Refinamento
- Mudar regra de que é permitido apenas um e-mail por teste
- Corrigir barra de progresso da tela de teste
- No CRUD de questões, ao invés de acionar o confirm do browser, acionar meu modal de confirmação
- Ao clicar em algum select, não desativar a barra de rolagem da página (se possível, pesquisar, senão deixa)
- Corrigir DTOs das questões
- Tamanho do Quase certa (7.0)

---

# Paleta de Cores
Verde escuro - #005345     -- hover: #3e9b8c
Laranja - #ff7100          -- hover: #ff8f36
Cinza - text-neutral-600

