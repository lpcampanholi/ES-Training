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
31/05 - Início às 10:30

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

	- Se a média atual for >= 8.0, o usuário já avança para o próximo nível.
	- Se a média atual for < 8.0, verifica-se se é possível atingir média 8.0 tirando 10 na próxima questão.
	- Se não for possível atingir média 8.0, mesmo tirando 10.0 na próxima questão, o teste é encerrado e o usuário permanece no nível atual.
	- Se for possível atingir média 8.0, o usuário faz mais uma pergunta deste nível.

Então o usuário faz a quarta questão do nível. Então deve ser feito a avaliação novamente.

Regra da avaliação:

✅ Após 3 ou 4 questões, se a média atual somada com 10 e dividida por 2 for >= 8, o usuário continua o teste.
❌ Se (média + 10) / 2 < 8, o teste é finalizado.


Então o usuário faz a quinta e última questão do nível.

	- Se atingiu a média (>= 8.0), ele continua o teste e avança para o próximo nível.
	- Se não atingiu a média (< 8.0), o teste é encerrado e o usuário fica no nível atual.

Recomendação Final:

- Ao final do teste, o sistema recomenda o nível adequado para o usuário com base em seu desempenho.

- Sobre as alternativas (options):  

	Cada questão possui 4 opções, com valores:
	Totalmente correta -10
	Quase correta -	7
	Parcialmente correta -4
	Totalmente errada	- 0

É recomendado que cada questão deve ter exatamente uma opção de cada tipo (10, 7, 4, 0)


# Refinamento
- Adicionar loading no botão da tela de registro
- Deixar tela de resultado mais bonita
- Corrigir o badge do nível do teste na tela de teste
- Mudar regra de que é permitido apenas um e-mail por teste
- Melhorar a Home, deixar mais simplificada
- Corrigir barra de progresso da tela de teste
- No CRUD de questões, ao invés de acionar o confirm do browser, acionar meu modal de confirmação
- Ao clicar em algum select, não desativar a barra de rolagem da página (se possível, pesquisar, senão deixa)
- Corrigir as cores dos trequinhos e arrumar os utils
- Fechar o modal de edição de Questões ***** OK
- Corrigir DTOs das questões
- Tamanho do Quase certa (7.0)
- campo telefone na tela de registros deve aceitar apenas números



# ✅ Testes Manuais - Lógica do Teste de Nivelamento
> Alternativas possíveis: **0, 4, 7, 10**

---

🧪 **Caminho 1: Avança direto após 3 questões**  
Notas: 10, 10, 7 → Média = 9  

✅ Resultado: Avança de nível

---

🧪 **Caminho 2: Faz 3, mas (média + 10)/2 < 8 → Finaliza**  
Notas: 4, 4, 4 → Média = 4  

🔍 Verificação: (4 + 10) / 2 = 7 < 8 ❌  

❌ Resultado: Finaliza teste no nível atual

---

🧪 **Caminho 3: Faz 3, (média + 10)/2 >= 8 → Faz 4ª questão, então Finaliza**  
Notas: 7, 7, 7 → Média = 7  

🔍 Verificação: (7 + 10)/2 = 8.5 ✅  

➡️ 4ª questão: 4  
Nova média: (7+7+7+4)/4 = 6.25  

🔍 Verificação: (6.25 + 10)/2 = 8.125 ✅ → Faz 5ª  

5ª questão: 4  
Média final: (7+7+7+4+4)/5 = 5.8 ❌  

❌ Resultado: Finaliza sem avançar

---

🧪 **Caminho 4: Faz 3, (média + 10)/2 >= 8 → Faz 4ª, depois Avança**  
Notas: 7, 10, 7 → Média = 8  

✅ Resultado: Avança direto

---

🧪 **Caminho 5: Finaliza com nota exata (8.0)**  
Notas: 10, 4, 10 → Média = 8  

✅ Resultado: Avança direto

---

🧪 **Caminho 6: Último nível (profissional)**  
Notas: 10, 10, 10 → Média = 10 ✅  

📌 Próximo nível não existe  

✅ Resultado: Teste finalizado com recomendação de nível profissional

---

🧪 **Caminho 7: Erra tudo**  
Notas: 0, 0, 0 → Média = 0  

🔍 Verificação: (0 + 10)/2 = 5 ❌  

❌ Resultado: Finaliza teste

---

🧪 **Caminho 8: Média 7 → faz 4ª, continua, mas não atinge**  
Notas: 10, 7, 4 → Média = 7  

🔍 Verificação: (7 + 10)/2 = 8.5 ✅ → faz 4ª  

4ª questão: 4 → média = (10+7+4+4)/4 = 6.25  

🔍 Verificação: (6.25 + 10)/2 = 8.125 ✅ → faz 5ª  

5ª questão: 4 → final: (10+7+4+4+4)/5 = 5.8 ❌  

❌ Resultado: Finaliza sem avançar

---

🧪 **Caminho 9: Média baixa, mas impossível atingir média**  
Notas: 4, 4, 4 → Média = 4  

🔍 Verificação: (4 + 10) / 2 = 7 ❌  

❌ Resultado: Finaliza


caminhos 3 e 8  