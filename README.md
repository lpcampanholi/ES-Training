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



Total: 18,5 horas x 80 = R$ 1480,00


## Níveis

Fundamental
Essencial
Avançado
Profissional (só do Excel)

Formação completa - 12 créditos - 3 por módulo

Se passou no fundamental, começar o essencial, e assim por diante

Resultado - oferecer o módulo nível pra ele

começar o teste de excel, os outros ficam bloqueados

LEADS - Nome, email, celular - qual teste, qual nível, Id, Se veio pelo teste de nivelamento ou não, classificação no teste, Etapa pendente, contatado, convertido (quando envia o link de pagamento), 
motivos

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