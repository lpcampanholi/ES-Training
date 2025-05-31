# ES Training

Conexão com o banco:

```
mysql -u root -p
```
senha: 1234

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

## Níveis

- Fundamental
- Essencial
- Avançado
- Profissional (só do Excel)

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

ESTUDANTES - qual módulo (formação Smart e Profissional do Excel)  

*INDICAÇÃO* - liste 10 contatos e ganhe até 10% de desconto na formação da excel solutions  

Comando para resetar o banco:
```
npx prisma db push --force-reset
```
Popular o banco:
```
npx tsx .\src\scripts\seed-data.ts 
```

## Valor das questões

Totalmente errada: 0  
Parcialmente certa: 40  
Quase certa: 70  
Totalmente certa: 100  

## O que fazer

- Corrigir modal das questões
- Verificar CRUD de questões:
 - Criar
 - Listagem
 - Editar
 - Deletar
 - Fechar modal da questão ao fechar
- Corrigir lógica do teste

# Regra do teste:

O teste possui deve possui a seguinte regra:

- Níveis do teste (nesta ordem): fundamental, essencial, avançado e profissional.

- O usuário inicia o teste no primeiro nível: fundamental.

- No início de cada nível, o usuário começa com 3 questões obrigatórias desse nível.

- Após fazer essas três primeiras questões, há uma avaliação:

	- Se a média for >= 8.0, o usuário já avança para o próximo nível.
	- Se a média for < 8.0, verifica-se se é possível atingir média 8.0 com a próxima questão.
	- Se não for possível atingir média 8.0, mesmo tirando 10.0 na próxima questão, o teste é encerrado e o usuário permanece no nível atual.
	- Se for possível atingir média 8.0, o usuário faz mais uma pergunta deste nível.

Então o usuário faz a quarta questão do nível. Então deve ser feito a avaliação novamente:

	- Se a média for >= 8.0, o usuário já avança para o próximo nível.
	- Se a média for < 8.0, verifica-se se é possível atingir média 8.0 com a próxima questão.
	- Se não for possível atingir média 8.0, mesmo tirando 10.0 na próxima questão, o teste é encerrado e o usuário permanece no nível atual.
	- Se for possível atingir média 8.0, o usuário faz mais uma pergunta deste nível.

Então o usuário faz a quinta e última questão do nível.

	- Se atingiu a média (>= 8.0), ele continua o teste e avança para o próximo nível.
	- Se não atingiu a média (< 8.0), o teste é encerrado e o usuário fica no nível atual.

Recomendação Final:

- Ao final do teste, o sistema recomenda o nível adequado para o usuário com base em seu desempenho.
